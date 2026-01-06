const request = require('supertest');
const { createApp, ensureData } = require('../app');

let app;
beforeAll(async () => {
  await ensureData();
  app = createApp();
});

test('GET /api/tours returns array', async () => {
  const res = await request(app).get('/api/tours');
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

test('unauth POST /api/config is unauthorized', async () => {
  const res = await request(app).post('/api/config').send({ whatsapp: '234' });
  expect(res.statusCode).toBe(401);
});

test('login with default password and POST /api/config succeeds', async () => {
  const agent = request.agent(app);
  let r = await agent.post('/admin/login').send({ password: 'devpass' });
  expect(r.statusCode).toBe(200);
  r = await agent.post('/api/config').send({ whatsapp: '2348012345678' });
  expect(r.statusCode).toBe(200);
  expect(r.body.config.whatsapp).toBe('2348012345678');
});

test('POST /api/tours with header auth works', async () => {
  const id = 't-' + Date.now();
  const res = await request(app).post('/api/tours').set('x-admin-key', 'devpass').send({ id, title: 'T1', kuulaUrl: 'https://kuula.co/post/' + id });
  expect(res.statusCode).toBe(200);
  expect(res.body.tour.id).toBe(id);
});
