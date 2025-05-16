import { readFile } from "fs/promises";
import { PATH_DB } from "../constants/contacts.js";

export const countContacts = async () => {
  const data = await readFile(PATH_DB, "utf-8");
  const contacts = JSON.parse(data);
  return contacts.length;
};

console.log(await countContacts());
 