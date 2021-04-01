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
      return errorMsg(res, 500, error.message);
    }
  }
}
