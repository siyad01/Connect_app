import multer from "multer";

// Store files in memory (in RAM)
const storage = multer.memoryStorage();

const uploadFiles = multer({ storage });


// Accept two files with specific field names
const uploadFile = uploadFiles.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "backgroundPicture", maxCount: 1 },
]);




export default uploadFile;
