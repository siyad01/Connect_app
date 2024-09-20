import { Connection } from "../models/connectionModel.js"; // Adjust the import path as needed
import { Notification } from "../models/notificationModel.js"; // Adjust the import path as needed
import TryCatch from "../utils/TryCatch.js";
import { User } from "../models/userModel.js";

export const getNotifications = TryCatch(async (req, res) => {
  const userId = req.params.userId;

  // Find notifications for the user
  const notifications = await Notification.find({ recipient: userId })
    .populate("sender", "firstName lastName profilePicture") // Populate sender's data
    .populate("messageId") // Populate the message data if the notification is for a message

    .sort({ createdAt: -1 }); // Sort by newest first


  res.status(200).json(notifications);
});

export const acceptConnectionRequest = TryCatch(async (req, res) => {
  const userId = req.params.userId;
  const requestId = req.params.requestId;

  // Find the connection request
  const connectionRequest = await Connection.findById(requestId);

  if (!connectionRequest || connectionRequest.recipient.toString() !== userId) {
    return res
      .status(400)
      .json({ message: "Invalid request or you are not authorized" });
  }

  // Extract sender and recipient from the connection request
  const senderId = connectionRequest.requester.toString();
  const recipientId = connectionRequest.recipient.toString();

  // Update connection request status to accepted
  connectionRequest.status = "accepted";
  await connectionRequest.save();

  // Update sender's connections
  await User.findByIdAndUpdate(senderId, {
    $addToSet: { connections: recipientId }, // Add recipient to sender's connections if not already there
  });

  // Update recipient's connections
  await User.findByIdAndUpdate(recipientId, {
    $addToSet: { connections: senderId }, // Add sender to recipient's connections if not already there
  });

  // Find and remove the notification
  await Notification.findOneAndDelete({
    connectionRequestId: requestId,
    recipient: userId,
  });

  res.status(200).json({ message: "Connection request accepted" });
});

export const declineConnectionRequest = TryCatch(async (req, res) => {
  const userId = req.params.userId;
  const requestId = req.params.requestId;

  // Find the connection request
  const connectionRequest = await Connection.findById(requestId);

  if (!connectionRequest || connectionRequest.recipient.toString() !== userId) {
    return res
      .status(400)
      .json({ message: "Invalid request or you are not authorized" });
  }

  // Remove the connection request
  await Connection.findByIdAndDelete(requestId);

  // Find and remove the notification
  await Notification.findOneAndDelete({
    connectionRequestId: requestId,
    recipient: userId,
  });

  res.status(200).json({ message: "Connection request declined" });
});

export const viewMessage = async (req, res) => {
  try {
    const { userId, messageId } = req.params;
    
    // Your logic to mark message as viewed

    await Notification.findOneAndDelete({ messageId: messageId, recipient: userId }); // Adjust as needed
    res.status(200).json({ message: 'Message viewed' });
  } catch (error) {
    res.status(500).json({ message: 'Error viewing message', error });
  }
};
