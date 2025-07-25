import multer from 'multer';
import { TEMP_UPLOAD_DIR } from "../constants/paths.js";

const limits = {
  fileSize: 1 * 1024 * 1024, // 1MB
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TEMP_UPLOAD_DIR);
  },
  filename: function (req, file, cb){
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + '_' + file.originalname);
  },
});

export const upload = multer({storage, limits});