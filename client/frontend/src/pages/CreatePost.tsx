import React, { useState, useEffect } from "react";
import { createPost, fetchCategories } from "../api/api";
import { useNavigate } from "react-router-dom";

const CreatePost: React.FC = () => {
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // fetch categories for dropdown
    fetchCategories()
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const fd = new FormData();
    fd.append("title", title);
    fd.append("body", body);
    if (category) fd.append("category", category);
    if (file) fd.append("featuredImage", file);

    try {
      await createPost(fd);
      setMessage("✅ Post created successfully!");
      setTitle("");
      setBody("");
      setCategory("");
      setFile(null);
      nav("/"); // redirect to posts list after successful submission
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setMessage(
          `❌ ${err.response.data.errors.map((e: any) => e.msg).join(", ")}`
        );
      } else if (err.response?.data?.message) {
        setMessage(`❌ ${err.response.data.message}`);
      } else {
        setMessage(`❌ ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 space-y-4 bg-white dark:bg-gray-800 rounded shadow-md"
    >
      <h2 className="text-2xl font-bold text-center">📝 Create New Post</h2>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        required
      />

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Content"
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        rows={5}
        required
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
      >
        <option value="">Select category</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="w-full"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>

      {message && (
        <p
          className={`mt-4 text-center ${
            message.startsWith("✅") ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
};

export default CreatePost;
