import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({ storage, limits: { fileSize: 50 * 5024 * 5024 } });

export default upload;
