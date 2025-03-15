import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import { authenticateJWT } from "./middleware/auth-jwt.js";
import {
  deleteLoadout,
  getLoadoutById,
  getLoadouts,
  getLoadoutsByUserId,
  saveLoadout,
  updateLoadout,
} from "./model/database.js";
import loginAPI from "./model/login.js";
import { attachmentNames } from "./utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;

dotenv.config();

// Middleware Setup
app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.static("public"));
app.use("/images", express.static(path.join(__dirname, "images")));

// ------------------ AUTH ROUTES ------------------

// Authentication & User Management
app.get("/", redirectToLogin);
app.get("/index", renderIndex);
app.get("/login", renderLogin);
app.post("/login", loginUser);
app.get("/sign-up", renderSignUp);
app.post("/sign-up", signUpUser);
app.get("/logout", logoutUser);

// User Profile & Settings
app.get("/profile", authenticateJWT, renderProfile);
app.get("/api/profile", authenticateJWT, getUserProfile);
app.get("/edit-profile", authenticateJWT, renderEditProfile);
app.put("/api/edit-profile", authenticateJWT, updateUserProfile);
app.post("/edit-profile/:id", authenticateJWT, updateProfile);
app.get("/update-password", authenticateJWT, renderUpdatePassword);
app.post("/update-password", authenticateJWT, updatePassword);
app.delete("/delete-account", authenticateJWT, deleteUser);

// Static Pages
app.get("/about", (req, res) => res.render("about"));
app.get("/contact", (req, res) => res.render("contact"));
app.get("/terms", (req, res) => res.render("terms"));
app.get("/privacy", (req, res) => res.render("privacy"));
app.get("/explore", (req, res) => res.render("explore"));
app.get("/my-loadouts", authenticateJWT, (req, res) =>
  res.render("my-loadouts")
);
app.get("/create-loadout", authenticateJWT, (req, res) =>
  res.render("create-loadout")
);

// ------------------ LOADOUT API ROUTES ------------------

app.post("/api/loadouts", authenticateJWT, createLoadout);
app.get("/api/loadouts", getAllLoadouts);
app.get("/api/my-loadouts", authenticateJWT, getUserLoadouts);
// app.get("/api/loadouts/:id", getLoadout);
app.get("/loadout/:id", authenticateJWT, renderLoadoutPage);
app.get("/explore-loadout/:id", authenticateJWT, renderExploreLoadoutPage);
app.put("/api/loadouts/:id", authenticateJWT, updateLoadoutData);
app.delete("/api/loadouts/:id", authenticateJWT, removeLoadout);

// ------------------ ROUTE HANDLER FUNCTIONS ------------------

// Redirect to login page
function redirectToLogin(req, res) {
  res.redirect("/login");
}

// Render Pages
function renderIndex(req, res) {
  res.render("index");
}
function renderLogin(req, res) {
  res.render("login", { hideNavbar: true });
}
function renderSignUp(req, res) {
  res.render("sign-up", { hideNavbar: true });
}
function renderProfile(req, res) {
  res.render("profile", { user: req.user });
}
function renderEditProfile(req, res) {
  res.render("edit-profile", { user: req.user });
}
function renderUpdatePassword(req, res) {
  res.render("update-password", { user: req.user });
}

// ------------------ AUTH FUNCTIONS ------------------

// Handle user login
export async function loginUser(req, res) {
  const { username, password } = req.body;

  try {
    const user = await loginAPI.findUserByUsername(username);
    if (!user) {
      return res.render("login", { error: "Incorrect username or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.render("login", { error: "Incorrect username or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Store token in cookies
    res.cookie("token", token, {
      httpOnly: false,
      secure: true,
      sameSite: "Strict",
    });

    // Redirect after successful login
    res.redirect("/index");
  } catch (error) {
    console.error("Error during login:", error);
    res.render("login", { error: "An error occurred during login." });
  }
}

// Handle user signup
export async function signUpUser(req, res) {
  const { username, password, confirmPassword } = req.body;

  if (!username || username.length < 4 || username.length > 20) {
    return sendSignUpError(req, res, "Username must be 4-20 characters long.");
  }

  if (password.length < 8) {
    return sendSignUpError(
      req,
      res,
      "Password must be at least 8 characters long."
    );
  }

  if (password !== confirmPassword) {
    return sendSignUpError(req, res, "Passwords do not match.");
  }

  try {
    // Check if username already exists
    const existingUser = await loginAPI.findUserByUsername(username);
    if (existingUser) {
      return sendSignUpError(req, res, "Username is already taken.");
    }

    // Hash password and create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      username,
      password: hashedPassword,
      firstName: "",
      lastName: "",
      email: "",
    };

    await loginAPI.createUser(newUser);

    if (req.headers["content-type"] === "application/json") {
      return res.json({ success: true });
    }

    res.redirect("/login");
  } catch (error) {
    console.error("Error during sign-up:", error);
    return sendSignUpError(req, res, "An error occurred during sign-up.");
  }
}

// Helper function for handling errors
function sendSignUpError(req, res, message) {
  if (req.headers["content-type"] === "application/json") {
    return res.json({ success: false, error: message });
  } else {
    return res.render("sign-up", { error: message });
  }
}

// Logout user
function logoutUser(req, res) {
  res.clearCookie("token");
  res.redirect("/login");
}

// ------------------ USER MANAGEMENT FUNCTIONS ------------------

// Function to fetch user profile
async function getUserProfile(req, res) {
  try {
    const userId = req.user.id;
    const user = await loginAPI.findUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Function to update user profile
async function updateUserProfile(req, res) {
  try {
    const userId = req.user.id;
    const { username, firstName, lastName, email } = req.body;

    // Check if username is already taken
    const existingUser = await loginAPI.findUserByUsername(username);
    if (existingUser && existingUser._id.toString() !== userId) {
      return res
        .status(400)
        .json({ success: false, error: "Username is already taken." });
    }

    // Update user data
    await loginAPI.updateUserById(userId, {
      username,
      firstName,
      lastName,
      email,
    });

    res.json({ success: true, message: "Profile updated successfully!" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, error: "Error updating profile." });
  }
}

// Update user profile
async function updateProfile(req, res) {
  const userId = req.user.id;
  const { username, firstName, lastName, email } = req.body;

  try {
    await loginAPI.updateUserById(userId, {
      username,
      firstName,
      lastName,
      email,
    });
    res.redirect("/profile");
  } catch (error) {
    res.status(500).json({ error: "Error updating profile" });
  }
}

// Update password
async function updatePassword(req, res) {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Get user from database
    const user = await loginAPI.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    // Validate current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, error: "Incorrect current password." });
    }

    // Validate new password
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, error: "Passwords do not match." });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 8 characters long.",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        error: "New password must be different from the current password.",
      });
    }

    // Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await loginAPI.updateUserById(req.user.id, { password: hashedPassword });

    // Clear JWT token (force re-login)
    res.clearCookie("token");

    res.json({
      success: true,
      message: "Password updated successfully. Please log in again.",
    });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ success: false, error: "Error updating password." });
  }
}

