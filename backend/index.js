import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDb from "./database/db.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import networkRoutes from "./routes/networkRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import path from "path";
import cloudinary from "cloudinary";

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.Cloud_Name,
  api_key: process.env.Cloud_Api,
  api_secret: process.env.Cloud_Secret,
});

const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/auth", authRoutes); // Use the authentication routes under '/api/auth'
app.use("/api/network", networkRoutes); // Add this line to define the endpoint
app.use("/api/notifications", notificationRoutes); // Add this line to define the endpoint

app.use("/api/conversations", conversationRoutes);
app.use("/api/messaging", messageRoutes);

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname)), "frontend", "dist", "index.html";
});

app.listen(PORT, () => {
  console.log(`Server Started on http://localhost:${PORT}`);
  connectDb();
});
