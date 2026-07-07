// ============================================
// FRONTEND - app.js (JavaScript do navegador)
// ============================================

// 🔄 URL do seu BACKEND (Node.js)
const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000/api/characters"
    : `http://${window.location.hostname}:3000/api/characters`;

console.log("📡 API URL:", API_BASE);
let currentCharacter = null;

// ============================================
// IMAGENS LOCAIS (FALLBACK)
// ============================================

const LOCAL_IMAGES = {
  Jiraiya: "/images/jiraiya.png",
  // Adicione outros personagens se quiser
  // 'Naruto Uzumaki': '/images/naruto.jpg',
  // 'Sasuke Uchiha': '/images/sasuke.jpg',
};

// ✅ FUNÇÃO CORRIGIDA - Prioriza imagem local para personagens específicos
function getCharacterImage(character) {
  if (!character) return null;

  // 🔥 PRIORIDADE MÁXIMA: Se for Jiraiya, usa a imagem local!
  if (character.name === "Jiraiya") {
    console.log("🖼️ Usando imagem LOCAL do Jiraiya");
    return "/images/jiraiya.png";
  }

  // Para outros personagens, tenta a imagem da API primeiro
  if (character.images && character.images.length > 0) {
    return character.images[0];
  }

  // Se não tem imagem na API, tenta imagem local pelo nome
  if (character.name && LOCAL_IMAGES[character.name]) {
    return LOCAL_IMAGES[character.name];
  }

  // Se não tem nenhuma, retorna null (vai mostrar placeholder)
  return null;
}

// Elementos DOM
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const topJutsuBtn = document.getElementById("topJutsuBtn");
const randomBtn = document.getElementById("randomBtn");
const characterInfo = document.getElementById("characterInfo");
const characterName = document.getElementById("characterName");
const characterStatus = document.getElementById("characterStatus");
const personalInfo = document.getElementById("personalInfo");
const familyInfo = document.getElementById("familyInfo");
const jutsuList = document.getElementById("jutsuList");
const charactersList = document.getElementById("charactersList");
const loading = document.getElementById("loading");

// Event Listeners
searchBtn.addEventListener("click", () => searchCharacter());
topJutsuBtn.addEventListener("click", showTopJutsu);
randomBtn.addEventListener("click", getRandomCharacter);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchCharacter();
});

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

