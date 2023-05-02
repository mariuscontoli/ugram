const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
        id: {
            type: Number,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: false
        },
        photoUrl: {
            type: String,
            required: false
        },
        registrationDate: {
            type: Date,
            required: true
        },
        photos: {
            type: Array,
            required: false
        },
        accessToken: {
            type: String,
            required: false
        },
        notifications: {
            type: Array,
            required: false
        }
    }
)

const User = mongoose.model("User", UserSchema, "users");
module.exports = User;

