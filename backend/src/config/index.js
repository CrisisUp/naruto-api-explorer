// backend/src/config/index.js
require("dotenv").config();

module.exports = {
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || "development",
  },
  apis: {
    primary: {
      name: "Dattebayo API",
      url:
        process.env.DATTEBAYO_API_URL || "https://dattebayo-api.onrender.com",
      timeout: 5000,
    },
    fallback: {
      name: "Naruto API",
      url:
        process.env.NARUTO_API_URL ||
        "https://naruto-api-rsl3.onrender.com/api/v1",
      timeout: 5000,
    },
  },
  cache: {
    ttl: 5 * 60 * 1000, // 5 minutos
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  },
};
