const errorCodes = require('../constants/httpCodes');

const throwError = ({
  message = 'Internal server error',
  code = errorCodes.INTERNAL_SERVER_ERROR,
  errors,
}) => {
  const error = new Error(message);
  error.data = errors;
  error.code = code;
  throw error;
};

module.exports = throwError;
