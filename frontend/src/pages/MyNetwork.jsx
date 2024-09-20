import { useEffect, useState } from "react";
import UserCardInNetwork from "../components/UserCardInNetwork";
import { UserData } from "../context/userContext";
import { Loading } from "../components/Loading";
import { Link, useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const MyNetwork = () => {
  const { user, loading } = UserData();
  const [suggestedPeople, setSuggestedPeople] = useState([]);
  const [connections, setConnections] = useState([]);

  // Fetch suggested people to connect with
  const fetchSuggestions = async () => {
    try {
      const response = await fetch(`/api/network/${user._id}/suggestions`);
      const data = await response.json();
      setSuggestedPeople(data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };


  // Fetch the user's connections
  const fetchConnections = async () => {
    try {
      const response = await fetch(`/api/user/${user._id}/connections`);
      const data = await response.json();

      setConnections(data);
    } catch (error) {
      console.error("Error fetching connections:", error);
    }
  };

  const firstName = user.firstName;
  const lastName = user.lastName;
  const profilePicture = user.profilePicture;
  // Connect to a person
  const handleConnect = async (personId) => {
    try {
      const response = await fetch(`/api/network/${user._id}/connect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetUserId: personId,
          firstName,
          lastName,
          profilePicture,
        }), // Ensure the key matches what your backend expects
      });

      if (response.ok) {
        toast.success("Connection request sent!");
        fetchConnections(); // Refetch connections

        fetchSuggestions(); // Refetch the suggestions
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to send connection request");
      }
    } catch (error) {
      console.error("Error sending connection request:", error);
    }
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchSuggestions();
      fetchConnections();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleMessage = async (personId) => {
    try {
      // Make API call to create a new conversation
      const { data } = await axios.post("/api/conversations", {
        userId: personId, // Pass the profile user ID
      });


      // Redirect to the messaging page with the conversation ID
      navigate(`/messaging/${data._id}`);
    } catch (error) {
      console.log("Error creating conversation", error);
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="min-h-screen bg-[#f9f6f2]">
          <div className="pt-16">
            <div className="container mx-auto p-4 flex flex-col lg:flex-row lg:space-x-4">
              {/* Left Sidebar */}
              <div className="hidden lg:block mb-4 lg:mb-0 lg:w-1/4 px-2">
                <UserCardInNetwork user={user} />
              </div>

              {/* Right Content Area */}
              <div className="w-full lg:w-3/4 space-y-4 shadow-md p-2 bg-white rounded-lg">
                {/* Suggestions Section */}
                <div className="px-4">
                  <h2 className="text-xl font-semibold mb-4">
                    People you may know with similar roles
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {suggestedPeople.length === 0 ? (
                      <p>No suggestions available at the moment</p>
                    ) : (
                      suggestedPeople?.map((person) => (
                        <div
                          key={person?._id}
                          className="bg-white border border-gray-300 rounded-lg shadow-sm p-4 relative"
                        >
                          <img
                            src={
                              person?.backgroundPicture ||
                              "/default-background.jpg"
                            }
                            alt="Background"
                            className="w-full h-24 object-cover rounded-t-lg"
                          />
                          <Link
                            to={`/user/${person?._id}`}
                            className="absolute top-16 left-1/2 transform -translate-x-1/2"
                          >
                            <img
                              src={
                                person?.profilePicture || "/default-avatar.jpg"
                              }
                              alt="Profile"
                              className="w-20 h-20 rounded-full border-4 border-white object-cover"
                            />
                          </Link>
                          <div className="pt-8 text-center">
                            <h3 className="text-lg font-semibold">
                              {person?.firstName} {person?.lastName}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {person?.tagline}
                            </p>

                            <div className="mt-4">
                              <button
                                className="w-full bg-[#FFA904] text-white text-sm font-semibold py-2 rounded hover:bg-[#d6a03b]"
                                onClick={() => handleConnect(person._id)}
                              >
                                Connect
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Connections Section */}
                <div className="px-4 mt-8">
                  <h2 className="text-xl font-semibold mb-4">
                    Your Connections
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {connections?.length === 0 ? (
                      <p>You have no connections</p>
                    ) : (
                      connections?.map((connection) => (
                        <div
                          key={connection?._id}
                          className="bg-white border border-gray-300 rounded-lg shadow-sm p-4 -py-4 relative text-sm sm:text-base"
                        >
                          <img
                            src={
                              connection?.backgroundPicture ||
                              "/default-background.jpg"
                            }
                            alt="Background"
                            className="w-full h-24 object-cover rounded-t-lg"
                          />
                          <Link
                            to={`/user/${connection?._id}`}
                            className="absolute top-16 left-1/2 transform -translate-x-1/2"
                          >
                            <img
                              src={
                                connection?.profilePicture ||
                                "/default-avatar.jpg"
                              }
                              alt="Profile"
                              className="w-20 h-20 rounded-full border-4 border-white object-cover"
                            />
                          </Link>
                          <div className="mt-8 text-center">
                            <h3 className="text-sm sm:text-base font-semibold">
                              {connection?.firstName} {connection?.lastName}
                            </h3>
                            <p>{connection.tagline}</p>

                            <div className="mt-4">
                              <button
                                onClick={() => handleMessage(connection._id)}
                                className="w-full bg-[#FFA904] text-white text-sm font-semibold py-2 rounded hover:bg-[#d6a03b]"
                              >
                                Message
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyNetwork;
