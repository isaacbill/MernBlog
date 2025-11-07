import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChatPage from "./pages/ChatPage";

const App: React.FC = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const location = useLocation();

  // ✅ Keep token updated across browser events + state
  useEffect(() => {
    const syncToken = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", syncToken);
    return () => window.removeEventListener("storage", syncToken);
  }, []);

  // ✅ When navigating, re-check token
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [location.pathname]);

  const Private = ({ children }: { children: JSX.Element }) =>
    token ? children : <Navigate to="/login" replace />;

  const Public = ({ children }: { children: JSX.Element }) =>
    token ? <Navigate to="/chat" replace /> : children;

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Public>
            <LoginPage />
          </Public>
        }
      />
      <Route
        path="/register"
        element={
          <Public>
            <RegisterPage />
          </Public>
        }
      />
      <Route
        path="/chat"
        element={
          <Private>
            <ChatPage />
          </Private>
        }
      />
      <Route path="*" element={<Navigate to={token ? "/chat" : "/login"} replace />} />
    </Routes>
  );
};

export default App;
