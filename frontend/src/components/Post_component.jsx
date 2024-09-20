/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { FaImage, FaVideo, FaSmile } from "react-icons/fa";
import Picker from "@emoji-mart/react";
import { PostData } from "../context/postContext";
import { useNavigate } from "react-router-dom";
import SinglePost from "./SinglePost";
import { Loading } from "./Loading";
const PostSection = ({ user }) => {
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [postContent, setPostContent] = useState("");

  //const [editpost, setEditPost] = useState(false);
  //const [isEditPostModalOpen, setisEditPostModalOpen] = useState(false)

  const { posts, createPost, loading } = PostData();

  const emojiPickerRef = useRef(null);
  const navigate = useNavigate();

  const handleOpenPost = () => setIsPostOpen(true);
  const handleClosePost = () => {
    setIsPostOpen(false);
    setFile(null);
    setFilePreview(null);
    setShowEmojiPicker(false);
  };

  let userPosts;

  if (posts) {
    userPosts = posts.filter((post) => post.owner._id === user._id);
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const fileUrl = URL.createObjectURL(selectedFile);
      setFilePreview(fileUrl);
    }
  };

  const handleMouseEnter = () => {
    setShowEmojiPicker(true);
  };

  const handleMouseLeave = () => {
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // useEffect(() => {
  //   fetchSinglePost(post._id);
  // },[post._id])

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("content", postContent);
    if (file) {
      formData.append("file", file);
    }

    await createPost(
      formData,
      setFilePreview,
      setFile,
      setPostContent,
      navigate
    );
    setIsPostOpen(false);
  };

  const handleEmojiClick = (emoji) => {
    setPostContent(postContent + emoji.native);
  };

  useEffect(() => {
    if (isPostOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isPostOpen]);

  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Activity</h2>
            <button
              className="text-[#FFA904] font-semibold border-2 border-[#FFA904] p-2 rounded-xl hover:bg-[#FFA904] hover:text-white text-sm sm:text-base"
              onClick={handleOpenPost}
            >
              Create a post
            </button>
          </div>
          
          <div className="flex flex-wrap space-x-2 sm:space-x-4 mb-4">
            <p className="bg-[#FFA904] text-white font-semibold px-6 py-2 rounded-xl text-md sm:text-base">
              Posts
            </p>
          </div>

          <div className="space-y-4">
            {userPosts && userPosts.length > 0 ? (
              userPosts
                .slice(0, expanded ? 3 : 2)
                .map((post) => (
                  <SinglePost key={post._id} post={post} user={user} />
                ))
            ) : (
              <p>No posts yet</p>
            )}
          </div>

          <button
            className="text-[#FFA904] font-semibold text-center justify-center hover:bg-gray-100 p-2 mt-4 "
            onClick={handleToggle}
          >
            Show {expanded ? "less" : "more"}{" "}
            <i className={`fas fa-chevron-${expanded ? "up" : "down"}`}></i>{" "}
          </button>

          {isPostOpen && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-lg mx-4 sm:mx-auto relative overflow-y-auto max-h-[90vh]">
                <button
                  className="absolute top-2 right-3 text-gray-600 hover:text-gray-900 text-2xl"
                  onClick={handleClosePost}
                >
                  &times;
                </button>
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

                {filePreview && (
                  <div className="relative mt-8 border p-2 rounded-lg">
                    <button
                      className="absolute top-2 right-2 text-gray-800 font-bold text-2xl z-10"
                      onClick={() => {
                        setFile(null);
                        setFilePreview(null);
                      }}
                    >
                      &times;
                    </button>
                    {file && (
                      <>
                        {file.type.startsWith("image/") ? (
                          <img
                            src={filePreview}
                            alt="Preview"
                            className="w-full h-[200px] object-cover rounded-lg"
                          />
                        ) : file.type.startsWith("video/") ? (
                          <video
                            src={filePreview}
                            controls
                            className="w-full h-[200px] object-cover rounded-lg"
                          />
                        ) : (
                          <p>Unsupported file type</p>
                        )}
                      </>
                    )}
                  </div>
                )}

                <div className="flex space-x-4 mt-2">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <FaImage className="text-[#FFA904] text-xl" />
                    <input
                      type="file"
                      id="image-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>

                  <label htmlFor="video-upload" className="cursor-pointer">
                    <FaVideo className="text-[#FFA904] text-xl" />
                    <input
                      type="file"
                      id="video-upload"
                      className="hidden"
                      accept="video/*"
                      onChange={handleFileChange}
                    />
                  </label>

                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="relative"
                  >
                    <FaSmile className="text-[#FFA904] text-xl" />
                    {showEmojiPicker && (
                      <div
                        className="absolute z-50"
                        ref={emojiPickerRef}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      >
                        <Picker onEmojiSelect={handleEmojiClick} />
                      </div>
                    )}
                  </button>
                </div>

                <div className="mt-6">
                  <button
                    className="w-full py-2 bg-[#FFA904] text-white font-semibold rounded-lg hover:bg-[#d38b00]"
                    onClick={handleSubmit}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
export default PostSection;
