import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    tagline: {
      type: String,
      trim: true,
      default: "Professional Seeking Opportunities",
    },
    bio: {
      type: String,
      trim: true,
    },
    location: {
      country: { type: String, trim: true },
      city: { type: String, trim: true },
    },
    website: {
      type: String,
      trim: true,
    },
    profilePicture: {
      type: String,
    },
    backgroundPicture: {
      type: String,
    },
    pronouns: {
      type: String,
      default: "He/Him",
    },

    experience: [
      {
        title: { type: String, required: true },
        company: { type: String, required: true },

        startDate: { type: Date, required: true },
        endDate: { type: Date },
        description: { type: String, trim: true },
      },
    ],
    education: [
      {
        school: { type: String, required: true },
        degree: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        description: { type: String },
      },
    ],
    skills: [
      {
        skillName: { type: String, required: true },
        skillLevel: { type: String, required: true },
      },
    ],
    certifications: [
      {
        certName: { type: String, trim: true },
        issuedDate: { type: Date },
      },
    ],
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    pendingConnections: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
