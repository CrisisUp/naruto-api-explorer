// frontend/src/js/app.js
import {
  fetchCharacters,
  fetchCharacterById,
  fetchCharacterByName,
  fetchTopJutsu,
  fetchRandomCharacter,
} from "./services/apiClient.js";

import { getCharacterImage, createImageHtml } from "./utils/imageUtils.js";
import {
  escapeHtml,
  safeArray,
  showElement,
  hideElement,
} from "./utils/domUtils.js";
import { DEFAULT_LIMIT, TOP_JUTSU_LIMIT } from "./config.js";

class NarutoApp {
  constructor() {
    this.currentCharacter = null;
    this.elements = this.getElements();
    this.bindEvents();
    this.initialize();
  }

  getElements() {
    return {
      searchInput: document.getElementById("searchInput"),
      searchBtn: document.getElementById("searchBtn"),
      topJutsuBtn: document.getElementById("topJutsuBtn"),
      randomBtn: document.getElementById("randomBtn"),
      characterInfo: document.getElementById("characterInfo"),
      characterName: document.getElementById("characterName"),
      characterStatus: document.getElementById("characterStatus"),
      personalInfo: document.getElementById("personalInfo"),
      familyInfo: document.getElementById("familyInfo"),
      jutsuList: document.getElementById("jutsuList"),
      charactersList: document.getElementById("charactersList"),
      loading: document.getElementById("loading"),
    };
  }