// Função para escapar caracteres especiais no HTML
function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Função para converter campo em array seguro
function safeArray(value) {
  if (!value) return "Desconhecido";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

// Função para buscar personagem por ID
async function displayCharacterById(id) {
  showLoading(true);
  try {
    const response = await fetch(`${API_BASE}/${id}`);
    if (!response.ok) {
      throw new Error("Personagem não encontrado");
    }
    const data = await response.json();
    displayCharacter(data);
    hideLoading();
  } catch (error) {
    showError(error.message);
    hideLoading();
  }
}

// ============================================
// FUNÇÕES PRINCIPAIS
// ============================================

async function searchCharacter() {
  const name = searchInput.value.trim();
  if (!name) {
    alert("Digite o nome de um personagem!");
    return;
  }

  showLoading(true);
  try {
    const response = await fetch(
      `${API_BASE}/search/${encodeURIComponent(name)}`,
    );
    if (!response.ok) {
      throw new Error("Personagem não encontrado");
    }
    const data = await response.json();
    displayCharacter(data);
    hideLoading();
  } catch (error) {
    showError(error.message);
    hideLoading();
  }
}

async function getRandomCharacter() {
  showLoading(true);
  try {
    const response = await fetch(`${API_BASE}`);
    const data = await response.json();
    if (data.characters && data.characters.length > 0) {
      const random =
        data.characters[Math.floor(Math.random() * data.characters.length)];
      displayCharacter(random);
    }
    hideLoading();
  } catch (error) {
    showError("Erro ao buscar personagem aleatório");
    hideLoading();
  }
}

async function showTopJutsu() {
  showLoading(true);
  try {
    const response = await fetch(`${API_BASE}/top-jutsu`);
    const data = await response.json();
    displayTopJutsu(data);
    hideLoading();
  } catch (error) {
    showError("Erro ao buscar top jutsus");
    hideLoading();
  }
}

// ============================================
// FUNÇÕES DE DISPLAY
// ============================================

function displayCharacter(character) {
  if (!character) {
    showError("Personagem não encontrado");
    return;
  }

  currentCharacter = character;
  characterInfo.classList.remove("hidden");
  charactersList.innerHTML = "";

  // ============================================
  // 🖼️ IMAGEM DO PERSONAGEM (COM FALLBACK LOCAL!)
  // ============================================
  const imageUrl = getCharacterImage(character);
  let imageHtml = "";

  if (imageUrl) {
    imageHtml = `
      <div class="character-image-container">
        <img src="${imageUrl}" 
             alt="${escapeHtml(character.name)}" 
             class="character-image"
             onerror="this.style.display='none';this.parentElement.querySelector('.character-image-placeholder').style.display='flex'"
             loading="lazy">
        <div class="character-image-placeholder" style="display: none;">
          🍥 ${escapeHtml(character.name?.charAt(0) || "?")}
        </div>
      </div>
    `;
  } else {
    imageHtml = `
      <div class="character-image-container">
        <div class="character-image-placeholder">
          🍥 ${escapeHtml(character.name?.charAt(0) || "?")}
        </div>
      </div>
    `;
  }

  // Nome
  characterName.textContent = character.name || "Desconhecido";

  // Status
  const status = character.personal?.status || "Desconhecido";
  characterStatus.textContent = status;
  characterStatus.className = "status-badge";
  if (status.toLowerCase().includes("alive")) {
    characterStatus.classList.add("status-alive");
  } else if (status.toLowerCase().includes("deceased")) {
    characterStatus.classList.add("status-deceased");
  } else {
    characterStatus.classList.add("status-unknown");
  }

  // ============================================
  // HEADER COM IMAGEM
  // ============================================
  const headerContainer = document.querySelector(".character-header");
  if (headerContainer) {
    headerContainer.innerHTML = `
      <div class="character-header-with-image">
        ${imageHtml}
        <div class="character-header-info">
          <h2>${escapeHtml(character.name || "Desconhecido")}</h2>
          <span class="status-badge ${characterStatus.className}">${status}</span>
        </div>
      </div>
    `;
  }

  // ============================================
  // INFORMAÇÕES PESSOAIS
  // ============================================
  const personal = character.personal || {};

  personalInfo.innerHTML = `
    <div class="info-item">
      <span class="label">📅 Aniversário</span>
      <span class="value">${escapeHtml(personal.birthdate || "Desconhecido")}</span>
    </div>
    <div class="info-item">
      <span class="label">👤 Sexo</span>
      <span class="value">${escapeHtml(personal.sex || "Desconhecido")}</span>
    </div>
    <div class="info-item">
      <span class="label">🩸 Tipo Sanguíneo</span>
      <span class="value">${escapeHtml(personal.bloodType || "Desconhecido")}</span>
    </div>
    <div class="info-item">
      <span class="label">🏷️ Clã</span>
      <span class="value">${escapeHtml(personal.clan || "Desconhecido")}</span>
    </div>
    <div class="info-item">
      <span class="label">📍 Afiliação</span>
      <span class="value">${escapeHtml(safeArray(personal.affiliation))}</span>
    </div>
    <div class="info-item">
      <span class="label">📊 Classificação</span>
      <span class="value">${escapeHtml(safeArray(personal.classification))}</span>
    </div>
    <div class="info-item">
      <span class="label">⚡ Naturezas</span>
      <span class="value">${escapeHtml(safeArray(character.natureType))}</span>
    </div>
  `;

  // ============================================
  // FAMÍLIA
  // ============================================
  const family = character.family || {};
  const familyItems = Object.entries(family).filter(([key, value]) => value);
  if (familyItems.length > 0) {
    familyInfo.innerHTML = familyItems
      .map(
        ([key, value]) => `
          <div class="info-item">
            <span class="label">${formatFamilyRelation(key)}</span>
            <span class="value">${escapeHtml(value)}</span>
          </div>
        `,
      )
      .join("");
  } else {
    familyInfo.innerHTML =
      '<p style="color: #aaa;">Nenhuma informação familiar disponível</p>';
  }

  // ============================================
  // JUTSUS
  // ============================================
  const jutsus = character.jutsu || [];
  if (jutsus.length > 0) {
    jutsuList.innerHTML = jutsus
      .map(
        (jutsu) => `
          <span class="jutsu-tag">${escapeHtml(jutsu)}</span>
        `,
      )
      .join("");
  } else {
    jutsuList.innerHTML = '<p style="color: #aaa;">Nenhum jutsu registrado</p>';
  }
}

function formatFamilyRelation(key) {
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

function displayTopJutsu(data) {
  characterInfo.classList.remove("hidden");
  characterName.textContent = "🏆 Top Jutsus";
  characterStatus.textContent = "";
  characterStatus.className = "status-badge hidden";
  charactersList.innerHTML = "";

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
    <div class="info-item">
      <span class="label">📊 Ranking</span>
      <span class="value">Personagens com mais jutsus</span>
    </div>
  `;

  familyInfo.innerHTML = data
    .map(
      (item, index) => `
        <div class="info-item">
          <span class="label">#${index + 1}</span>
          <span class="value">${escapeHtml(item.name)}: ${item.jutsuCount} jutsus</span>
        </div>
      `,
    )
    .join("");

  jutsuList.innerHTML = "";
}

function showError(message) {
  characterInfo.classList.remove("hidden");
  characterName.textContent = "❌ Erro";
  characterStatus.textContent = "";
  characterStatus.className = "status-badge hidden";

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
  charactersList.innerHTML = "";
}

function showLoading(show) {
  loading.classList.toggle("hidden", !show);
}

function hideLoading() {
  loading.classList.add("hidden");
}

// ============================================
// INICIALIZAÇÃO
// ============================================

async function loadCharactersList() {
  try {
    const response = await fetch(`${API_BASE}`);
    const data = await response.json();
    if (data.characters) {
      const first20 = data.characters.slice(0, 20);

      charactersList.innerHTML = first20
        .map((char) => {
          // Usar a mesma função para obter a imagem
          const imageUrl = getCharacterImage(char);
          let miniImageHtml = "";

          if (imageUrl) {
            miniImageHtml = `
              <img src="${imageUrl}" 
                   alt="${escapeHtml(char.name)}" 
                   class="mini-image"
                   loading="lazy"
                   onerror="this.style.display='none';this.parentElement.querySelector('.mini-placeholder').style.display='flex'">
            `;
          }

          return `
            <div class="character-card-mini" data-character-id="${char.id}">
              ${miniImageHtml}
              <div class="mini-placeholder" style="display: ${imageUrl ? "none" : "flex"}">
                🍥
              </div>
              <div class="name">${escapeHtml(char.name)}</div>
              <div class="clan">${escapeHtml(char.personal?.clan || "Sem clã")}</div>
            </div>
          `;
        })
        .join("");

      document.querySelectorAll(".character-card-mini").forEach((card) => {
        card.addEventListener("click", function () {
          const id = this.dataset.characterId;
          displayCharacterById(id);
        });
      });
    }
  } catch (error) {
    console.error("Erro ao carregar lista:", error);
  }
}

// 🚀 Iniciar quando a página carregar
document.addEventListener("DOMContentLoaded", loadCharactersList);
