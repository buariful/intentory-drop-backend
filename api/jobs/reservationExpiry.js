const cron = require('node-cron');
const { Op } = require('sequelize');
const { sequelize } = require('../db');
const { Reservation, Drop } = require('../models');

/**
 * Periodically checks for expired ACTIVE reservations using a cron job,
 * restores stock to the associated Drops, and broadcasts updates.
 * @param {import('socket.io').Server} io
 */
const initReservationExpiryJob = (io) => {
  // Run every minute
  cron.schedule('* * * * *', async () => {
    console.log(`******* CRONJOB STARTED AT ${new Date().toLocaleString()} *******`);
    try {
      const expiredReservations = await Reservation.findAll({
        where: {
          status: 'ACTIVE',
          expiresAt: { [Op.lt]: new Date() },
        },
      });

      if (expiredReservations.length === 0) return;

      console.log('******** EXPIRED RESERVATION *************');
      console.log(expiredReservations);

      for (const reservation of expiredReservations) {
        await sequelize.transaction(async (t) => {
          // Double check status within transaction to avoid race conditions
          const res = await Reservation.findByPk(reservation.id, {
            lock: t.LOCK.UPDATE,
            transaction: t,
          });

          if (res && res.status === 'ACTIVE') {
            res.status = 'EXPIRED';
            await res.save({ transaction: t });

            const drop = await Drop.findByPk(res.dropId, {
              lock: t.LOCK.UPDATE,
              transaction: t,
            });

            if (drop) {
              drop.availableStock += 1;
              await drop.save({ transaction: t });

              // Broadcast update
              io.emit('stock_update', {
                dropId: drop.id,
                availableStock: drop.availableStock,
              });

              console.log(`******* RESTORE DROP STOCK ${drop.id}*******`);
              console.log(`******* EXPIRED RESERVATION ${res.id} *******`);
            }
          }
        });
      }
    } catch (error) {
      console.error(`*******JOB ERROR: ${error.message} *******`);
    }
  });
};

module.exports = { initReservationExpiryJob };
