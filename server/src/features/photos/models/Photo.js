const mongoose = require("mongoose");

const PhotoSchema = new mongoose.Schema({
        uuid: {
            type: String,
            required: true,
        },
        ownerId: {
            type: Number,
            required: true,
        },
        photoUrl: {
            type: String,
            required: true
        },
        creationDate: {
            type: Date,
            required: true
        },
        lastUpdated: {
            type: Date,
            required: false
        },
        description: {
            type: String,
            required: true
        },
        keywords: {
            type: Array,
            required: true
        },
        mentions: {
            type: Array,
            required: true
        },
        likes: {
            type: Array,
            required: false
        },
        comments: {
            type: Array,
            required: false
        }
    }
)

const Photo = mongoose.model("Photo", PhotoSchema, "photos");
module.exports = Photo;