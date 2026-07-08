// backend/src/utils/validators.js
const Joi = require("joi");

// ============================================
// ESQUEMAS DE VALIDAÇÃO
// ============================================

// Validação para ID (parâmetro de rota)
const idSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "ID deve ser um número",
    "number.integer": "ID deve ser um número inteiro",
    "number.positive": "ID deve ser um número positivo",
    "any.required": "ID é obrigatório",
  }),
});

// Validação para nome (parâmetro de rota)
const nameSchema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(100)
    .pattern(/^[a-zA-ZÀ-ÿ\s\-']+$/)
    .required()
    .messages({
      "string.base": "Nome deve ser um texto",
      "string.min": "Nome deve ter pelo menos 1 caractere",
      "string.max": "Nome deve ter no máximo 100 caracteres",
      "string.pattern.base": "Nome contém caracteres inválidos",
      "any.required": "Nome é obrigatório",
    }),
});

// Validação para query string (busca geral)
const searchQuerySchema = Joi.object({
  q: Joi.string().min(1).max(100).required().messages({
    "string.base": "Query deve ser um texto",
    "string.min": "Query deve ter pelo menos 1 caractere",
    "string.max": "Query deve ter no máximo 100 caracteres",
    "any.required": "Query é obrigatória",
  }),
});

// Validação para limit (top jutsus)
const limitSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(50).default(5).messages({
    "number.base": "Limit deve ser um número",
    "number.integer": "Limit deve ser um número inteiro",
    "number.min": "Limit deve ser no mínimo 1",
    "number.max": "Limit deve ser no máximo 50",
  }),
});

// ============================================
// FUNÇÃO AUXILIAR PARA VALIDAÇÃO
// ============================================

function validate(schema, data) {
  // Converte strings numéricas para números automaticamente
  const convertedData = { ...data };
  for (const key of Object.keys(convertedData)) {
    if (!isNaN(convertedData[key]) && convertedData[key] !== "") {
      convertedData[key] = Number(convertedData[key]);
    }
  }

  const { error, value } = schema.validate(convertedData, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join("."),
      message: detail.message,
    }));
    return { errors, value: null };
  }

  return { errors: null, value };
}

// ============================================
// EXPORTAR
// ============================================

module.exports = {
  idSchema,
  nameSchema,
  searchQuerySchema,
  limitSchema,
  validate,
};
