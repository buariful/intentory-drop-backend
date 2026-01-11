const { Op } = require('sequelize');
const { sequelize } = require('../db');
const Drop = require('../models/Drop');
const Purchase = require('../models/Purchase');
const Reservation = require('../models/Reservation');
const ResponseHandler = require('../utils/ResponseHandler');

const { SendSuccessResponse, SendErrorResponse } = ResponseHandler;

const getDropList = async (req, res) => {
  try {
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 10);
    const offset = (page - 1) * limit;

    const { rows, count } = await Drop.findAndCountAll({
      where: { isActive: true, startsAt: { [Op.gte]: new Date() } },
      order: [['startsAt', 'DESC']],
      limit,
      offset,
    });

    return SendSuccessResponse({
      res,
      message: 'Drops fetched successfully',
      data: {
        list: rows,
        meta: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    console.log('*********', error?.message, '*********');
    return SendErrorResponse({
      res,
      message: error.message || 'Internal server error',
      status: 500,
    });
  }
};

const insertDrops = async (req, res) => {
  try {
    const drops = req.body; // array of drops

    const formatted = drops.map((d) => ({
      ...d,
      availableStock: d.totalStock,
    }));

    const created = await Drop.bulkCreate(formatted, {
      validate: true,
    });

    return SendSuccessResponse({
      res,
      message: 'Drops created successfully',
      data: created,
    });
  } catch (error) {
    console.log('*********', error?.message, '*********');
    return SendErrorResponse({
      res,
      message: error.message || 'Internal server error',
      status: 500,
    });
  }
};

const reserveDrop = async (req, res) => {
  try {
    const { dropId } = req.params;
    const userId = req.user.id;

    const result = await sequelize.transaction(async (t) => {
      const drop = await Drop.findOne({
        where: { id: dropId, isActive: true },
        lock: t.LOCK.UPDATE,
        transaction: t,
      });

      if (!drop) throw new Error('Drop not found');
      if (drop.availableStock <= 0) throw new Error('Out of stock');

      drop.availableStock -= 1;
      await drop.save({ transaction: t });

      // reserve the item
      const expiresAt = new Date(Date.now() + 60 * 1000);
      const reservation = await Reservation.create(
        {
          userId,
          dropId,
          expiresAt,
        },
        { transaction: t }
      );

      // broadcast through socket
      const io = req.app.get('io');
      io.emit('stock_update', { dropId: drop.id, availableStock: drop.availableStock });

      return reservation;
    });

    return SendSuccessResponse({
      res,
      message: 'Drop reserved successfully',
      data: result,
    });
  } catch (error) {
    console.log('*********', error?.message, '*********');
    return SendErrorResponse({
      res,
      message: error.message || 'Internal server error',
      status: 500,
    });
  }
};

const purchaseReservedDrop = async (req, res) => {
  try {
    const { reserveId } = req.params;
    const userId = req.user.id;

    const purchase = await sequelize.transaction(async (t) => {
      const reservation = await Reservation.findOne({
        where: { id: reserveId, userId: req.user.id },
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      if (!reservation) {
        throw new Error('No valid reservation');
      }
      if (reservation.status !== 'ACTIVE') throw new Error('Reservation is not active');

      reservation.status = 'PURCHASED';
      await reservation.save({ transaction: t });

      const drop = await Drop.findByPk(reservation.dropId);
      if (!drop) SendErrorResponse({ res, message: 'Drop item not found' });

      const purchase = await Purchase.create(
        {
          userId,
          dropId: reservation.dropId,
          pricePaid: drop.price,
        },
        { transaction: t }
      );

      return purchase;
    });

    return SendSuccessResponse({
      res,
      message: 'Drop purchased successfully',
      data: purchase,
    });
  } catch (error) {
    console.log('*********', error?.message, '*********');
    return SendErrorResponse({
      res,
      message: error.message || 'Internal seerver error',
      status: 500,
    });
  }
};

module.exports = {
  getDropList,
  insertDrops,
  reserveDrop,
  purchaseReservedDrop,
};
