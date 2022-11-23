
import { DatabaseConnection, sql } from '@databases/sqlite';
import {randomUUID} from 'node:crypto';
import {z} from 'zod';

import {generateIconUrl} from './utils';

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  icon: {
    url: string;
    version: number;
  };
  createdAt: Date;
  updatedAt: Date;
}


interface BookmarkGetByIdOptions {
  id: string;
}

const bookmarkGetByIdInput = z.object({
  id: z.string(),
});

interface BookmarkAddOptions {
  url: string;
  title?: string;
  categoryId?: string;
}

const bookmarkAddOptionsInput = z.object({
  url: z.string().url(),
  title: z.string().max(255).optional(),
  categoryId: z.string().optional(),
});

interface BookmarkDeleteOptions {
  id: string;
}

const bookmarkDeleteOptionsInput = z.object({
  id: z.string()
});

interface BookmarkModel {
  id: string;
  title: string;
  url: string;
  icon_url: string;
  icon_version: number;
  created_at: string;
  updated_at: string;
}

const bookmarkModelSchema = z.object({
  id: z.string().max(100),
  title: z.string(),
  url: z.string(),
  icon_url: z.string(),
  icon_version: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
})

const fromModelToBookmark = (model: BookmarkModel): Bookmark => {
  const params = bookmarkModelSchema.parse(model);

  return {
    id: params.id,
    title: params.title,
    url: params.url,
    icon: {
      url: params.icon_url,
      version: params.icon_version,
    },
    createdAt: new Date(params.created_at),
    updatedAt: new Date(params.updated_at),
  }
}

export async function getById(db: DatabaseConnection, options: BookmarkGetByIdOptions) {
  const params = bookmarkGetByIdInput.parse(options);
  const results: BookmarkModel[] = await db.query(sql`SELECT * FROM bookmarks WHERE id = ${params.id}`);
  return fromModelToBookmark(results[0]);
}

export async function list(db: DatabaseConnection) {
  const results: BookmarkModel[] = await db.query(sql`SELECT * FROM bookmarks`);
  return results.map(fromModelToBookmark);
}

export async function add(db: DatabaseConnection,options: BookmarkAddOptions) {
  const params = bookmarkAddOptionsInput.parse(options);

  const bookmark: BookmarkModel = {
    id: randomUUID(),
    url: params.url,
    title: params.title ?? params.url,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    icon_url: generateIconUrl(params.url),
    icon_version: Date.now(),
  }

  await db.query(sql`
    INSERT INTO bookmarks (id, url, title, icon_url, icon_version, created_at, updated_at)
    VALUES (
      ${bookmark.id},
      ${bookmark.url},
      ${bookmark.title},
      ${bookmark.icon_url},
      ${bookmark.icon_version},
      ${bookmark.created_at},
      ${bookmark.updated_at}
    );
  `)

  return getById(db, {id: bookmark.id});
}

export async function deleteById(db: DatabaseConnection, options: BookmarkDeleteOptions) {
  const params = bookmarkDeleteOptionsInput.parse(options);
  await db.query(sql`DELETE FROM bookmarks WHERE id=${params.id}`);
  return true;
}