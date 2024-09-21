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

export const createContact = async (payload) => {
  return await contactModel.create(payload);
};

export const updateContact = async (contactId, payload, options = {}) => {
  const rawResult = await contactModel.findByIdAndUpdate(contactId, payload, {
    new: true,
    includeResultMetadata: true,
    ...options,
  });
  if (!rawResult.value) {
    throw createHttpError(404, {
      status: 404,
      message: 'Contact not found',
    });
  }
  return {
    contact: rawResult.value,
    isNew: !rawResult.lastErrorObject.updatedExisting,
  };
};

export const deleteContactById = async (contactId) => {
  await contactModel.findOneAndDelete(contactId);
};
