// server.js — start the app after ensuring data files exist
const { createApp, ensureData } = require('./app');
const PORT = process.env.PORT || 3000;

(async () => {
  await ensureData();
  const app = createApp();
  app.listen(PORT, () => console.log(`Vista360 pilot running on http://localhost:${PORT}`));
})();
