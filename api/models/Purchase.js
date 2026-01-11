const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db');

class Purchase extends Model {}

Purchase.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    dropId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    pricePaid: {
      // type: DataTypes.INTEGER,
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Purchase',
    tableName: 'purchases',
    indexes: [{ fields: ['dropId'] }, { fields: ['userId'] }],
  }
);

module.exports = Purchase;
