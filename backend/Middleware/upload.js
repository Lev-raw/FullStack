const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const multer = require("multer");

const uploadsDirectory = path.join(__dirname, "..", "uploads");
fs.mkdirSync(uploadsDirectory, { recursive: true });

const allowedImageTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);
const allowedVideoTypes = new Map([
  ["video/mp4", ".mp4"],
  ["video/webm", ".webm"],
]);
const allowedTypes = new Map([...allowedImageTypes, ...allowedVideoTypes]);
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDirectory),
  filename: (req, file, cb) => {
    cb(null, `${crypto.randomUUID()}${allowedTypes.get(file.mimetype)}`);
  },
});

const imageFileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();
  if (
    allowedImageTypes.get(file.mimetype) === extension ||
    (file.mimetype === "image/jpeg" && extension === ".jpeg")
  ) {
    cb(null, true);
  } else {
    cb(
      Object.assign(
        new Error("Only JPG, JPEG, PNG and WEBP images are allowed."),
        { status: 400 },
      ),
    );
  }
};

const upload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

const videoFileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();
  if (allowedVideoTypes.get(file.mimetype) === extension) {
    cb(null, true);
  } else {
    cb(
      Object.assign(
        new Error("Only MP4 and WEBM videos are allowed."),
        { status: 400 },
      ),
    );
  }
};

const uploadVideo = multer({
  storage,
  fileFilter: videoFileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024,
    files: 1,
  },
});

module.exports = { upload, uploadVideo, uploadsDirectory };
