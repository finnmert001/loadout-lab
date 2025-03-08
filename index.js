import bcrypt from "bcryptjs";
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

app.post("/edit-profile/:id", updateProfile);

app.get("/explore", (req, res) => {
  res.render("explore"); // Render the explore.pug template
});

app.get("/create-loadout", (req, res) => {
  res.render("create-loadout"); // Render the explore.pug template
});

app.get("/check-username", async (req, res) => {
  const { username } = req.query;

  try {
    const existingUser = await loginAPI.findUserByUsername(username);
    res.json({ exists: !!existingUser }); // true if user exists, false otherwise
  } catch (error) {
    console.error("Error checking username:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error logging out");
    }

    res.redirect("/login");
  });
});

app.get("/update-password", (req, res) => {
  // Ensure the user is logged in
  if (!req.session.user) {
    return res.redirect("/login"); // Redirect to login if the user is not logged in
  }

  // Pass the user data from the session to the template
  const user = req.session.user;

  // Render the update-password page with the user data
  res.render("update-password", { user });
});

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

app.post("/update-password", async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  // Ensure the user is logged in
  if (!req.session.user) {
    return res.render("update-password", {
      errorMessage: "User not logged in", // Pass error message to render in view
    });
  }

  // Get the user's current password from the database using session user ID
  const user = await loginAPI.findUserById(req.session.user._id); // Assuming you're using an API

  if (!user) {
    return renderUpdatePasswordWithError(res, "User not found");
  }

  // Check if the current password matches the stored password
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return renderUpdatePasswordWithError(res, "Current password is incorrect.");
  }

  if (newPassword.length < 8) {
    return renderUpdatePasswordWithError(
      res,
      "Password must be at least 8 characters long."
    );
  }

  if (newPassword !== confirmPassword) {
    return renderUpdatePasswordWithError(
      res,
      "Please ensure new and confirm password match."
    );
  }

  if (currentPassword === newPassword) {
    return renderUpdatePasswordWithError(
      res,
      "Your new password must be different from your current password."
    );
  }

  // Hash the new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  try {
    // Update the password in the database via API call (not via save)
    await loginAPI.updateUserById(req.session.user._id, {
      password: hashedPassword, // Only updating password
    });

    res.redirect("/profile");
  } catch (error) {
    console.error("Error updating password:", error);
    res.render("update-password", {
      errorMessage: "Error updating password", // Pass error message to render in view
    });
  }
});

app.delete("/delete-account", async (req, res) => {
  // Ensure the user is logged in
  if (!req.session.user) {
    return res
      .status(401)
      .json({ success: false, message: "User not logged in" });
  }

  try {
    const userId = req.session.user._id;

    // Fetch the user using the userId from session
    const user = await loginAPI.findUserById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Delete the user account (this can be a DB delete action)
    await loginAPI.deleteUserById(userId);

    // Destroy the session after successful deletion
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Error ending session" });
      }

      res.json({ success: true, message: "Account deleted successfully" });
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ success: false, message: "Error deleting account" });
  }
});

export async function updateProfile(req, res) {
  const userId = req.session.user._id; // Use _id from session or get it from DB if necessary

  if (!req.session.user) {
    return res.redirect("/login"); // Ensure user is logged in
  }

  const { username, firstName, lastName, email } = req.body;

  const existingUser = await loginAPI.findUserByUsername(username);
  if (existingUser && existingUser._id !== userId) {
    return renderEditProfileWithError(
      res,
      userId,
      "Username is already taken. Please choose another."
    );
  }

  const updatedProfileData = {
    username: username,
    firstName: firstName, // Ensure it's a string
    lastName: lastName, // Ensure it's a string
    email: email,
  };

  try {
    // Use userId in the update API call
    await loginAPI.updateUserById(userId, updatedProfileData); // Use _id for RestDB update

    // After updating in DB, also update session data
    req.session.user.username = username;
    req.session.user.firstName = firstName;
    req.session.user.lastName = lastName;
    req.session.user.email = email;

    // Redirect to profile page with updated session data
    res.redirect("/profile");
  } catch (error) {
    handleProfileError(res, error, "Error updating profile");
  }
}

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
          _id: user._id,
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
  const { username, password, confirmPassword } = req.body;

  if (
    !username ||
    username.length < 4 ||
    username.length > 20 ||
    /[!@#$%^&*(),.?":{}|<>]/.test(username)
  ) {
    return renderSignUpWithError(
      res,
      "Username must be between 4 and 20 characters and should not contain symbols."
    );
  }

  if (password.length < 8) {
    return renderSignUpWithError(
      res,
      "Password must be at least 8 characters long"
    );
  }

  if (password !== confirmPassword) {
    return renderSignUpWithError(
      res,
      "Please ensure password and confirm password match."
    );
  }

  try {
    const existingUser = await loginAPI.findUserByUsername(username);
    if (existingUser) {
      return renderSignUpWithError(res, "Username is already taken.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with only the username and password
    const newUser = {
      username,
      password: hashedPassword,
      firstName: "", // Leave first name empty for now
      lastName: "", // Leave last name empty for now
      email: "", // Leave email empty for now
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

export function renderSignUpWithError(res, errorMessage, options = {}) {
  res.render("sign-up", { error: errorMessage, hideNavbar: true, ...options });
}

export function handleProfileError(res, error, message) {
  console.error(message + ":", error.message);
  res.status(500).send(message);
}

export function renderEditProfileWithError(res, userId, errorMessage) {
  // Fetch the user's data based on userId to populate the form
  loginAPI
    .findUserById(userId)
    .then((user) => {
      res.render("edit-profile", { error: errorMessage, user }); // Pass 'user' to the template
    })
    .catch((err) => {
      console.error("Error fetching user:", err);
      res.redirect("/profile"); // Redirect to profile in case of error fetching user
    });
}

export function renderUpdatePasswordWithError(res, errorMessage) {
  res.render("update-password", { error: errorMessage });
}

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
