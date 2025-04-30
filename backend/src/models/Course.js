const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ders adı zorunludur'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Ders açıklaması zorunludur']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema); 