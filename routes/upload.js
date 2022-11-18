const router = require('express').Router()
const cloudinary = require('cloudinary')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const fs = require('fs')


// we will upload image on cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API,
    api_secret: process.env.CLOUD_API_SECRET
})

// Upload image only admin can use
router.post('/upload', auth, authAdmin, (req, res) => {
    try {
        // console.log(req.files)
        if(!req.files || Object.keys(req.files).length === 0) return res.status(400).json({ message: 'No files were uploaded' })
        const file = req.files.file;
        // 1024*1024 = 1mb; 1024*1024*5=5mb 
        if(file.size > 1024*1024) {
            removeTmp(file.tempFilePath)
            return res.status(400).json({ message: 'File size too large' })
        }
        if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png'){
            removeTmp(file.tempFilePath)
            return res.status(400).json({ message: 'File format is incorrect' })
        }
            cloudinary.v2.uploader.upload(file.tempFilePath, { folder: "test" }, async(err, result)=>{
                if(err) throw err;
                removeTmp(file.tempFilePath)
                // after upload will have file as tmp
                res.json({ public_id: result.public_id, url: result.secure_url })
            })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

// Deleted image only admin can use
router.post('/destroy', (req, res)=>{
    try {
        const { public_id } = req.body;
        if(!public_id) return res.status(400).json({ message: 'No image selected'})
        cloudinary.v2.uploader.destroy(public_id, async(err, result) => {
            if(err) throw err;
            res.json({ message: 'Deleted Image'})
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

const removeTmp = (path) =>{
    fs.unlink(path, err=>{
        if(err) throw err;
    })
}

module.exports = router