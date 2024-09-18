import { Router } from 'express';
import { getAllContacts, getContactById } from '../services/contacts.js';

const contactsRouter = Router();

contactsRouter.get('/', async (req, res) => {
  const contacts = await getAllContacts();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts',
    data: contacts,
  });
});

contactsRouter.get('/:contactId', async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
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

export default contactsRouter;
