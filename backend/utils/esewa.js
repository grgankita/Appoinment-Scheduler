const Esewa = require("esewajs");

const esewa = new Esewa({
  // Use production: true for live environment
  environment: "test",
  clientId: "YOUR_ESEWA_CLIENT_ID",
  secretId: "YOUR_ESEWA_SECRET_ID",
});

module.exports = esewa;
