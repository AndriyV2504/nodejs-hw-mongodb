import { contactModel } from '../models/contact.js';

export const getAllContacts = async () => {
  return await contactModel.find({});
};

export const getContactById = async (contactId) => {
  return await contactModel.findById(contactId);
};
