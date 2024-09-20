// authRoutes.js (or wherever your authentication routes are defined)
import express from "express";

import { isAuth } from "../middlewares/isAuth.js";
const router = express.Router();

// Token verification route
router.get("/verify", isAuth, (req, res) => {
  // If token is valid, return user data
  res.status(200).json({ user: req.user });
});

export default router;