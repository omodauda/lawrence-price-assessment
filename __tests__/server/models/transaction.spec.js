/* 
  @jest-environment node
*/
import { async } from 'regenerator-runtime';
import { User, Account, Transaction } from '../../../src/database/models';
import { connectDb, disconnectDb } from '../../utils/connection';

describe('The Transaction model', () => {
  const user = {
    email: 'test3@yahoo.com',
    password: 'testing'
  };

  const account = {
    balance: 100
  };

  const transaction = {
    transaction_type: 'credit',
    reference: '98e0350f-ed09-46b0-83d7-8a135afeaf84',
    amount: 100,
    balance_before: 0,
    balance_after: 100,
    narration: 'top-up my balance'
  };

  let newUser;
  let userAccount;
  let newTxn;

  beforeAll(async() => {
    await connectDb();
    newUser = await User.create(user);
    userAccount = await Account.create({user_id: newUser.dataValues.id, balance: account.balance});
    newTxn = await Transaction.create({account_id: userAccount.dataValues.id, ...transaction});
  });

  afterAll(async() => {
    await disconnectDb();
  });

  it('should create a transaction with account_id', async() => {
    expect(newTxn.dataValues).toHaveProperty('id');
    expect(newTxn.dataValues).toHaveProperty('transaction_type');
    expect(newTxn.dataValues.transaction_type).toBe('credit');
    expect(newTxn.dataValues).toHaveProperty('reference');
    expect(newTxn.dataValues.reference).toBe(transaction.reference);
    expect(newTxn.dataValues).toHaveProperty('amount');
    expect(newTxn.dataValues.amount).toBe('100.00');
    expect(newTxn.dataValues).toHaveProperty('balance_before');
    expect(newTxn.dataValues.balance_before).toBe('0.00');
    expect(newTxn.dataValues).toHaveProperty('balance_after');
    expect(newTxn.dataValues.balance_after).toBe('100.00');
    expect(newTxn.dataValues).toHaveProperty('narration');
    expect(newTxn.dataValues.narration).toBe(transaction.narration);
  })
})