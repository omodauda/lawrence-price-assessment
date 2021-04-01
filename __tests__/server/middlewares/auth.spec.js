/* 
  @jest-environment node
*/
import { async } from 'regenerator-runtime';
import { User } from '../../../src/database/models';
import { connectDb, disconnectDb } from '../../utils/connection';
// import jwt from 'jsonwebtoken';
import authMiddleware from '../../../src/middlewares/auth';
import Response from '../../utils/response';
import JWTR from 'jwt-redis';
import redis from 'redis';

const redisClient = redis.createClient();
const jwtr = new JWTR(redisClient);

describe('The jwt auth middleware', () => {

  const user = {
    email: 'auth-test@yahoo.com',
    password: 'testing'
  };

  let newUser;

  beforeAll(async() => {
    await connectDb();
    newUser = await User.create({ email: user.email, password: user.password});
  });

  afterAll(async() => {
    await disconnectDb();
  });

  it('should return a 401 if auth fails', async() => {
    const req = {
      headers: {
        authorization: ''
      }
    };

    const res = new Response();

    const statusSpy = jest.spyOn(res, 'status');
    const jsonSpy = jest.spyOn(res, 'json');
    const next = jest.fn();

    await authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(0);

    expect(statusSpy).toHaveBeenCalledWith(401);

    expect(jsonSpy).toHaveBeenCalledWith({
      status: 'fail',
      error: 'Unauthorized request'
    })
  });

  it('should call next function', async() => {

    const token = await jwtr.sign({
      iss: 'omodauda',
      sub: newUser.dataValues.id,
      iat: new Date().getTime(),
      expiresIn: '1d',
    }, process.env.JWT_SECRET);

    const authorization = `Bearer ${token}`;

    const req = {
      headers: {
        authorization
      }
    };

    const res = new Response();

    const next = jest.fn();

    await authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});