# 📰 MERN Blog

A full-stack **MERN (MongoDB, Express, React, Node.js)** blog application with authentication, post creation, editing, categories, comments, and email-based password recovery.

---

## Features

- **User Authentication**
  - Register / Login
  - JWT-based authentication
- **Posts**
  - Create, edit, delete posts
  - Add featured images
  - Search posts
  - Pagination
- **Comments**
  - Add comments to posts
  - Show/hide comments
- **Categories**
  - Manage post categories
- **Responsive Design**
  - Built with Tailwind CSS
- **Private/Public Routes**
  - Protected routes for authenticated users

---

## Tech Stack

- **Frontend:** React, React Router, Tailwind CSS, Axios
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** JWT
- **File Uploads:** Multer
- **Email Service:** Nodemailer
- **Environment Variables:** `.env`

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas)
- npm or yarn

---

### 1. Clone the repository

```bash
git clone [https://github.com/yourusername/mern-blog.git](https://github.com/isaacbill/MernBlog.git)
cd MernBlog

**2. Backend Setup**
cd server
npm install


Create a .env file:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret



Start the server:

npm install
npm run dev


The backend runs on http://localhost:5000.

**3. Frontend Setup**
cd client\frontend
npm install
npm run dev


The frontend runs on http://localhost:5173 (Vite dev server).

**4. Using the App**

Open the frontend URL in your browser.

Register a new user or login.

Create, edit, or delete posts.

Add comments and browse posts.



## CI/CD Pipeline with GitHub Actions

This project uses a GitHub Actions workflow to automatically build and deploy the MERN stack application to Render whenever changes are pushed to the `main` branch or a pull request is opened against it.

### Workflow Overview

- **Trigger:** Push to `main` or Pull Request to `main`.
- **Node.js Version:** 22.x
- **Jobs:**
  1. **Build and Deploy**
     - **Checkout Repository:** Pulls the latest code.
     - **Setup Node.js:** Installs the specified Node version.
     - **Backend**
       - Installs dependencies (`npm ci`) in `./server`.
     - **Frontend**
       - Installs dependencies (`npm ci`) in `./client/frontend`.
       - Builds the frontend for production (`npm run build`).
     - **Deployment**
       - Triggers Render backend deployment using a webhook (`RENDER_BACKEND_HOOK` secret).
       - Triggers Render frontend deployment using a webhook (`RENDER_FRONTEND_HOOK` secret).

### How to Use

1. Push changes to the `main` branch or open a pull request.
2. GitHub Actions automatically runs the workflow.
3. Render deployments are triggered, and the app is updated in production.

### Notes

- Environment variables for Render deployment are stored as GitHub secrets (`RENDER_BACKEND_HOOK` and `RENDER_FRONTEND_HOOK`).
- Testing is optional and can be added to the workflow if desired.
- The workflow ensures that the frontend is always built before deployment, so the live app is always up to date.

# MERN Stack Application

## Deployed Applications

### Frontend
[View Frontend on Render](https://[your-frontend-url.onrender.com](https://mern-blog-ilio.onrender.com))

### Backend
[View Backend API on Render](https://[your-backend-url.onrender.com](https://mernblog-3sl8.onrender.com))







