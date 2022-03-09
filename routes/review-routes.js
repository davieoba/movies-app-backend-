const express = require('express')
const reviewController = require('./../controllers/review-controller')
const userController = require('./../controllers/user-controller')
const router = express.Router()

router.route('/:id').get(reviewController.getReviews)

router.route('/').post(userController.protect, reviewController.createReview)

module.exports = router
