const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HousePostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  rent: {
    type: Number,
    required: true,
  },
  bedrooms: {
    type: Number,
    required: true,
  },
  bathrooms: {
    type: Number,
    required: true,
  },
  // We will store the paths to the uploaded images
  images: {
    type: [String],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('HousePost', HousePostSchema);
