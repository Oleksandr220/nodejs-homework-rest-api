const fs = require('fs/promises')
const path = require('path')
const { NotFound } = require('http-errors')
const Jimp = require('jimp')

const { User } = require('../../models')
const { HOST_NAME } = process.env

const contactsDir = path.join(__dirname, '../../public/avatars')

const updateAvatar = async (req, res) => {
  const { id } = req.params
  const { path: tempUpload, originalname } = req.file
  try {
    const avatarURL = path.join(HOST_NAME, '/public/avatars/', originalname)
    const resultUpload = path.join(contactsDir, originalname)
    await fs.rename(tempUpload, resultUpload)
    await Jimp.read(resultUpload).then((avatar) => {
      const newAvatar = avatar.cover(250, 250).write(resultUpload)
      return newAvatar
    })
    const result = await User.findByIdAndUpdate(
      id,
      { avatarURL },
      { new: true }
    )
    if (!result) {
      throw new NotFound(`Contact with id=${id} not found`)
    }
    res.json({
      status: 'success',
      code: 200,
      data: {
        result,
      },
    })
  } catch (error) {
    await fs.unlink(tempUpload)
    throw error
  }
}

module.exports = updateAvatar
