/* 
  @jest-environment node
*/
import server from '../../../src';
import { connectDb, disconnectDb } from '../../utils/connection';
import supertest from 'supertest';
import { async } from 'regenerator-runtime';

const app = () => supertest(server);

describe('The login user route', () => {

  beforeAll(async() => {
    await connectDb();
  });

  afterAll(async() => {
    await disconnectDb();
  });

  it('should login a registered user', async() => {
    const user = {
      email: 'testlogin@yahoo.com',
      password: 'johndoe'
    };
    
    await app().post('/api/v1/users/signup').send({ email: user.email, password: user.password});
    const response = await app().post('/api/v1/users/login').send({ email: user.email, password: user.password});


    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'login successful');
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('token');
    expect(response.body.data).toHaveProperty('user_id');
    expect(response.body.data).toHaveProperty('user_email', user.email);
    expect(response.body.data).toHaveProperty('createdAt');
    expect(response.body.data).toHaveProperty('balance');
    expect(response.body.data).toHaveProperty('balance_updatedAt');
    expect(response.body.data).toHaveProperty('Transactions');
    // expect(response.body.data.Transaction).toEqual(expect.any(Array))
  })
})