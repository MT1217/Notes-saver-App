# 📝 Notes Saver App

A secure, responsive, full-stack note-taking application built with the MERN stack. This application allows users to create personal accounts, securely log in, and manage their daily notes with full Create, Read, Update, and Delete (CRUD) capabilities.

---

## ✨ Features
* **Secure Authentication:** Custom email and password registration with encrypted passwords (bcrypt) and stateless session management (JSON Web Tokens).
* **Protected Routes:** Frontend route protection and backend middleware to ensure users can only access and modify their own personal data.
* **Full CRUD Functionality:** Seamlessly create, view, edit, and delete notes in real-time.
* **Responsive UI:** A clean, modern interface built with Tailwind CSS that adapts beautifully to mobile, tablet, and desktop screens.
* **Monorepo Architecture:** Frontend and backend codebases housed in a single, clean repository for easier version control and deployment.

---

## 🛠️ Tech Stack

**Frontend**
* React.js (via Vite)
* Tailwind CSS
* React Router DOM
* Axios
* Lucide React (Icons)

**Backend**
* Node.js
* Express.js
* MongoDB (Atlas) & Mongoose
* JSON Web Tokens (JWT)
* bcryptjs

---

## 📂 Folder Structure

```text
notes-app-fullstack/
├── notes-backend/       # Node.js & Express API environment
│   ├── config/          # Database connection
│   ├── controllers/     # Route logic (Auth & Notes)
│   ├── middleware/      # JWT protection logic
│   ├── models/          # Mongoose schemas (User & Note)
│   ├── routes/          # Express route definitions
│   └── server.js        # Main backend entry point
│
└── notes-frontend/      # React & Vite environment
    ├── src/
    │   ├── components/  # Reusable UI (NoteModal)
    │   ├── context/     # Global state (AuthContext)
    │   ├── pages/       # Core views (Login & Dashboard)
    │   ├── App.jsx      # Routing logic
    │   └── main.jsx     # Main frontend entry point

