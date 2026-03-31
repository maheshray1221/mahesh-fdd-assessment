const request = require('supertest');
const app = require('../server');

// NOTE: These tests run against a live MongoDB instance.
// Set MONGO_URI in your .env before running npm test.

const testUser = {
  name: 'Test User',
  email: `test_${Date.now()}@example.com`,
  password: 'password123',
};

let authToken = '';
let taskId = '';

describe('Auth Endpoints', () => {
  it('POST /api/auth/register — should return 201 on successful registration', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.statusCode).toBe(201);          // Bug 4: controller returns 200
    expect(res.body).toHaveProperty('token');
    authToken = res.body.token;
  });

  it('POST /api/auth/login — should return 200 and a token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    authToken = res.body.token;                // refresh token for downstream tests
  });

  it('POST /api/auth/login — should return 401 for wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'wrongpassword' });
    expect(res.statusCode).toBe(401);
  });
});

describe('Task Endpoints (require valid auth)', () => {
  it('POST /api/tasks — should create a task and return 201', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)   // Bug 3: token will be rejected
      .send({ title: 'Fix the login bug', priority: 'high' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    taskId = res.body._id;
  });

  it('GET /api/tasks — should return array of tasks', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('PUT /api/tasks/:id — should update status to in-progress', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ status: 'in-progress' });           // Bug 2: controller reads 'state' not 'status'
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('in-progress');  // will remain 'pending'
  });

  it('DELETE /api/tasks/:id — should delete the task and return 200', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);             // Bug 5: missing await causes crash
  });
});

describe('User Endpoints', () => {
  it('GET /api/users/profile — should return user profile', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email');
  });
});
