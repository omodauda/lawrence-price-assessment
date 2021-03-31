import { async } from 'regenerator-runtime';
import { User, Account, sequelize } from '../database/models';
import { errorMsg, successMsg } from '../utils/response';

export default class UserController {
  static async registerUser(req, res) {
    try {
      const { email, password } = req.body;

      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        return errorMsg(res, 400, `user with email ${email} already exist`);
      }

      const result = await sequelize.transaction(async (t) => {
        const newUser = await User.create({ email, password }, { transaction: t });
        const userAccount = await Account.create(
          {
            user_id: newUser.id,
            balance: 0,
          },
          { transaction: t },
        );
        return successMsg(res, 200, 'user registered successfully');
      });
      return result;
    } catch (error) {
      return errorMsg(res, 500, 'internal server error');
    }
  }
}
