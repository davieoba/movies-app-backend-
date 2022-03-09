const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A movie must have a name'],
    minLength: 2,
    maxLength: 200
  },
  year: {
    type: Date,
    required: [true, 'A movie must have a release year']
  },
  cast: {
    type: Array,
    required: [true, 'A movie must have casts']
  },
  storyline: {
    type: String,
    minLength: 10,
    maxLength: 750,
    required: [true, 'A description has not been added for this movie']
  },
  genre: {
    type: String,
    enum: [
      'action',
      'adventure',
      'comedy',
      'fantasy',
      'drama',
      'fiction',
      'thriller',
      'horror',
      'documentary',
      'anime',
      'family',
      'crime',
      'animation'
    ]
  },
  directors: {
    type: [String]
  }
})

const Movie = mongoose.model('Movie', movieSchema)

module.exports = Movie
