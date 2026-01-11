const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db');

class Drop extends Model {}

Drop.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    price: {
      type: DataTypes.FLOAT(11, 3),
      allowNull: false,
    },

    totalStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    availableStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    startsAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Drop',
    tableName: 'drops',
  }
);

module.exports = Drop;
