<template>
  <div class="home-view">
    <!-- Top navigation bar -->
    <header class="top-nav">
      <img src="/pink-paw.png" alt="Paw" class="logo-icon" />
      <h4>Paws & Preferences</h4>
    </header>

    <!-- Card area -->
    <main class="card-area">
      <!-- Instruction / loading screen -->
      <div v-if="showInstructions" class="loading-screen">
        <p class="loading-title">Welcome to Paws & Preferences 🐾</p>
        <p class="loading-instruction">Swipe right to like, left to pass 😺</p>

        <!-- Loading bar while loading -->
<div v-if="loading" class="loading-bar-container">
  <div
    class="loading-bar"
    :style="{ width: (loadedCount / total * 100) + '%' }"
  ></div>
</div>

        <!-- Show progress -->
        <p v-if="loading" class="loading-progress">
          Loading images: {{ loadedCount }}/{{ total }}
        </p>

        <!-- Start button appears only after all images loaded -->
        <button 
          v-if="!loading" 
          class="start-btn" 
          @click="showInstructions = false"
        >
          Start Swiping!
        </button>
      </div>

      <!-- Cat cards -->
      <div v-else>
        <!-- Progress bar -->
        <div class="progress-wrapper">
          <div class="progress-bar-container">
            <div
              class="progress-bar"
              :style="{ width: progressPercentage + '%' }"
            ></div>
          </div>
          <span class="progress-text">
            {{ total - cats.length }}/{{ total }}
          </span>
        </div>

        <!-- Cat stack -->
        <div class="card-viewport">
          <div class="card-stack">
            <CatCard
              v-for="(cat, index) in cats"
              :key="cat.id"
              :src="cat.url"
              :tags="cat.tags"
              :zIndex="cats.length - index"
              @swipe="handleSwipe(index, $event)"
            />
          </div>
        </div>
      </div>
    </main>

    <!-- Bottom action buttons -->
    <footer class="action-buttons">
      <button @click="undo" :disabled="!history.length">
        <img src="/yellow-undo.png" alt="Undo" />
      </button>

      <button @click="swipeLeft" :disabled="!cats.length">
        <img src="/purple-close.png" alt="Dislike" />
      </button>

      <button @click="swipeRight" :disabled="!cats.length">
        <img src="/pink-heart.png" alt="Like" />
      </button>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import CatCard from "../components/CatCard.vue";
import { useRouter } from "vue-router";

export default defineComponent({
  components: { CatCard },
  setup() {
    const total = 15;
    const cats = ref<{ id: string; tags: string[]; url: string }[]>([]);
    const liked = ref<{ id: string; tags: string[]; url: string }[]>([]);
    const history = ref<
      { cat: { id: string; tags: string[]; url: string }; direction: string }[]
    >([]);
    const loading = ref(true);             // API / image loading
    const showInstructions = ref(true);    // Instruction screen
    const loadedCount = ref(0);            // Track number of images loaded
    const router = useRouter();

    onMounted(async () => {
      // Fetch all cats
      const requests = Array.from({ length: total }, () =>
        fetch("https://cataas.com/cat?json=true").then(res => res.json())
      );
      const results = await Promise.all(requests);

      cats.value = results.map(data => ({
        id: data.id,
        tags: data.tags || [],
        url: `https://cataas.com/cat/${data.id}?width=400&height=600`,
      }));

      // Preload images with progress
      await Promise.all(
        cats.value.map(cat => {
          return new Promise<void>((resolve) => {
            const img = new Image();
            img.src = cat.url;
            img.onload = () => {
              loadedCount.value++;
              resolve();
            };
            img.onerror = () => resolve(); // resolve even if failed
          });
        })
      );

      // All images loaded
      loading.value = false;
    });

    const handleSwipe = (index: number, direction: string) => {
      const cat = cats.value[index];
      if (!cat) return;

      if (direction === "right") liked.value.push(cat);

      history.value.push({ cat, direction });
      cats.value.splice(index, 1);

      if (!cats.value.length) {
        router.push({
          name: "Summary",
          query: { liked: JSON.stringify(liked.value) },
        });
      }
    };

    const undo = () => {
      if (!history.value.length) return;
      const last = history.value.pop()!;
      cats.value.unshift(last.cat);

      if (last.direction === "right") {
        liked.value = liked.value.filter((c) => c.id !== last.cat.id);
      }
    };

    const swipeLeft = () => {
      if (cats.value.length) handleSwipe(0, "left");
    };

    const swipeRight = () => {
      if (cats.value.length) handleSwipe(0, "right");
    };

    const progressPercentage = computed(
      () => ((total - cats.value.length) / total) * 100
    );

    return {
      cats,
      total,
      history,
      undo,
      swipeLeft,
      swipeRight,
      handleSwipe,
      progressPercentage,
      loading,
      showInstructions,
      loadedCount,
    };
  },
});
</script>

<style>
.home-view {
  min-height: 100svh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-main);
  color: var(--text-primary);
}

.top-nav {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: left;
  gap: 8px;
  font-weight: bold;
  font-size: 18px;
  border-bottom: 1px solid var(--border-subtle);
  padding-left: 8px;
}

.logo-icon {
  width: 24px;
  height: 24px;
}

.card-area {
  flex: 1;
  position: relative;
  width: 100vw;
  margin: 0 auto;
  overflow: hidden;
}

.progress-wrapper {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 24px);
  max-width: 380px;
  z-index: 100;
}

.progress-bar-container {
  width: 100%;
  height: 8px;
  background: var(--border-subtle);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: var(--accent-like);
  transition: width 0.25s ease;
}

.progress-text {
  font-size: 12px;
  margin-top: 4px;
  color: var(--text-secondary);
}

.card-stack {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (min-width: 768px) {
  .card-stack {
    max-width: 420px;
    margin: 0 auto;
  }
}

.action-buttons {
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  border-top: 1px solid var(--border-subtle);
}

.action-buttons button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  font-size: 26px;
  background: var(--bg-surface);
  box-shadow: var(--shadow-card);
  cursor: pointer;
  color: var(--text-primary);
}

.action-buttons button img {
  width: 28px;
  height: 28px;
}

.action-buttons button:nth-child(2) img,
.action-buttons button:nth-child(3) img {
  width: 32px;
  height: 32px;
}

.action-buttons button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.action-buttons button:active {
  transform: scale(0.9);
}

.loading-screen {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20px;
}

.loading-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 12px;
}

.loading-instruction {
  font-size: 16px;
  margin-bottom: 24px;
  color: var(--text-secondary);
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 6px solid var(--border-subtle);
  border-top-color: var(--accent-like);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.start-btn {
  margin-top: 20px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  background: var(--accent-like);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
}

.loading-bar-container {
  width: 80%;
  height: 12px;
  background: var(--border-subtle);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 12px;
  position: relative;
}

.loading-bar {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--accent-like),
    rgba(255, 255, 255, 0.3),
    var(--accent-like)
  );
  background-size: 200% 100%;
  border-radius: 6px;
  transition: width 0.3s ease;
  animation: shimmer 1.5s infinite linear;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>
