/* 
  @jest-environment node
*/
import server from '../../../src/app';
import supertest from 'supertest';
import { connectDb, disconnectDb } from '../../utils/connection';
import { async } from 'regenerator-runtime';

const app = () => supertest(server);

describe('The add money transaction', () => {

  beforeAll(async() => {
    await connectDb();
  });

  afterAll(async() => {
    await disconnectDb();
  });

  it('should add amount to user account', async() => {
    const user = {
      email: 'testadd@gmail.com',
      password: 'johndoe'
    };
    
    await app().post('/api/v1/users/signup').send({ email: user.email, password: user.password});
    const loggedUser = await app().post('/api/v1/users/login').send({ email: user.email, password: user.password});
    const token = loggedUser.body.data.token;

    const headers = {
      authorization: `Bearer ${token}`
    };

    const body = {
      amount: 300
    };

    const response = await app().post('/api/v1/account/add_money').send({ "amount": body.amount}).set(headers);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', `You've successfully credited your account with ${body.amount}`);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('balance_before');
    expect(response.body.data).toHaveProperty('balance_after');
  })
})