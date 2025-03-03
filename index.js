import bcrypt from "bcrypt";
import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import loginAPI from "./model/login.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Set up view engine and middleware
app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  session({
    secret: "asecretkey", // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Change to true if using HTTPS
  })
);

app.use("/images", express.static(path.join(__dirname, "images")));

// Routes
app.get("/", redirectToLogin);

app.get("/index", renderIndex);

app.get("/login", renderLogin);

app.post("/login", loginUser);

app.get("/sign-up", renderSignUp);

app.post("/sign-up", signUpUser);

app.get("/profile", (req, res) => {
  // Ensure the user is logged in (session check)
  if (!req.session.user) {
    return res.redirect("/login"); // Redirect to login if the user is not logged in
  }

  // Pass user data to profile page
  const user = req.session.user;
  res.render("profile", { user }); // Render the profile.pug template
});

app.get("/edit-profile", (req, res) => {
  // Ensure the user is logged in (session check)
  if (!req.session.user) {
    return res.redirect("/login");
  }

  // Render the edit profile page and pass user data to the page
  const user = req.session.user;
  res.render("edit-profile", { user });
});

app.get("/explore", (req, res) => {
  res.render("explore"); // Render the explore.pug template
});

export function redirectToLogin(req, res) {
  res.redirect("/login");
}

export function renderIndex(req, res) {
  res.render("index", { hideNavbar: false });
}

export function renderLogin(req, res) {
  res.render("login", { hideNavbar: true });
}

export async function loginUser(req, res) {
  const { username, password } = req.body;

  try {
    const user = await loginAPI.findUserByUsername(username);

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // Store user data in the session
        req.session.user = {
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        };

        return res.redirect("/index"); // Redirect to profile page after successful login
      } else {
        renderLoginWithError(res, "Incorrect Username or Password", {
          hideNavbar: true,
        });
        console.log("Incorrect Password");
      }
    } else {
      renderLoginWithError(res, "Incorrect Username or Password", {
        hideNavbar: true,
      });
      console.log("User not found");
    }
  } catch (error) {
    renderLoginWithError(res, "An error occurred while authenticating", {
      hideNavbar: true,
    });
    console.error("Error during login:", error);
  }
}

export function renderSignUp(req, res) {
  res.render("sign-up", { hideNavbar: true });
}

export async function signUpUser(req, res) {
  const { username, password } = req.body;

  if (username.length < 4 || username.length > 20) {
    return renderSignUpWithError(
      res,
      "Username must be between 4 and 20 characters long"
    );
  }

  if (password.length < 8) {
    return renderSignUpWithError(
      res,
      "Password must be at least 8 characters long"
    );
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with only the username and password
    const newUser = {
      username,
      password: hashedPassword,
      firstName: "", // Leave first name empty for now
      lastName: "", // Leave last name empty for now
    };

    await loginAPI.createUser(newUser); // Send the new user data to RestDB
    res.redirect("/login");
  } catch (error) {
    renderSignUpWithError(res, "An error occurred during registration");
  }
}

// Error handling functions
function renderLoginWithError(res, errorMessage, options = {}) {
  res.render("login", { error: errorMessage, hideNavbar: true, ...options });
}

export function renderSignUpWithError(res, errorMessage) {
  res.render("sign-up", { error: errorMessage });
}

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
