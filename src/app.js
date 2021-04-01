import dotenv from 'dotenv';
import express from 'express';
import { sequelize } from './database/models';
import router from './routes';

dotenv.config();

const app = express();
const ENV = process.env.NODE_ENV;

app.use(express.json());
app.use('/api/v1/', router);

async function init_db() {
  if (ENV === 'development') {
    try {
      await sequelize.authenticate();
      console.log('Database connection established');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }
}

init_db();

export default app;
