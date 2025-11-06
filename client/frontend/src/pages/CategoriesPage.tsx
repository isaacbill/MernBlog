import React, { useEffect, useState } from "react";
import { fetchCategories, createCategory } from "../api/api";

interface Category {
  _id: string;
  name: string;
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCat, setNewCat] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // Load categories
  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(data))
      .catch((err: any) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Handle category creation
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.trim()) return;

    try {
      const created = await createCategory({ name: newCat });
      setCategories((prev) => [...prev, created]);
      setMessage(`✅ Category "${created.name}" added`);
      setNewCat("");
    } catch (err: any) {
      setMessage(`❌ ${err.response?.data?.errors?.[0]?.msg || err.message}`);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading categories...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">📂 Categories</h2>

      {/* Category list */}
      <ul className="mb-6 space-y-2">
        {categories.map((cat) => (
          <li key={cat._id} className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
            {cat.name}
          </li>
        ))}
      </ul>

      {/* Add new category */}
      <form onSubmit={handleCreate} className="space-y-2">
        <input
          type="text"
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          placeholder="New category name"
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Add Category
        </button>
      </form>

      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
};

export default CategoriesPage;