// Delete user account
async function deleteUser(req, res) {
  try {
    await loginAPI.deleteUserById(req.user.id);

    // Clear JWT token from cookies
    res.clearCookie("token");

    // Respond with JSON success message
    res.json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ error: "Account deletion failed" });
  }
}

// ------------------ LOADOUT FUNCTIONS ------------------

async function createLoadout(req, res) {
  try {
    const userId = req.user.id; // Extract user ID from JWT
    const newLoadout = await saveLoadout({ ...req.body, userId });

    res.status(201).json(newLoadout);
  } catch (error) {
    console.error("Error creating loadout:", error);
    res.status(500).json({ error: "Failed to create loadout" });
  }
}

async function getAllLoadouts(req, res) {
  try {
    const loadouts = await getLoadouts();
    res.json(loadouts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch loadouts" });
  }
}

// Function to get user's loadouts
async function getUserLoadouts(req, res) {
  try {
    const userId = req.user.id;
    const loadouts = await getLoadoutsByUserId(userId);

    if (!loadouts || loadouts.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "No loadouts found." });
    }

    res.json(loadouts);
  } catch (error) {
    console.error("Error fetching loadouts:", error);
    res.status(500).json({ success: false, error: "Error fetching loadouts." });
  }
}

async function renderLoadoutPage(req, res) {
  try {
    const loadoutId = req.params.id;
    const loadout = await getLoadoutById(loadoutId);

    if (!loadout) {
      return res.status(404).send("Loadout not found");
    }

    // Convert attachment keys into readable names
    const formatAttachments = (attachments) =>
      attachments.map((att) => attachmentNames[att] || att);

    res.render("loadout", {
      user: req.user,
      loadout,
      primaryAttachmentsList: formatAttachments(
        loadout.primaryAttachments || []
      ),
      secondaryAttachmentsList: formatAttachments(
        loadout.secondaryAttachments || []
      ),
    });
  } catch (error) {
    console.error("Error rendering loadout page:", error);
    res.status(500).send("Internal Server Error");
  }
}

// async function getLoadout(req, res) {
//   try {
//     const loadout = await getLoadoutById(req.params.id);
//     res.json(loadout || { error: "Loadout not found" });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch loadout" });
//   }
// }

async function renderExploreLoadoutPage(req, res) {
  try {
    const loadoutId = req.params.id;
    const loadout = await getLoadoutById(loadoutId);

    if (!loadout) {
      return res.status(404).send("Loadout not found");
    }

    // Convert attachment keys into readable names
    const formatAttachments = (attachments) =>
      attachments.map((att) => attachmentNames[att] || att);

    res.render("explore-loadout", {
      loadout,
      primaryAttachmentsList: formatAttachments(
        loadout.primaryAttachments || []
      ),
      secondaryAttachmentsList: formatAttachments(
        loadout.secondaryAttachments || []
      ),
    });
  } catch (error) {
    console.error("Error fetching explore loadout:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function updateLoadoutData(req, res) {
  try {
    const loadoutId = req.params.id;
    const userId = req.user.id; // Get user ID from JWT

    // Fetch the loadout
    const existingLoadout = await getLoadoutById(loadoutId);
    if (!existingLoadout) {
      return res.status(404).json({ error: "Loadout not found" });
    }

    // Ensure only the owner can update
    if (existingLoadout.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to edit this loadout" });
    }

    // Update loadout
    const updatedLoadout = await updateLoadout(loadoutId, req.body);

    res.json({
      success: true,
      message: "Loadout updated successfully",
      updatedLoadout,
    });
  } catch (error) {
    console.error("Error updating loadout:", error);
    res.status(500).json({ error: "Failed to update loadout" });
  }
}

async function removeLoadout(req, res) {
  try {
    const userId = req.user.id;
    const loadoutId = req.params.id;

    const loadout = await getLoadoutById(loadoutId);

    if (!loadout) {
      return res
        .status(404)
        .json({ success: false, error: "Loadout not found." });
    }

    if (loadout.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: "Unauthorised to delete this loadout.",
      });
    }

    await deleteLoadout(loadoutId);

    res.json({ success: true, message: "Loadout deleted successfully!" });
  } catch (error) {
    console.error("Error deleting loadout:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to delete loadout." });
  }
}

// ------------------ START SERVER ------------------

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
