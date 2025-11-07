# 💬 MERN Chat App (Realtime Messaging)

A modern **realtime chat application** built with the **MERN stack**, **TypeScript**, **Tailwind CSS**, and **Socket.io** — featuring authentication, online presence, and file sharing.

---

## 🚀 Features

- 🔑 User authentication (JWT-based)
- 💬 Real-time messaging with Socket.io
- 📁 File upload support
- 👀 Online user tracking
- 🔔 Desktop notifications for new messages
- 🌈 Beautiful UI with Tailwind CSS
- ⚙️ TypeScript on both frontend and backend
- ☁️ MongoDB Atlas for database
- 🧭 Protected routes with React Router

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React + TypeScript + Tailwind CSS + Vite |
| Backend | Node.js + Express + MongoDB + Socket.io |
| Database | MongoDB Atlas |
| Auth | JWT (JSON Web Token) |

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd mern-week5
Install Dependencies
Backend
cd server
npm install

Frontend
cd ../client
npm install

🧾 Environment Variables

Create a .env file inside your server directory:

PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/chat-app
JWT_SECRET=yourSuperSecretKey
CLIENT_URL=http://localhost:5173

▶️ Running the Application
🖥️ Start the Server

From the server/ folder:

npm run dev

💻 Start the Client

From the client/ folder:

npm run dev


Then open http://localhost:5173 in your browser.
