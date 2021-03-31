/* 
  @jest-environment node
*/
import server from '../../../src';
import { connectDb, disconnectDb } from '../../utils/connection';
import supertest from 'supertest';

const app = () => supertest(server);

describe('The register user route', () => {

  beforeAll(async() => {
    await connectDb();
  });

  afterAll(async() => {
    await disconnectDb();
  });

  it('should register a new user', async() => {
    const user = {
      email: 'johndoe@yahoo.com',
      password: 'johndoe'
    };
    const response = await app().post('/api/v1/users/signup').send(user);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'user registered successfully');
  });

  it('should return 400 for existing email', async() => {
    const user = {
      email: 'johndoe@yahoo.com',
      password: 'johndoe'
    };

    const response = await app().post('/api/v1/users/signup').send(user);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('status', 'fail');
    expect(response.body).toHaveProperty('error', `user with email ${user.email} already exist`);
  });

  it('should return 400 if any field is empty', async() => {
    const user = {
      email: '',
      password: ''
    };

    const response = await app().post('/api/v1/users/signup').send(user);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('status', 'fail');
    expect(response.body).toHaveProperty('error', 'email cannot be an empty field');
  });
})