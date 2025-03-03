import bcrypt from "bcrypt";
import express from "express";
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

app.use("/images", express.static(path.join(__dirname, "images")));

// Routes
app.get("/", redirectToLogin);

app.get("/index", renderIndex);

app.get("/login", renderLogin);

app.post("/login", loginUser);

app.get("/sign-up", renderSignUp);

app.post("/sign-up", signUpUser);

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
        res.redirect("/index");
      } else {
        renderLoginWithError(res, "Incorrect Username or Password");
        console.log("Incorrect Password");
      }
    } else {
      renderLoginWithError(res, "Incorrect Username or Password");
      console.log("User not found");
    }
  } catch (error) {
    renderLoginWithError(res, "An error occurred while authenticating");
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
    await loginAPI.createUser({ username, password: hashedPassword });
    res.redirect("/login");
  } catch (error) {
    renderSignUpWithError(res, "An error occurred during registration");
  }
}

// Error handling functions
export function renderLoginWithError(res, errorMessage) {
  res.render("login", { error: errorMessage });
}

export function renderSignUpWithError(res, errorMessage) {
  res.render("sign-up", { error: errorMessage });
}

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
