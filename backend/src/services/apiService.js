// backend/src/services/apiService.js
const config = require("../config");
const logger = require("../utils/logger");
const dattebayoApi = require("./dattebayoApi");
const narutoApiFallback = require("./narutoApiFallback");

class ApiService {
  constructor() {
    this.primary = dattebayoApi;
    this.fallback = narutoApiFallback;
    this.fallbackUsed = false;
    this.lastError = null;
    this.cache = new Map();
    this.cacheTTL = config.cache.ttl;
  }

  // 🔥 ADICIONE ESTE MÉTODO AQUI!
  formatCharacter(raw) {
    if (!raw) return null;

    // Se o fallback foi usado, usa o formatador do fallback
    if (this.fallbackUsed) {
      return this.fallback.formatCharacter(raw);
    }

    // Senão, usa o formatador da API primária
    return this.primary.formatCharacter(raw);
  }

  async getCharacters() {
    const cacheKey = "characters";
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      logger.info("📡 Tentando API primária...");
      const data = await this.primary.fetchCharacters();

      if (data?.characters) {
        this.fallbackUsed = false;
        this.saveToCache(cacheKey, data);
        logger.info("✅ API primária funcionou!");
        return data;
      }

      return await this.tryFallback(cacheKey);
    } catch (error) {
      this.lastError = error;
      return await this.tryFallback(cacheKey);
    }
  }

  async tryFallback(cacheKey) {
    logger.warn("🔄 Tentando API de fallback...");
    const data = await this.fallback.fetchCharacters();

    if (data?.characters) {
      this.fallbackUsed = true;
      this.saveToCache(cacheKey, data);
      logger.info("✅ API de fallback funcionou!");
      return data;
    }

    logger.error("❌ Todas as APIs falharam!");
    return null;
  }

  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      logger.info(`📦 Usando cache: ${key}`);
      return cached.data;
    }
    return null;
  }

  saveToCache(key, data) {
    this.cache.set(key, { data, timestamp: Date.now() });
    logger.info(`💾 Cache salvo: ${key}`);
  }

  findCharacterByName(name) {
    const data = this.cache.get("characters")?.data;
    if (!data?.characters) return null;
    return data.characters.find(
      (char) => char.name?.toLowerCase() === name?.toLowerCase(),
    );
  }

  getTopJutsu(limit = 5) {
    const data = this.cache.get("characters")?.data;
    if (!data?.characters) return [];

    return data.characters
      .map((char) => ({
        name: char.name || "Desconhecido",
        jutsuCount: char.jutsu?.length || 0,
      }))
      .sort((a, b) => b.jutsuCount - a.jutsuCount)
      .slice(0, limit);
  }

  getStatus() {
    return {
      activeApi: this.fallbackUsed ? "Naruto API (Fallback)" : "Dattebayo API",
      fallbackUsed: this.fallbackUsed,
      lastError: this.lastError?.message || null,
      cacheSize: this.cache.size,
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = new ApiService();
