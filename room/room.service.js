const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');


module.exports = {
    getAll,
    getById,
    create,
    delete: _delete
};

async function getAll() {
    return await db.Room.findAll();
}

async function getById(id) {
    return await getRoom(id);
}

async function create(params) {
    // validate
    if (await db.User.findOne({
            where: {
                name: params.name
            }
        })) {
        throw 'Name "' + params.name + '" is already taken';
    }
    // save user
    await db.Room.create(params);
}

async function _delete(id) {
    const room = await getRoom(id);
    await room.destroy();
}

async function getRoom(id) {
    const room = await db.Room.findByPk(id);
    if (!room) throw 'Room not found';
    return room;
}