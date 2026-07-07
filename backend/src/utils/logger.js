// backend/src/utils/logger.js
const config = require("../config");

const levels = {
  INFO: "ℹ️",
  WARN: "⚠️",
  ERROR: "❌",
  SUCCESS: "✅",
  DEBUG: "🐛",
};

function log(level, message, ...args) {
  const timestamp = new Date().toISOString();
  const prefix = levels[level] || "📌";

  if (config.server.env === "development") {
    console.log(`${prefix} [${timestamp}] ${message}`, ...args);
  } else {
    // Em produção, enviar para serviço de logs
    console.log(`${prefix} ${message}`, ...args);
  }
}

module.exports = {
  info: (msg, ...args) => log("INFO", msg, ...args),
  warn: (msg, ...args) => log("WARN", msg, ...args),
  error: (msg, ...args) => log("ERROR", msg, ...args),
  success: (msg, ...args) => log("SUCCESS", msg, ...args),
  debug: (msg, ...args) => log("DEBUG", msg, ...args),
};
