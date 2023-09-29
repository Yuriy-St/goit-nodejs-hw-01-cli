const fs = require('fs/promises');
const { nanoid } = require('nanoid');
const path = require('path');

const conatctsPath = path.join(__dirname, 'db/contacts.json');

/**
 * Gets all contacts from the db
 * @returns {Array} array of contacts
 */
async function listContacts() {
  const contactsList = await fs.readFile(conatctsPath, 'utf-8');
  return JSON.parse(contactsList);
}

/**
 * Gets a contact by Id
 * @param {string} contactId
 * @returns {object|string} contact or message if not found
 */
async function getContactById(contactId) {
  const contactList = await listContacts();
  const contact = contactList.find(item => item.id === contactId);
  if (!contact) return 'Contact not found';
  return contact;
}

/**
 * Delets contact by Id from the db
 * @param {string} contactId
 * @returns {object|null} deleted contact or null if contact not exists
 */
async function removeContact(contactId) {
  const contacts = await listContacts();
  const idx = contacts.findIndex(contact => contact.id === contactId);
  if (idx === -1) return null;
  const [removedContact] = contacts.splice(idx, 1);
  await updateContactList(contacts);
  return removedContact;
}

/**
 * Adds a contact to the db
 * @param {Object} contact - the contact to be added to the db
 * @param {string} contact.name - the name of the contact
 * @param {string} contact.email - the email of the contact
 * @param {string} contact.phone - the phone of the contact
 * @returns {Object} new contact
 */
async function addContact({ name, email, phone }) {
  const contacts = await listContacts();
  const newContact = { id: nanoid(), name, email, phone };
  contacts.push(newContact);
  await updateContactList(contacts);
  return newContact;
}

/**
 * Helper to update contacts list in the db
 * @param {Array} contactList
 */
async function updateContactList(contactList) {
  await fs.writeFile(conatctsPath, JSON.stringify(contactList, null, 2));
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
