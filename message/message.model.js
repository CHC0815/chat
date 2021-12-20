const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "id"
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
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
      defaultValue: null,
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
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "message"
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "created_at"
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