import * as Bookmarks from '../../src/bookmarks';
import {initializeDatabase} from '../../src/database';

export default defineEventHandler(async (event) => {
  const {databasePath} = useRuntimeConfig();
  const database = await initializeDatabase(databasePath);
  const data = await readBody(event);
  return Bookmarks.add(database, data);
});