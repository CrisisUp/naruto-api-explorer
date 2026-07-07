// backend/src/controllers/characterController.js
const apiService = require("../services/apiService");
const logger = require("../utils/logger");

class CharacterController {
  async getCharacterById(req, res) {
    try {
      const { id } = req.params;
      const data = await apiService.getCharacters();

      if (!data?.characters) {
        return res.status(404).json({ error: "Personagem não encontrado" });
      }

      const character = data.characters.find(
        (char) => char.id === parseInt(id),
      );

      if (!character) {
        return res.status(404).json({ error: "Personagem não encontrado" });
      }

      // ✅ USANDO O formatCharacter do apiService
      const formatted = apiService.formatCharacter(character);
      res.json(formatted);
    } catch (error) {
      logger.error("❌ Erro ao buscar personagem por ID:", error.message);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async searchCharacter(req, res) {
    try {
      const { name } = req.params;
      const character = apiService.findCharacterByName(name);

      if (!character) {
        return res.status(404).json({ error: "Personagem não encontrado" });
      }

      // ✅ USANDO O formatCharacter do apiService
      const formatted = apiService.formatCharacter(character);
      res.json(formatted);
    } catch (error) {
      logger.error("❌ Erro ao buscar personagem:", error.message);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async getAllCharacters(req, res) {
    try {
      const data = await apiService.getCharacters();
      if (!data) {
        return res.status(503).json({
          error: "Serviço indisponível",
          message: "Nenhuma API disponível no momento",
        });
      }
      res.json(data);
    } catch (error) {
      logger.error("❌ Erro ao buscar personagens:", error.message);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async getTopJutsu(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 5;
      const top = apiService.getTopJutsu(limit);
      res.json(top);
    } catch (error) {
      logger.error("❌ Erro ao buscar top jutsus:", error.message);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async getStatus(req, res) {
    res.json(apiService.getStatus());
  }
}

module.exports = new CharacterController();
