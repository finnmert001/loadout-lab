import bcrypt from "bcryptjs";
import cors from "cors";
import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import {
  deleteLoadout,
  getLoadoutById,
  getLoadouts,
  getLoadoutsByUserId,
  saveLoadout,
  updateLoadout,
} from "./model/database.js"; // Import loadout database functions
import loginAPI from "./model/login.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware Setup
app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // Allow frontend requests
app.use(express.static("public"));

app.use(
  session({
    secret: "asecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Change to true if using HTTPS
  })
);

app.use("/images", express.static(path.join(__dirname, "images")));

// ------------------ AUTH ROUTES ------------------

// Redirect to login if not authenticated
app.get("/", redirectToLogin);

// Render index
app.get("/index", renderIndex);

// Render login page
app.get("/login", renderLogin);

// Handle login
app.post("/login", loginUser);

// Render sign-up page
app.get("/sign-up", renderSignUp);

// Handle sign-up
app.post("/sign-up", signUpUser);

// Edit profile
app.post("/edit-profile/:id", updateProfile);

app.get("/explore", (req, res) => {
  res.render("explore"); // Render the explore.pug template
});

app.get("/my-loadouts", (req, res) => {
  res.render("my-loadouts"); // Render the explore.pug template
});

app.get("/create-loadout", (req, res) => {
  res.render("create-loadout"); // Render the explore.pug template
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("Error logging out");
    res.redirect("/login");
  });
});

// Profile and password management
app.get("/profile", ensureAuthenticated, renderProfile);
app.get("/edit-profile", ensureAuthenticated, renderEditProfile);
app.get("/update-password", ensureAuthenticated, renderUpdatePassword);
app.post("/update-password", ensureAuthenticated, updatePassword);

