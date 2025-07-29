import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';
// import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
// import { TEMP_UPLOAD_DIR, PERMANENT_UPLOAD_DIR } from './constants/paths.js';

await initMongoConnection();
// createDirIfNotExists(TEMP_UPLOAD_DIR);
// createDirIfNotExists(PERMANENT_UPLOAD_DIR);
setupServer();
