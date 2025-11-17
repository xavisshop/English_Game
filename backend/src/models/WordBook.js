const mongoose = require('mongoose');

const wordBookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  source: {
    type: String,
    trim: true,
  },
  wordCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('WordBook', wordBookSchema);