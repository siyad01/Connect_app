import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';

export const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(403).json({ message: "Please Login" });
        }

        // Verify token
        const decodedData = jwt.verify(token, process.env.JWT_SEC);

        // Find user by ID
        const user = await User.findById(decodedData.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user; // Attach user to request object
        next(); // Proceed to the next middleware or route handler

    } catch (error) {
        console.error("Authentication error:", error); // Log error for debugging
        res.status(403).json({ message: "Invalid or expired token" });
    }
};
