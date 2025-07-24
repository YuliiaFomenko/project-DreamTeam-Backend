import createHttpError from "http-errors";
import { Contact } from "../db/models/contact.js";
import { createPaginationMetaData } from "../utils/createPaginationMetaData.js";

export const getAllContacts = async ({userId, page, perPage, sortBy, sortOrder, type, isFavourite }) => {
  const skip = (page - 1) * perPage;

  const filteredContactsQuery = Contact.find({ userId });

  if (type) {
    filteredContactsQuery.where('contactType').equals(type);
  }
  if ( typeof isFavourite === 'boolean') {
    filteredContactsQuery.where('isFavourite').equals(isFavourite);
  }

  const [contacts, contactsCount] = await Promise.all([
    Contact.find()
      .merge(filteredContactsQuery)
      .skip(skip)
      .limit(perPage)
      .sort({
        [sortBy]: sortOrder,
      }),
    Contact.find().merge(filteredContactsQuery).countDocuments(),
  ]);

  const metaData = createPaginationMetaData(page, perPage, contactsCount);

  return {
    data: contacts,
    ...metaData,
  };
}; 

export const getContactById = async(contactId, userId) => {
  const contact = await Contact.findOne({_id: contactId, userId});
  return contact;
};

export const createContact = async(payload) => {
  const contact = await Contact.create(payload);
  return contact;
};

export const updateContact = async (contactId, payload, userId, options) => {
  const result = await Contact.findOneAndUpdate({ _id: contactId, userId}, payload, {
    ...options,
    new: true,
    includeResultMetadata: true,
  });

  if (!result.value) {
    throw createHttpError(404, 'Contact not found');
  }

  return {
    contact: result.value,
    isNew: !result.lastErrorObject.updatedExisting,
  };
};

export const deleteContactById = async (contactId, userId) => {
  const deletedContact = await Contact.findOneAndDelete({_id: contactId, userId});

  return deletedContact;
};