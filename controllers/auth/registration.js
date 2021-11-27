const gravatar = require('gravatar')

const { Conflict } = require('http-errors')
const { nanoid } = require('nanoid')

const { HOST_NAME } = process.env

const { sendMail } = require('../../helpers')
const { User } = require('../../models')

const registration = async (req, res) => {
  const authRoute = 'api/auth/verify'
  const { email, password } = req.body
  const avatarURL = gravatar.url(email, { protocol: 'http', s: '250' })
  const user = await User.findOne({ email })

  if (user) {
    throw new Conflict(`Email ${email} in use`)
  }

  const verificationToken = nanoid()
  const newUser = new User({ email, avatarURL, verificationToken })
  newUser.setPassword(password)
  await newUser.save()

  const mail = {
    to: email,
    subject: 'Подтверждение регистрации',
    html: `<a href='${HOST_NAME}/${authRoute}/${verificationToken}'>Нажмите для подверждения email</a>`,
  }

  await sendMail(mail)

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
