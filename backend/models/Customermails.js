const mongoose = require('mongoose');

const customermailSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports =
  mongoose.models.customermail ||
  mongoose.model('customermail', customermailSchema);