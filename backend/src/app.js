// backend/src/app.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const config = require("./config");
const logger = require("./utils/logger");

const app = express();

// Middleware
app.use(cors(config.cors));
app.use(express.json());

// Log de requisições
app.use((req, res, next) => {
  logger.info(`📥 ${req.method} ${req.url}`);
  next();
});

// ✅ SERVIDOR DE ARQUIVOS ESTÁTICOS - CORRIGIDO!
// Serve tanto a pasta src quanto a pasta public
app.use(express.static(path.join(__dirname, "../../frontend/src")));
app.use(express.static(path.join(__dirname, "../../frontend/public")));

// Importar rotas
const charactersRouter = require("./routes/characters");

// Usar rotas
app.use("/api/characters", charactersRouter);

// Rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/src/index.html"));
});

// Rota de health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    api: "Naruto API Explorer",
    env: config.server.env,
  });
});

// Middleware de erro (sempre por último)
app.use((err, req, res, next) => {
  logger.error("❌ Erro:", err.message);
  res.status(500).json({
    error: "Erro interno do servidor",
    message: err.message,
  });
});

module.exports = app;
