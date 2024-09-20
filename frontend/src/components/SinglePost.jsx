/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { BiSolidLike, BiSolidCommentDetail } from "react-icons/bi";
import { FaShare } from "react-icons/fa";
import Modal from "./Modal";
import { PostData } from "../context/postContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { MdDelete } from "react-icons/md";

const SinglePost = ({ post, user }) => {
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false);
  const [postContent, setPostContent] = useState("");

  const { updatePost, deletePost } = PostData();
  const [commentText, setCommentText] = useState(""); // New state for comment input
  const [showCommentSection, setShowCommentSection] = useState(false); // Track comment section visibility

  const handleLike = async () => {
    // Handle liking functionality here
    try {
      const { data } = await axios.post(`/api/post/like/${post._id}`);
      setLikes(
        data.message === "Post Liked"
          ? [...likes, user._id]
          : likes.filter((id) => id !== user._id)
      );
      toast.success(data.message);
      window.location.reload();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to like/unlike post"
      );
      console.log(error);
    }
  };

  const handleComment = async () => {
    try {
      const { data } = await axios.post(`/api/post/comment/${post._id}`, {
        comment: commentText,
      });
      setComments(data.comments);

      toast.success(data.message);
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add comment");
    }
    setCommentText("");
    setShowCommentSection(false);
  };

  const handleShare = () => {
    const shareURL = `${window.location.origin}/post/${post._id}`;
    navigator.clipboard.writeText(shareURL);
    toast.success("Post link copied to clipboard");
  };

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleEdit = () => {
    setPostContent(post?.content);
    setIsEditPostModalOpen(true);

    // Add your edit functionality here
  };

  const handleDelete = () => {
    const postId = post._id;
    deletePost(postId, navigate);
    // Add your delete functionality here
  };
  //const postId = post?._id;

  // Validate media URL and type
  const mediaUrl = post?.media?.url;
  const isImage =
    mediaUrl &&
    mediaUrl.startsWith("http") &&
    /\.(jpeg|jpg|gif|png|svg)$/i.test(mediaUrl);
  const isVideo =
    mediaUrl && mediaUrl.startsWith("http") && /\.(mp4|mov)$/i.test(mediaUrl);

  const navigate = useNavigate();

  const updatePostHandler = () => {
    const content = postContent;
    updatePost(post, content, navigate);
    setIsEditPostModalOpen(false);
  };

  const toggleCommentSection = () => {
    setShowCommentSection(!showCommentSection);
  };
  const deleteCommentHandler = async (commentId) => {
    try {
      const { data } = await axios.delete(`/api/post/comment/${post._id}`, {
        params: { commentId },
      });
      setComments(comments.filter((comment) => comment._id !== commentId));
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete comment");
    }
  };
  useEffect(() => {
    // Fetch the post with comments and user details if needed
    const fetchPostDetails = async () => {
      try {
        const { data } = await axios.get(`/api/post/${post._id}`);
        setComments(data.comments);
      } catch (error) {
        console.error("Failed to fetch post details", error);
      }
    };

    if (showCommentSection) {
      fetchPostDetails();
    }
  }, [showCommentSection, post._id]);

  return (
    <>
      <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4  mx-auto mt-4">
        {/* Header */}
        <div className="flex items-start space-x-3 relative">
          {post?.owner?._id === user?._id ? (
            <Link to={"/account"}>
              <img
                className="w-10 h-10 rounded-full"
                src={post?.owner?.profilePicture || "/default-avatar.jpg"}
                alt="Profile"
              />
            </Link>
          ) : (
            <Link to={`/user/${post?.owner?._id}`}>
              <img
                className="w-10 h-10 rounded-full"
                src={post?.owner?.profilePicture || "/default-avatar.jpg"}
                alt="Profile"
              />
            </Link>
          )}

          <div>
            <p className="font-semibold">
              {post?.owner?.firstName} {post?.owner?.lastName}
            </p>
            <p className="text-gray-500 text-sm">
              {post?.createdAt
                ? new Date(post.createdAt).toLocaleDateString()
                : "Unknown date"}
            </p>
            <p className="text-xs text-gray-500">96,167 followers • Promoted</p>
          </div>
          {user._id === post.owner._id && (
            <div className="absolute right-1 top-1">
              {user?.id === post.owner._id ? (
                <button className="text-gray-700" onClick={handleMenuToggle}>
                  {/* Three dots icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 6a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM12 12a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM12 18a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
                  </svg>
                </button>
              ) : (
                " "
              )}

              {menuOpen && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg w-40">
                  <ul className="text-sm">
                    <li>
                      <button
                        className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                        onClick={handleEdit}
                      >
                        Edit
                      </button>
                    </li>
                    <li>
                      <button
                        className="block px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600"
                        onClick={handleDelete}
                      >
                        Delete
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <p className="mb-4">{post?.content || "No content available"}</p>

        {/* Image or Video */}
        {mediaUrl && (
          <div className="mt-3">
            {isImage ? (
              <img
                src={mediaUrl} // Use media URL from the post
                alt="Post media"
                className="w-full h-[200px] object-cover rounded-lg"
              />
            ) : isVideo ? (
              <video
                src={mediaUrl} // Use media URL from the post
                controls
                className="w-full rounded-lg"
              />
            ) : (
              <p>Unsupported file type</p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center mt-4 text-gray-500 text-sm">
          <div className="flex items-center space-x-1">
            <span>{likes.length}</span>
          </div>
          <div className="space-x-2">
            <span>{comments.length || 0} comments</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between text-sm sm:text-base items-center mt-4 border-t border-gray-300 pt-2">
          <button
            className="flex items-center space-x-1  text-gray-700 hover:text-[#FFA904]"
            onClick={handleLike}
          >
            {/* Like Icon */}
            <BiSolidLike />
            <span>{likes.includes(user._id) ? "Unlike" : "Like"}</span>{" "}
          </button>
          <button
            className="flex items-center space-x-1 text-gray-700 hover:text-[#FFA904]"
            onClick={toggleCommentSection}
          >
            {/* Comment Icon */}
            <BiSolidCommentDetail />
            <span>Comment</span>
          </button>
          <button
            className="flex items-center space-x-1 text-gray-700 hover:text-[#FFA904]"
            onClick={handleShare}
          >
            {/* Share Icon */}
            <FaShare />
            <span>Share</span>
          </button>
        </div>

        {/* Comment Section */}
        {showCommentSection && (
          <div className="mt-4">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="w-full border border-gray-300 p-2 rounded-lg"
            />
            <button
              onClick={handleComment} // Pass commentText as argument
              className="mt-2 py-1 px-4 bg-[#FFA904] text-white rounded-lg hover:bg-[#d38b00]"
            >
              Post Comment
            </button>
            {/* Render existing comments */}
            {comments?.map((comment) => (
              <div
                key={comment?._id}
                className="relative flex items-start justify-between mb-4 border-b border-gray-200 pb-2"
              >
                <div className="flex items-center gap-3">
                  <Link to={`/user/${comment?.user?._id}`}>
                    {" "}
                    {/* Correct path to user profile */}
                    <div className="rounded-full h-10 w-10 bg-gray-300 flex items-center justify-center mt-4">
                      <span className="font-bold">
                        {comment?.user?.profilePicture ? (
                          <img
                            src={comment?.user?.profilePicture}
                            alt="Profile"
                            className="w-full h-full rounded-full"
                          />
                        ) : (
                          comment?.user?.firstName?.slice(0, 1)
                        )}
                      </span>
                    </div>
                  </Link>

                  <div className="ml-2 mt-4">
                    <h2 className="text-md font-semibold">
                      {comment?.user?.firstName} {comment?.user?.lastName}
                    </h2>
                    <p className="text-gray-500 text-sm">{comment.comment}</p>
                  </div>

                  {comment?.user?._id === user?._id && (
                    <button
                      onClick={() => deleteCommentHandler(comment?._id)}
                      className="absolute right-2 top-1  text-gray-700 py-1 px-2 rounded hover:bg-[#FFA904] mt-4"
                    >
                      <MdDelete />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isEditPostModalOpen}
        onClose={() => setIsEditPostModalOpen(false)}
        title="Edit Post"
      >
        <form onSubmit={updatePostHandler}>
          <div className="flex items-center space-x-2 mb-4">
            <img
              className="w-10 h-10 rounded-full"
              src={user?.profilePicture || "/default-avatar.jpg"}
              alt="Profile"
            />
            <p className="font-semibold">
              {user?.firstName} {user?.lastName}
            </p>
          </div>
          <textarea
            rows={4}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="What do you want to talk about?"
            className="w-full border-2 border-gray-300 p-2 rounded-lg"
          />

          <div className="mt-4">
            <button className="w-full py-2 bg-[#FFA904] text-white font-semibold rounded-lg hover:bg-[#d38b00]">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default SinglePost;
