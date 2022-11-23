<script lang="ts" setup>
import { type Bookmark } from "~/server/src/bookmarks";

const bookmarkUrl = ref("");

const { data: bookmarks, pending } = await useAsyncData(() =>
  $fetch("/api/bookmarks")
);

const addBookmark = async () => {
  const bookmark = await $fetch("/api/bookmarks", {
    method: "post",
    body: {
      url: bookmarkUrl.value,
    },
  });

  if (bookmarks.value === null) return;

  bookmarks.value = [...(bookmarks.value as Bookmark[]), bookmark as Bookmark];
  bookmarkUrl.value = "";
};
</script>

<template>
  <div>
    <form class="form" @submit.prevent>
      <label for="url">Bookmark Manager</label>
      <input
        v-model="bookmarkUrl"
        placeholder="https://superdense.com"
        type="url"
        name="url"
        id="url"
      />
      <button @click="addBookmark">Add</button>
    </form>

    <div v-if="pending">Loading...</div>
    <div v-else-if="(bookmarks as Bookmark[]).length > 0">
      <ul class="bookmark-list">
        <li
          class="bookmark-item"
          v-for="bookmark in (bookmarks as Bookmark[])"
          :key="bookmark.id"
        >
          <a class="bookmark-link" :href="bookmark.url" target="_blank">
            <img width="24" height="24" :src="bookmark.icon.url" />
            {{ bookmark.url }}
          </a>
        </li>
      </ul>
    </div>
    <div v-else style="text-align: center; margin-top: 50px">
      No bookmarks added yet...
    </div>
  </div>
</template>

<style>
:root {
  --font-smaller: 0.75rem;
}

html {
  font-family: sans-serif;
  background: rgb(10, 14, 36);
  color: white;
}

.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 450px;
  margin-inline: auto;
  gap: 10px;
  text-align: center;
}

.bookmark-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-width: 750px;
  margin-inline: auto;
  margin-top: 50px;
  max-height: 225px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

.bookmark-list .bookmark-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-block: 5px;
  font-size: var(--font-smaller);
}

.bookmark-list .bookmark-link {
  display: inherit;
  align-items: inherit;
  gap: inherit;
  text-decoration: none;
  color: white;
}

.bookmark-list .bookmark-item img {
  aspect-ratio: 1;
  border-radius: 100%;
  transition: 100ms all linear;
}

.bookmark-list .bookmark-item:hover img {
  border-radius: 3px;
  scale: 1.05;
}

input,
button {
  border-radius: 3px;
  padding: 6px;
  border: none;
}
</style>
