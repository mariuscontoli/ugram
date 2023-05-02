const express = require("express");
const router = express.Router();
const userService = require("../services/userService");
const PhotoUserDto = require("../../photos/dto/photoUserDto");
const photoService = require("../../photos/services/photoService");
const isSelf = require("../../../core/middlewares/isSelf");
const mongoose = require('mongoose')

// Order is important, place /me routes before others, as the /:id routes can get confused.
router.get("/me", async function (req, res, next) {
    try {
        const user = await userService.findOne(req.userId);
        res.send(user);
    } catch (error) {
        next(error);
    }
});

router.delete("/me", async function (req, res, next) {
    try {
        mongoose.startSession().then( async session => {
                session.startTransaction();
                await userService.deleteAccount(req.userId, session);
                await photoService.deleteAllFromUser(req.userId, session);
            }
        );

        res.status(200).send({ message: 'Account deleted' });
    } catch (error) {
        next(error);
    }
});
router.get("/:id", async function (req, res, next) {
    if (!req.params.id) {
        res.status(400).send("Wrong id format");
        return;
    }

    try {
        const user = await userService.findOne(req.params.id);
        res.send(user);
    } catch (error) {
        next(error);
    }
});


router.patch("/:id", isSelf, async function (req, res, next) {
    if (!req.params.id) {
        res.status(400).send("Wrong id format");
        return;
    }

    try {
        const user = await userService.update(req.params.id, req.body);
        res.send(user);
    } catch (error) {
        next(error);
    }
});

router.get("/:id/photos", async function (req, res, next) {
    if (!req.params.id) {
        res.status(400).send("Wrong id format");
        return;
    }
    try {
        const photos = await userService.getPhotos(req.params.id);
        res.send(photos);
    } catch (error) {
        next(error);
    }
});

router.post("/:id/photos", isSelf, async function (req, res, next) {
    if (!req.params.id) {
        res.status(400).send("Wrong id format");
    }
    try {
        const photo = await photoService.create(req.params.id, req.body);
        const photoUserDto = new PhotoUserDto(photo);

        const userPhotos = await userService.addPhoto(req.params.id, photoUserDto);
        if (!userPhotos) {
            res.status(500).send("Error processing photo");
        }

        res.send(userPhotos);
    } catch (error) {
        next(error);
    }
});

router.patch("/:id/photos/:uuid", isSelf, async function (req, res, next) {
    if (!req.params.id) {
        res.status(400).send("Wrong id format");
        return;
    }
    if (!req.body.description || !req.body.mentions || !req.body.keywords) {
        res.status(400).send("Wrong body format");
        return;
    }
    try {
        const photo = await photoService.update(req.params.uuid, req.body);
        const photoUserDto = new PhotoUserDto(photo);

        const userPhotos = await userService.updatePhoto(req.params.id, req.params.uuid, photoUserDto);
        if (!userPhotos) {
            res.status(500).send("Error processing photo");
            return;
        }

        res.send(userPhotos);
    } catch (error) {
        next(error);
    }
});

router.delete("/:id/photos/:uuid", isSelf, async function (req, res, next) {
    if (!req.params.id) {
        res.status(400).send("Wrong id format");
        return;
    }
    if (!req.params.uuid) {
        res.status(400).send("Wrong photo id format");
        return;
    }
    try {
        await photoService.deleteOne(req.params.uuid);
        const userPhotos = await userService.deletePhoto(req.params.id, req.params.uuid);

        res.send(userPhotos);
    } catch (error) {
        next(error);
    }
});

router.get("/conversation/roomId/:receiverId", async function (req, res, next) {
   // this route is used to get the roomId of the conversation between the current user and the receiver
    // if the conversation doesn't exist, it will be created
    if (!req.params.receiverId) {
        res.status(400).send("Wrong id format");
        return;
    }
    try {
        const roomId = await userService.getRoomId(req.userId, req.params.receiverId);
        console.log(roomId);
        res.send(roomId);
    } catch (error) {
        next(error);
    }
});

router.get("/conversation/:roomId/messages", async function (req, res, next) {
    if (!req.params.roomId) {
        res.status(400).send("Wrong id format");
        return;
    }
    try {
        const messages = await userService.getMessages(req.params.roomId);
        res.send(messages);
    } catch (error) {
        next(error);
    }
});

router.post("/conversation/:roomId/messages", async function (req, res, next) {
    if (!req.params.roomId) {
        res.status(400).send("Wrong id format");
        return;
    }
    if (!req.body.message) {
        res.status(400).send("Wrong body format");
        return;
    }
    try {
        const message = await userService.addMessage(req.params.roomId, req.userId, req.body.message);
        res.send(message);
    } catch (error) {
        next(error);
    }
});

router.get("/:id/notifications", async function (req, res, next) {
    if (!req.params.id) {
        res.status(400).send("Wrong id format");
        return;
    }
    try {
        const notifications = await userService.getNotifications(req.params.id);
        res.send(notifications);
    } catch (error) {
        next(error);
    }
});


module.exports = router;