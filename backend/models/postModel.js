import mongoose from "mongoose";
const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    media: {
      id: String, // Cloudinary or other media service ID
      url: String, // URL for the media
      
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        unique: true, // Ensure no duplicate likes from the same user

      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Reference to User model
          required: true,

        },
        comment: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    visibility: {
      type: String,
      enum: ["Public", "Connections", "Private"],
      default: "Public",
    },
  },
  {
    timestamps: true,
  }
);

postSchema.index({ _id: 1, "likes.user": 1 }, { unique: true });

export const Post = mongoose.model("Post", postSchema);
