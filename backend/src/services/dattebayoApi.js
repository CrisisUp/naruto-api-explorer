// backend/src/services/dattebayoApi.js
const axios = require("axios");
const config = require("../config");
const logger = require("../utils/logger");

class DattebayoApi {
  constructor() {
    this.client = axios.create({
      baseURL: config.apis.primary.url,
      timeout: config.apis.primary.timeout,
    });
    this.name = config.apis.primary.name;
  }

  async fetchCharacters() {
    try {
      logger.info(`📡 Buscando dados da ${this.name}...`);
      const response = await this.client.get("/characters");
      return response.data;
    } catch (error) {
      logger.error(`❌ ${this.name} falhou:`, error.message);
      return null;
    }
  }

  formatCharacter(raw) {
    if (!raw) return null;
    return {
      id: raw.id,
      name: raw.name,
      images: raw.images || [],
      personal: {
        clan: raw.personal?.clan || "Desconhecido",
        status: raw.personal?.status || "Desconhecido",
        birthdate: raw.personal?.birthdate || "Desconhecido",
        sex: raw.personal?.sex || "Desconhecido",
        bloodType: raw.personal?.bloodType || "Desconhecido",
        affiliation: raw.personal?.affiliation || [],
        classification: raw.personal?.classification || [],
      },
      family: raw.family || {},
      jutsu: raw.jutsu || [],
      natureType: raw.natureType || [],
      rank: raw.rank || {},
      tools: raw.tools || [],
    };
  }
}

module.exports = new DattebayoApi();
