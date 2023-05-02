const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
    photoId: {
        type: String,
        required: true
    },
    userId: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

const Like = mongoose.model("Like", likeSchema, "likes");
module.exports = Like;