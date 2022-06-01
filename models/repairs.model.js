//importamos el archivo db de la caperta utils
const { db } = require('../utils/database');

//DataTypes(esto para que este valor puede ser leido en cualquier base de datos )
const { DataTypes } = require('sequelize');

const Repairs = db.define('repairs', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: true,
    type: DataTypes.INTEGER,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  imgPath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  },
});

module.exports = { Repairs };
