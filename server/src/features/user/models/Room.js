const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    recipientOne: {
        type: Number,
        required: true,
    },
    recipientTwo: {
        type: Number,
        required: true,
    },
    messages: {
        type: Array,
        required: false,
    }
});

const Room = mongoose.model('Room', RoomSchema, 'rooms');
module.exports = Room;