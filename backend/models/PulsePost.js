const mongoose = require('mongoose');

const pulsePostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    image: { type: String, required: true, trim: true },
    readMoreUrl: { type: String, default: '#', trim: true },
  },
  { timestamps: true },
);

module.exports = mongoose.models.PulsePost || mongoose.model('PulsePost', pulsePostSchema);
