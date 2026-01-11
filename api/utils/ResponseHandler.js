const SendSuccessResponse = ({ res, message = 'Success', data = null, status = 200 }) => {
  return res.status(status).json({ success: true, message, data });
};

const SendErrorResponse = ({ res, message = 'Error', data = null, status = 200 }) => {
  return res.status(status).json({ success: false, message, data });
};

module.exports = { SendSuccessResponse, SendErrorResponse };
