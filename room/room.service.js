const db = require('_helpers/db');


module.exports = {
    getAll,
    getById,
    create,
    delete: _delete,
    checkRoomPassword,
};

async function getAll() {
    return await db.Room.findAll();
}

async function getById(id) {
    return await getRoom(id);
}

async function create(params) {
    // validate
    if (await db.Room.findOne({
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

async function checkRoomPassword(id, hash) {
    console.log(id);
    console.log(hash);
    const room = await getRoom(id);
    return room.hash !== hash;
}