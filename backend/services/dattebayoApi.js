// backend/services/dattebayoApi.js
const axios = require("axios");

const BASE_URL = "https://dattebayo-api.onrender.com";

class DattebayoApi {
  async getCharacters() {
    try {
      const response = await axios.get(`${BASE_URL}/characters`);
      return response.data;
    } catch (error) {
      console.error("❌ Dattebayo API falhou:", error.message);
      return null;
    }
  }

  async getCharacterByName(name) {
    const data = await this.getCharacters();
    if (!data || !data.characters) return null;
    return data.characters.find(
      (char) => char.name?.toLowerCase() === name?.toLowerCase(),
    );
  }

  async getTopJutsu(limit = 5) {
    const data = await this.getCharacters();
    if (!data || !data.characters) return [];
    return data.characters
      .map((char) => ({
        name: char.name,
        jutsuCount: char.jutsu?.length || 0,
      }))
      .sort((a, b) => b.jutsuCount - a.jutsuCount)
      .slice(0, limit);
  }

  async searchCharacters(query) {
    const data = await this.getCharacters();
    if (!data || !data.characters) return [];
    const term = query.toLowerCase();
    return data.characters.filter(
      (char) =>
        char.name?.toLowerCase().includes(term) ||
        char.personal?.clan?.toLowerCase().includes(term),
    );
  }

  // Converte para o formato que o frontend espera
  formatCharacter(char) {
    if (!char) return null;
    return {
      id: char.id,
      name: char.name,
      images: char.images || [],
      personal: {
        clan: char.personal?.clan || "Desconhecido",
        status: char.personal?.status || "Desconhecido",
        birthdate: char.personal?.birthdate || "Desconhecido",
        sex: char.personal?.sex || "Desconhecido",
        bloodType: char.personal?.bloodType || "Desconhecido",
        affiliation: char.personal?.affiliation || [],
        classification: char.personal?.classification || [],
      },
      family: char.family || {},
      jutsu: char.jutsu || [],
      natureType: char.natureType || [],
      rank: char.rank || {},
      tools: char.tools || [],
    };
  }
}

module.exports = new DattebayoApi();
