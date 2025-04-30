const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  firstName: {
    type: String,
    required: [true, 'İsim zorunludur'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Soyisim zorunludur'],
    trim: true
  },
  birthDate: {
    type: Date,
    required: [true, 'Doğum tarihi zorunludur']
  }
}, {
  timestamps: true
});

// Tam isim için virtual field
studentSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// JSON dönüşlerinde virtual'ları dahil et
studentSchema.set('toJSON', { virtuals: true });
studentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Student', studentSchema); 