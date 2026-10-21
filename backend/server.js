const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const pulseRoutes = require('./routes/pulseRoutes');
const aboutRoutes = require('./routes/AboutSectionRoutes');
const siteSectionsRoutes = require('./routes/siteSectionsRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const { uploadsDirectory } = require('./Middleware/upload');
const multer = require('multer');

const app = express();

connectDB();
app.use(cors());
app.use(express.json({ limit: '8mb' }));

app.get('/', (req, res) => {
  res.send('CMS Backend is running');
});

app.use('/api/pulse', pulseRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/sections', siteSectionsRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/uploads', express.static(uploadsDirectory, { maxAge: '1y', immutable: true }));

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof multer.MulterError) {
    const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    const isVideo = error.field === 'video';
    return res.status(status).json({
      message: status === 413
        ? isVideo ? 'Video must be 100MB or smaller.' : 'Image must be 5MB or smaller.'
        : 'Unable to process the uploaded file.',
    });
  }

  const status = Number.isInteger(error.status) ? error.status : 500;
  if (status >= 500) {
    console.error('Unhandled request error:', error);
  }
  return res.status(status).json({
    message: status < 500 ? error.message : 'Internal server error',
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
