const express = require('express')
const router = express.Router()

const {
  validation,
  controllerWrapper,
  authenticate,
  upload,
} = require('../../middlewares')

const { auth: controllers } = require('../../controllers')
const { joiSchemaUser } = require('../../models/user')

router.post(
  '/users/signup',
  validation(joiSchemaUser),
  controllerWrapper(controllers.registration)
)

router.post(
  '/users/login',
  validation(joiSchemaUser),
  controllerWrapper(controllers.login)
)

router.get(
  '/users/current',
  authenticate,
  controllerWrapper(controllers.curentUser)
)

router.patch(
  '/:id/users/avatar',
  authenticate,
  upload.single('avatar'),
  controllerWrapper(controllers.updateAvatar)
)

router.get('/users/logout', authenticate, controllerWrapper(controllers.logout))

module.exports = router
