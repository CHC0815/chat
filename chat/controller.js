const express = require('express');
const router = express.Router();
const authorize = require('_middleware/authorize')

router.get('/', index);

module.exports = router;

function index(req, res, next) {
    res.send("Hello");
}