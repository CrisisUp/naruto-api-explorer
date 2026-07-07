// frontend/src/js/config.js

export const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000/api/characters"
    : `http://${window.location.hostname}:3000/api/characters`;

// frontend/src/js/config.js
export const LOCAL_IMAGES = {
  Jiraiya: "/images/jiraiya.png",
  "Naruto Uzumaki": "/images/naruto.jpg",
  "Sasuke Uchiha": "/images/sasuke.jpg",
  // ...
};

export const DEFAULT_LIMIT = 20;
export const TOP_JUTSU_LIMIT = 5;
