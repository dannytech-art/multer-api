const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, './uploads')
    },
    filename: (req, file, cb)=>{
        const ext = file.mimetype.split('/')[1]
       const uniqueExt = `IMG_${Date.now()}.${ext} `
        cb(null, uniqueExt)
    }
});

const fileFilter = (req, file, cb)=>{
    if (file.mimetype.startsWith('image/')) {
        cb(null, true)
    }else{
        cb(new Error('Invalid file format, only image file allowd'))
    }
}

const limit = {
    fileSize: 1024 * 1024 * 2
}
const uploads = multer({
    storage,
    fileFilter,
    limit
})

module.exports = uploads