// Check username availability (AJAX)
app.get("/check-username", async (req, res) => {
  const { username } = req.query;
  try {
    const existingUser = await loginAPI.findUserByUsername(username);
    res.json({ exists: !!existingUser });
  } catch (error) {
    console.error("Error checking username:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete user
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

// ------------------ LOADOUT API ROUTES ------------------

// Create a new loadout
app.post("/api/loadouts", async (req, res) => {
  if (!req.session || !req.session.user) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Please log in to save a loadout." });
  }

  const userId = req.session.user._id;

  try {
    const loadoutData = {
      ...req.body,
      userId: userId,
    };

    const newLoadout = await saveLoadout(loadoutData);
    res.status(201).json(newLoadout);
  } catch (error) {
    res.status(500).json({ error: "Failed to create loadout" });
  }
});

// Get all loadouts
app.get("/api/loadouts", async (req, res) => {
  try {
    const loadouts = await getLoadouts();
    res.status(200).json(loadouts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch loadouts" });
  }
});

// Get loadouts for the logged-in user (for My Loadouts page)
app.get("/api/my-loadouts", async (req, res) => {
  try {
    if (!req.session.user || !req.session.user._id) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }

    const userId = req.session.user._id;

    const loadouts = await getLoadoutsByUserId(userId);

    res.status(200).json(loadouts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user loadouts." });
  }
});

// Get a single loadout by ID
app.get("/api/loadouts/:id", async (req, res) => {
  try {
    const loadout = await getLoadoutById(req.params.id);
    if (!loadout) {
      return res.status(404).json({ error: "Loadout not found" });
    }
    res.status(200).json(loadout);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch loadout" });
  }
});

// Update a loadout
app.put("/api/loadouts/:id", async (req, res) => {
  try {
    const updatedLoadout = await updateLoadout(req.params.id, req.body);
    res.status(200).json(updatedLoadout);
  } catch (error) {
    res.status(500).json({ error: "Failed to update loadout" });
  }
});

// Delete a loadout
app.delete("/api/loadouts/:id", async (req, res) => {
  try {
    await deleteLoadout(req.params.id);
    res.status(200).json({ message: "Loadout deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete loadout" });
  }
});

const attachmentNames = {
  // Optic
  "accu-spot-reflex": "Accu-Spot Reflex",
  "kepler-microflex": "Kepler Microflex",
  "otero-micro-dot": "Otero Micro Dot",
  "jason-armory-2x": "Jason Armory 2x",
  "willis-3x": "Willis 3x",

  // Muzzle
  suppressor: "Suppressor",
  compensator: "Compensator",
  "ported-compensator": "Ported Compensator",
  "muzzle-brake": "Muzzle Brake",

  // Barrel
  "chf-barrel": "CHF Barrel",
  "long-barrel": "Long Barrel",
  "gain-twist-barrel": "Gain-Twist Barrel",
  "reinforced-barrel": "Reinforced Barrel",

  // Underbarrel
  "vertical-foregrip": "Vertical Foregrip",
  "ranger-foregrip": "Ranger Foregrip",
  "precision-foregrip": "Precision Foregrip",
  "marksman-foregrip": "Marksman Foregrip",
  "lightweight-foregrip": "Lightweight Foregrip",

  // Magazine
  "flip-mag": "Flip Mag",
  "fast-mag-1": "Fast Mag I",
  "fast-mag-2": "Fast Mag II",
  "extended-mag-1": "Extended Mag I",
  "extended-mag-2": "Extended Mag II",

  // Rear Grip
  "assault-grip": "Assault Grip",
  "commando-grip": "Commando Grip",
  "cqb-grip": "CQB Grip",
  "ergonomic-grip": "Ergonomic Grip",
  "quickdraw-grip": "Quickdraw Grip",

  // Stock
  "light-stock": "Light Stock",
  "infiltrator-stock": "Infiltrator Stock",
  "no-stock": "No Stock",
  "agility-stock": "Agility Stock",
  "balanced-stock": "Balanced Stock",

  // Laser
  "fast-motion-laser": "Fast Motion Laser",
  "steady-aim-laser": "Steady Aim Laser",
  "strelok-laser": "Strelok Laser",
  "tactical-laser": "Tactical Laser",
  "target-laser": "Target Laser",

  // Fire Mods
  fmj: "FMJ",
  overpressured: "Overpressured",
  "rapid-fire": "Rapid Fire",
  "recoil-springs": "Recoil Springs",
};

// Get loadout by ID for viewing explore page loadout
app.get("/explore-loadout/:id", async (req, res) => {
  const loadoutId = req.params.id;

  try {
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
    console.error("Error fetching loadout:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Get loadout by ID for viewing
app.get("/loadout/:id", async (req, res) => {
  const loadoutId = req.params.id;

  try {
    const loadout = await getLoadoutById(loadoutId);

    if (!loadout) {
      return res.status(404).send("Loadout not found");
    }

    // Convert attachment keys into readable names
    const formatAttachments = (attachments) =>
      attachments.map((att) => attachmentNames[att] || att);

    res.render("loadout", {
      loadout,
      primaryAttachmentsList: formatAttachments(
        loadout.primaryAttachments || []
      ),
      secondaryAttachmentsList: formatAttachments(
        loadout.secondaryAttachments || []
      ),
    });
  } catch (error) {
    console.error("Error fetching loadout:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Get loadout by ID for editing
app.get("/edit-loadout/:id", async (req, res) => {
  try {
    const loadoutId = req.params.id;
    const loadout = await getLoadoutById(loadoutId);

    if (!loadout) {
      return res.status(404).send("Loadout not found");
    }

    const formattedPrimaryAttachments = loadout.primaryAttachments.map(
      (attachment) => attachmentNames[attachment] || attachment
    );

    const formattedSecondaryAttachments = loadout.secondaryAttachments.map(
      (attachment) => attachmentNames[attachment] || attachment
    );

    // Define attachment categories and options
    const attachmentOptions = {
      Optic: [
        "Accu-Spot Reflex",
        "Kepler Microflex",
        "Otero Micro Dot",
        "Jason Armory 2x",
        "Willis 3x",
      ],
      Muzzle: [
        "Suppressor",
        "Compensator",
        "Ported Compensator",
        "Muzzle Brake",
      ],
      Barrel: [
        "CHF Barrel",
        "Long Barrel",
        "Gain-Twist Barrel",
        "Reinforced Barrel",
      ],
      Underbarrel: [
        "Vertical Foregrip",
        "Ranger Foregrip",
        "Precision Foregrip",
        "Marksman Foregrip",
        "Lightweight Foregrip",
      ],
      Magazine: [
        "Flip Mag",
        "Fast Mag I",
        "Fast Mag II",
        "Extended Mag I",
        "Extended Mag II",
      ],
      "Rear Grip": [
        "Assault Grip",
        "Commando Grip",
        "CQB Grip",
        "Ergonomic Grip",
        "Quickdraw Grip",
      ],
      Stock: [
        "Light Stock",
        "Infiltrator Stock",
        "No Stock",
        "Agility Stock",
        "Balanced Stock",
      ],
      Laser: [
        "Fast Motion Laser",
        "Steady Aim Laser",
        "Strelok Laser",
        "Tactical Laser",
        "Target Laser",
      ],
      "Fire Mods": ["FMJ", "Overpressured", "Rapid Fire", "Recoil Springs"],
    };

    res.render("edit-loadout", {
      loadout: {
        ...loadout,
        primaryAttachments: formattedPrimaryAttachments,
        secondaryAttachments: formattedSecondaryAttachments,
      },
      attachmentOptions,
    });
  } catch (error) {
    console.error("Error fetching loadout:", error);
    res.status(500).send("Internal Server Error");
  }
});

// ------------------ HELPER FUNCTIONS ------------------

// Redirect to login if not authenticated
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

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  next();
}

// Render profile page
function renderProfile(req, res) {
  res.render("profile", { user: req.session.user });
}

// Render edit profile page
function renderEditProfile(req, res) {
  res.render("edit-profile", { user: req.session.user });
}

// Render update password page
function renderUpdatePassword(req, res) {
  res.render("update-password", { user: req.session.user });
}

// Handle password update
async function updatePassword(req, res) {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!req.session.user) {
    return res.render("update-password", {
      errorMessage: "User not logged in",
    });
  }

  const user = await loginAPI.findUserById(req.session.user._id);
  if (!user)
    return res.render("update-password", { errorMessage: "User not found" });

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

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await loginAPI.updateUserById(req.session.user._id, {
    password: hashedPassword,
  });

  res.redirect("/profile");
}

// ----------------- ERROR HANDLING -----------------

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

// ------------------ START SERVER ------------------

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
