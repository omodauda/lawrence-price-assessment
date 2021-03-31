/* 
  @jest-environment node
*/
import { async } from 'regenerator-runtime';
import { User, Account } from '../../../src/database/models';
import { connectDb, disconnectDb } from '../../utils/connection';

describe('The Account model', () => {
  const user = {
    email: 'test2@yahoo.com',
    password: 'testing'
  };

  const account = {
    balance: 100
  };

  let newUser;
  let userAccount;

  beforeAll(async() => {
    await connectDb();
    newUser = await User.create(user);
    userAccount = await Account.create({user_id: newUser.dataValues.id, balance: account.balance});
    console.log(typeof userAccount.dataValues.balance);
  });

  afterAll(async() => {
    await disconnectDb();
  });

  it("should create an account with the user_id", async()=> {
    expect(userAccount.dataValues).toHaveProperty('id');
    expect(userAccount.dataValues).toHaveProperty('user_id');
    expect(userAccount.dataValues.user_id).toBe(newUser.dataValues.id);
    expect(userAccount.dataValues).toHaveProperty('balance');
    expect(userAccount.dataValues.balance).toBe('100.00');
  });
})