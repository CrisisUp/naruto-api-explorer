// backend/src/services/narutoApiFallback.js
const axios = require("axios");
const config = require("../config");
const logger = require("../utils/logger");

class NarutoApiFallback {
  constructor() {
    this.client = axios.create({
      baseURL: config.apis.fallback.url,
      timeout: config.apis.fallback.timeout,
    });
    this.name = config.apis.fallback.name;
  }

  async fetchCharacters() {
    try {
      logger.info(`📡 Buscando dados da ${this.name} (fallback)...`);
      const response = await this.client.get("/characters");
      return { characters: response.data };
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
        clan: raw.info?.Clã || "Desconhecido",
        status: raw.info?.Status || "Desconhecido",
        birthdate: raw.info?.Aniversário || "Desconhecido",
        sex: raw.info?.Sexo || "Desconhecido",
        bloodType: raw.info?.["Tipo Sanguíneo"] || "Desconhecido",
        affiliation: raw.info?.Afiliação || "Desconhecido",
        classification: [],
      },
      family: {},
      jutsu: [],
      natureType: [],
      rank: {},
      tools: [],
      about: raw.about || [],
      page: raw.page || "",
    };
  }
}

module.exports = new NarutoApiFallback();
