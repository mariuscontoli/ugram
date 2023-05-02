const User = require("../../user/models/User");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const CustomException = require('../../../core/exception/CustomException');

const createUserMongo = async (payload) => {
    // Create user in MongoDB
    // Find last user in MongoDB to get the last id and increment it
    const findLastUser = await User.findOne({}, "id").sort({id: -1});

    const isUserAlreadyInDb = await User.findOne({email: payload.email});
    if (isUserAlreadyInDb) {
        throw new CustomException("User already exists", 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(payload.password, salt);

    // Generate a token for the user to be authenticated

    const user = await User.create({
        id: findLastUser ? findLastUser.id + 1 : 1,
        username: payload.username,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        password: hashedPassword,
        registrationDate: Date.now(),
    });

    if (!user) {
        throw new CustomException("Couldn't create user in database", 500);
    }

    user.accessToken = jwt.sign({id: user.id}, 'secret-key', {expiresIn: '1h'});
    await user.save();

    return {user: user };
};

const loginUser = async (email, password) => {

    const user = await User.findOne({email});
    if (!user) {
        throw new CustomException("User not found", 404);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new CustomException("Wrong password", 400);
    }

    user.accessToken = jwt.sign({id: user.id}, 'secret-key', {expiresIn: '1h'});
    await user.save();

    return { user: user };
}

const logoutUser = async (userId) => {
    const user = await User.findOne({id: userId});
    if (!user) {
        throw new CustomException("User not found", 404);
    }

    user.accessToken = null;
    await user.save();

    return user;
}

module.exports = {
    createUserMongo,
    loginUser,
    logoutUser
}