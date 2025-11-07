import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { connectSocket, getSocket } from "../socket";
import { Message, User } from "../types";

const SERVER = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";
const SOUND = "/ding.mp3";

const ChatPage: React.FC = () => {
  const token = localStorage.getItem("token")!;
  const user: User = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  const [connected, setConnected] = useState(false);
  const [room, setRoom] = useState("global");
  const [messages, setMessages] = useState<Message[]>([]);
  const [online, setOnline] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [typingUsers, setTypingUsers] = useState<Record<string, string>>({});
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const fileRef = useRef<HTMLInputElement | null>(null);
  const soundRef = useRef<HTMLAudioElement | null>(null);

  // 🔌 Connect socket
  useEffect(() => {
    soundRef.current = new Audio(SOUND);
    const socket = connectSocket(token);

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("init", (data: { recent: Message[]; online: string[] }) => {
      setMessages(data.recent || []);
      setOnline(data.online || []);
    });

    socket.on("message:new", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
      soundRef.current?.play();

      if (Notification.permission === "granted" && msg.from.userId !== user._id) {
        new Notification(`Message from ${msg.from.name}`, { body: msg.content });
      }
    });

    socket.on("system:message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("typing", ({ userId, name, isTyping }: any) => {
      setTypingUsers((prev) => {
        const copy = { ...prev };
        if (isTyping) copy[userId] = name;
        else delete copy[userId];
        return copy;
      });
    });

    socket.on("presence:update", ({ userId, online }: any) => {
      setOnline((prev) =>
        online ? [...new Set([...prev, userId])] : prev.filter((id) => id !== userId)
      );
    });

    if (Notification.permission !== "granted") Notification.requestPermission();

    return () => socket.disconnect();
  }, []);

  // ✉️ Send message
  const sendMessage = () => {
    const socket = getSocket();
    if (!socket || !text.trim()) return;
    socket.emit("message:send", { room, content: text, type: "text" });
    setText("");
  };

  // 📁 Upload file
  const uploadFile = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await axios.post(`${SERVER}/api/upload`, fd);
    const socket = getSocket();
    socket?.emit("message:send", {
      room,
      content: res.data.url,
      type: "file",
      fileMeta: res.data,
    });
  };

  // ⬆️ Load older messages
  const loadOlder = async () => {
    const before = messages.length ? messages[0].ts : new Date().toISOString();
    const res = await axios.get(
      `${SERVER}/api/messages?room=${room}&before=${before}&limit=50`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setMessages((prev) => [...res.data.messages, ...prev]);
  };

  // 🚪 Logout logic
  const confirmLogout = () => setShowLogoutConfirm(true);
  const cancelLogout = () => setShowLogoutConfirm(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="max-w-3xl mx-auto p-4 relative">
      {/* ====== Main Chat UI ====== */}
      <div className={`${showLogoutConfirm ? "blur-sm pointer-events-none" : ""}`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold">Room: {room}</h2>
            <span className="text-sm text-gray-600">
              {connected ? "🟢 Connected" : "🔴 Disconnected"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-700 font-medium">{user?.name}</span>
            <button
              onClick={confirmLogout}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Load older messages */}
        <button onClick={loadOlder} className="text-blue-500 mb-2 underline">
          Load older messages
        </button>

        {/* Messages */}
        <div className="border p-3 h-96 overflow-y-auto bg-gray-50 rounded">
          {messages.map((m) => (
            <div key={m._id || Math.random()} className="mb-3">
              {m.type === "system" ? (
                <div className="text-gray-500 italic text-sm text-center">
                  {m.content}
                </div>
              ) : (
                <div>
                  <div className="flex justify-between text-sm text-gray-700">
                    <strong>{m.from.name}</strong>
                    <span>{new Date(m.ts).toLocaleTimeString()}</span>
                  </div>
                  {m.type === "file" ? (
                    <a
                      href={m.content}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      File: {m.fileMeta?.originalName}
                    </a>
                  ) : (
                    <p>{m.content}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Typing indicator */}
        {Object.values(typingUsers).length > 0 && (
          <p className="italic text-sm mt-2 text-gray-600">
            {Object.values(typingUsers).join(", ")} typing...
          </p>
        )}

        {/* Message input */}
        <div className="flex gap-2 mt-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Type a message..."
          />
          <input
            ref={fileRef}
            type="file"
            onChange={(e) => e.target.files && uploadFile(e.target.files[0])}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>

        {/* Online users */}
        <div className="mt-4 text-sm text-gray-600">
          <strong>Online:</strong> {online.join(", ")}
        </div>
      </div>

      {/* ====== Logout Confirmation Modal ====== */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center animate-fadeIn">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to log out?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Yes, Logout
              </button>
              <button
                onClick={cancelLogout}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
