const express = require("express");
const router = express.Router();
const photoService = require("../services/photoService");

router.get("/", async function (req, res, next) {
    try {
        const {keyword, description} = req.query;

        let filter = {};

        if (keyword) {
            filter.keywords = {$regex: keyword, $options: 'i'};
        }

        if (description) {
            filter.description = filter.description = {$regex: description, $options: 'i'};
        }

        let photos = await photoService.findAll(filter);

        res.send(photos);
    } catch (error) {
        next(error);
    }
});

router.post('/:uuid/likes', async (req, res, next) => {
    try {
        const {photo, isPhotoLiked} = await photoService.userLikePhoto(req.userId, req.params.uuid);
        const response = {isLiked: isPhotoLiked, photo: photo};

        res.status(200).send(response);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/:uuid/comments', async (req, res, next) => {
    try {
        const photo = await photoService.addComment(req.userId, req.params.uuid, req.body);

        res.status(200).send(photo);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.delete('/:uuid/comments/:commentUuid', async (req, res, next) => {
    try {
        const photo = await photoService.deleteComment(req.userId, req.params.uuid, req.params.commentUuid);

        res.status(200).send(photo);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;