const db = require('_helpers/db');


module.exports = {
    getAll,
    getById,
    create,
    delete: _delete,
    getAllByRoom,
    sendMessage,
    getLimitByRoom
};

async function getAll() {
    return await db.Message.findAll();
}

async function getAllByRoom(roomId) {
    return await db.Message.findAll({
        where: {
            room_id: roomId
        }
    });
}

async function getLimitByRoom(roomId, limit) {
    return await db.Message.findAll({
        limit: parseInt(limit),
        where: {
            room_id: roomId
        },
        order: [
            ['createdAt', 'DESC']
        ]
    });
}

async function sendMessage(sender_id, room_id, message) {
    // save message
    await db.Message.create({
        sender_id: sender_id,
        room_id: room_id,
        message: message
    }).then(function (message) {
        console.log(message);
    });
}

async function getById(id) {
    return await getRoom(id);
}

async function create(params) {
    // save message
    await db.Message.create(params);
}

async function _delete(id) {
    const message = await getMessage(id);
    await message.destroy();
}

async function getMessage(id) {
    const message = await db.Message.findByPk(id);
    if (!message) throw 'Message not found';
    return message;
}