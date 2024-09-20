/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
const UserCard = ({ user }) => {
  return (
    <div className="bg-white  rounded-lg shadow-md p-6 max-w-[250px] mr-0">
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
          {user?.firstName} {user?.lastName}
        </h2>
        <p className="text-sm text-gray-500">{user?.tagline}</p>
      </div>

      {/* Manage My Network */}
    </div>
  );
};

export default UserCard;
