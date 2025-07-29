import mongoose from 'mongoose';
import { getEnvVar } from '../utils/getEnvVar.js';
import { ENV_VARS } from '../constants/envVars.js';

export const initMongoConnection = async () => {
  const user = getEnvVar(ENV_VARS.MONGODB_USER);
  const password = getEnvVar(ENV_VARS.MONGODB_PASSWORD);
  const url = getEnvVar(ENV_VARS.MONGODB_URL);
  const db = getEnvVar(ENV_VARS.MONGODB_DB);

  const uri = `mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster3`;

  try {
    await mongoose.connect(uri);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
