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
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    price: {
      // type: DataTypes.FLOAT(11, 3),
      type: DataTypes.DECIMAL(10, 2),
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

    image: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'https://www.merkis.com.bd/wp-content/uploads/2023/05/743.20-02.jpg',
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
