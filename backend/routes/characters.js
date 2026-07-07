// backend/routes/characters.js
const express = require("express");
const router = express.Router();
const apiService = require("../services/apiService");

// ============================================
// 1. ROTAS ESPECÍFICAS (SEM PARÂMETROS)
// ============================================

// Listar todos os personagens
router.get("/", async (req, res) => {
  try {
    const data = await apiService.getAllCharacters();
    if (!data) {
      return res.status(503).json({
        error: "Serviço indisponível",
        message: "Nenhuma API disponível no momento",
      });
    }
    res.json(data);
  } catch (error) {
    console.error("❌ Erro:", error.message);
    res.status(500).json({ error: "Erro ao buscar personagens" });
  }
});

// Top jutsus (rota específica - DEVE VIR ANTES DO /:id!)
router.get("/top-jutsu", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const top = await apiService.getTopJutsu(limit);

    if (!top || !Array.isArray(top)) {
      return res.status(200).json([]);
    }

    res.json(top);
  } catch (error) {
    console.error("❌ Erro ao buscar top jutsus:", error.message);
    res.status(500).json({ error: "Erro ao buscar top jutsus" });
  }
});

// Status do sistema
router.get("/status", (req, res) => {
  res.json(apiService.getStatus());
});

// Busca geral (com query string)
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res
        .status(400)
        .json({ error: "Parâmetro de busca é obrigatório" });
    }
    const results = await apiService.searchCharacters(q);
    res.json(results);
  } catch (error) {
    console.error("❌ Erro:", error.message);
    res.status(500).json({ error: "Erro ao realizar busca" });
  }
});

// ============================================
// 2. ROTAS COM PARÂMETROS
// ============================================

// Buscar por nome (parâmetro na URL)
router.get("/search/:name", async (req, res) => {
  try {
    const character = await apiService.getCharacterByName(req.params.name);
    if (!character) {
      return res.status(404).json({ error: "Personagem não encontrado" });
    }
    const formatted = apiService.formatCharacter(character);
    res.json(formatted);
  } catch (error) {
    console.error("❌ Erro:", error.message);
    res.status(500).json({ error: "Erro ao buscar personagem" });
  }
});

// Buscar por ID (DEVE SER A ÚLTIMA ROTA COM PARÂMETRO!)
router.get("/:id", async (req, res) => {
  try {
    const data = await apiService.getAllCharacters();
    if (!data || !data.characters) {
      return res.status(404).json({ error: "Personagem não encontrado" });
    }

    const character = data.characters.find(
      (char) => char.id === parseInt(req.params.id),
    );

    if (!character) {
      return res.status(404).json({ error: "Personagem não encontrado" });
    }

    const formatted = apiService.formatCharacter(character);
    res.json(formatted);
  } catch (error) {
    console.error("❌ Erro ao buscar personagem por ID:", error.message);
    res.status(500).json({ error: "Erro ao buscar personagem" });
  }
});

module.exports = router;
