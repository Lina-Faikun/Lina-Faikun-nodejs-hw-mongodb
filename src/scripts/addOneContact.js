import { readFile, writeFile } from "fs/promises";
import { PATH_DB } from "../constants/contacts.js";
import { createFakeContact } from "../utils/createFakeContact.js";


export const addOneContact = async () => {
  const data = await readFile(PATH_DB, "utf-8");
  const contacts = JSON.parse(data);

  const newContact = createFakeContact();
  contacts.push(newContact);

  await writeFile(PATH_DB, JSON.stringify(contacts, null, 2));
};

addOneContact();
