import { connect, set } from 'mongoose';
import { NODE_ENV } from '@config';

export const dbConnection = async () => {
  const dbConfig = {
    url: `mongodb+srv://${process.env.DB_HOST}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.pjtiy.mongodb.net/${process.env.DB_DATABASE}`,
  };

  if (NODE_ENV !== 'production') {
    set('debug', true);
  }

  try {
    await connect(dbConfig.url);
    console.log('DB Connected successfully to crypto-db');
  } catch (error) {
    console.error('DB Connection Error:', error.message);
    throw error;
  }
};
