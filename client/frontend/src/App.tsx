import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import PostsPage from "./pages/PostsPage";
import CreatePost from "./pages/CreatePost";
import PostForm from "./pages/PostForm";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CategoriesPage from "./pages/CategoriesPage";


const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  // Update token if changed in localStorage (e.g., after login)
  useEffect(() => {
    const handleStorage = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    return token ? children : <Navigate to="/login" replace />;
  };

  const PublicRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    return token ? <Navigate to="/" replace /> : children;
  };

  return (
    <Router>
      {/* Navbar */}
      {token && (
        <nav className="p-4 bg-blue-600 text-white flex justify-between items-center shadow-md">
          <div className="font-bold text-lg">
            <Link to="/">📰 MERN Blog</Link>
          </div>

          <div className="space-x-4">
            <Link to="/" className="hover:underline">Posts</Link>
            <Link to="/create" className="hover:underline">Create Post</Link>
            <Link to="/categories" className="hover:underline">Category</Link>
            <button onClick={logout} className="hover:underline">Logout</button>
          </div>
        </nav>
      )}

      <main className="p-6 min-h-screen bg-gray-100 text-gray-900">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage onLogin={() => setToken(localStorage.getItem("token"))} />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage onRegister={() => setToken(localStorage.getItem("token"))} />
              </PublicRoute>
            }
          />
          
          {/* Private Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <PostsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/create"
            element={
              <PrivateRoute>
                <CreatePost />
              </PrivateRoute>
            }
          />
          <Route
            path="/posts/create"
            element={
              <PrivateRoute>
                <PostForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/posts/edit/:id"
            element={
              <PrivateRoute>
                <PostForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <PrivateRoute>
                <CategoriesPage />
              </PrivateRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to={token ? "/" : "/login"} replace />} />
        </Routes>
      </main>

      {token && (
        <footer className="text-center py-4 bg-gray-200 text-gray-600">
          © 2025 MERN Blog | Built with ❤️ using React & Node.js
        </footer>
      )}
    </Router>
  );
};

export default App;
