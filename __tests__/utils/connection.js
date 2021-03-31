import { async } from 'regenerator-runtime';
import {sequelize} from '../../src/database/models';

async function connectDb() {
  try{
    await sequelize.authenticate();
    console.log('Successfully connected to test db');
    await sequelize.sync({ force: true});
  } catch(error) {
    // console.error('Unable to connect to the database:', error);
  }
};

async function disconnectDb() {
  try{
    await sequelize.close();
    console.log('Connection to test db closed');
  } catch (error){
    // console.error('Unable to close test DB connection:', error);
  }
}

export {
  connectDb,
  disconnectDb
}