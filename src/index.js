import { UPLOAD_PATH } from './constants/path.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';
import { createDirNot } from './utils/validation/createDirNot.js';

(async () => {
  await initMongoConnection();
  await createDirNot(UPLOAD_PATH);
  setupServer();
})();
