const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 200,
    required: [true, 'A user must have a name']
  },
  email: {
    type: String,
    required: [true, 'A user must have an email address'],
    unique: true,
    validate: {
      validator: function (val) {
        return validator.isEmail(val)
      },
      message: 'Please provide a valid email address'
    }
  },
  password: {
    type: String,
    required: [true, 'user must have a password'],
    minlength: 6,
    select: false
  },
  passwordConfirm: {
    type: String,
    validate: {
      validator: function (val) {
        return this.password === val
      },
      message: 'Passwords do not match'
    }
  },
  passwordChangedAt: Date,
  role: {
    type: String,
    enum: ['user', 'admin', 'creator'],
    default: 'user'
  },
  passwordResetToken: String,
  passwordResetExpires: Date
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }
  this.password = await bcrypt.hash(this.password, 10)
  this.passwordConfirm = undefined
})

userSchema.methods.changedPasswordAfter = function (val) {
  if (this.passwordChangedAt) {
    const timestamp = this.passwordChangedAt / 1000

    return val < timestamp
  }

  return false
}

userSchema.methods.comparePassword = async function (val) {
  const auth = await bcrypt.compare(val, this.password)

  return auth
}

userSchema.methods.forgotPasswordToken = function () {
  const token = crypto.randomBytes(32).toString('hex')

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex')

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000

  return token
}

const User = mongoose.model('User', userSchema)
module.exports = User
