import * as Bookmarks from "../../src/bookmarks";
import { initializeDatabase } from "../../src/database";

export default defineEventHandler(async () => {
	const { databasePath } = useRuntimeConfig();
	const database = await initializeDatabase(databasePath);
	return Bookmarks.list(database);
});
