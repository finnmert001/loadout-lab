# Loadout Lab

Loadout Lab is a web application that allows users to create and manage custom weapon loadouts for _Call of Duty: Warzone_. The application provides an interactive and user-friendly interface for selecting weapons and attachments, while ensuring secure user authentication and reliable data storage. Built with scalability, usability, and security in mind, Loadout Lab empowers players to preserve their custom loadouts even after prestige resets.

---

## Table of Contents

- [Introduction](#introduction)
- [Solution Overview](#solution-overview)
- [Project Aim & Objectives](#project-aim--objectives)
- [Enterprise Considerations](#enterprise-considerations)
  - [Performance](#performance)
  - [Scalability](#scalability)
  - [Robustness](#robustness)
  - [Security](#security)
  - [Deployment](#deployment)
- [Installation & Usage Instructions](#installation--usage-instructions)
  - [Prerequisites](#prerequisites)
  - [Setup Steps](#setup-steps)
  - [Running the Application](#running-the-application)
- [Feature Overview](#feature-overview)
- [Known Issues & Future Enhancements](#known-issues--future-enhancements)
- [References](#references)

---

## Introduction

Players of _Call of Duty: Warzone_ often face the frustration of losing their custom loadouts after prestiging. Loadout Lab addresses this issue by providing a secure and persistent platform where users can create, manage, and retrieve their ideal weapon configurations. The web application is built using Node.js, Pug (Jade), and RESTdb, featuring robust authentication and intuitive UI.

---

## Solution Overview

Loadout Lab enables users to register, log in, and manage detailed loadout configurations with weapon attachments, including logic for wildcards like Overkill and Gunfighter. Users can securely update their profile, manage their saved loadouts, and explore loadouts created by others — all powered by RESTdb and secured using industry-standard practices.

---

## Project Aim & Objectives

### Aim

To develop a secure and scalable web application for managing customisable weapon loadouts, solving the issue of loadouts resetting upon prestige.

### Objectives

- Implement secure authentication using JWT.
- Implement CSRF protection to enhance application security.
- Enable real-time data updates for loadouts.
- Ensure proper role-based access control for user data.
- Provide a responsive and user-friendly UI for managing loadouts.
- Optimise application performance for scalability and efficiency.

---

## Enterprise Considerations

### Performance

Performance optimisation has not been the primary focus in this version; however, the codebase has been structured for easy future improvements, such as caching or database indexing.

### Scalability

Although specific strategies for scalability were not implemented, the application's modular architecture and API-driven backend make it suitable for future scalability enhancements, such as integrating a NoSQL database or deploying microservices.

### Robustness

Robustness is maintained using try/catch blocks throughout the backend. Errors are appropriately logged and relayed to users via popup notifications or error messages. Invalid operations (e.g., accessing a loadout that doesn’t belong to the user) are securely handled.

### Security

Loadout Lab incorporates multiple security measures:

- **JWT Authentication** for managing secure sessions
- **CSRF Protection** to prevent cross-site request forgery
- **bcrypt** for password hashing and validation
- **Input validation** to mitigate injection attacks and ensure data integrity

### Deployment

The application is deployed on **[Loadout Lab on Render](https://your-deployment-url.onrender.com/)**, with continuous deployment configured from the GitHub repository. Commits to the main branch automatically trigger production updates.

---

## Installation & Usage Instructions

### Prerequisites

- Node.js (v18+ recommended)

### Setup Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/loadout-lab.git
   cd loadout-lab
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   An example environment file has been provided:

   - Copy `.env.example` to `.env`
   - This file contains temporary RESTdb API keys for demo purposes
   - No RESTdb account setup is required

   ```bash
   cp .env.example .env
   ```

   This setup should work as expected, but I am still refining my understanding of temporary API keys in RESTdb. If you encounter any issues while running the application, please feel free to reach out to me for assistance.

4. _(Note: The `PORT` variable is defined in `index.js`, but can also be set in `.env`.)_

### Running the Application

Start the server locally:

```bash
npm start
```

Navigate to `http://localhost:3000` in your browser.

---

## Feature Overview

### Authentication & Account Management

- **User Registration & Login**  
  Uses JWT for secure session handling.
- **Logout**  
  Clears JWT and CSRF tokens securely.
- **Profile Management**  
  Users can update first name, last name, username, and email.
- **Password Update**  
  Requires current password verification and re-login for confirmation.
- **Account Deletion**  
  JWT validation ensures only the owner can delete the account, with confirmation modal.

### Loadout Management

- **Create Loadouts**  
  Define two weapons and attachments. Loadout logic adjusts for wildcards like Overkill or Gunfighter.
- **View Loadouts**  
  View personal loadouts and explore those created by the wider user base.
- **Edit Loadouts**  
  Only the owner can update; enforced with JWT ownership validation.
- **Delete Loadouts**  
  Ownership is verified before allowing deletion.

### Meta Classes

- Tiered weapon classes curated and displayed on the home page with recommended attachments.

---

## Known Issues & Future Enhancements

### Known Issues

- No major issues have been observed during testing.
- UI responsiveness requires adjustments for smaller screens.

### Future Enhancements

- Add **lethals, tacticals, and perks** to loadouts.
- Implement **loadout sharing** via URL links so users can send builds to friends.
- Add **performance optimisations** such as caching and lazy loading.

---

## References

- [JWT Authentication](https://www.geeksforgeeks.org/json-web-token-jwt/)
- [JWT Authentication Tutorial - Node.js](https://www.youtube.com/watch?v=mbsmsi7l3r4)
- [CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [CSRF Tokens Tutorial](https://www.youtube.com/watch?v=80S8h5hEwTY)
- [Password Encryption with bcryptjs](https://www.geeksforgeeks.org/password-encryption-in-node-js-using-bcryptjs-module/)
- [ChatGPT](https://chatgpt.com/) – Debugging, code refactoring, and implementation support

---
