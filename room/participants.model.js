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
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "user_id",
      references: {
        key: "id",
        model: "users_model"
      }
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "room_id",
      references: {
        key: "id",
        model: "room_model"
      }
    },
    access: {
      type: DataTypes.STRING(3),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "access"
    }
  };
  const options = {
    tableName: "paricipants",
    comment: "",
    indexes: [{
      name: "user_id",
      unique: false,
      type: "BTREE",
      fields: ["user_id"]
    }, {
      name: "room_id",
      unique: false,
      type: "BTREE",
      fields: ["room_id"]
    }]
  };
  const ParticipantsModel = sequelize.define("participants_model", attributes, options);
  return ParticipantsModel;
};