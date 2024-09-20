import multer from "multer";

// Store files in memory (in RAM)
const storage = multer.memoryStorage();

const uploadFiles = multer({ storage });

const uploadFileinPost = uploadFiles.single("file");

export default uploadFileinPost;