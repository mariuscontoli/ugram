const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    photoId: {
        type: String,
        required: true
    },
    userId: {
        type: Number,
        required: true
    },
    authorUsername: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    uuid: {
        type: String,
        required: true
    }
});

const Comment = mongoose.model('Comment', commentSchema, 'comments');
module.exports = Comment;

