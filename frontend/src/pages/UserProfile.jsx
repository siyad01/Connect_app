/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SinglePost from "../components/SinglePost";
import { Loading } from "../components/Loading";

// eslint-disable-next-line react/prop-types
const UserProfile = ({ user: loggedInUser }) => {
  const navigate = useNavigate();

  const params = useParams();
  const [user, setUser] = useState([]);

  const [loading, setLoading] = useState(false);

  const [posts, setPosts] = useState([]);

  const handleMessage = async () => {
    try {
      // Make API call to create a new conversation
      const { data } = await axios.post("/api/conversations", {
        userId: user._id, // Pass the profile user ID
      });

      // Redirect to the messaging page with the conversation ID
      navigate(`/messaging/${data._id}`);
    } catch (error) {
      console.log("Error creating conversation", error);
    }
  };

  async function fetchUser() {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/user/${params.id}`);
      setUser(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }
  async function fetchPosts() {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/post/all");
      setPosts(data);
      setLoading(false);
    } catch (error) {
      console.log("error fetching post ", error);
      setLoading(false);
    }
  }

  let userPosts;

  if (posts) {
    userPosts = posts.filter((post) => post.owner._id === user._id);
  }

  useEffect(() => {
    fetchUser();
    fetchPosts();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Connect to a person
  const handleConnect = () => {
    navigate("/my-network");
  };

  const handleUnconnect = async () => {
    try {
      await axios.post("/api/network/unconnect", {
        userId: loggedInUser._id,
        connectionId: user._id,
      });
      // Optionally refresh user data
      fetchUser();
    } catch (error) {
      console.error("Error unconnecting user:", error);
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="min-h-screen bg-[#f9f6f2]">
          <div className="container mx-auto p-4 pt-20 flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
            {/* Main Feed */}
            <div className="w-full lg:w-2/3">
              {/*Profile */}
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

                      <p className=" text-gray-700 text-sm sm:text-base mt-1">
                        {user?.tagline}
                      </p>
                      <p className="mt-1 text-gray-500 text-sm font-semibold">
                        {user?.location
                          ? `${user?.location?.city}, ${user?.location?.country}`
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
                      {user?.connections?.includes(loggedInUser._id) ? (
                        <>
                          <button
                            onClick={handleMessage}
                            title="message"
                            className="font-semibold text-sm sm:text-base px-3 sm:px-4 py-1 sm:py-2 rounded-md shadow bg-[#FFA904] hover:bg-gray-300 text-white hover:text-gray-800"
                          >
                            Message
                          </button>
                          <button
                            onClick={handleUnconnect}
                            title="unconnect"
                            className="font-semibold text-sm sm:text-base px-3 sm:px-4 py-1 sm:py-2 rounded-md shadow bg-red-500 hover:bg-red-700 text-white"
                          >
                            Unconnect
                          </button>
                        </>
                      ) : (
                        <button
                          title="connect"
                          onClick={handleConnect}
                          className="font-semibold text-sm sm:text-base px-3 sm:px-4 py-1 sm:py-2 rounded-md shadow bg-[#FFA904] hover:bg-gray-300 text-white hover:text-gray-800"
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="bg-gray-100 p-3 mt-4 rounded-md">
                    <span className="text-gray-600 text-sm sm:text-base">
                      Open to work as
                    </span>
                    <span className="ml-2 text-gray-800 font-medium text-sm sm:text-base">
                      {user?.tagline}
                    </span>
                  </div>
                </div>
              </div>
              {/* {About} */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mt-6 relative">
                <h2 className="text-lg font-semibold mb-2 sm:mb-4">About</h2>
                <p className="text-gray-700 text-sm sm:text-base">{user.bio}</p>
              </div>
              {/* {Posts Section} */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mt-6">
                <div className="flex flex-wrap space-x-2 sm:space-x-4 mb-4">
                  <p className="font-semibold px-4 py-2 rounded-xl text-sm sm:text-base bg-[#FFA904] text-white">
                    Posts
                  </p>
                </div>

                <div className="space-y-4">
                  {userPosts && userPosts?.length > 0 ? (
                    userPosts?.map((post) => (
                      <SinglePost key={post?._id} post={post} user={user} />
                    ))
                  ) : (
                    <p>No posts yet</p>
                  )}
                </div>

                <div className="hover:bg-gray-100 p-2 mt-4 text-center">
                  <button className="text-[#FFA904] font-semibold">
                    Show all posts ➔
                  </button>
                </div>
              </div>
              {/* {Experience} */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mt-6 relative">
                <h2 className="text-lg font-semibold">Experience</h2>
                <div className="mt-4 space-y-4">
                  {user?.experience?.length === 0
                    ? "No experience added"
                    : user?.experience?.map((exp, index) => (
                        <div
                          key={index}
                          className="hover:bg-gray-100 p-4 rounded-lg relative flex flex-col sm:flex-row items-start sm:items-center sm:justify-between"
                        >
                          <div>
                            <h3 className="text-md font-semibold">
                              {exp?.title} {" | "} {exp?.company}
                            </h3>
                            <p className="text-gray-500 text-sm sm:text-base">
                              {new Date(exp.startDate).toLocaleDateString()} -{" "}
                              {exp?.endDate
                                ? new Date(exp.endDate).toLocaleDateString()
                                : "Present"}{" "}
                            </p>
                            <p className="text-gray-600 text-sm sm:text-base">
                              {exp?.description}
                            </p>
                          </div>
                        </div>
                      ))}
                </div>
              </div>
              {/* {Education} */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mt-6 relative">
                <h2 className="text-lg font-semibold">Education</h2>
                <div className="mt-4 space-y-4">
                  {user?.education?.length === 0
                    ? "No education added"
                    : user.education?.map((edu, index) => (
                        <div
                          key={index}
                          className="hover:bg-gray-100 p-4 rounded-lg relative flex flex-col sm:flex-row items-start sm:items-center sm:justify-between"
                        >
                          <div>
                            <h3 className="text-md font-semibold">
                              {edu?.degree} {" | "} {edu?.school}
                            </h3>
                            <p className="text-gray-500 text-sm sm:text-base">
                              {new Date(edu.startDate).toLocaleDateString()} -{" "}
                              {edu?.endDate
                                ? new Date(edu.endDate).toLocaleDateString()
                                : "Present"}{" "}
                            </p>
                            <p className="text-gray-600 text-sm sm:text-base">
                              {edu?.description}
                            </p>
                          </div>
                        </div>
                      ))}
                </div>
              </div>
              {/* {Skills} */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mt-6 relative">
                <h2 className="text-lg font-semibold">Skills</h2>
                <div className="mt-4 space-y-4">
                  {user?.skills?.length === 0
                    ? "No skills added"
                    : user?.skills?.map((skill, index) => (
                        <div
                          key={index}
                          className="hover:bg-gray-100 p-4 rounded-lg relative flex flex-col sm:flex-row items-start sm:items-center sm:justify-between"
                        >
                          <div>
                            <h3 className="text-md font-semibold">
                              {skill?.skillName}
                            </h3>
                            <p className="text-gray-500 text-sm sm:text-base">
                              {skill?.skillLevel}
                            </p>
                          </div>
                        </div>
                      ))}
                </div>
              </div>
              {/* {Licenses and Certifications} */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mt-6 relative">
                <h2 className="text-lg font-semibold">
                  Licenses & Certifications
                </h2>
                <div className="mt-4 space-y-4">
                  {user?.certifications?.length === 0
                    ? "No certifications added"
                    : user?.certifications?.map((cert, index) => (
                        <div
                          key={index}
                          className="hover:bg-gray-100 p-4 rounded-lg relative flex flex-col sm:flex-row items-start sm:items-center sm:justify-between"
                        >
                          <div>
                            <h3 className="text-md font-semibold">
                              {cert?.certName}
                            </h3>
                            <p className="text-gray-500 text-sm sm:text-base">
                              Issued on {cert?.issuedDate.split("T")[0]}
                            </p>
                          </div>
                        </div>
                      ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="hidden lg:block lg:w-1/3">
              {/* Public Profile & URL Section */}
              <div className="bg-white p-6 shadow-md  max-w-sm rounded-lg mb-4">
                <p className="text-gray-800 font-semibold">
                  Public profile & URL
                </p>
                <a
                  href="#"
                  className="text-[#FFA904]  hover:text-[#b37903] font-semibold"
                >
                  www.Connect.com/in/{user?.firstName}
                  {"-"}
                  {user?.lastName}
                </a>
              </div>

              {/* Profile Language Section */}
              <div className="bg-white p-6 rounded-lg max-w-sm shadow-md mb-4">
                <div className="flex justify-between items-center">
                  <p className="text-gray-800 font-semibold">
                    Profile language
                  </p>
                  <p className="text-gray-800 text-sm">English</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className=" text-gray-900 font-semibold py-4 mt-6">
            <div className="container mx-auto text-center">
              <p>&copy; 2024 Connect. All rights reserved.</p>
              <p>Made by Muhammed Siyad</p>
            </div>
          </footer>
        </div>
      )}
    </>
  );
};

export default UserProfile;
