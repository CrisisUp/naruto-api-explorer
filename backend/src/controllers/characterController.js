// backend/src/controllers/characterController.js
const apiService = require("../services/apiService");
const logger = require("../utils/logger");
const {
  idSchema,
  nameSchema,
  searchQuerySchema,
  limitSchema,
  validate,
} = require("../utils/validators");

class CharacterController {
  // ============================================
  // GET /api/characters/:id - COM VALIDAÇÃO
  // ============================================
  async getCharacterById(req, res) {
    try {
      // 🔥 VALIDAÇÃO DO ID
      const { errors, value } = validate(idSchema, req.params);

      if (errors) {
        logger.warn(`⚠️ Validação falhou: ${JSON.stringify(errors)}`);
        return res.status(400).json({
          error: "Dados inválidos",
          details: errors,
        });
      }

      const { id } = value;
      const data = await apiService.getCharacters();

      if (!data?.characters) {
        return res.status(404).json({ error: "Personagem não encontrado" });
      }

      // 🔥 VALIDAÇÃO: ID existe no cache
      const character = data.characters.find(
        (char) => char.id === parseInt(id),
      );

      if (!character) {
        return res.status(404).json({ error: "Personagem não encontrado" });
      }

      const formatted = apiService.formatCharacter(character);
      res.json(formatted);
    } catch (error) {
      logger.error("❌ Erro ao buscar personagem por ID:", error.message);
      res.status(500).json({
        error: "Erro interno do servidor",
        message: error.message,
      });
    }
  }

  // ============================================
  // GET /api/characters/search/:name - COM VALIDAÇÃO
  // ============================================
  async searchCharacter(req, res) {
    try {
      // 🔥 VALIDAÇÃO DO NOME
      const { errors, value } = validate(nameSchema, req.params);

      if (errors) {
        logger.warn(`⚠️ Validação falhou: ${JSON.stringify(errors)}`);
        return res.status(400).json({
          error: "Dados inválidos",
          details: errors,
        });
      }

      const { name } = value;

      // 🔥 VALIDAÇÃO: Sanitização básica
      const sanitizedName = name.trim().replace(/\s+/g, " ");

      const character = apiService.findCharacterByName(sanitizedName);

      if (!character) {
        return res.status(404).json({ error: "Personagem não encontrado" });
      }

      const formatted = apiService.formatCharacter(character);
      res.json(formatted);
    } catch (error) {
      logger.error("❌ Erro ao buscar personagem:", error.message);
      res.status(500).json({
        error: "Erro interno do servidor",
        message: error.message,
      });
    }
  }

  // ============================================
  // GET /api/characters - COM VALIDAÇÃO DE QUERY
  // ============================================
  async getAllCharacters(req, res) {
    try {
      // 🔥 VALIDAÇÃO DA QUERY (busca geral)
      if (req.query.q) {
        const { errors, value } = validate(searchQuerySchema, req.query);

        if (errors) {
          logger.warn(`⚠️ Validação falhou: ${JSON.stringify(errors)}`);
          return res.status(400).json({
            error: "Parâmetros inválidos",
            details: errors,
          });
        }

        const results = await apiService.searchCharacters(value.q);
        return res.json(results);
      }

      // Sem query, retorna todos
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
      res.status(500).json({
        error: "Erro interno do servidor",
        message: error.message,
      });
    }
  }

  // ============================================
  // GET /api/characters/top-jutsu - COM VALIDAÇÃO
  // ============================================
  async getTopJutsu(req, res) {
    try {
      // 🔥 VALIDAÇÃO DO LIMIT
      const { errors, value } = validate(limitSchema, req.query);

      if (errors) {
        logger.warn(`⚠️ Validação falhou: ${JSON.stringify(errors)}`);
        return res.status(400).json({
          error: "Parâmetros inválidos",
          details: errors,
        });
      }

      const limit = value.limit;
      const top = apiService.getTopJutsu(limit);
      res.json(top);
    } catch (error) {
      logger.error("❌ Erro ao buscar top jutsus:", error.message);
      res.status(500).json({
        error: "Erro interno do servidor",
        message: error.message,
      });
    }
  }

  // ============================================
  // GET /api/characters/status - SEM VALIDAÇÃO
  // ============================================
  async getStatus(req, res) {
    res.json(apiService.getStatus());
  }
}

module.exports = new CharacterController();
