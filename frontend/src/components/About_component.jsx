/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { UserData } from "../context/userContext";
const About_component = ({ user }) => {
  const [isEditAbout, setIsEditAbout] = useState(false);
  const [bio, setBio] = useState("");
  const navigate = useNavigate;

  const { updateUser } = UserData();
  const handleOpenEditAbout = () => {
    setIsEditAbout(true);
  };

  const handleCloseEditAbout = () => {
    setIsEditAbout(false);
  };

  const editHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    if (bio) formData.append("bio", bio);

    // Call the updateUser function
    await updateUser(formData, navigate);

    setIsEditAbout(false); // Close the edit about modal
  };

  useEffect(() => {
    if (isEditAbout) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = "auto"; // Re-enable scrolling
    }

    // Cleanup when the component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isEditAbout]);
  return (
    <>
      {/* {About} */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mt-6 relative">
        <button
          className="absolute top-4 sm:top-6 right-4 sm:right-6 hover:text-[#FFA904]"
          title="Edit About"
          onClick={handleOpenEditAbout}
        >
          <FaEdit />
        </button>
        <h2 className="text-lg font-semibold mb-2 sm:mb-4">About</h2>
        <p className="text-gray-700 text-sm sm:text-base">{user.bio}</p>
      </div>
      {/*Edit About */}
      {isEditAbout && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-4 shadow-lg w-full max-w-lg mx-4 sm:mx-auto relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-1 right-3 text-gray-600 hover:text-gray-900 text-2xl"
              onClick={handleCloseEditAbout} // Close About Modal
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit About</h2>
            <div className="space-y-4 mb-6">
              {/* Bio Input */}
              <div>
                <label className="block text-gray-700">Bio</label>
                <textarea
                  defaultValue={user.bio}
                  className="w-full bg-gray-100 rounded-lg p-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FFA904] resize-none"
                  rows="4"
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={editHandler}
                className="bg-[#FFA904] text-white px-4 py-2 rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default About_component;
