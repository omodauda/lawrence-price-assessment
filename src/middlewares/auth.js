import JWTR from 'jwt-redis';
import redis from 'redis';
import { User } from '../database/models';

const REDIS_PORT = process.env.REDISCLOUD_URL || 6379;

const redisClient = redis.createClient(REDIS_PORT);
const jwtr = new JWTR(redisClient);

// eslint-disable-next-line consistent-return
export default async (req, res, next) => {
  if (!req.headers.authorization) {
    return res
      .status(401)
      .json({
        status: 'fail',
        error: 'Unauthorized request',
      });
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = await jwtr.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.sub);
    req.user.jti = decoded.jti;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({
        status: 'fail',
        error: 'Unauthorized request',
      });
  }
};
