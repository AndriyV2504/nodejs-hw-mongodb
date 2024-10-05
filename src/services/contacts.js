import createHttpError from 'http-errors';
import { contactModel } from '../models/contact.js';
import { createPaginationData } from '../validation/createPagination.js';

export const getAllContacts = async ({
  userId,
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  filter = {},
}) => {
  const skip = (page - 1) * perPage;
  const contactsQuery = contactModel.find({ userId });

  if (filter.type) {
    contactsQuery.where('contactType').equals(filter.type);
  }

  if (filter.isFavorite || filter.isFavorite === false) {
    contactsQuery.where('isFavorite').equals(filter.isFavorite);
  }

  const [count, contacts] = await Promise.all([
    contactModel.find().merge(contactsQuery).countDocuments(),
    contactModel
      .find()
      .merge(contactsQuery)
      .skip(skip)
      .limit(perPage)
      .sort({
        [sortBy]: sortOrder,
      }),
  ]);

  return {
    data: contacts,
    totalItems: count,
    pagination: createPaginationData(count, page, perPage),
  };
};

export const getContactById = async (userId, contactId) => {
  const contact = await contactModel.findById({ _id: contactId, userId });
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
