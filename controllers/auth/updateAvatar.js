const fs = require('fs/promises')
const path = require('path')
const { NotFound } = require('http-errors')
const Jimp = require('jimp')

const { User } = require('../../models')

const contactsDir = path.join(__dirname, '../../public/avatars')

const updateAvatar = async (req, res) => {
  const { id } = req.params
  const { path: tempUpload, originalname } = req.file
  try {
    const resultUpload = path.join(contactsDir, originalname)
    await fs.rename(tempUpload, resultUpload)
    // const avatarURL = path.join('http://localhost:3000/avatars', originalname)
    await Jimp.read(`${contactsDir}/${originalname}`).then((avatar) => {
      return avatar.cover(250, 250).write(`${contactsDir}/avatar-small-bw.jpg`)
    })
    const result = await User.findByIdAndUpdate(
      id,
      { avatarURL: 'http://localhost:3000/avatars/avatar-small-bw.jpg' },
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
