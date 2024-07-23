// const multer = require('multer')
// const { CloudinaryStorage } = require('multer-storage-cloudinary')
// const cloudinary = require('../Cloudinary/Cloudinary')

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: 'profile_pics',
//         format: async(req,res)=> 'png',
//         public_id: (req, file) => file.originalname.split('.')[0]  //File name without extention
//     }
// })

// const upload = multer({ storage })
// module.exports = upload;

const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../Cloudinary/Cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const extension = file.mimetype.split('/')[1]; // Get the file extension (e.g., jpg, png, mp4)
        let folder = 'profile_pics';
        let resource_type = 'auto'; // This allows Cloudinary to automatically detect the file type

        // Optionally, you can set a different folder for videos
        if (file.mimetype.startsWith('video')) {
            folder = 'profile_videos';
        }

        return {
            folder: folder,
            format: extension,
            public_id: file.originalname.split('.')[0], // File name without extension
            resource_type: resource_type,
        };
    }
});

const upload = multer({ storage });
module.exports = upload;

