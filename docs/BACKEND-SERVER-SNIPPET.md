## Minimal Node + Express server (DB placeholder)

Copy-paste this as a starting point for a backend with placeholder for a DB connection string:

```js
// server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Example DB connection placeholder (replace with your DB client)
const DB_CONNECTION = process.env.DB_CONNECTION || 'mongodb://user:pass@host:27017/dbname';
// e.g. const client = new MongoClient(DB_CONNECTION); await client.connect();

app.use(express.static(path.join(__dirname, 'public')));

// API examples
app.get('/api/tours', async (req, res) => {
  // If using DB, fetch from DB; otherwise read from data/tours.json
  res.json([/* your tours */]);
});

app.get('/api/tours/:id', (req, res) => {
  // fetch single tour by id
  res.json({});
});

app.listen(PORT, () => console.log('Server on', PORT));
```

Replace the `DB_CONNECTION` placeholder with your real database connection string when you add a DB.
