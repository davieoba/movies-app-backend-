const express = require('express')
const userController = require('./../controllers/user-controller')
const router = express.Router()

router.route('/signup').post(userController.signup)
router.route('/login').post(userController.login)

router.route('/').get(userController.getUsers)
router
  .route('/me/:id')
  .get(userController.protect, userController.getMe, userController.getUser)

router.route('/:id').get(userController.protect, userController.getUser)

router
  .route('/updatepassword')
  .post(userController.protect, userController.updatePassword)

router
  .route('/updateuser')
  .post(userController.protect, userController.updateUser)

router.route('/forgotpassword').post(userController.forgotPassword)
router.route('/resetpassword/:resetToken').post(userController.resetPassword)
module.exports = router
