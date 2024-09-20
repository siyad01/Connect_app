import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import UserCardInJobs from "../components/UserCardInJobs";
import { UserData } from "../context/userContext";
import moment from 'moment';
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const { user, loading } = UserData();
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications (connection requests and messages)
  const fetchNotifications = async () => {
    try {
      const response = await fetch(`/api/notifications/${user._id}`);
      const data = await response.json();
      
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Handle accept connection request
  const handleAccept = async (requestId) => {
    try {
      const response = await fetch(`/api/notifications/${user._id}/accept/${requestId}`, {
        method: "POST",
      });

      if (response.ok) {
        toast.success("Connection request accepted!");
        fetchNotifications(); // Refetch notifications
      }
    } catch (error) {
      console.error("Error accepting connection request:", error);
    }
  };

  // Handle decline connection request
  const handleDecline = async (requestId) => {
    try {
      const response = await fetch(`/api/notifications/${user._id}/decline/${requestId}`, {
        method: "POST",
      });

      if (response.ok) {
        toast.success("Connection request declined!");
        fetchNotifications(); // Refetch notifications
      }
    } catch (error) {
      console.error("Error declining connection request:", error);
    }

  };
  const navigate = useNavigate()

  // Handle view message
  const handleViewMessage = async (messageId) => {
    try {
      if (typeof messageId !== 'string') {
        throw new Error('Invalid message ID');
      }
  
      const response = await fetch(`/api/notifications/${user._id}/view/${messageId}`, {
        method: "POST",
      });
  
      if (response.ok) {
        toast.success("Message viewed!");
        setNotifications(notifications.filter(notification => notification.messageId._id !== messageId));
        fetchNotifications()
        navigate(`/messaging`,400);
      } else {
        const error = await response.json();
        toast.error(error.message);
      }
    } catch (error) {
      console.error("Error viewing message:", error);
    }

  };
  

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const getTimeAgo = (createdAt) => {
    return moment(createdAt).fromNow();
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="min-h-screen bg-[#f9f6f2]">
          <div className="pt-16">
            <div className="container mx-auto p-4 flex space-x-2">
              {/* Left Sidebar */}
              <div className="hidden lg:block lg:w-1/4 space-x-4">
                <UserCardInJobs user={user}/>
              </div>

              <div className="w-full lg:w-1/2 shadow-md p-2 bg-white rounded-lg mr-6">
                <div className="bg-white rounded-lg p-4 mx-auto">
                  {notifications?.length === 0 ? (
                    <p>No notifications available</p>
                  ) : (
                    notifications?.map((notification) => (
                      <div
                        key={notification?._id}
                        className="flex items-start space-x-4 py-4 border-b last:border-b-0"
                      >
                        <div className="flex-shrink-0">
                          <img
                            src={notification?.sender?.profilePicture || "/default-avatar.jpg"}
                            alt="Profile"
                            className="w-10 h-10 rounded-full"
                          />
                        </div>

                        <div className="flex-1">
                          <h3 className="text-gray-700 font-medium text-sm">
                            {notification?.type === 'connectionRequest' ? (
                              <>
                                {notification?.sender?.firstName} {notification?.sender?.lastName} sent you a connection request
                              </>
                            ) : (
                              <>
                                {notification?.sender?.firstName} {notification?.sender?.lastName} sent you a message
                              </>
                            )}
                          </h3>
                          <p className="text-gray-500 text-sm">{getTimeAgo(notification?.createdAt)}</p>
                          <div className="mt-2 flex space-x-2">
                            {notification?.type === 'connectionRequest' ? (
                              <>
                                <button
                                  className="px-3 py-1 text-green-600 border border-green-600 rounded-full text-sm hover:bg-green-50"
                                  onClick={() => handleAccept(notification?.connectionRequestId)} // Use connectionRequestId
                                >
                                  Accept
                                </button>
                                <button
                                  className="px-3 py-1 text-red-600 border border-red-600 rounded-full text-sm hover:bg-red-50"
                                  onClick={() => handleDecline(notification?.connectionRequestId)} // Use connectionRequestId
                                >
                                  Decline
                                </button>
                              </>
                            ) : (
                              <button
                                className="px-3 py-1 text-blue-600 border border-blue-600 rounded-full text-sm hover:bg-blue-50"
                                onClick={() => handleViewMessage(notification?.messageId?._id)} // Use messageId
                              >
                                View Message
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <button className="text-gray-500 hover:text-gray-700">
                            •••
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                  <div className="text-center mt-2 -mb-2">Show more</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Notifications;
