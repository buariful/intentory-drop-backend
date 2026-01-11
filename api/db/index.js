const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected successfully');
  } catch (err) {
    console.error('Unable to connect DB:', err);
  }
};

module.exports = { sequelize, connectDB };
