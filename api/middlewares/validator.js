const { SendErrorResponse } = require('../utils/ResponseHandler');

module.exports = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    next();
  } catch (err) {
    return SendErrorResponse({ res, message: 'Validation error', data: { errors: err.errors } });
  }
};
