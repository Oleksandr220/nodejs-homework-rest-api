const { BadRequest } = require('http-errors')
const { User } = require('../../models')
const { sendMail } = require('../../helpers')
const { HOST_NAME } = process.env

const repeatedVerify = async (req, res) => {
  const { email } = req.body

  if (!email) {
    throw new BadRequest('Missing required field email')
  }

  const authRoute = 'api/auth/verify'
  const user = await User.findOne({ email })
  const { verificationToken } = user

  if (verificationToken === null) {
    throw new BadRequest('Verification has already been passed')
  }

  const mail = {
    to: email,
    subject: 'Подтверждение регистрации',
    html: `<a href='${HOST_NAME}/${authRoute}/${verificationToken}'>Нажмите для подверждения email</a>`,
  }

  await sendMail(mail)

  res.status(200).json({
    status: 'success',
    code: 200,
    message: 'Verification email sent',
  })
}

module.exports = repeatedVerify
