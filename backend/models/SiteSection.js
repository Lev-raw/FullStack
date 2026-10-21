const mongoose = require('mongoose');

const SiteSectionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    content: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.models.SiteSection || mongoose.model('SiteSection', SiteSectionSchema);
