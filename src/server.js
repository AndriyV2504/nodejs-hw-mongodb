import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import { ENV_VARS } from './constants/index.js';
import {
  notFoundMiddleware,
  errorHandlerMiddleware,
} from './middlewares/index.js';
import { contactService } from './services/contacts.js';

const PORT = env(ENV_VARS.PORT, 3000);

export const setupServer = () => {
  const app = express();
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

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

  app.get('/contacts', async (req, res) => {
    const contacts = await contactService.getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts',
      data: contacts,
    });
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;
    const contact = await contactService.getContactById(contactId);
    if (!contact) {
      return res.status(404).json({
        message: 'Contact not found',
      });
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  });

  app.use(notFoundMiddleware);

  app.use(errorHandlerMiddleware);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
