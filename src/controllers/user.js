import { async } from 'regenerator-runtime';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  User, Account, Transaction, sequelize,
} from '../database/models';
import { errorMsg, successMsg } from '../utils/response';

const signToken = (user) => jwt.sign({
  iss: 'omodauda',
  sub: user.id,
  iat: new Date().getTime(),
  expiresIn: '1d',
}, process.env.JWT_SECRET);

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

  static async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return errorMsg(res, 400, `user with email ${email} not registered`);
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return errorMsg(res, 400, 'Invalid password');
      }

      const account = await Account.findOne({ where: { user_id: user.id }, include: Transaction });

      const { id, email: user_email, createdAt } = user;
      const { balance, updatedAt: balance_updatedAt, Transactions } = account;

      const token = signToken(user);

      const data = {
        user_id: id,
        user_email,
        createdAt,
        balance,
        balance_updatedAt,
        Transactions,
      };

      return successMsg(res, 200, 'login successful', { token, ...data });
    } catch (error) {
      return errorMsg(res, 500, 'internal server error');
    }
  }
}