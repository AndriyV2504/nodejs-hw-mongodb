import {
  createContact,
  deleteContactById,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import { parseFilterParams } from '../utils/validation/parseFilterParams.js';
import { validatePaginationParams } from '../utils/validation/parsePaginationParams.js';
import { parseSortParams } from '../utils/validation/parseSortParams.js';

export const getContactsController = async (req, res) => {
  const { page = 1, perPage = 10 } = validatePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getAllContacts({
    userId: req.user._id,
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(req.user._id, contactId);

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const { file, body } = req;
  const contact = await createContact({
    ...body,
    userId: req.user._id,
    file,
  });

  res.status(201).send({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const { body, file } = req;
  const { contact } = await updateContact(req.user._id, contactId, {
    ...body,
    file,
  });

  res.send({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
};

export const putContactController = async (req, res) => {
  const { contactId } = req.params;
  const { body } = req;
  const { contact, isNew } = await updateContact(
    req.user._id,
    contactId,
    body,
    {
      upsert: true,
    },
  );
  const status = isNew ? 201 : 200;

  res.status(status).send({
    status,
    message: 'Successfully upserted a contact!',
    data: contact,
  });
};

export const deleteContactByIdController = async (req, res) => {
  const { contactId } = req.params;

  delete deleteContactById(req.user._id, contactId);

  res.status(204).send();
};
