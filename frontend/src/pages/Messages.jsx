import { useState, useEffect } from "react";
import { FiSend } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import { UserData } from "../context/userContext";
import { Loading } from "../components/Loading";
import toast from "react-hot-toast";
import axios from "axios";

const Messages = () => {
  const { user, loading } = UserData();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Fetch conversations
    const fetchConversations = async () => {
      try {
        const response = await fetch(`/api/conversations/${user._id}`);
        const data = await response.json();
        setConversations(data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };
    fetchConversations();
  }, [user]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`/api/messaging/${activeChat._id}`);
      if (response.data) {
        setMessages(response.data);
      } else {
        console.warn("No messages found");
        setMessages([]); // Set to an empty array if null
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (activeChat) {
      fetchMessages();
    }
  }, [activeChat]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(`/api/messaging/${activeChat._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: user._id,
          content: newMessage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, data]);
        setNewMessage("");
        toast.success("Message sent");
        fetchMessages();
      } else {
        const error = await response.json();
        console.error("Error sending message:", error);
        toast.error(error.message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const response = await axios.delete(`/api/messaging/${activeChat._id}/${messageId}`);
      if (response.status === 200) {
        setMessages((prev) => prev.filter((message) => message._id !== messageId));
        toast.success("Message deleted");
      } else {
        toast.error("Failed to delete message");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Error deleting message");
    }
  };

  

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="min-h-screen bg-[#f9f6f2]">
          <div className="pt-20 p-4">
            <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] bg-gray-100">
              {/* Sidebar */}
              <div className="w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-300 overflow-y-auto shadow-lg rounded-lg">
                <div className="p-4 border-b">
                  <input
                    type="text"
                    placeholder="Search messages"
                    className="w-full p-2 border rounded outline-[#FFA904]"
                  />
                </div>
                <div>
                  {/* Message List */}
                  {conversations.map((conversation) => (
                    <div
                      key={conversation._id}
                      onClick={() => setActiveChat(conversation)} // Set active chat
                      className="p-4 hover:bg-gray-100 cursor-pointer flex items-center"
                    >
                      <img
                        src={
                          conversation?.participants?.find(
                            (participant) =>
                              participant._id.toString() !== user._id.toString()
                          ).profilePicture || "/default-avatar.jpg"
                        }
                        alt="Profile"
                        className="rounded-full w-10 h-10 mr-3"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-semibold">
                            {
                              conversation.participants.find(
                                (participant) =>
                                  participant._id.toString() !==
                                  user._id.toString()
                              ).firstName
                            }
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(
                              conversation?.updatedAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {conversation?.lastMessage?.content ||
                            "No messages yet"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Window */}
              <div className="flex-1 flex flex-col bg-white shadow-lg rounded-lg">
                {activeChat ? (
                  <>
                    {/* Chat Header: Display recipient details */}
                    <div className="p-4 border-b border-gray-300">
                      <div className="flex items-center">
                        {/* Find the partner from participants */}
                        {activeChat.participants
                          .filter(
                            (participant) =>
                              participant?._id?.toString() !==
                              user?._id?.toString()
                          )
                          .map((partner) => (
                            <div
                              key={partner?._id}
                              className="flex items-center"
                            >
                              <img
                                src={
                                  partner?.profilePicture ||
                                  "/default-avatar.jpg"
                                }
                                alt="Recipient"
                                className="rounded-full w-10 h-10 mr-3"
                              />
                              <div>
                                <div className="font-semibold text-lg">
                                  {partner?.firstName} {partner?.lastName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {partner?.email}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4">
                      {messages?.length > 0 ? (
                        messages?.map((message) => (
                          <div
                            key={message?._id}
                            className={`flex mb-4 ${
                              message?.sender?._id.toString() ===
                              user?._id?.toString()
                                ? "justify-end"
                                : ""
                            }`}
                          >
                            <img
                              src={
                                message?.sender?._id?.toString() ===
                                user?._id?.toString()
                                  ? user?.profilePicture
                                  : activeChat?.participants.find(
                                      (participant) =>
                                        participant?._id?.toString() !==
                                        user?._id?.toString()
                                    )?.profilePicture || "/default-avatar.jpg"
                              }
                              alt="Profile"
                              className="rounded-full w-10 h-10 mr-3"
                            />
                            <div>
                              <div className="font-semibold">
                                {message?.sender?._id?.toString() ===
                                user?._id?.toString()
                                  ? "You"
                                  : activeChat?.participants.find(
                                      (participant) =>
                                        participant?._id?.toString() !==
                                        user?._id?.toString()
                                    ).firstName}
                              </div>
                              <div className="text-sm text-gray-600 flex items-center">
                                {message?.content}
                                {message?.sender?._id?.toString() ===
                                  user?._id?.toString() && (
                                  <button
                                    onClick={() => handleDeleteMessage(message._id)}
                                    className="ml-2 text-red-500 hover:text-red-700"
                                  >
                                    <FaTrash />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No messages yet</p>
                      )}
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-gray-300">
                      <div className="flex items-center">
                        <input
                          type="text"
                          placeholder="Write a message..."
                          className="flex-1 p-2 border rounded outline-[#FFA904]"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button
                          className="ml-2 text-[#FFA904] text-xl"
                          onClick={handleSendMessage}
                        >
                          <FiSend />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Select a conversation to start chatting
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Messages;
