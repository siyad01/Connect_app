/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { FaEdit } from "react-icons/fa";
import { UserData } from "../context/userContext";
const Profile_component = ({ user }) => {
  const [editProfile, setEditProfile] = useState(false);
  const navigate = useNavigate();

  const { updateUser } = UserData();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [backgroundPicture, setBackgroundPicture] = useState(null);
  const [tagline, setTagline] = useState("");

  const [location, setLocation] = useState({
    country: "",
    city: "",
  });
  const [pronouns, setPronouns] = useState("");
  const [website, setWebsite] = useState("");

  useEffect(() => {
    if (editProfile) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = "auto"; // Re-enable scrolling
    }

    // Cleanup when the component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [editProfile]);

  const editHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append basic profile details
    if (firstName) formData.append("firstName", firstName);
    if (lastName) formData.append("lastName", lastName);
    if (tagline) formData.append("tagline", tagline);

    // Append location (check if location exists)
    if (location && (location.country || location.city)) {
      formData.append("location", JSON.stringify(location));
    }

    // Append website
    if (website) {
      formData.append("website", website);
    }

    // Append pronouns
    if (pronouns) {
      formData.append("pronouns", pronouns);
    }

    // Append files (if they exist)
    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }
    if (backgroundPicture) {
      formData.append("backgroundPicture", backgroundPicture);
    }

    // Call the updateUser function
    await updateUser(formData, navigate);

    setEditProfile(false); // Close the edit profile modal
  };
  const handleOpenEditProfile = () => {
    setEditProfile(true);
  };

  const handleCloseEditProfile = () => {
    setEditProfile(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg">
        {/* Background and Profile Picture */}
        <div className="relative">
          <img
            src={user?.backgroundPicture}
            alt="Background"
            className="w-full h-24 sm:h-36 object-cover rounded-t-lg"
          />
          <img
            src={user?.profilePicture}
            alt="Profile"
            className="absolute top-12 sm:top-20  left-4 sm:left-6 w-20 sm:w-28 h-20 sm:h-28 rounded-full border-4 border-white object-cover"
          />
        </div>

        {/* Profile Details */}
        <div className="px-4 sm:px-6 pt-12 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold">
                {user?.firstName + " " + user?.lastName}
              </h1>
              <p className="text-gray-500 text-sm sm:text-base">
                ({user?.pronouns})
              </p>
              <p className=" text-gray-700 text-sm sm:text-base">
                {user?.tagline}
              </p>
              <p className="mt-1 text-gray-500 text-sm font-semibold">
                {user?.location
                  ? `${user.location.city}, ${user.location.country}`
                  : "Location not set"}
              </p>

              <p
                className="text-gray-500 text-sm mt-1"
                title={`mailto:${user?.email}`}
              >
                <a
                  href={`mailto:${user?.email}`}
                  className="text-[#FFA904] font-semibold text-sm"
                >
                  Contact info
                </a>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              

              <button
                title="Edit Profile"
                className="hover:text-[#FFA904] text-md sm:text-base"
                onClick={handleOpenEditProfile}
              >
                <FaEdit />
              </button>
            </div>
          </div>

          {/* Badge */}
          <div className="bg-gray-100 p-3 mt-4 rounded-md">
            <span className="text-gray-600 text-sm sm:text-base">
              Open to work as
            </span>
            <span className="ml-2 text-gray-800 font-medium text-sm sm:text-base">
              {user.tagline}
            </span>
          </div>
        </div>
      </div>

      {/*Edit profile */}
      {editProfile && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-4 shadow-lg w-full max-w-lg mx-4 sm:mx-auto relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-2 right-3 text-gray-600 hover:text-gray-900 text-2xl"
              onClick={handleCloseEditProfile}
            >
              &times; {/* Close button */}
            </button>
            <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>
            <div className="space-y-6 mb-6">
              {/* Profile Picture and Background Picture */}
              <div className="space-y-4 mb-6">
                {/* Background Picture */}
                <div className="w-full h-20 rounded-md bg-gray-200 overflow-hidden hover:ring-2 hover:ring-[#FFA904] mb-2">
                  <img
                    src={
                      backgroundPicture
                        ? URL.createObjectURL(backgroundPicture)
                        : user.backgroundPicture
                    }
                    alt="Background Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <input
                  type="file"
                  className="bg-gray-100 text-gray-600 p-2 rounded-full hover:bg-gray-200 w-full"
                  onChange={(e) => setBackgroundPicture(e.target.files[0])}
                  title="Choose Background"

                />

                
              </div>

              <div className="space-y-4">
                {/* Profile Picture */}
                <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden hover:ring-2 hover:ring-[#FFA904] mb-2">
                  <img
                    src={
                      profilePicture
                        ? URL.createObjectURL(profilePicture)
                        : user.profilePicture
                    }
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <input
                  type="file"
                  className="bg-gray-100 text-gray-600 p-2 rounded-full hover:bg-gray-200 w-full"
                  onChange={(e) => setProfilePicture(e.target.files[0])}
                  title="Choose Profile"

                />
              </div>

              {/* First Name and Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First name*
                  </label>
                  <input
                    type="text"
                    defaultValue={user.firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last name*
                  </label>
                  <input
                    type="text"
                    defaultValue={user.lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {/* Pronouns */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">
                  Pronouns
                </label>
                <select
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  value={pronouns || ""} // Add default value from user data
                  onChange={(e) => setPronouns(e.target.value)}
                >
                  <option value="He/Him">He/Him</option>
                  <option value="She/Her">She/Her</option>
                  <option value="They/Them">They/Them</option>
                </select>
              </div>

              {/* Tagline Input */}
              <div className="mb-6">
                <label className="block text-gray-700">Tagline</label>
                <input
                  type="text"
                  defaultValue={user.tagline} // Use defaultValue instead of placeholder
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-gray-100 rounded-lg p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FFA904]"
                />
              </div>

              {/* Location */}
              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Country/Region*
                  </label>
                  <input
                    type="text"
                    defaultValue={location.country || ""} // Use value for controlled input
                    onChange={(e) =>
                      setLocation((prevLocation) => ({
                        ...prevLocation,
                        country: e.target.value,
                      }))
                    } // Update the country field correctly
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    defaultValue={location.city || ""} // Use value for controlled input
                    onChange={(e) =>
                      setLocation((prevLocation) => ({
                        ...prevLocation,
                        city: e.target.value,
                      }))
                    } // Update the city field correctly
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {/* Website */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">
                  Website
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Add a link that will appear at the top of your profile"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
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

export default Profile_component;
