import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import TryCatch from "../utils/TryCatch.js";
import generateToken from "../utils/generateToken.js";
import getDataUrl from "../utils/urlGenerator.js";
import cloudinary from "cloudinary";

export const registerUser = TryCatch(async (req, res) => {
  const { firstName, lastName, email, password, tagline, bio } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      message: "An account with this email already exists",
    });
  }
  // Extract uploaded files from multer
  const files = req.files;

  let profilePictureUrl = null;
  let backgroundPictureUrl = null;

  // Handle Profile Picture upload
  if (files?.profilePicture) {
    const profileFile = files.profilePicture[0]; // multer stores files as arrays
    const profileFileUrl = getDataUrl(profileFile);
    const uploadProfile = await cloudinary.v2.uploader.upload(
      profileFileUrl.content
    );
    profilePictureUrl = uploadProfile.secure_url; // Get URL of the uploaded image
  }

  // Handle Background Picture upload
  if (files?.backgroundPicture) {
    const backgroundFile = files.backgroundPicture[0];
    const backgroundFileUrl = getDataUrl(backgroundFile);
    const uploadBackground = await cloudinary.v2.uploader.upload(
      backgroundFileUrl.content
    );
    backgroundPictureUrl = uploadBackground.secure_url;
  }

  // Check if user with this email already exists

  // Hash the password
  const hashPassword = await bcrypt.hash(password, 10);

  // Create a new user in the database
  user = await User.create({
    firstName,
    lastName,
    email,
    password: hashPassword,
    profilePicture: profilePictureUrl,
    backgroundPicture: backgroundPictureUrl,
    tagline,
    bio,
  });

  // Generate and send the token (assuming you have a function for this)
  generateToken(user._id, res);

  res.status(201).json({
    user,
    message: "User registered successfully",
  });
});

export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return res.status(400).json({
      message: "No user with this mail",
    });

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword)
    return res.status(400).json({
      message: "Wrong password",
    });

  generateToken(user._id, res);

  res.json({
    user,
    message: "Logged in",
  });
});

