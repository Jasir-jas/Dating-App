const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../Cloudinary/Cloudinary')

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'profile_pics',
        format: async(req,res)=> 'png',
        public_id: (req, file) => file.originalname.split('.')[0]  //File name without extention
    }
})

const upload = multer({ storage })
module.exports = upload;