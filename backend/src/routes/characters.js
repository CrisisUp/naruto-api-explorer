// backend/src/routes/characters.js
const express = require("express");
const router = express.Router();
const characterController = require("../controllers/characterController");
const validateMiddleware = require("../middleware/validate");
const { idSchema, nameSchema, limitSchema } = require("../utils/validators");

// ============================================
// 1. ROTAS ESPECÍFICAS (SEM PARÂMETROS) - DEVEM VIR PRIMEIRO!
// ============================================

// Status do sistema
router.get("/status", characterController.getStatus);

// Top jutsus (DEVE VIR ANTES DO /:id!)
router.get(
  "/top-jutsu",
  validateMiddleware(limitSchema, "query"),
  characterController.getTopJutsu,
);

// ============================================
// 2. ROTAS COM PARÂMETROS - DEVEM VIR DEPOIS
// ============================================

// Buscar por nome
router.get(
  "/search/:name",
  validateMiddleware(nameSchema, "params"),
  characterController.searchCharacter,
);

// Buscar por ID (DEVE SER A ÚLTIMA ROTA COM PARÂMETRO!)
router.get(
  "/:id",
  validateMiddleware(idSchema, "params"),
  characterController.getCharacterById,
);

// ============================================
// 3. ROTA BASE (PODE FICAR NO FINAL)
// ============================================

// Listar todos os personagens
router.get("/", characterController.getAllCharacters);

module.exports = router;
