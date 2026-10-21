const mongoose = require('mongoose');

const AboutSectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    leadname: { type: String, required: true },
    designation: { type: String, required: true },
    image: { type: String, required: true },
    sagaTitle: { type: String, required: true },
    sagaText: { type: String, required: true },
    sagaTextSecond: { type: String, required: true },
    buttonText: { type: String, required: true },
    buttonHref: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.models.AboutSection || mongoose.model('AboutSection', AboutSectionSchema);