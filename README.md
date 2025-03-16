# Loadout Lab

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
   cd loadout-lab
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
- [ChatGPT: Used for debugging, code fixes, and refactoring](https://chatgpt.com/)
