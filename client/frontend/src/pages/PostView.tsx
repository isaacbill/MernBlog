import React from "react";
import { useParams } from "react-router-dom";
import { fetchPost } from "../api/api";
import { useApi } from "../hooks/useApi";

export default function PostView() {
  const { id } = useParams();
  const { data, loading } = useApi(()=>fetchPost(id!), [id]);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>Not found</div>;
  return (
    <article>
      <h1>{data.title}</h1>
      <div>By: {data.author?.name}</div>
      {data.featuredImage && <img src={data.featuredImage} alt={data.title} style={{maxWidth: "100%"}} />}
      <div dangerouslySetInnerHTML={{ __html: data.body }} />
    </article>
  );
}
