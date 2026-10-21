const express = require('express');
const fs = require('node:fs/promises');
const { upload, uploadVideo } = require('../Middleware/upload');

const router = express.Router();

const matchesImageSignature = (buffer, mimeType) => {
  if (mimeType === 'image/jpeg') {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (mimeType === 'image/png') {
    return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }
  return mimeType === 'image/webp' &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP';
};

const matchesVideoSignature = (buffer, mimeType) => {
  if (mimeType === 'video/mp4') {
    return buffer.length >= 12 && buffer.toString('ascii', 4, 8) === 'ftyp';
  }
  return mimeType === 'video/webm' &&
    buffer.length >= 4 &&
    buffer.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]));
};

router.post('/image', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Choose an image to upload.' });
  }

  const fileBytes = await fs.readFile(req.file.path);
  if (!matchesImageSignature(fileBytes, req.file.mimetype)) {
    await fs.unlink(req.file.path);
    return res.status(400).json({ message: 'The uploaded file is not a valid JPG, PNG, or WEBP image.' });
  }

  return res.status(201).json({ url: `/uploads/${req.file.filename}` });
});

router.post('/video', uploadVideo.single('video'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Choose a video to upload.' });
  }

  const fileBytes = await fs.readFile(req.file.path);
  if (!matchesVideoSignature(fileBytes, req.file.mimetype)) {
    await fs.unlink(req.file.path);
    return res.status(400).json({ message: 'The uploaded file is not a valid MP4 or WEBM video.' });
  }

  return res.status(201).json({ url: `/uploads/${req.file.filename}` });
});

module.exports = router;
