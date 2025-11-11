import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE, // only this
  headers: { "Content-Type": "application/json" },
});

// Attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ----- POSTS -----
export const fetchPosts = (params?: any) =>
  api.get("/posts", { params }).then((res) => res.data);

export const fetchPost = (id: string) =>
  api.get(`/posts/${id}`).then((res) => res.data);

export const createPost = (formData: FormData) =>
  api
    .post("/posts", formData, { headers: { "Content-Type": "multipart/form-data" } })
    .then((res) => res.data);

export const updatePost = (id: string, formData: FormData) =>
  api
    .put(`/posts/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } })
    .then((res) => res.data);

export const deletePost = (id: string) =>
  api.delete(`/posts/${id}`).then((res) => res.data);

// ----- AUTH -----
export const login = (data: { email: string; password: string }) =>
  api.post("/auth/login", data).then((res) => res.data);

export const register = (data: { name: string; email: string; password: string }) =>
  api.post("/auth/register", data).then((res) => res.data);

// ----- COMMENTS -----
export const fetchComments = (postId: string) =>
  api.get(`/comments/post/${postId}`).then((res) => res.data);

export const createComment = (postId: string, authorName: string, body: string) =>
  api.post("/comments", { post: postId, authorName, body }).then((res) => res.data);

// ----- CATEGORIES -----
export const fetchCategories = () =>
  api.get("/categories").then((res) => res.data);

export const createCategory = (data: { name: string }) =>
  api.post("/categories", data).then((res) => res.data);

export default api;
