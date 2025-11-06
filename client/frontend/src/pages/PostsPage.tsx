import React, { useEffect, useState } from "react";
import { fetchPosts, deletePost } from "../api/api";
import Comments from "./Comments";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const PostsPage: React.FC = () => {
  const nav = useNavigate();

  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const limit = 5;

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await fetchPosts({ page, limit, q });
      setPosts(res.data || []);
      setTotal(res.total || 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [page, q]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await deletePost(id);
      setPosts(prev => prev.filter(p => p._id !== id));
    } catch (err: any) {
      alert("Failed to delete post: " + err.message);
    }
  };

  if (loading) return <p className="text-center mt-6">Loading posts...</p>;
  if (error) return <p className="text-red-500 text-center mt-6">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      <h1 className="text-3xl font-bold text-center">📰 Blog Posts</h1>

      {/* Search */}
      <input
        type="text"
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Search posts..."
        className="w-full p-2 border rounded mb-4"
      />

      {/* Posts List */}
      {posts.map(post => (
        <PostItem key={post._id} post={post} onDelete={handleDelete} nav={nav} />
      ))}

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="self-center">Page {page}</span>
        <button
          onClick={() => setPage(prev => (prev * limit < total ? prev + 1 : prev))}
          disabled={page * limit >= total}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

interface PostItemProps {
  post: any;
  onDelete: (id: string) => void;
  nav: any;
}

const PostItem: React.FC<PostItemProps> = ({ post, onDelete, nav }) => {
  const [showComments, setShowComments] = useState(false);

  // Determine the correct image URL
  const imgSrc = post.featuredImage
    ? post.featuredImage.startsWith("http")
      ? post.featuredImage
      : `${API_BASE}${post.featuredImage}`
    : null;

  return (
    <div className="p-4 border rounded shadow-sm bg-white dark:bg-gray-800">
      <h2 className="text-xl font-semibold">{post.title}</h2>

      {imgSrc && (
        <img
          src={imgSrc}
          alt={post.title}
          className="mt-2 w-full max-h-64 object-cover rounded"
        />
      )}

      <p className="mt-2 text-gray-700 dark:text-gray-300">{post.body}</p>

      <div className="mt-2 flex gap-2 flex-wrap">
        <button
          onClick={() => nav(`/posts/edit/${post._id}`)}
          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(post._id)}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
        <button
          onClick={() => setShowComments(prev => !prev)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {showComments ? "Hide Comments" : "Show Comments"}
        </button>
      </div>

      {showComments && <Comments postId={post._id} />}
    </div>
  );
};

export default PostsPage;
