/* 
  @jest-environment node
*/
import server from '../../../src/app';
import supertest from 'supertest';
import { connectDb, disconnectDb } from '../../utils/connection';
import { async } from 'regenerator-runtime';

const app = () => supertest(server);

describe('The send money route', () => {
  beforeAll(async() => {
    await connectDb();
  });

  afterAll(async() => {
    await disconnectDb();
  });

  it('should complete a transfer', async() => {
    const user1 = {
      email: 'user1@gmail.com',
      password: 'johndoe'
    };

    const user2 = {
      email: 'user2@gmail.com',
      password: 'johndoe'
    };

    await app().post('/api/v1/users/signup').send({ email: user1.email, password: user1.password});
    await app().post('/api/v1/users/signup').send({ email: user2.email, password: user2.password});
    const loggedUser = await app().post('/api/v1/users/login').send({ email: user1.email, password: user1.password});
    const token = loggedUser.body.data.token;

    const headers = {
      authorization: `Bearer ${token}`
    };

    const body = {
      amount: 500
    };

    const secondUser = await app().post('/api/v1/users/login').send({ email: user2.email, password: user2.password});
    await app().post('/api/v1/account/add_money').send({ "amount": body.amount}).set(headers);
    const response = await app().post('/api/v1/account/send_money').send({ "amount": 200, "receiver_account_id":  secondUser.body.data.user_id }).set(headers);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'Transfer successful');
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('balance_before');
    expect(response.body.data).toHaveProperty('balance_after');
  })
})