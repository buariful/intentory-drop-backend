const Drop = require('./Drop');
const Reservation = require('./Reservation');
const Purchase = require('./Purchase');
const User = require('./User');

// Associations
Drop.hasMany(Reservation, { as: 'reservations', foreignKey: 'dropId' });
Reservation.belongsTo(Drop, { as: 'drop', foreignKey: 'dropId' });

User.hasMany(Reservation, { as: 'reservations', foreignKey: 'userId' });
Reservation.belongsTo(User, { as: 'user', foreignKey: 'userId' });

Drop.hasMany(Purchase, { as: 'purchases', foreignKey: 'dropId' });
Purchase.belongsTo(Drop, { as: 'drop', foreignKey: 'dropId' });

User.hasMany(Purchase, { as: 'purchases', foreignKey: 'userId' });
Purchase.belongsTo(User, { as: 'user', foreignKey: 'userId' });

module.exports = {
  Drop,
  Reservation,
  Purchase,
  User,
};
