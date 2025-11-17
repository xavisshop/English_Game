const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  studentIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  wordBookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WordBook',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Class', classSchema);