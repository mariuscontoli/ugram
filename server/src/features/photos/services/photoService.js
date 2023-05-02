const Photo = require("../models/Photo");
const uuid = require('uuid');
const CustomException = require("../../../core/exception/CustomException");
const Like = require("../models/Like");
const Comment = require("../models/Comment");
const User = require("../../../features/user/models/User");
const PhotoUserDto = require("../dto/photoUserDto");
const userService = require("../../user/services/userService");

async function findAll(filter) {
    const query = await Photo.find(filter);

    const response = {data: [], totalCount: 0};

    for (let i = 0; i < query.length; i++) {
        response.data.push(query[i]);
    }

    response.totalCount = response.data.length;

    return response;
}

async function findOne(uuid) {
    const photo = await Photo.findOne({uuid: uuid});
    if (!photo) {
        throw new CustomException("User not found", 404);
    }
    return photo;
}

async function create(userId, payload) {
    return Photo.create({
        ownerId: userId,
        photoUrl: payload.photoUrl,
        description: payload.description,
        keywords: payload.keywords,
        mentions: payload.mentions,
        uuid: uuid.v4(),
        creationDate: Date.now(),
        likes: []
    })
}

async function update(uuid, payload) {
    const photo = await Photo.findOne({uuid: uuid});
    // do not update the url of the photo
    photo.description = payload.description;
    photo.keywords = payload.keywords;
    photo.mentions = payload.mentions;
    photo.lastUpdated = Date.now();
    await photo.save();

    return photo;
}

async function deleteOne(uuid) {
    const photo = await Photo.findOne({uuid: uuid});
    await photo.remove();
}

async function deleteAllFromUser(userId, session) {
    try {
        await Photo.deleteMany({ownerId: userId});
        session.commitTransaction();
    } catch (error) {
        session.abortTransaction();
        console.log(`Error deleting photos for user ${userId} : ${error.message}`);
        throw new CustomException("Error deleting photos for user", 500);
    }
}

async function userLikePhoto(userId, photoId) {
    try {
        const photo = await Photo.findOne({uuid: photoId});
        // Check if the user already liked the photo
        const alreadyLiked = photo.likes.filter(like => like.userId === userId);
        let isPhotoLiked = alreadyLiked.length > 0;
        if (isPhotoLiked) {
            photo.likes = photo.likes.filter(like => like.userId !== userId);
            const like = await Like.findOne({userId: userId, photoId: photoId});
            isPhotoLiked = false;
            await like.remove()
            await photo.save();
            const photoUserDto = new PhotoUserDto(photo);
            await userService.updatePhoto(photo.ownerId, photo.uuid, photoUserDto);
            return {photo, isPhotoLiked};
        }

        const newLike = await Like.create({
            userId: userId,
            photoId: photoId,
            date: Date.now()
        });

        photo.likes.push(newLike);
        isPhotoLiked = true;

        await photo.save();

        const photoUserDto = new PhotoUserDto(photo);
        await userService.updatePhoto(photo.ownerId, photo.uuid, photoUserDto);


        if (photo.ownerId !== userId) {
            await userService.addNotification(photo.ownerId, userId, "like");
        }

        return {photo, isPhotoLiked};
    } catch (error) {
        console.error(error);
        throw new CustomException("Error liking photo", 500);
    }
}

async function addComment(userId, photoId, payload) {
    try {
        const photo = await Photo.findOne({uuid: photoId});
        const user = await User.findOne({id : userId});


        const newComment = await Comment.create({
            userId: userId,
            photoId: photoId,
            authorUsername: user.username,
            createdAt: Date.now(),
            content: payload.text,
            uuid: uuid.v4()
        });

        photo.comments.push(newComment);
        await photo.save();
        const photoUserDto = new PhotoUserDto(photo);
        await userService.updatePhoto(photo.ownerId, photo.uuid, photoUserDto);
        await userService.addNotification(photo.ownerId, userId, "comment");

        return photo;
    } catch (error) {
        console.error(error);
        throw new CustomException("Error adding comment", 500);
    }
}

async function deleteComment(userId, photoId, commentUuid) {
    try {
        const photo = await Photo.findOne({uuid: photoId});
        photo.comments = photo.comments.filter(comment => comment.uuid !== commentUuid);
        const commentToDelete = await Comment.findOne({userId: userId, photoId: photoId, uuid: commentUuid});
        await commentToDelete.remove();
        await photo.save();

        return photo;
    } catch (error) {
        console.error(error);
        throw new CustomException("Error deleting comment", 500);
    }
}

module.exports = {
    findOne,
    findAll,
    create,
    update,
    deleteOne,
    deleteAllFromUser,
    userLikePhoto,
    addComment,
    deleteComment
}
