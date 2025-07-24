import 'dotenv/config';

export const getEnvVar = (name, defaultValue) => {
  const envVar = process.env[name];

  if(envVar) {
    return envVar;
  }

  if (!envVar && defaultValue) {
    return defaultValue;
  }

  throw new Error(`Environment variable ${name} is not set and no default value provided.`);
};