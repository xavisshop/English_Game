const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
  wordBookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WordBook',
    required: true,
  },
  word: {
    type: String,
    required: true,
    trim: true,
  },
  phonetic: {
    type: String,
    trim: true,
  },
  pronunciation: {
    type: String, // URL to pronunciation audio
    trim: true,
  },
  definition: {
    type: String,
    required: true,
    trim: true,
  },
  example: {
    type: String,
    trim: true,
  },
  image: {
    type: String, // URL to image
    trim: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Word', wordSchema);