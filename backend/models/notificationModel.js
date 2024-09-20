import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['connectionRequest', 'message' ], // Define notification types
    required: true
  },
  message: {
    type: String, // For general message content
    required: true
  },
  connectionRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Connection' // Only if it's a connection request notification
  },
  messageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


export const Notification = mongoose.model("Notification", NotificationSchema);
