const Movie = require('./../models/movies')
const AppError = require('./../utils/app-error')
const catchAsync = require('./../utils/catchAsync')

exports.createMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.create({
    title: req.body.title,
    year: req.body.year,
    rating: req.body.rating,
    cast: req.body.cast,
    storyline: req.body.storyline,
    genre: req.body.genre,
    directors: req.body.directors
  })

  if (!movie) return next(new AppError('movie not created', 401))

  res.status(200).json({
    message: 'Success',
    data: {
      movie
    }
  })
})

exports.getMovies = catchAsync(async (req, res, next) => {
  const excludedFields = ['sort', 'field', 'limit', 'page']

  const queryObj = { ...req.query }

  // I want to remove the excludedFields from this queryObj
  for (const x in queryObj) {
    if (excludedFields.includes(x)) {
      delete queryObj[x]
    }
  }

  let queryStr = JSON.stringify(queryObj)
  // console.log(queryStr);
  // I want to compensate for $gt, $gte, $lt, $lte
  queryStr = JSON.parse(
    queryStr.replaceAll(/lt|lte|gt|gte/g, function (val) {
      return `$${val}`
    })
  )

  console.log(queryStr)
  let query = Movie.find(queryStr)
  // note: this is the way the code was before, this would get me my result
  // const movies = await Movie.find(queryStr);
  if (req.query.sort) {
    req.query.sort = req.query.sort.split(',').join(' ')
    query = query.sort(req.query.sort)
  }

  if (req.query.fields) {
    req.query.fields = req.query.fields.split(',').join(' ')
    query = query.select(req.query.fields)
  }

  const movies = await query

  res.status(200).json({
    message: 'success',
    result: movies.length,
    data: {
      movies
    }
  })
})

exports.getMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id)

  if (!movie) return next(new AppError('There is no movie', '400'))

  res.status(200).json({
    message: 'success',
    data: {
      movie
    }
  })
})

exports.updateMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: false,
    new: true
  })

  res.status(200).json({
    message: 'success',
    data: {
      movie
    }
  })
})

exports.deleteMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.findByIdAndDelete(req.params.id)

  res.status(200).json({
    message: 'success'
  })
})
