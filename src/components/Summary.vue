<template>
  <div class="summary-page">
    <!-- Top navbar -->
    <header class="top-nav">
      <img src="/pink-paw.png" alt="Paw" class="logo-icon" />
      <h3>Paws & Preferences</h3>
    </header>

    <!-- Main content -->
    <main class="summary-content">
      <!-- Header -->
      <header class="summary-header">
        <h1>
          You liked <span>{{ likedCats.length }}</span> cats
        </h1>
        <p class="subtitle">
          {{ likedCats.length
            ? "Here are your top feline matches 😻"
            : "No matches this time… you sure are picky 😼" }}
        </p>
      </header>

      <!-- Empty state -->
      <div v-if="likedCats.length === 0" class="empty-state">
        <p>Swipe differently next time!</p>
      </div>

      <!-- Liked cats -->
      <section v-else class="cats-grid">
        <div
          v-for="cat in likedCats"
          :key="cat.id"
          class="cat-card-summary"
        >
          <img :src="cat.url" alt="Liked cat" />
          <div class="card-footer">
            <span
              v-for="tag in cat.tags"
              :key="tag"
              class="tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </section>
    </main>

    <!-- Sticky bottom button -->
    <footer class="summary-footer">
      <button class="primary-btn" @click="goHome">
        {{ likedCats.length > 0 ? 'Start Over' : 'Try Again' }}
      </button>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

interface Cat {
  id: string;
  url: string;
  tags: string[];
}

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();

    const likedCatsRaw: Cat[] = JSON.parse(route.query.liked as string || "[]");

    const likedCats = computed(() =>
      likedCatsRaw.map((cat: Cat) => ({
        ...cat,
        tags: cat.tags && cat.tags.length ? cat.tags : ["mysterious kitty"]
      }))
    );

    const goHome = () => router.push("/");

    return { likedCats, goHome };
  }
});
</script>

<style>
.summary-page {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--bg-main);
  color: var(--text-primary);
}

/* Top navbar */
.top-nav {
  top: 0;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 12px;
  border-bottom: 1px solid var(--border-subtle);
  background: var(--bg-main);
  font-weight: bold;
  font-size: 18px;
  position: sticky;
}

.logo-icon {
  width: 24px;
  height: 24px;
}

/* Main scrollable content */
.summary-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 16px;
  align-content: center;
}

/* Summary header */
.summary-header {
  text-align: center;
  margin-bottom: 24px;
}

.summary-header h1 {
  font-size: 24px;
  margin: 0;
}

.summary-header h1 span {
  color: var(--accent-like);
}

.subtitle {
  margin-top: 8px;
  font-size: 14px;
  color: var(--text-secondary);
}

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-align: center;
  margin-top: 40px;
}

.empty-icon {
  width: 64px;
  opacity: 0.6;
}

/* Cats grid */
.cats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (min-width: 768px) {
  .cats-grid {
    grid-template-columns: repeat(3, 1fr);
    max-width: 900px;
    margin: 0 auto;
  }
}

.cat-card-summary {
  background: var(--bg-card);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: var(--shadow-card);
}

.cat-card-summary img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.card-footer {
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  background: rgba(255, 255, 255, 0.08);
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}

/* Sticky bottom button */
.summary-footer {
  padding: 16px;
  border-top: 1px solid var(--border-subtle);
  background: var(--bg-main);
  position: sticky;
  bottom: 0;
}

.primary-btn {
  width: 100%;
  padding: 14px;
  font-size: 16px;
  font-weight: bold;
  background: var(--accent-like);
  color: white;
  border: none;
  border-radius: 14px;
  cursor: pointer;
}

.primary-btn:active {
  transform: scale(0.97);
}
</style>
