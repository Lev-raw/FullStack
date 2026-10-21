const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pulse-page';

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    console.warn(
      'MongoDB connection failed. Falling back to in-memory Pulse posts.',
      error.message,
    );
    return false;
  }
};

module.exports = connectDB;
