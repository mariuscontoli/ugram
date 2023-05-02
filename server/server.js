const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser');
const authMiddleware = require('./src/core/middlewares/authMiddleware');
const errorHandler = require('./src/core/middlewares/errorHandler');
const logger = require('./src/core/utils/logger');

const app = express()
require("dotenv").config();

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:8080",
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('message', (msg) => {
        io.emit('my broadcast', `server: ${msg}`);
        console.log('message: ' + msg);
    });

    socket.on('join', (roomName, userId) => {
        console.log('user number : ' + userId + ' joined room id: ' + roomName);
        socket.join(roomName);
    });

    socket.on('message', ({message, roomName}, callback) => {
        console.log('message: ' + message.text + ' in ' + roomName);

        // generate data to send to receivers
        const outgoingMessage = {
            message,
        };
        // send socket to all in room except sender
        socket.to(roomName).emit('message', outgoingMessage);
        callback({
            status: "ok"
        });
    });

});

server.listen(3000, () => {
    console.log('listening on *:3000');
});

mongoose.set('strictQuery', true);
mongoose.connect(`mongodb://localhost:27017/${process.env.MONGODB_DBNAME}?authSource=admin`);

app.use(cors());
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(bodyParser.text({ limit: '200mb' }));

app.listen(process.env.API_PORT);
logger.info(`Server started on port ${process.env.API_PORT}`);

app.use(authMiddleware);
app.use("/", require("./src/features/auth/controllers/authController"));
app.use("/user", require("./src/features/user/controllers/userController"));
app.use("/users", require("./src/features/user/controllers/usersController"));
app.use("/photos", require("./src/features/photos/controllers/photoController"));

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.use(errorHandler);
