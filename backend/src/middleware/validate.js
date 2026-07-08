// backend/src/middleware/validate.js
const { validate } = require("../utils/validators");

/**
 * Middleware de validação para rotas
 * @param {Object} schema - Esquema Joi
 * @param {string} source - 'body', 'query', 'params'
 */
function validateMiddleware(schema, source = "body") {
  return (req, res, next) => {
    const data = req[source];
    const { errors, value } = validate(schema, data);

    if (errors) {
      return res.status(400).json({
        error: "Dados inválidos",
        details: errors,
      });
    }

    req[source] = value;
    next();
  };
}

module.exports = validateMiddleware;
