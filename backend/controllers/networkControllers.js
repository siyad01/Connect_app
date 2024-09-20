import { User } from "../models/userModel.js"; // Assuming you have a User model
import { Connection } from "../models/connectionModel.js"; // Assuming you have a Connection model
import TryCatch from "../utils/TryCatch.js";
import { Notification } from "../models/notificationModel.js"; // Assuming you have a Connection model

// Get People You May Know
export const getSuggestions = TryCatch(async (req, res) => {
  const userId = req.params.userId;

  // Fetch user data and their connections
  const user = await User.findById(userId).populate("connections");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Find users with similar roles, excluding existing connections
  const suggestions = await User.find({
    _id: { $ne: userId, $nin: user.connections }, // Exclude the user and their current connections
    role: user.role, // Assuming you have a "role" field in the user model for matching
  }).limit(10); // Limit suggestions to 10

  res.status(200).json(suggestions);
});

// Get Current Connections
export const getConnections = TryCatch(async (req, res) => {
  const userId = req.params.userId;

  const user = await User.findById(userId).populate("connections");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Optionally, return more detailed info about connections
  const connections = await User.find({
    _id: { $in: user.connections },
  }).select("firstName lastName profilePicture bio");

  res.status(200).json(connections);
});

// Send Connection Request
export const sendConnectionRequest = TryCatch(async (req, res) => {
  const userId = req.params.userId;
  const user = req.body;
  
  
  const { targetUserId } = req.body;

  if (userId === targetUserId) {
    return res.status(400).json({ message: "You can't connect with yourself" });
  }

  // Find the target user
  const targetUser = await User.findById(targetUserId);
  if (!targetUser) {
    return res.status(404).json({ message: "Target user not found" });
  }

  // Check if a connection or pending request already exists
  const existingConnection = await Connection.findOne({
    $or: [
      { requester: userId, recipient: targetUserId },
      { requester: targetUserId, recipient: userId },
    ],
  });

  if (existingConnection) {
    return res
      .status(400)
      .json({ message: "Already connected or request pending" });
  }

  // Create a new connection request
  const newConnection = new Connection({
    requester: userId,
    recipient: targetUserId,
    status: "pending",
  });

  

  await newConnection.save();

  // Create a notification for the target user
  const notification = new Notification({
    recipient: targetUserId,
    sender: userId,
    type: "connectionRequest",
    message: `You have a new connection request from ${userId}`,
    connectionRequestId: newConnection._id,
  });

  

  await notification.save();

  res.status(201).json({ message: "Connection request sent!" });
});


export const unConnectUser = TryCatch(async (req, res) => {
  try {
    const { userId, connectionId } = req.body; // IDs of the users involved

    // Step 1: Update User Model
    await User.findByIdAndUpdate(userId, { $pull: { connections: connectionId } });
    await User.findByIdAndUpdate(connectionId, { $pull: { connections: userId } });

    // Step 2: Delete Connection Document
    await Connection.findOneAndDelete({
      $or: [
        { requester: userId, recipient: connectionId },
        { requester: connectionId, recipient: userId }
      ]
    });

    res.status(200).json({ message: 'User successfully disconnected' });
  } catch (error) {
    console.error('Error disconnecting user:', error);
    res.status(500).json({ message: 'Server error during disconnection' });
  }
});


