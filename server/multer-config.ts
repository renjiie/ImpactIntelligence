import multer from "multer";
import path from "path";
import fs from "fs";
import { log } from "./vite";

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  log(`Created uploads directory at ${uploadsDir}`, "multer");
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (_req: any, _file: any, cb: (arg0: null, arg1: string) => void) {
    cb(null, uploadsDir);
  },
  filename: function (_req: any, file: { fieldname: string; originalname: string; }, cb: (arg0: null, arg1: string) => void) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter to validate file types
type MulterFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer?: Buffer;
};

const fileFilter = (_req: any, file: MulterFile, cb: multer.FileFilterCallback) => {
  // Accept PDF, DOCX, and TXT files
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF, DOCX, and TXT files are allowed."));
  }
};

// Export the configured multer instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
});
