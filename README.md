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

