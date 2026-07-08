// backend/src/utils/geoLogger.js
const axios = require("axios");

async function getGeoInfo(ip) {
  try {
    const response = await axios.get(`https://ipinfo.io/${ip}/json`);
    return {
      city: response.data.city || "Desconhecida",
      region: response.data.region || "Desconhecida",
      country: response.data.country || "Desconhecida",
    };
  } catch {
    return {
      city: "Desconhecida",
      region: "Desconhecida",
      country: "Desconhecida",
    };
  }
}

// No app.js
const geo = await getGeoInfo(ip);
logger.info(
  `${deviceIcon} ${deviceType} | ${os} | ${browser} | ${ip} (${geo.city}, ${geo.country}) | ` +
    `${req.method} ${req.url} | ${statusIcon} ${status} | ${duration}ms`,
);
