import { DatabaseConnection } from '@databases/sqlite';
import {up as bookmarksUp} from './1-create-bookmarks';

export async function init(db: DatabaseConnection) {
  await bookmarksUp(db);
}