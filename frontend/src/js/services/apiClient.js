// frontend/src/js/services/apiClient.js
import { API_BASE } from "../config.js";

export async function fetchCharacters() {
  const response = await fetch(API_BASE);
  if (!response.ok) throw new Error("Erro ao buscar personagens");
  return response.json();
}

export async function fetchCharacterById(id) {
  const response = await fetch(`${API_BASE}/${id}`);
  if (!response.ok) throw new Error("Personagem não encontrado");
  return response.json();
}

export async function fetchCharacterByName(name) {
  const response = await fetch(
    `${API_BASE}/search/${encodeURIComponent(name)}`,
  );
  if (!response.ok) throw new Error("Personagem não encontrado");
  return response.json();
}

export async function fetchTopJutsu(limit = 5) {
  const response = await fetch(`${API_BASE}/top-jutsu?limit=${limit}`);
  if (!response.ok) throw new Error("Erro ao buscar top jutsus");
  return response.json();
}

export async function fetchRandomCharacter() {
  const data = await fetchCharacters();
  if (!data.characters?.length) throw new Error("Nenhum personagem disponível");
  const randomIndex = Math.floor(Math.random() * data.characters.length);
  return data.characters[randomIndex];
}
