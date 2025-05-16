import { createFakeContact } from "../utils/createFakeContact.js";
import { readContacts } from "../utils/readContacts.js";
import { writeContacts } from "../utils/writeContacts.js";

const generateContacts = async (number) => {
  try {
    const contacts = await readContacts();

    for (let i = 0; i < number; i++) {
      const newContact = createFakeContact();
      contacts.push(newContact);
    }

    await writeContacts(contacts);
    console.log(`${number} контакт(ів) успішно додано.`);
  } catch (error) {
    console.error("Помилка при створенні контактів:", error.message);
  }
};

generateContacts(5);
