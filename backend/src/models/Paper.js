const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  authors: [{
    type: String,
    trim: true,
  }],
  year: {
    type: Number,
    required: true,
  },
  abstract: {
    type: String,
    trim: true,
  },
  url: {
    type: String,
    trim: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
    default: '',
  },
  tags: [{
    type: String,
    trim: true,
  }],
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Add text index for search functionality
paperSchema.index({ title: 'text', abstract: 'text', tags: 'text' });

module.exports = mongoose.model('Paper', paperSchema); 