const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  },
  rating: {
    type: Number,
    default: 4,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    minlength: 10,
    maxlength: 350,
    required: [true, 'A review should be atleast 10 characters']
  },
  timestamp: Date
})

const Review = mongoose.model('Review', reviewSchema)
module.exports = Review
