import React, { useEffect, useState } from "react";
import { fetchComments, createComment } from "../api/api";

interface Comment {
  _id: string;
  authorName: string;
  body: string;
  createdAt: string;
}

interface Props {
  postId: string;
}

const Comments: React.FC<Props> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); // toggle form visibility

  const loadComments = async () => {
    setLoading(true);
    try {
      const data = await fetchComments(postId);
      setComments(data);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !body) return alert("Name and comment are required.");
    try {
      const comment = await createComment(postId, author, body);
      setComments(prev => [comment, ...prev]); // optimistic UI update
      setAuthor("");
      setBody("");
      setShowForm(false); // hide form after submit
    } catch (err: any) {
      alert("Failed to add comment: " + err.message);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  if (loading) return <p>Loading comments...</p>;

  return (
    <div className="mt-4">
      <h4 className="font-bold mb-2">Comments</h4>

      {/* Toggle form button */}
      <button
        onClick={() => setShowForm(prev => !prev)}
        className="px-3 py-1 mb-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {showForm ? "Hide Comment Form" : "Add Comment"}
      </button>

      {/* Comment form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 space-y-2">
          <input
            type="text"
            placeholder="Your name"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            placeholder="Write a comment..."
            value={body}
            onChange={e => setBody(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Submit Comment
          </button>
        </form>
      )}

      {/* Comments list */}
      {comments.length === 0 ? (
        <p className="text-gray-600">No comments yet.</p>
      ) : (
        <ul className="space-y-2">
          {comments.map(c => (
            <li key={c._id} className="p-2 border rounded bg-gray-50 dark:bg-gray-700">
              <p className="font-semibold">{c.authorName}</p>
              <p>{c.body}</p>
              <small className="text-gray-500">{new Date(c.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Comments;
