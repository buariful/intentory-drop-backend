const SendSuccess = ({ res, message = 'Success', data = null, status = 200 }) => {
  return res.status(status).json({ success: true, message, data });
};

const SendError = ({ res, message = 'Error', data = null, status = 200 }) => {
  return res.status(status).json({ success: false, message, data });
};

module.exports = { SendSuccess, SendError };
