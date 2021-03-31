import dotenv from 'dotenv';
import express from 'express';
import regeneratorRuntime from 'regenerator-runtime';
import { sequelize } from './database/models';
import router from './routes';

dotenv.config();

const app = express();
const { PORT } = process.env;
const ENV = process.env.NODE_ENV;

app.use(express.json());
app.use('/api/v1/', router);

app.listen(PORT, async () => {
  if (ENV === 'development') {
    console.log(`app is running on port ${PORT}`);
    try {
      await sequelize.authenticate();
      console.log('Database connection established');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }
});

export default app;
