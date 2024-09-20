/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { FaImage, FaVideo, FaSmile } from "react-icons/fa";
import Picker from "@emoji-mart/react";
import { PostData } from "../context/postContext";
import { useNavigate } from "react-router-dom";

const PostCreationBox = ({user}) => {
  const [isPostOpen, setIsPostOpen] = useState(false);

  const handleInputClick = () => {
    setIsPostOpen(true);
  };

  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null); // For media preview

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [postContent, setPostContent] = useState(""); // To handle post content

  const handleClosePost = () => {
    setIsPostOpen(false);
    setFile(null);
    setFilePreview(null);
    setShowEmojiPicker(false);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const fileUrl = URL.createObjectURL(selectedFile);
      setFilePreview(fileUrl);
    }
  };

  const emojiPickerRef = useRef(null);

  // Handle mouse enter and leave for emoji picker
  const handleMouseEnter = () => {
    setShowEmojiPicker(true);
  };

  const handleMouseLeave = () => {
    setShowEmojiPicker(false);
  };

  // Close emoji picker if it's open and mouse leaves
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

  const {createPost} = PostData();
  const navigate = useNavigate()

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
    setPostContent(postContent + emoji.native); // Append emoji to the post content
  };

  useEffect(() => {
    if (isPostOpen) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = "auto"; // Re-enable scrolling
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isPostOpen]);

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm max-w-xl mx-auto">
      <div className="flex items-center space-x-4">
        {/* Profile Picture */}
        <div className="w-12 h-11 rounded-full bg-gray-200 overflow-hidden hover:ring-2 hover:ring-[#FFA904]">
          <img
            src={user?.profilePicture} // Replace with actual profile image or a placeholder
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Input Field */}
        <input
          type="text"
          placeholder="What do you want to talk about?"
          className="w-full bg-gray-100 rounded-xl px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FFA904] text-sm md:text-base"
          onClick={handleInputClick}
        />
      </div>

      {/* New Post Component */}
      {isPostOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-lg mx-4 sm:mx-auto relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-1 right-3 text-gray-600 hover:text-gray-900 text-2xl"
              onClick={handleClosePost}
            >
              &times;
            </button>
            <div className="flex items-center space-x-2 mb-4">
              <div className="rounded-full overflow-hidden h-10 w-10">
                <img
                  className="object-cover w-full h-full"
                  src={user?.profilePicture || "/default-avatar.jpg"}
                  alt="Profile"
                />
              </div>
              <div>
                <p className="font-semibold">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
            </div>
            <textarea
              rows={4}
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What do you want to talk about?"
              className="w-full border-2 border-gray-300 p-2 rounded-lg"
            />

            {/* Media Preview */}
            {filePreview && (
              <div className="mt-8 relative border p-2 rounded-lg">
                <button
                  className="absolute -top-2 right-1 text-gray-800 font-bold text-2xl z-10"
                  onClick={() => {
                    setFile(null);
                    setFilePreview(null);
                  }}
                >
                  &times;
                </button>
                <div className="mt-4 relative">
                  {file ? (
                    file.type.startsWith("image/") ? (
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
                    )
                  ) : (
                    <p>No file selected</p>
                  )}
                </div>
              </div>
            )}

            {/* File upload options */}
            <div className="flex space-x-4 mt-2">
              <button>
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
              </button>

              <button>
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
              </button>

              {/* Emoji Picker */}
              <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <FaSmile className="text-[#FFA904] text-xl" />
              </button>

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
  );
};

export default PostCreationBox;
