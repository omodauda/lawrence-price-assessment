import { v4 as uuidv4 } from 'uuid';
import { Account, Transaction, sequelize } from '../database/models';
import { errorMsg, successMsg } from '../utils/response';

export default class TransactionController {
  static async addMoney(req, res) {
    try {
      const { amount } = req.body;

      const account = await Account.findOne({ where: { user_id: req.user.id } });

      const result = await sequelize.transaction(async (t) => {
        await Account.increment(
          { balance: amount }, { where: { user_id: req.user.id } }, { transaction: t },
        );

        await Transaction.create({
          account_id: account.id,
          transaction_type: 'credit',
          amount,
          balance_before: Number(account.balance),
          balance_after: Number(account.balance) + Number(amount),
        }, {
          transaction: t,
        });

        const afterCredit = await Account.findOne({ where: { user_id: req.user.id } });

        const data = {
          balance_before: Number(account.balance),
          balance_after: Number(afterCredit.balance),
        };

        return successMsg(res, 200, `You've successfully credited your account with ${amount}`, data);
      });

      return result;
    } catch (error) {
      return errorMsg(res, 500, 'Internal server error');
    }
  }

  static async sendMoney(req, res) {
    try {
      const { amount, receiver_account_id } = req.body;
      const account = await Account.findOne({ where: { user_id: req.user.id } });
      const receipient_account = await Account.findOne({ where: { id: receiver_account_id } });

      if (receiver_account_id === req.user.id) {
        return errorMsg(res, 400, 'You cannot send money to yourself');
      }

      if (!receipient_account) {
        return errorMsg(res, 400, `account with id ${receiver_account_id} does not exist`);
      }

      if (Number(account.balance) < amount) {
        return errorMsg(res, 400, 'Insufficient balance');
      }

      const result = await sequelize.transaction(async (t) => {
        // debit sender
        await Account.decrement(
          { balance: amount }, { where: { user_id: req.user.id } }, { transaction: t },
        );

        // create debit tnx
        await Transaction.create({
          account_id: account.id,
          transaction_type: 'debit',
          amount,
          balance_before: Number(account.balance),
          balance_after: Number(account.balance) - Number(amount),
        }, {
          transaction: t,
        });

        // credit receipient
        await Account.increment(
          { balance: amount }, { where: { user_id: receipient_account.id } }, { transaction: t },
        );

        // create credit tnx
        await Transaction.create({
          account_id: receiver_account_id,
          transaction_type: 'credit',
          amount,
          balance_before: Number(receipient_account.balance),
          balance_after: Number(receipient_account.balance) + Number(amount),
        }, {
          transaction: t,
        });

        const afterDebit = await Account.findOne({ where: { user_id: req.user.id } });

        const data = {
          balance_before: Number(account.balance),
          balance_after: Number(afterDebit.balance),
        };

        return successMsg(res, 200, 'Transfer successful', data);
      });
      return result;
    } catch (error) {
      return errorMsg(res, 500, error.message);
    }
  }
}
