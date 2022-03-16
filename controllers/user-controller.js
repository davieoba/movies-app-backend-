require('dotenv').config({
  path: './../.env'
})
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/app-error')
const util = require('util')
const sendEmail = require('./../utils/sendmail')
const crypto = require('crypto')
const Email = require('./../utils/Email')

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  })

  if (!user)
    return next(new AppError('User was not created successfully', '401'))

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES
  })

  if (!token)
    return next(new AppError('User was not created successfully', '401'))

  const url = `${req.protocol}://${req.get('host')}/api/v1/users`

  new Email(user, url).sendWelcome()

  res.status(200).json({
    message: 'success',
    data: {
      user
    },
    token
  })
})

exports.login = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email }).select('+password')

  if (!user) return next(new AppError('User not found', '404'))

  if (!req.body.password) return next('Please provide password', '401')

  const auth = await user.comparePassword(req.body.password)
  if (!auth)
    return next(new AppError('User email or password is not correct', '401'))

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES
  })

  res.status(200).json({
    message: 'success',
    data: {
      user
    },
    token
  })
})

exports.protect = catchAsync(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token)
    return next(
      new AppError('User not logged in, Log in to gain access', '401')
    )

  const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY)

  if (!decoded) return next(new AppError('Invalid login', '401'))

  const user = await User.findById(decoded.id)

  if (!user) return next(new AppError('The user not found', '404'))

  // we want to now know if the user changed the password after login
  const auth = user.changedPasswordAfter(decoded.iat)
  if (auth) return next('Password was changed recently, login again', '401')

  req.user = user
  next()
})

exports.getUsers = catchAsync(async (req, res, next) => {
  const user = await User.find()

  res.status(200).json({
    messsage: 'success',
    result: user.length,
    data: {
      user
    }
  })
})

exports.restrictTo = (...role) => {
  return catchAsync((req, res, next) => {
    if (!role.includes(req.user.role)) {
      console.log(req.user)
      return next(
        new AppError('You are not authorized to perform this action', '401')
      )
    }

    next()
  })
}

exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user._id
  next()
})

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  res.status(200).json({
    message: 'success',
    data: {
      user
    }
  })
})

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('password')

  if (!user) return next(new AppError('Please login to have access', '401'))

  // check if the user is who they say they are by asking for the current password and then comparing it with the password in the database
  const auth = await user.comparePassword(req.body.password)
  if (!auth) return next(new AppError('Password is wrong.', '401'))

  user.password = req.body.newPassword
  user.passwordChangedAt = new Date().getTime()
  await user.save()

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES
  })

  res.status(200).json({
    message: 'success',
    data: {
      user
    },
    token
  })
})

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body

  if (!email)
    return next(new AppError('Please provide an email address', '400'))

  const user = await User.findOne({ email: email })
  if (!user)
    return next(new AppError('User does not exist, Create an Account', '404'))

  const resetToken = user.forgotPasswordToken()
  await user.save()

  const url = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetpassword/${resetToken}`

  const message = `Forgot your password ?, please enter your new password and confirm password to ${url}.\n If you did not forget your password, please ignore this message`

  await new Email(user, url)
    .sendPasswordReset()
    .then(() => {
      res.status(200).json({
        status: 'success',
        message: 'Email sent successfully'
      })
    })
    .catch(async (err) => {
      user.passwordResetToken = undefined
      user.passwordResetExpires = undefined
      await user.save()
      return next(
        new AppError(
          'Email not sent successfully to the user, try again',
          '500'
        )
      )
    })
})

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex')

  // console.log(hashedToken)
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  })
  console.log(user)
  if (!user) return next(new AppError('User not found', '404'))

  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  user.passwordChangedAt = new Date().getTime()
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined

  await user.save()
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES
  })

  if (!token)
    return next(new AppError('User was not created successfully', '401'))

  res.status(200).json({
    message: 'success',
    data: {
      user
    },
    token
  })
})

exports.updateUser = catchAsync(async (req, res, next) => {
  // some code
  const updates = ['name', 'email']

  for (const x in req.body) {
    if (!updates.includes(x)) {
      delete req.body[x]
    }
  }

  console.log(req.body)

  const user = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true
  })

  if (!user) return next(new AppError('Error updating profile', '401'))

  res.status(200).json({
    message: 'success',
    result: {
      data: user
    }
  })
})
