import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

export const setupServer = () => {
  const app = express();
  app.use(pino);
  app.use(cors());

  const PORT = 3000;

  app.use(express.json());

  app.use('*', (req, res, next) => {
    console.log('First middlware');
    next();
  });

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello world',
    });
  });

  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
    next();
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