export const myProfile = TryCatch(async (req, res) => {
  try {
    const userId = req.params.id;

    // Debugging: Check type and value of userId
   

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
export const userProfile = TryCatch(async (req, res) => {
 
  const user = await User.findById(req.params.id).select("-password ");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json(user);
});

export const updateProfile = TryCatch(async (req, res) => {
  const userId = req.user._id; // Get user ID from the authenticated user


  const {
    firstName,
    lastName,
    tagline,
    bio,
    skills,
    experience,
    education,
    certifications,
    location,
    website,
    pronouns,
  } = req.body;

  // Fetch the user by ID
  let user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  const files = req.files;
  // Handle Profile Picture update if file is provided
  if (files?.profilePicture) {
    const profileFile = req.files.profilePicture[0];
    const profileFileUrl = getDataUrl(profileFile);
    const uploadProfile = await cloudinary.v2.uploader.upload(
      profileFileUrl.content
    );
    user.profilePicture = uploadProfile.secure_url; // Update profile picture URL
  }

  // Handle Background Picture update if file is provided
  if (req.files?.backgroundPicture) {
    const backgroundFile = req.files.backgroundPicture[0];
    const backgroundFileUrl = getDataUrl(backgroundFile);
    const uploadBackground = await cloudinary.v2.uploader.upload(
      backgroundFileUrl.content
    );
    user.backgroundPicture = uploadBackground.secure_url; // Update background picture URL
  }

  // Update user fields only if they are provided in the request body
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;

  if (tagline) user.tagline = tagline;
  if (bio) user.bio = bio;

  if (location)
    user.location = Array.isArray(location) ? location : JSON.parse(location);

  if (website) user.website = website;
  if (pronouns) user.pronouns = pronouns;

  // // Update skills, experience, and education if provided, and parse if necessary
  if (skills) user.skills = Array.isArray(skills) ? skills : JSON.parse(skills);
  if (experience)
    user.experience = Array.isArray(experience)
      ? experience
      : JSON.parse(experience);
  if (education)
    user.education = Array.isArray(education)
      ? education
      : JSON.parse(education);
  if (certifications)
    user.certifications = Array.isArray(certifications)
      ? certifications
      : JSON.parse(certifications);



  // // Handle location
  if (location) {
    if (location.country) user.location.country = location.country;
    if (location.city) user.location.city = location.city;
  }

  // Save the updated user information
  await user.save();
  res.status(200).json({
    message: "Profile updated successfully",
    user,
  });
});

export const addData = TryCatch(async (req, res) => {
  const userId = req.user._id;
  const { education, experience } = req.body; // Destructure both education and experience

  

  // Fetch the user by ID
  let user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  // Handle experience addition
  if (experience) {
    const { title, company, startDate, endDate, description } =
      JSON.parse(experience);

    const newExperience = {
      title,
      company,
      startDate,
      endDate,
      description,
    };

    // Add the new experience to the array of experiences
    if (Array.isArray(user.experience)) {
      user.experience.push(newExperience);
    } else {
      user.experience = [newExperience]; // Initialize as an array if not already
    }
  }

  // Handle education addition
  if (education) {
    const { school, degree, startDate, endDate, description } =
      JSON.parse(education);

    const newEducation = {
      school,
      degree,
      startDate,
      endDate,
      description,
    };

    // Add the new education to the array of education
    if (Array.isArray(user.education)) {
      user.education.push(newEducation);
    } else {
      user.education = [newEducation]; // Initialize as an array if not already
    }
  }

  // Save the updated user data
  try {
    await user.save();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error saving user data", error: error.message });
  }

  res.status(200).json({
    message: "Data added successfully",
    user,
  });
});

export const addSkillData = TryCatch(async (req, res) => {
  const userId = req.user._id;
  const { skillName, skillLevel, certName, issuedDate } = req.body;

  

  // Fetch the user by ID
  let user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const newSkill = {
    skillName,
    skillLevel,
  };

  // Ensure skillName and skillLevel are valid strings
  if (!newSkill.skillName || !newSkill.skillLevel) {
    return res.status(400).json({
      message: "Skill name and skill level are required",
    });
  }

  // Add the new skill to the user's skills array
  if (Array.isArray(user.skills)) {
    user.skills.push(newSkill);
  } else {
    user.skills = [newSkill]; // Initialize as an array if not already
  }

  await user.save();

  res.status(200).json({
    message: "Data added successfully",
    user,
  });
});

export const addCertificatesData = TryCatch(async (req, res) => {
  const userId = req.user._id;
  const { certName, issuedDate } = req.body;

 

  // Fetch the user by ID
  let user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const newCertificates = {
    certName,
    issuedDate,
  };

  if (!newCertificates.certName || !newCertificates.issuedDate) {
    return res.status(400).json({
      message: "Certificate name and issued date required",
    });
  }

  if (Array.isArray(user.certifications)) {
    user.certifications.push(newCertificates);
  } else {
    user.certifications = [newCertificates]; // Initialize as an array if not already
  }

  await user.save();

  res.status(200).json({
    message: "Data added successfully",
    user,
  });
});

export const logoutUser = TryCatch(async (req, res) => {
  res.cookie("token", "", { maxAge: 0 });

  res.json({
    message: "Logged Out Successfully",
  });
});

export const getUserConnections = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("connections", "firstName lastName profilePicture backgroundPicture tagline");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.connections);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching connections" });
  }
};

export const searchUsers = async (req, res) => {
  const { query } = req.query; // This should access the query parameter correctly

  if (!query) {
    return res.status(400).json({ message: "Search query is required." });
  }

  try {
    // Perform the user search
    const users = await User.find({
      $or: [
        { firstName: { $regex: query, $options: 'i' } }, // Case-insensitive search for first name
        { lastName: { $regex: query, $options: 'i' } },  // Case-insensitive search for last name
      ],
    }).select('firstName lastName profilePicture _id');

    if (!users.length) {
      return res.status(404).json({ message: "No users found." });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error." });
  }
};


