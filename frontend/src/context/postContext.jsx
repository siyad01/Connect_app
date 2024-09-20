/* eslint-disable no-unused-vars */
import axios from "axios";
import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const PostContext = createContext();

// eslint-disable-next-line react/prop-types
export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState({});
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState([]);

  async function fetchPosts() {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/post/all");
      setPosts(data);
      setLoading(false);
    } catch (error) {
      console.log("error fetching post ", error);
      setLoading(false);
    }
  }

  async function fetchSinglePost(id) {
    setLoading(true);

    try {
      const { data } = await axios.get(`/api/post/${id}`);
      setPost(data);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching post", error);
      setLoading(false);
    }
  }

  async function updatePost(post, postContent, navigate) {
   
    try {
      const { data } = await axios.put("/api/post/update-post", {
        postContent,
        post,
      });
      toast.success(data.message);
      fetchPosts();
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function deletePost(postId, navigate) {
   

    try {
      const { data } = await axios.delete("/api/post/delete-post", {
        data: { postId },
      });
      toast.success(data.message);
      fetchPosts();
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function createPost(
    formData,
    setFilePreview,
    setFile,
    setPostContent,
    navigate
  ) {
    try {
      const { data } = await axios.post("/api/post/new", formData);
      toast.success(data.message);
      toast.success(data.message);
      setFile([]);
      setFilePreview("");
      setPostContent("");
      fetchPosts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Create Post failed");
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);
  return (
    <PostContext.Provider
      value={{
        createPost,
        posts, // Array of posts
        loading, // Boolean indicating loading state
        fetchSinglePost,
        post, // Single post data
        updatePost,
        deletePost,
      }}
    >
      {children}
      <Toaster />
    </PostContext.Provider>
  );
};

export const PostData = () => useContext(PostContext);
