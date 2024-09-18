import createHttpError from 'http-errors';
import { contactModel } from '../models/contact.js';

export const getAllContacts = async () => {
  return await contactModel.find({});
};

export const getContactById = async (contactId) => {
  const contact = await contactModel.findById(contactId);
  if (!contact) {
    throw createHttpError(404, {
      status: 404,
      message: 'Contact not found',
    });
  }
  return contact;
};
