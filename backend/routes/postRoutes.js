import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { Post } from "../models/postModel.js";

import {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
  likePost,
  commentOnPost,
  deleteComment,
} from "../controllers/postControllers.js";
import uploadFileinPost from "../middlewares/multerforpost.js";
const router = express.Router();

// Route to create a new post
router.post("/new", isAuth, uploadFileinPost, createPost);

// Route to get all posts (for the feed)
router.get("/all", isAuth, getAllPosts);

// Route to get a single post by ID
router.get("/:id", isAuth, getSinglePost);


// Route to update a post
router.put("/update-post", isAuth, updatePost);

// Route to delete a post
router.delete("/delete-post", isAuth, deletePost);

// Route to like/unlike a post
router.post("/like/:id", isAuth, likePost);

// Route to comment on a post
router.post("/comment/:id", isAuth, commentOnPost);

// Route to delete a comment
router.delete("/comment/:id", isAuth, deleteComment);

export default router;
