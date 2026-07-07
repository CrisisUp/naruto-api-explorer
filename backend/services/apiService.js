// backend/services/apiService.js
const dattebayoApi = require("./dattebayoApi");
const narutoApiFallback = require("./narutoApiFallback");

class ApiService {
  constructor() {
    this.primary = dattebayoApi;
    this.fallback = narutoApiFallback;
    this.lastError = null;
    this.fallbackUsed = false;
  }

  async executeWithFallback(primaryMethod, fallbackMethod, ...args) {
    try {
      console.log("📡 Tentando API primária (Dattebayo)...");
      const result = await primaryMethod(...args);

      if (result !== null && result !== undefined && result !== false) {
        this.fallbackUsed = false;
        console.log("✅ API primária funcionou!");
        return result;
      }
      throw new Error("API primária retornou dados vazios");
    } catch (error) {
      console.warn("⚠️ API primária falhou:", error.message);
      console.log("🔄 Tentando API de fallback...");

      try {
        const fallbackResult = await fallbackMethod(...args);
        if (fallbackResult !== null && fallbackResult !== undefined) {
          this.fallbackUsed = true;
          console.log("✅ API de fallback funcionou!");
          return fallbackResult;
        }
        throw new Error("API de fallback retornou dados vazios");
      } catch (fallbackError) {
        console.error("❌ Todas as APIs falharam!");
        this.lastError = fallbackError;
        return null;
      }
    }
  }

  async getAllCharacters() {
    return this.executeWithFallback(
      () => this.primary.getCharacters(),
      () => this.fallback.getCharacters(),
    );
  }

  async getCharacterByName(name) {
    return this.executeWithFallback(
      () => this.primary.getCharacterByName(name),
      () => this.fallback.getCharacterByName(name),
    );
  }

  async searchCharacters(query) {
    return this.executeWithFallback(
      () => this.primary.searchCharacters(query),
      () => this.fallback.searchCharacters(query),
    );
  }

  // ✅ CORRIGIDO: getTopJutsu com tratamento de erro
  async getTopJutsu(limit = 5) {
    try {
      const result = await this.getAllCharacters();

      if (!result || !result.characters) {
        console.warn("⚠️ Nenhum personagem encontrado para top jutsus");
        return [];
      }

      // Verificar se há personagens com jutsus
      const hasJutsu = result.characters.some((char) => char.jutsu?.length > 0);

      if (!hasJutsu) {
        console.warn("⚠️ Nenhum personagem com jutsus encontrado");
        // Tentar usar o fallback específico
        const fallbackResult = await this.fallback.getTopJutsu(limit);
        if (fallbackResult && fallbackResult.length > 0) {
          return fallbackResult;
        }
        return [];
      }

      const top = result.characters
        .map((char) => ({
          name: char.name || "Desconhecido",
          jutsuCount: char.jutsu?.length || 0,
        }))
        .filter((item) => item.jutsuCount > 0) // Remover quem não tem jutsus
        .sort((a, b) => b.jutsuCount - a.jutsuCount)
        .slice(0, limit);

      console.log(`✅ Top ${top.length} jutsus calculados`);
      return top;
    } catch (error) {
      console.error("❌ Erro ao calcular top jutsus:", error.message);
      return [];
    }
  }

  formatCharacter(char) {
    if (!char) return null;
    if (this.fallbackUsed) {
      return this.fallback.formatCharacter(char);
    }
    return this.primary.formatCharacter(char);
  }

  getActiveApi() {
    return this.fallbackUsed
      ? "Naruto API (Fallback)"
      : "Dattebayo API (Primária)";
  }

  getStatus() {
    return {
      activeApi: this.getActiveApi(),
      fallbackUsed: this.fallbackUsed,
      lastError: this.lastError?.message || null,
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = new ApiService();
