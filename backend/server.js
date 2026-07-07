// backend/server.js
const app = require("./src/app");
const config = require("./src/config");
const logger = require("./src/utils/logger");
const os = require("os");

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

const PORT = config.server.port;
const localIP = getLocalIP();

app.listen(PORT, "0.0.0.0", () => {
  logger.success(`🎉 Servidor rodando em:`);
  logger.info(`   📱 Local:    http://localhost:${PORT}`);
  logger.info(`   📱 IP Local: http://${localIP}:${PORT}`);
  logger.info(`📚 API: http://localhost:${PORT}/api/characters`);
  logger.info(`🏥 Health: http://localhost:${PORT}/health`);
  logger.info("");
  logger.info(`📱 Para acessar do CELULAR, use o IP acima:`);
  logger.info(`   http://${localIP}:${PORT}`);
});
