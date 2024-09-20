/* eslint-disable react/prop-types */
import { FaUserFriends } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
const UserCard = ({ user }) => {
  const [connections, setConnections] = useState("")

  // Fetch the user's connections
  const fetchConnections = async () => {
    try {
      const response = await fetch(`/api/user/${user._id}/connections`);
      const data = await response.json();

      setConnections(data.length);
    } catch (error) {
      console.error("Error fetching connections:", error);
    }
  };
  useEffect(() => {
    fetchConnections();
  })

  return (
    <div className="bg-white border  rounded-lg shadow-md p-4 max-w-[300px] mr-0">
      {/* Header with background image and profile image */}
      <div className="relative">
        <img
          src={user?.backgroundPicture} // Replace with the actual background image path
          alt="Background"
          className="w-full h-16 rounded-t-lg object-cover"
        />
        <Link to={`/account`}>
          <img
            src={user?.profilePicture} // Replace with the actual profile image path
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover border-4 border-white absolute left-1/2 transform -translate-x-1/2 -bottom-10 cursor-pointer
                  hover:ring-2 hover:ring-[#FFA904]"
          />
        </Link>
      </div>

      {/* User Info */}
      <div className="text-center mt-12">
        <h2 className="text-lg font-semibold hover:underline hover:text-[#FFA904] cursor-pointer">
          {user.firstName} {user?.lastName}
        </h2>
        <p className="text-sm text-gray-500">{user?.tagline} </p>
      </div>

      {/* Manage My Network */}
      <div className="mt-6 border-t border-gray-300 pt-4">
        <h3 className="text-md font-semibold mb-2">Manage my network</h3>
        <div className="space-y-2 text-md ">
          <div className="flex justify-between items-center hover:bg-gray-100 p-1">
            <div className="flex items-center ">
              <FaUserFriends className="mr-2" />
              <span>Connections</span>
            </div>
            <span className="text-gray-700">{connections}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
