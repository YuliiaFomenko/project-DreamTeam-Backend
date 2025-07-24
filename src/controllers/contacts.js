import createHttpError from 'http-errors';
import {
  createContact,
  deleteContactById,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import { parseFilterParams, parsePaginationParams, parseSortParams } from '../utils/parse-helpers.js';
import { saveFile } from '../utils/saveFile.js';

export const getAllContactsController = async (req, res) => {

  const {page, perPage} = parsePaginationParams(req.query);
  const {sortOrder, sortBy} = parseSortParams(req.query);
  const {type, isFavourite} = parseFilterParams(req.query);
  const {_id: userId} = req.user;

  const contacts = await getAllContacts({
    userId,
    page,
    perPage,
    sortOrder,
    sortBy,
    type,
    isFavourite,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;

  const contact = await getContactById(contactId, userId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {

  const photo = req.file;
  let photoUrl;

  if (photo){
    photoUrl = await saveFile(photo);
  }

  const contact = await createContact({
    ...req.body,
    userId: req.user._id,
    photo: photoUrl,
});

  return res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const photo = req.file;
  const updatedFields = {...req.body};

  if (photo){
    const photoUrl = await saveFile(photo);
    updatedFields.photo = photoUrl;
  }

  const { contact } = await updateContact(contactId, updatedFields, userId, {
    upsert: false,
  });

  return res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
};


export const deleteContactController = async(req, res) => {
  const {contactId} = req.params;
  const { _id: userId } = req.user;

  const deletedContact = await deleteContactById(contactId, userId);

  if(!deletedContact){
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};