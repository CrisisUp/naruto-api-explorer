// backend/services/narutoApiFallback.js
const axios = require("axios");

const BASE_URL = "https://naruto-api-rsl3.onrender.com/api/v1";

class NarutoApiFallback {
  async getCharacters() {
    try {
      const response = await axios.get(`${BASE_URL}/characters`);
      // A API retorna um array diretamente
      return { characters: response.data };
    } catch (error) {
      console.error("❌ Naruto API Fallback falhou:", error.message);
      return null;
    }
  }

  async getCharacterByName(name) {
    // Esta API pode não ter busca por nome, então buscamos todos e filtramos
    const data = await this.getCharacters();
    if (!data || !data.characters) return null;
    return data.characters.find(
      (char) => char.name?.toLowerCase() === name?.toLowerCase(),
    );
  }

  async getTopJutsu(limit = 5) {
    // Esta API não tem jutsus, então retornamos vazio
    return [];
  }

  async searchCharacters(query) {
    const data = await this.getCharacters();
    if (!data || !data.characters) return [];
    const term = query.toLowerCase();
    return data.characters.filter((char) =>
      char.name?.toLowerCase().includes(term),
    );
  }

  // Converte para o formato que o frontend espera
  formatCharacter(char) {
    if (!char) return null;
    // Mapeia os campos da API para o formato do frontend
    return {
      id: char.id,
      name: char.name,
      images: char.images || [],
      personal: {
        clan: char.info?.Clã || "Desconhecido",
        status: char.info?.Status || "Desconhecido",
        birthdate: char.info?.Aniversário || "Desconhecido",
        sex: char.info?.Sexo || "Desconhecido",
        bloodType: char.info?.["Tipo Sanguíneo"] || "Desconhecido",
        affiliation: char.info?.Afiliação || "Desconhecido",
        classification: [],
      },
      family: {},
      jutsu: [],
      natureType: [],
      rank: {},
      tools: [],
      about: char.about || [],
      page: char.page || "",
    };
  }
}

module.exports = new NarutoApiFallback();
