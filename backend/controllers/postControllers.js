import { Post } from "../models/postModel.js";
import TryCatch from "../utils/TryCatch.js";
import getDataUrl from "../utils/urlGenerator.js";
import cloudinary from "cloudinary";

// Create a Post
export const createPost = TryCatch(async (req, res) => {
  const { content, visibility } = req.body;
  const file = req.file; // Handling media (optional)

  let media = {};
  if (file) {
    const fileUrl = getDataUrl(file); // Convert file to base64 or buffer
    let cloud;

    // Check if the file is an image or video
    if (file.mimetype.startsWith("image/")) {
      cloud = await cloudinary.v2.uploader.upload(fileUrl.content); // Default for images
    } else if (file.mimetype.startsWith("video/")) {
      cloud = await cloudinary.v2.uploader.upload(fileUrl.content, {
        resource_type: "video", // For videos
      });
    }

    // Storing the uploaded media's Cloudinary public ID and URL
    media = {
      id: cloud.public_id,
      url: cloud.secure_url,
    };
  }

  const post = await Post.create({
    content,
    media,
    owner: req.user._id,
    visibility: visibility || "Public",
  });

  res.json({
    message: "Post Created",
    post,
  });
});

// Get all Posts (e.g., for feed)
export const getAllPosts = TryCatch(async (req, res) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate("owner", "-password");
  res.json(posts);
});

// Get a Single Post
export const getSinglePost = TryCatch(async (req, res) => {
  const post = await Post.findById(req.params.id).populate({
   path: "owner",
   select: "-password"
})

.populate({
  path: 'comments.user',
  select: 'profilePicture firstName lastName'
});


  if (!post)
    return res.status(404).json({
      message: "Post not found",
    });

  res.json(post);
});


// Get All Posts for a Specific User

// Like a Post
export const likePost = TryCatch(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post)
    return res.status(404).json({
      message: "Post not found",
    });

  if (post.likes.includes(req.user._id)) {
    post.likes = post.likes.filter(
      (like) => like.toString() !== req.user._id.toString()
    );
    await post.save();
    res.json({ message: "Post Unliked" });
  } else {
    post.likes.push(req.user._id);
    await post.save();
    res.json({ message: "Post Liked" });
  }
});

// Comment on a Post
export const commentOnPost = TryCatch(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post)
    return res.status(404).json({
      message: "Post not found",
    });

  post.comments.push({
    user: req.user._id,
    comment: req.body.comment,
  });

  await post.save();
  
  const populatedPost = await Post.findById(req.params.id)
    .populate({
      path: 'comments.user',
      select: 'profilePicture firstName lastName', // Adjust fields as needed
    });

    res.json({
      message: "Comment Added",
      comments: populatedPost.comments,
    });
});

// Delete a Comment from a Post
export const deleteComment = TryCatch(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post)
    return res.status(404).json({
      message: "Post not found",
    });

  const commentIndex = post.comments.findIndex(
    (comment) => comment._id.toString() === req.query.commentId.toString()
  );

  if (commentIndex === -1)
    return res.status(404).json({
      message: "Comment not found",
    });

  const comment = post.comments[commentIndex];

  if (comment.user.toString() === req.user._id.toString()) {
    post.comments.splice(commentIndex, 1);
    await post.save();
    res.json({ message: "Comment Deleted" });
  } else {
    res.status(403).json({ message: "You are not the owner of this comment" });
  }
});

// Update a Post
export const updatePost = TryCatch(async (req, res) => {
  const { postContent } = req.body;
  const post = await Post.findById(req.body.post._id);

  if (!post)
    return res.status(404).json({
      message: "Post not found",
    });

  if (post.owner._id.toString() !== req.user._id.toString())
    return res.status(403).json({
      message: "Unauthorized",
    });

  post.content = postContent;

  await post.save();

  res.json({
    message: "Post Updated",
    post,
  });
});

// Delete a Post
export const deletePost = TryCatch(async (req, res) => {
  const { postId } = req.body;
  const post = await Post.findById(postId);

  if (!post)
    return res.status(404).json({
      message: "Post not found",
    });

  if (post.owner._id.toString() !== req.user._id.toString())
    return res.status(403).json({
      message: "Unauthorized",
    });

  if (post.media && post.media.id) {
    await cloudinary.v2.uploader.destroy(post.media.id); // Deleting media if exists
  }

  await post.deleteOne();

  res.json({
    message: "Post Deleted",
  });
});
