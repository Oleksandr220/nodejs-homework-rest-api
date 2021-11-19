const gravatar = require('gravatar')

const { Conflict } = require('http-errors')

const { User } = require('../../models')

const registration = async (req, res) => {
  const avatarURL = gravatar.url('alex.maslov@gmail.com')
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (user) {
    throw new Conflict(`Email ${email} in use`)
  }

  const newUser = new User({ email, avatarURL })
  newUser.setPassword(password)
  await newUser.save()

  res.status(201).json({
    status: 'created',
    code: 201,
    message: 'Register success',
    body: {
      user: {
        email,
        password,
        avatarURL,
      },
    },
  })
}

module.exports = registration
