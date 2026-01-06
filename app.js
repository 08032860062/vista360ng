// app.js - Express app factory for testing
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const DATA_DIR = path.join(__dirname, 'data');
const TOURS_FILE = path.join(DATA_DIR, 'tours.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

const defaultTours = [
  {
    id: 'maitama-castle',
    title: 'Maitama Castle – Abuja',
    city: 'Abuja',
    category: 'Luxury Mansion',
    price: '$20M',
    views: 361000,
    kuulaUrl: 'https://kuula.co/post/EXAMPLE1'
  }
];

const defaultConfig = { whatsapp: '234XXXXXXXXXX' };

let tours = [];
let config = {};
let users = {};

async function ensureData() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const t = await fs.readFile(TOURS_FILE, 'utf8');
    tours = JSON.parse(t);
  } catch (err) {
    tours = defaultTours;
    await fs.writeFile(TOURS_FILE, JSON.stringify(tours, null, 2));
  }

  try {
    const c = await fs.readFile(CONFIG_FILE, 'utf8');
    config = JSON.parse(c);
  } catch (err) {
    config = defaultConfig;
    await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));
  }

  try {
    const u = await fs.readFile(USERS_FILE, 'utf8');
    users = JSON.parse(u);
  } catch (err) {
    const defaultHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'devpass', 10);
    users = { admin: defaultHash };
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  }
}

function createApp() {
  const app = express();
  app.use(helmet());
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
  app.use(limiter);

  function checkAdmin(req) {
    const key = (req.headers['x-admin-key'] || '').toString();
    if (key && key === (process.env.ADMIN_KEY || 'devpass')) return true;
    if (req.cookies && req.cookies.admin === '1') return true;
    return false;
  }

  app.get('/api/tours', (req, res) => res.json(tours));
  app.get('/api/tours/:id', (req, res) => {
    const t = tours.find(x => x.id === req.params.id);
    if (!t) return res.status(404).json({ error: 'Not found' });
    res.json(t);
  });

  app.get('/api/config', (req, res) => res.json(config));

  app.post('/api/tours', async (req, res) => {
    if (!checkAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
    const { id, title, city, category, price, views, kuulaUrl } = req.body;
    if (!id || !title || !kuulaUrl) return res.status(400).json({ error: 'id, title and kuulaUrl are required' });
    if (tours.find(t => t.id === id)) return res.status(400).json({ error: 'tour with this id already exists' });
    const newTour = { id, title, city: city || '', category: category || '', price: price || '', views: Number(views) || 0, kuulaUrl };
    tours.push(newTour);
    await fs.writeFile(TOURS_FILE, JSON.stringify(tours, null, 2));
    res.json({ ok: true, tour: newTour });
  });

  app.post('/api/config', async (req, res) => {
    if (!checkAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
    const { whatsapp } = req.body;
    if (!whatsapp) return res.status(400).json({ error: 'whatsapp required' });
    config.whatsapp = whatsapp;
    await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));
    res.json({ ok: true, config });
  });

  app.post('/admin/login', async (req, res) => {
    const { password, username } = req.body || {};
    const user = (username || 'admin');
    const userHash = users[user];
    if (userHash && await bcrypt.compare(password || '', userHash)) {
      res.cookie('admin', '1', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
      return res.json({ ok: true });
    }
    const expected = process.env.ADMIN_PASSWORD || 'devpass';
    if (password === expected) {
      res.cookie('admin', '1', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
      return res.json({ ok: true });
    }
    res.status(401).json({ error: 'invalid password' });
  });

  app.post('/admin/logout', (req, res) => { res.clearCookie('admin'); res.json({ ok: true }); });

  app.post('/admin/users', async (req, res) => {
    if (!checkAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: 'username and password are required' });
    const hash = await bcrypt.hash(password, 10);
    users[username] = hash;
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
    res.json({ ok: true, username });
  });

  app.get('/admin/users', (req, res) => { if (!checkAdmin(req)) return res.status(401).json({ error: 'Unauthorized' }); res.json(Object.keys(users)); });

  app.get('/tour/:id', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'tour.html')); });
  app.get('/admin', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'admin.html')); });

  // change password (authenticated)
  app.post('/admin/change-password', async (req, res) => {
    if (!checkAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
    const { username, currentPassword, newPassword } = req.body || {};
    if (!username || !currentPassword || !newPassword) return res.status(400).json({ error: 'username,currentPassword,newPassword required' });
    const userHash = users[username];
    if (!userHash) return res.status(404).json({ error: 'user not found' });
    if (!await bcrypt.compare(currentPassword, userHash)) return res.status(401).json({ error: 'current password invalid' });
    users[username] = await bcrypt.hash(newPassword, 10);
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
    res.json({ ok: true });
  });

  return app;
}

module.exports = { createApp, ensureData };
