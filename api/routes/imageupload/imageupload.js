const ImageUploadModel = require('../../models/ImageUpload');
const router = require('express').Router();
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
 
var upload = multer({ storage: storage })

router.post('/uploadProfile', upload.single('myImage'), (req, res) => {
    var img = fs.readFileSync(req.file.path);
    var finalImg = {
        contentType: req.file.mimetype,
        image: new Buffer(img,'base64')
    };
    const newImage = new ImageUploadModel(finalImg);
    try{
        newImage.save();
        return res.contentType(final_img.contentType)
            .send(finalImg.image);
    } 
    catch(err){
        return res.status(400).json("error while uploading image")
    }
})

module.exports = router;