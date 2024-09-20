/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
const UserCard = ({ user }) => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4 max-w-sm mr-0">
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
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-sm text-gray-500">{user.tagline}</p>
      </div>

      {/* Saved Items */}
      <div className="mt-4 border-t border-gray-300 pt-2">
        <button className="flex items-center text-sm text-gray-700 hover:text-[#FFA904] w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 24 24"
            stroke="currentColor"
            fill="currentColor"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          Saved items
        </button>
      </div>
    </div>
  );
};

export default UserCard;
