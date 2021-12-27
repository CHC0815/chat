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
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "name"
    },
    hash: {
      type: DataTypes.STRING(64),
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "hash"
    }
  };
  const options = {
    tableName: "room",
    comment: "",
    indexes: [],
    createdAt: false,
    updatedAt: false
  };
  const RoomModel = sequelize.define("room_model", attributes, options);
  return RoomModel;
};