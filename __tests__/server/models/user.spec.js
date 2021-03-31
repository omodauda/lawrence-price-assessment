/* 
  @jest-environment node
*/
import { async } from 'regenerator-runtime';
import { User } from '../../../src/database/models';
import { connectDb, disconnectDb } from '../../utils/connection';
import bcrypt from 'bcryptjs';

describe('The User model', () => {

  const user = {
    email: 'test@yahoo.com',
    password: 'testing'
  };

  let newUser;

  beforeAll(async() => {
    await connectDb();
    newUser = await User.create(user);
  });

  afterAll(async() => {
    await disconnectDb();
  });

  it('should hash user password before saving', async() => {
    expect(newUser.dataValues.password).not.toMatch('testing');
  });

  it('confirm saved data values', async() => {
    expect(newUser.dataValues).toHaveProperty('id');
    expect(newUser.dataValues.email).toBe('test@yahoo.com');
    expect(bcrypt.compareSync(user.password, newUser.dataValues.password)).toBe(true);
  });
})