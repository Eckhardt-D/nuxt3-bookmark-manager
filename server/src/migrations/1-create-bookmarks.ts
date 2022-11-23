import { DatabaseConnection } from '@databases/sqlite';
import {sql} from '../database';

export async function up(db: DatabaseConnection) {
  await db.query(sql`
    CREATE TABLE IF NOT EXISTS bookmarks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      icon_url TEXT NOT NULL,
      icon_version INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_DATE,
      updated_at DATETIME NOT NULL
    );
  `)
}

export async function down(db: DatabaseConnection) {
  await db.query(sql`DROP TABLE IF EXISTS bookmarks`)
}