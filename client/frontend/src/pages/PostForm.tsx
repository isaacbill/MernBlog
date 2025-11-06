import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createPost, updatePost, fetchPost, fetchCategories } from "../api/api";

const PostForm: React.FC = () => {
  const { id } = useParams();
  const nav = useNavigate();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error);

    if (id) {
      fetchPost(id)
        .then(d => {
          setTitle(d.title);
          setBody(d.body);
          setCategory(d.category?._id || "");
          setFeaturedImage(d.featuredImage || null);
        })
        .catch(err => setError(err.message));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fd = new FormData();
    fd.append("title", title);
    fd.append("body", body);
    if (category) fd.append("category", category);
    if (file) fd.append("featuredImage", file);

    try {
      if (id) await updatePost(id, fd);
      else await createPost(fd);
      nav("/"); // Redirect after success
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 space-y-4 bg-white dark:bg-gray-800 rounded shadow-md"
    >
      <h2 className="text-2xl font-bold text-center">
        {id ? "✏️ Edit Post" : "📝 Create New Post"}
      </h2>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        required
      />

      <textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        placeholder="Content"
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        rows={5}
        required
      />

      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
      >
        <option value="">Select category</option>
        {categories.map(c => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </select>

      <div>
        <label className="block mb-1 font-medium">Featured Image</label>
        {featuredImage && !file && (
          <img
            src={featuredImage.startsWith("http") ? featuredImage : `http://localhost:5000${featuredImage}`}
            alt="Current"
            className="w-48 h-32 object-cover mb-2 rounded"
          />
        )}
        <input
          type="file"
          onChange={e => setFile(e.target.files?.[0] || null)}
          className="w-full"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
      >
        {loading ? "Saving..." : id ? "Update Post" : "Create Post"}
      </button>
    </form>
  );
};

export default PostForm;
