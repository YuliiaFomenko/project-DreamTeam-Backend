import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { getEnvVar } from './utils/getEnvVar.js';
import { ENV_VARS } from './constants/envVars.js';
import { errorHandlerMiddleware } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import router from './routers/index.js';
import cookieParser from 'cookie-parser';
import { PERMANENT_UPLOAD_DIR } from './constants/paths.js';
import { setupSwagger } from './middlewares/swagger.js';

export const setupServer = () => {
  const app = express();

  app.use(
    cors({
      origin: [
        'http://localhost:5173',
        'https://project-dream-team-frontend.vercel.app',
      ],
      credentials: true,
    }),
  );
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  app.use(cookieParser());

  app.use(express.json());

  app.use('/api-docs', setupSwagger());

  app.use('/uploads', express.static(PERMANENT_UPLOAD_DIR));

  app.use(router);

  app.use(notFoundHandler);

  app.use(errorHandlerMiddleware);

  const PORT = getEnvVar(ENV_VARS.PORT, 3000);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
