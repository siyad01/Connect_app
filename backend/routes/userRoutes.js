import express from "express";
import {
  userProfile,
  loginUser,
  myProfile,
  registerUser,
  updateProfile,
  addData,
  addSkillData,
  addCertificatesData,
  logoutUser,
  getUserConnections,
  searchUsers,
} from "../controllers/userControllers.js";
import { isAuth } from "../middlewares/isAuth.js";
import uploadFile from "../middlewares/multer.js";
const router = express.Router();

router.post("/register", uploadFile, registerUser);
router.post("/login", loginUser);
router.get("/me", isAuth, myProfile);
router.get("/logout", isAuth, logoutUser);
router.get('/search',isAuth, searchUsers);

router.get("/:id", isAuth, userProfile);

router.put("/update-profile", uploadFile, isAuth, updateProfile);
router.post("/add-data", uploadFile, isAuth, addData);
router.post("/add-skilldata", uploadFile, isAuth, addSkillData);
router.post("/add-certificatesdata", uploadFile, isAuth, addCertificatesData);

router.get("/:id/connections",isAuth,getUserConnections)


// router.post('/unconnect', isAuth, unConnectUser);


export default router;
