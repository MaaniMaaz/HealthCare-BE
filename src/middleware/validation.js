const ErrorHandler = require("../utils/ErrorHandler");

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return ErrorHandler(errorMessages.join(', '), 400, req, res);
    }
    
    next();
  };
};

module.exports = { validateRequest };