  bindEvents() {
    const { searchInput, searchBtn, topJutsuBtn, randomBtn } = this.elements;

    searchBtn.addEventListener("click", () => this.handleSearch());
    topJutsuBtn.addEventListener("click", () => this.handleTopJutsu());
    randomBtn.addEventListener("click", () => this.handleRandom());
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.handleSearch();
    });
  }

  async initialize() {
    try {
      await this.loadCharactersList();
    } catch (error) {
      console.error("Erro ao inicializar:", error);
    }
  }

  async handleSearch() {
    const name = this.elements.searchInput.value.trim();
    if (!name) {
      alert("Digite o nome de um personagem!");
      return;
    }

    try {
      this.showLoading();
      const character = await fetchCharacterByName(name);
      this.displayCharacter(character);
    } catch (error) {
      this.showError(error.message);
    } finally {
      this.hideLoading();
    }
  }

  async handleRandom() {
    try {
      this.showLoading();
      const character = await fetchRandomCharacter();
      this.displayCharacter(character);
    } catch (error) {
      this.showError(error.message);
    } finally {
      this.hideLoading();
    }
  }

  async handleTopJutsu() {
    try {
      this.showLoading();
      const data = await fetchTopJutsu(TOP_JUTSU_LIMIT);
      this.displayTopJutsu(data);
    } catch (error) {
      this.showError(error.message);
    } finally {
      this.hideLoading();
    }
  }

  async loadCharactersList() {
    try {
      const data = await fetchCharacters();
      const characters = data.characters?.slice(0, DEFAULT_LIMIT) || [];
      this.renderCharacterList(characters);
    } catch (error) {
      console.error("Erro ao carregar lista:", error);
    }
  }

  renderCharacterList(characters) {
    const { charactersList } = this.elements;

    charactersList.innerHTML = characters
      .map((char) => {
        const imageUrl = getCharacterImage(char);
        const imageHtml = imageUrl
          ? `<img src="${imageUrl}" alt="${escapeHtml(char.name)}" class="mini-image" loading="lazy" onerror="this.style.display='none'">`
          : `<div class="mini-placeholder">🍥</div>`;

        return `
        <div class="character-card-mini" data-character-id="${char.id}">
          ${imageHtml}
          <div class="name">${escapeHtml(char.name)}</div>
          <div class="clan">${escapeHtml(char.personal?.clan || "Sem clã")}</div>
        </div>
      `;
      })
      .join("");

    // Event delegation para os cards
    charactersList.querySelectorAll(".character-card-mini").forEach((card) => {
      card.addEventListener("click", () => {
        const id = parseInt(card.dataset.characterId);
        this.handleCharacterClick(id);
      });
    });
  }

  async handleCharacterClick(id) {
    try {
      this.showLoading();
      const character = await fetchCharacterById(id);
      this.displayCharacter(character);
    } catch (error) {
      this.showError(error.message);
    } finally {
      this.hideLoading();
    }
  }

  displayCharacter(character) {
    if (!character) {
      this.showError("Personagem não encontrado");
      return;
    }

    this.currentCharacter = character;
    const {
      characterInfo,
      characterName,
      characterStatus,
      personalInfo,
      familyInfo,
      jutsuList,
    } = this.elements;

    showElement(characterInfo);
    this.elements.charactersList.innerHTML = "";

    // Header com imagem
    const headerContainer = document.querySelector(".character-header");
    if (headerContainer) {
      headerContainer.innerHTML = `
        <div class="character-header-with-image">
          ${createImageHtml(character)}
          <div class="character-header-info">
            <h2>${escapeHtml(character.name)}</h2>
            <span class="status-badge ${this.getStatusClass(character)}">${character.personal?.status || "Desconhecido"}</span>
          </div>
        </div>
      `;
    }

    // Informações pessoais
    const personal = character.personal || {};
    personalInfo.innerHTML = `
      <div class="info-item"><span class="label">📅 Aniversário</span><span class="value">${escapeHtml(personal.birthdate || "Desconhecido")}</span></div>
      <div class="info-item"><span class="label">👤 Sexo</span><span class="value">${escapeHtml(personal.sex || "Desconhecido")}</span></div>
      <div class="info-item"><span class="label">🩸 Tipo Sanguíneo</span><span class="value">${escapeHtml(personal.bloodType || "Desconhecido")}</span></div>
      <div class="info-item"><span class="label">🏷️ Clã</span><span class="value">${escapeHtml(personal.clan || "Desconhecido")}</span></div>
      <div class="info-item"><span class="label">📍 Afiliação</span><span class="value">${escapeHtml(safeArray(personal.affiliation))}</span></div>
      <div class="info-item"><span class="label">📊 Classificação</span><span class="value">${escapeHtml(safeArray(personal.classification))}</span></div>
      <div class="info-item"><span class="label">⚡ Naturezas</span><span class="value">${escapeHtml(safeArray(character.natureType))}</span></div>
    `;

    // Família
    const family = character.family || {};
    const familyItems = Object.entries(family).filter(([_, value]) => value);
    familyInfo.innerHTML = familyItems.length
      ? familyItems
          .map(
            ([key, value]) => `
          <div class="info-item"><span class="label">${this.formatFamilyRelation(key)}</span><span class="value">${escapeHtml(value)}</span></div>
        `,
          )
          .join("")
      : '<p style="color: #aaa;">Nenhuma informação familiar disponível</p>';

    // Jutsus
    const jutsus = character.jutsu || [];
    jutsuList.innerHTML = jutsus.length
      ? jutsus
          .map((jutsu) => `<span class="jutsu-tag">${escapeHtml(jutsu)}</span>`)
          .join("")
      : '<p style="color: #aaa;">Nenhum jutsu registrado</p>';
  }

  displayTopJutsu(data) {
    const {
      characterInfo,
      characterName,
      characterStatus,
      personalInfo,
      familyInfo,
      jutsuList,
    } = this.elements;

    showElement(characterInfo);
    characterName.textContent = "🏆 Top Jutsus";
    characterStatus.textContent = "";
    characterStatus.className = "status-badge hidden";
    this.elements.charactersList.innerHTML = "";

    const headerContainer = document.querySelector(".character-header");
    if (headerContainer) {
      headerContainer.innerHTML = `
        <div class="character-header-with-image">
          <div class="character-header-info">
            <h2>🏆 Top Jutsus</h2>
          </div>
        </div>
      `;
    }

    personalInfo.innerHTML = `
      <div class="info-item"><span class="label">📊 Ranking</span><span class="value">Personagens com mais jutsus</span></div>
    `;

    familyInfo.innerHTML = data
      .map(
        (item, index) => `
      <div class="info-item"><span class="label">#${index + 1}</span><span class="value">${escapeHtml(item.name)}: ${item.jutsuCount} jutsus</span></div>
    `,
      )
      .join("");

    jutsuList.innerHTML = "";
  }

  showError(message) {
    const {
      characterInfo,
      characterName,
      characterStatus,
      personalInfo,
      familyInfo,
      jutsuList,
    } = this.elements;

    showElement(characterInfo);
    characterName.textContent = "❌ Erro";
    characterStatus.textContent = "";
    characterStatus.className = "status-badge hidden";
    this.elements.charactersList.innerHTML = "";

    const headerContainer = document.querySelector(".character-header");
    if (headerContainer) {
      headerContainer.innerHTML = `
        <div class="character-header-with-image">
          <div class="character-header-info">
            <h2>❌ Erro</h2>
          </div>
        </div>
      `;
    }

    personalInfo.innerHTML = `<p style="color: #f44336;">${escapeHtml(message)}</p>`;
    familyInfo.innerHTML = "";
    jutsuList.innerHTML = "";
  }

  getStatusClass(character) {
    const status = character.personal?.status?.toLowerCase() || "";
    if (status.includes("alive")) return "status-alive";
    if (status.includes("deceased")) return "status-deceased";
    return "status-unknown";
  }

  formatFamilyRelation(key) {
    const relations = {
      father: "👨 Pai",
      mother: "👩 Mãe",
      brother: "👦 Irmão",
      sister: "👧 Irmã",
      son: "👦 Filho",
      daughter: "👧 Filha",
      wife: "👰 Esposa",
      husband: "🤵 Marido",
      godfather: "🙏 Padrinho",
      "adoptive son": "👦 Filho Adotivo",
    };
    return relations[key] || key;
  }

  showLoading() {
    showElement(this.elements.loading);
  }

  hideLoading() {
    hideElement(this.elements.loading);
  }
}

// Inicializar a aplicação
document.addEventListener("DOMContentLoaded", () => {
  new NarutoApp();
});

/// Registrar Service Worker (PWA)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) => {
        console.log("✅ Service Worker registrado com sucesso!");
        console.log("📱 Scope:", registration.scope);
      })
      .catch((error) => {
        console.error("❌ Erro ao registrar Service Worker:", error);
      });
  });
}
