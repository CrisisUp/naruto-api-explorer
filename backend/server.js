// backend/server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const os = require("os"); // ← NOVO: para descobrir o IP

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// FUNÇÃO PARA OBTER O IP DA REDE LOCAL
// ============================================
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Pula interfaces não IPv4 e loopback (localhost)
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

// Middleware
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Importar rotas
const charactersRouter = require("./routes/characters");

// Usar rotas
app.use("/api/characters", charactersRouter);

// Rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Rota de health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    api: "Naruto API Explorer",
    serverIP: getLocalIP(), // ← NOVO: mostra o IP para acesso externo
  });
});

// Middleware de erro (sempre por último)
app.use((err, req, res, next) => {
  console.error("❌ Erro:", err.message);
  res.status(500).json({
    error: "Erro interno do servidor",
    message: err.message,
  });
});

// ============================================
// INICIAR SERVIDOR (ESCUTANDO EM TODAS AS INTERFACES)
// ============================================
const localIP = getLocalIP();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🎉 Servidor rodando em:`);
  console.log(`   📱 Local:    http://localhost:${PORT}`);
  console.log(`   📱 IP Local: http://${localIP}:${PORT}`);
  console.log(`📚 API: http://localhost:${PORT}/api/characters`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
  console.log("");
  console.log(`📱 Para acessar do CELULAR, use o IP acima:`);
  console.log(`   http://${localIP}:${PORT}`);
});
