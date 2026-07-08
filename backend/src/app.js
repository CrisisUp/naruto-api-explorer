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

// 🔥 LOG DE REQUISIÇÕES COM DETALHES DO DISPOSITIVO
app.use((req, res, next) => {
  const start = Date.now();

  // Detectar dispositivo pelo User-Agent
  const userAgent = req.headers["user-agent"] || "";
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent);
  const isDesktop = !isMobile;

  const deviceType = isMobile ? "📱 Celular" : "🖥️ Desktop";
  const deviceIcon = isMobile ? "📱" : "💻";

  // Detectar sistema operacional
  let os = "Desconhecido";
  if (userAgent.includes("Windows")) os = "Windows";
  else if (userAgent.includes("Mac OS")) os = "macOS";
  else if (userAgent.includes("Linux")) os = "Linux";
  else if (userAgent.includes("Android")) os = "Android";
  else if (userAgent.includes("iPhone") || userAgent.includes("iPad"))
    os = "iOS";

  // Detectar navegador
  let browser = "Desconhecido";
  if (userAgent.includes("Chrome") && !userAgent.includes("Edg"))
    browser = "Chrome";
  else if (userAgent.includes("Firefox")) browser = "Firefox";
  else if (userAgent.includes("Safari") && !userAgent.includes("Chrome"))
    browser = "Safari";
  else if (userAgent.includes("Edg")) browser = "Edge";
  else if (userAgent.includes("Opera")) browser = "Opera";

  // Capturar IP
  const ip = req.ip || req.connection.remoteAddress || "Desconhecido";

  // Log da requisição
  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const statusIcon = status >= 200 && status < 300 ? "✅" : "❌";

    logger.info(
      `${deviceIcon} ${deviceType} | ${os} | ${browser} | ${ip} | ` +
        `${req.method} ${req.url} | ${statusIcon} ${status} | ${duration}ms`,
    );
  });

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
