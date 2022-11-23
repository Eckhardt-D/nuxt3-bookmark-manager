import * as Bookmarks from '../../src/bookmarks';
import {initializeDatabase} from '../../src/database';

export default defineEventHandler(async (event) => {
  const {databasePath} = useRuntimeConfig();
  const database = await initializeDatabase(databasePath);
  const {id} = event.context.params;
  return Bookmarks.getById(database, { id });
});