const express = require("express");
const router = express.Router();
const User = require("../../user/models/User");

const authenticationService = require("../services/authService");

router.post("/register", async function (req, res, next) {
    if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) {
        res.status(400).send("Wrong format");
    }
    try {
        const result = await authenticationService.createUserMongo(req.body);

        res.status(200).send(result);
    } catch (error) {
        next(error);
    }
});

router.post("/login", async function (req, res, next) {
    if (!req.body.email || !req.body.password) {
        res.status(400).send("Wrong format");
        return;
    }
    try {
        const userToken = await authenticationService.loginUser(req.body.email, req.body.password);
        res.status(200).send(userToken);
    } catch (error) {
        next(error);
    }
});

router.post("/logout", async function (req, res, next) {
    try {
        const result = await authenticationService.logoutUser(req.userId);
        res.status(200).send(result);
    } catch (error) {
        next(error);
    }
});

router.get('/check-username', async function (req, res) {
    console.log(req.query)
    const { username } = req.query
    const userExists = await User.findOne({ username: username });

    return res.status(200).send({ userExists: !!userExists });
})

module.exports = router;