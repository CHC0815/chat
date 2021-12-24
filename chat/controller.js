const express = require('express');
const router = express.Router();
const authorize = require('_middleware/authorize');
const roomService = require('room/room.service');
const messageService = require('message/message.service');
const {
    reset
} = require('nodemon');

router.get('/', index);
router.get('/test', test);
router.get('/room/:id', authorize(), getRoom);
router.get('/login', login);
router.get('/messages/:id', authorize(), getAllMessagesInRoom);
router.post('/message/send', authorize(), sendMessage);

module.exports = router;

function index(req, res, next) {
    roomService.getAll().then((rooms) => {
        console.log(rooms);
        res.render('index', {
            rooms: rooms
        });
    }).catch((err) => {
        console.log(`Error: ${err}`);
        next();
    });
}

function test(req, res, next) {
    roomService.create({
        name: "TestRoom"
    }).then(() => {
        res.send("Added test data");
    }).catch((err) => {
        res.send(err);
    });
}

function getRoom(req, res, next) {
    roomService.getById(req.params.id).then((room) => {
        res.json(room);
    }).catch((err) => {
        console.log(`Error: ${err}`);
        next();
    });
}

function getAllMessagesInRoom(req, res, next) {
    messageService.getAllByRoom(req.params.id).then((messages) => {
        res.send(messages);
    }).catch((err) => {
        console.log(err);
        res.send("error");
    });
}

function sendMessage(req, res, next) {
    messageService.sendMessage(req.body.sender_id, req.body.room_id, req.body.message);
    res.send("Message sent");
}

function login(req, res, next) {
    res.render("login");
}