import DataUriParser from "datauri/parser.js";
import path from 'path';

const getDataUrl = (file) => {
    const parser = new DataUriParser();
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer); // Convert file buffer to data URI
};

export default getDataUrl;
