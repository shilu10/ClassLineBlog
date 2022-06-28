const mongoose = require('mongoose');

const ImageUploadSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        data: Buffer,
        contentType: String,
        required: false
    }
});

module.export =mongoose.model(
        "ImageUploadModel",
        ImageUploadSchema
    );
