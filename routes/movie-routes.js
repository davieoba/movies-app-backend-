const movieController = require('./../controllers/movie-controller')
const userController = require('./../controllers/user-controller')
const reviewController = require('./../controllers/review-controller')

const express = require('express')
const router = express.Router()

router
  .route('/')
  .post(
    userController.protect,
    userController.restrictTo('admin', 'creator'),
    movieController.createMovie
  )
  .get(movieController.getMovies)

router
  .route('/:id')
  .get(movieController.getMovie)
  .patch(
    userController.protect,
    userController.restrictTo('creator', 'admin'),
    movieController.updateMovie
  )
  .delete(
    userController.protect,
    userController.restrictTo('admin'),
    movieController.deleteMovie
  )

router
  .route('/:id/reviews')
  .post(userController.protect, reviewController.createReview)

module.exports = router
