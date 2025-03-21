<!-- # Loadout Lab

## Table of Contents

### [1. Introduction](#1-introduction-1)

### [2. Solution Overview](#2-solution-overview-1)

### [3. Project Aim & Objectives](#3-project-aim--objectives-1)

### [4. Enterprise Considerations](#4-enterprise-considerations-1)

### [5. Installation & Usage Instructions](#5-installation--usage-instructions-1)

### [6. Feature Overview](#6-feature-overview-1)

### [7. Known Issues & Future Enhancements](#7-known-issues--future-enhancements-1)

### [8. References](#8-references-1)

## 1. Introduction

Loadout Lab is a web application that allows users to create, manage, and share custom weapon loadouts for Call of Duty: Warzone. The application provides an interactive and user-friendly interface for selecting weapons and attachments while ensuring secure user authentication and data storage.

## 2. Solution Overview

Loadout Lab offers a streamlined way for players to build and customise weapon loadouts with various attachments. The application features a secure login system, a dynamic interface for selecting weapons, and a robust backend for storing and managing loadouts and profile information.

## 3. Project Aim & Objectives

### Main Goal

To develop a secure and scalable web application for managing customisable weapon loadouts, solving the issue of loadouts resetting upon prestige. This platform enables users to save and retrieve their loadouts after prestiging, ensuring they never lose their configurations.

### Key Objectives

- Implement secure authentication using JWT.
- Enable real-time data updates for loadouts.
- Ensure proper role-based access control for user data.
- Provide a responsive and user-friendly UI for managing loadouts.
- Optimise application performance for scalability and efficiency.

## 4. Enterprise Considerations

### **Performance**

- Optimised database queries to ensure fast loadout retrieval.
- Implemented caching mechanisms for frequently accessed data.
- Minimised API response times through efficient middleware.

### **Scalability**

- Designed backend with a modular architecture for future expansions.
- Used a NoSQL database (MongoDB) to handle dynamic loadout structures efficiently.
- Ensured API endpoints can handle concurrent user requests with efficient load balancing.

### **Robustness**

- Implemented error-handling middleware for graceful application failures.
- Validated user input to prevent data corruption.
- Used structured logging to monitor and debug issues effectively.

### **Security**

- JWT authentication for secure user sessions.
- Password hashing using bcrypt for user credentials.
- CSRF protection to prevent cross-site request forgery.
- Input validation to prevent injection attacks.
- Role-based access control to restrict unauthorised data access.

### **Deployment**

- Hosted on **Render**.
- CI/CD pipeline set up for automatic deployment.
- Environment variables used to manage sensitive configurations.

## 5. Installation & Usage Instructions

### **Prerequisites**

Ensure you have the following installed on your system:

- Node.js (v16+)
- npm (Node Package Manager)

### **Setup Steps**

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/loadout-lab.git
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file in the root directory.
   - Add the required configurations:
     ```env
     PORT=3000
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_secret_key
     ```

### **Running the Application**

Start the development server:

```sh
npm start
```

Access the application at `http://localhost:3000`

## 6. Feature Overview

### **User Authentication**

- **Purpose:** Secure login and signup system using JWT.
- **Code Location:** `middleware/auth-jwt.js`
- **Relevant Endpoints:** `/login`, `/sign-up`, `/logout`

### **Loadout Management**

- **Purpose:** Allow users to create, edit, and delete loadouts.
- **Code Location:** `routes/loadouts.js`
- **Relevant Endpoints:** `/api/loadouts`, `/api/my-loadouts`, `/edit-loadout/:id`

### **Weapon & Attachment Selection**

- **Purpose:** Interactive UI for selecting weapons and attachments.
- **Code Location:** `public/js/editLoadout.js`
- **Relevant Components:** `edit-loadout.pug`, `editLoadout.js`

## 7. Known Issues & Future Enhancements

### **Known Issues**

- Some UI elements may not render properly on smaller screen sizes.
- Error messages could be improved for better user feedback.

### **Future Enhancements**

- Implement a live preview for weapon loadouts.
- Add support for saving and sharing loadouts via public links.
- Introduce user roles (e.g., admin, premium users) with additional features.

## 8. References

- [JWT Authentication](https://www.geeksforgeeks.org/json-web-token-jwt/)
- [JWT Authentication Tutorial - Node.js](https://www.youtube.com/watch?v=mbsmsi7l3r4)
- [CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [CSRF Tokens Tutorial/Explanation](https://www.youtube.com/watch?v=80S8h5hEwTY)
- [Password Encryption in Node.js using bcryptjs Module](https://www.geeksforgeeks.org/password-encryption-in-node-js-using-bcryptjs-module/)
- [ChatGPT: Used for debugging, code fixes, and refactoring](https://chatgpt.com/) -->

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
