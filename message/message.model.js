const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,

      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "id"
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "room_id",
      references: {
        key: "id",
        model: "room_model"
      }
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,

      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "sender_id",
      references: {
        key: "id",
        model: "users_model"
      }
    },
    message: {
      type: DataTypes.STRING(2048),
      allowNull: false,

      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "message"
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,

      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "createdAt"
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,

      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "updatedAt"
    }
  };
  const options = {
    tableName: "messages",
    comment: "",
    indexes: [{
      name: "room_id",
      unique: false,
      type: "BTREE",
      fields: ["room_id"]
    }, {
      name: "sender_id",
      unique: false,
      type: "BTREE",
      fields: ["sender_id"]
    }]
  };
  const MessagesModel = sequelize.define("messages_model", attributes, options);
  return MessagesModel;
};