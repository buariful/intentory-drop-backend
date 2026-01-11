const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db');

class Reservation extends Model {}

Reservation.init(
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

    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM('ACTIVE', 'EXPIRED', 'PURCHASED'),
      defaultValue: 'ACTIVE',
    },
  },
  {
    sequelize,
    modelName: 'Reservation',
    tableName: 'reservations',
    indexes: [{ fields: ['dropId'] }, { fields: ['userId'] }, { fields: ['expiresAt'] }],
  }
);

module.exports = Reservation;
