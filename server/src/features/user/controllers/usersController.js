const express = require("express");
const router = express.Router();
const userService = require("../services/userService");

router.get("/", async function (req, res, next) {

    try {
        const users = await userService.findAll();
        res.send(users);
    } catch (error) {
        next(error);
    }
});
module.exports = router;