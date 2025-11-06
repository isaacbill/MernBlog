import { useState, useEffect } from "react";
import { fetchPosts, fetchCategories } from "../api/api";

// Generic API hook
export function useApi<T>(fn: (...args: any[]) => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    fn()
      .then(res => { if (!alive) return; setData(res); })
      .catch(e => { if (!alive) return; setError(e.message || String(e)); })
      .finally(() => { if (!alive) return; setLoading(false); });

    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, setData };
}

// Wrapper for Posts
export const usePosts = (params?: any) => {
  const apiCall = () => fetchPosts(params);
  const { data, loading, error, setData } = useApi<any>(apiCall, [JSON.stringify(params)]);

  return { posts: data?.data || data || [], loading, error, setPosts: setData };
};

// Wrapper for Categories
export const useCategories = () => {
  const { data, loading, error, setData } = useApi<any>(fetchCategories, []);

  return { categories: data || [], loading, error, setCategories: setData };
};
