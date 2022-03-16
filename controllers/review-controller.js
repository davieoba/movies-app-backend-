const Review = require('./../models/reviews')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/app-error')

exports.createReview = catchAsync(async (req, res, next) => {
  const review = await Review.create({
    user: req.body.user,
    movie: req.body.movie,
    rating: req.body.rating,
    review: req.body.review,
    timestamp: new Date()
  })

  if (!review) return next(new AppError('Review was not created ', '401'))

  res.status(200).json({
    message: 'success',
    data: {
      review
    }
  })
})

exports.getReviews = catchAsync(async (req, res, next) => {
  console.log(req.params)
  const reviews = await Review.find({ movie: req.params.id }).populate(
    'user movie'
  )

  res.status(200).json({
    message: 'success',
    result: reviews.length,
    data: {
      reviews
    }
  })
})

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id)

  if (!review) return next(new AppError('Review was not found', '404'))

  res.status(200).json({
    message: 'success',
    data: {
      review
    }
  })
})
