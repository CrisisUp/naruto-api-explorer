// frontend/src/js/utils/imageUtils.js
import { LOCAL_IMAGES } from "../config.js";

export function getCharacterImage(character) {
  if (!character) return null;

  if (character.name === "Jiraiya") {
    return "/images/jiraiya.png";
  }

  if (character.images?.length > 0) {
    return character.images[0];
  }

  if (character.name && LOCAL_IMAGES[character.name]) {
    return LOCAL_IMAGES[character.name];
  }

  return null;
}

export function createImageHtml(character) {
  const imageUrl = getCharacterImage(character);

  if (imageUrl) {
    return `
      <div class="character-image-container">
        <img src="${imageUrl}" 
             alt="${character.name}" 
             class="character-image"
             onerror="this.style.display='none';this.parentElement.querySelector('.character-image-placeholder').style.display='flex'"
             loading="lazy">
        <div class="character-image-placeholder" style="display: none;">
          🍥 ${character.name?.charAt(0) || "?"}
        </div>
      </div>
    `;
  }

  return `
    <div class="character-image-container">
      <div class="character-image-placeholder">
        🍥 ${character.name?.charAt(0) || "?"}
      </div>
    </div>
  `;
}
