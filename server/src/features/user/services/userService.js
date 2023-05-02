const User = require("../models/User");
const UserDto = require("../dto/userDto");
const PhotoUserDto = require("../../photos/dto/photoUserDto");
const MessageDto = require("../dto/messageDto");
const NotificationDto = require("../dto/notificationDto");
const CustomException = require("../../../core/exception/CustomException");
const Room = require("../models/Room");
const uuid = require("uuid");

async function findOne(userId) {
    const user = await User.findOne({id: userId});
    if (!user) {
        throw new CustomException("User not found", 404);
    }
    return user;
}

async function findAll() {
    const query = await User.find({});

    const response = {data: [], totalCount: 0};

    for (let i = 0; i < query.length; i++) {
        response.data.push(new UserDto(query[i]));
    }

    response.totalCount = response.data.length;

    return response;
}

async function update(id, payload) {
    const user = await User.findOne({ id: id });
    if (!user) {
        throw new CustomException("User not found", 404);
    }

    try {
        if (payload.firstName) {
            user.firstName = payload.firstName;
        }
        if (payload.lastName) {
            user.lastName = payload.lastName;
        }
        if (payload.email) {
            user.email = payload.email;
        }
        if (payload.phoneNumber) {
            user.phoneNumber = payload.phoneNumber;
        }
        await user.save();
    } catch (error) {
        console.log(`Error updating user ${user.id} : ${error.message}`);
        throw new CustomException("Error updating user", 500);
    }

    return user;
}

async function getPhotos(userId) {
    const user = await User.findOne({ id: userId });
    if (!user) {
        throw new CustomException("User not found", 404);
    }
    return user.photos;
}

async function addPhoto(userId, photoDto) {
    const user = await User.findOne({ id: userId });
    if (!user) {
        throw new CustomException("User not found", 404);
    }

    try {
        user.photos.push(photoDto);
        await user.save();

        return photoDto;
    } catch (e) {
        console.log(`Error adding photo to user ${user.id} : ${e.message}`);
        throw new CustomException("Error adding photo to user", 500);
    }
}

async function updatePhoto(userId, photoUuid, payload) {
    const user = await User.findOne({ id: userId });
    if (!user) {
        throw new CustomException("User not found", 404);
    }
    try {
        const photoIndex = user.photos.findIndex((p) => p.uuid === photoUuid);
        user.photos[photoIndex] = new PhotoUserDto(payload);
        await user.save();

        return user.photos;
    }
    catch (e) {
        console.log(`Error updating photo for user ${user.id} : ${e.message}`);
        throw new CustomException("Error updating photo for user", 500);
    }
}

async function deletePhoto(userId, photoUuid) {
    const user = await User.findOne({ id: userId });
    if (!user) {
        throw new CustomException("User not found", 404);
    }

    const photo = user.photos.find((p) => p.uuid === photoUuid);
    if (photo) {
        console.log(`Deleting photo ${photoUuid} for user ${user.id}`);
        user.photos = user.photos.filter((p) => p !== photo);
        await user.save();
        console.log(`Deleted photo ${photoUuid} for user ${user.id}`);
    } else {
        console.log(`Photo ${photoUuid} not found for user ${user.id}`);
        throw new CustomException("Photo not found", 404);
    }

    return user.photos;
}

async function deleteAccount(userId, session) {
    try {
        await User.deleteOne({id: userId});
    } catch (error) {
        session.abortTransaction();
        console.log(`Error deleting user ${userId} : ${error.message}`);
        throw new CustomException("Error deleting user", 500);
    }
}

async function getRoomId(userId, receiverId) {
    // the goal is to have a unique room id for each pair of users
    // so we can use it to send messages
    try {
        const existingRoom = await Room.find({recipientOne: { $in: [userId, receiverId] }} ).and([{recipientTwo: { $in: [userId, receiverId] }}]).exec();
        if (existingRoom && existingRoom.length > 0) {
            return existingRoom[0].id;
        } else {
            console.log("creating new room");
            const roomId = uuid.v4();
            const newRoom = new Room({
                id: roomId,
                recipientOne: userId,
                recipientTwo: receiverId
            });
            await newRoom.save();
            return roomId;
        }
    } catch (error) {
        console.log(`Error getting room id for user ${userId} : ${error.message}`);
        throw new CustomException("Error getting room id", 500);
    }
}

async function getMessages(roomId) {
    try {
        const room = await Room.find({id: roomId});
        if (room && room.length > 0) {
            return room[0].messages;
        } else {
            return [];
        }
    } catch (error) {
        console.log(`Error getting messages for room ${roomId} : ${error.message}`);
        throw new CustomException("Error getting messages", 500);
    }
}

async function addMessage(roomId, userId, message) {
    try {
        const room = await Room.find({id: roomId});
        const messageDto = new MessageDto(message, userId);
        if (room && room.length > 0) {
            room[0].messages.push(messageDto);
            await room[0].save();
            return room[0].messages;
        }
    } catch (error) {
        console.log(`Error adding message to room ${roomId} : ${error.message}`);
        throw new CustomException("Error adding message", 500);
    }
}

async function getNotifications(userId) {
    const user = await User.findOne({id: userId});
    if (!user) {
        throw new CustomException("User not found", 404);
    }
    try {
        const notifications = user.notifications;
        user.notifications = [];
        await user.save();
        return notifications;
    } catch (error) {
        console.log(`Error getting notifications for user ${userId} : ${error.message}`);
        throw new CustomException("Error getting notifications", 500);
    }
}

async function addNotification(userId, notifierId, notificationType) {
    const user = await User.findOne({id: userId});
    if (!user) {
        throw new CustomException("User not found", 404);
    }
    try {
        const notification = new NotificationDto(notifierId, notificationType);
        const existingNotification = user.notifications.find((n) => n.notifierId === notifierId && n.type === notificationType);
        if (existingNotification) {
            return user.notifications;
        }
        user.notifications.push(notification);
        await user.save();
        return user.notifications;
    } catch (error) {
        console.log(`Error adding notification to user ${userId} : ${error.message}`);
        throw new CustomException("Error adding notification", 500);
    }
}

module.exports = {
    findOne,
    update,
    getPhotos,
    addPhoto,
    updatePhoto,
    deletePhoto,
    findAll,
    deleteAccount,
    getRoomId,
    getMessages,
    addMessage,
    getNotifications,
    addNotification
};

