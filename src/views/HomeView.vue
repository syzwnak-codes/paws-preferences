<template>
  <div class="home-view">
    <!-- Progress bar -->
    <div class="progress-bar-container">
      <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
    </div>

    <span class="progress-text">{{ total - cats.length }}/{{ total }} cats swiped</span>

    <!-- Cat cards -->
    <CatCard
      v-for="(cat, index) in cats"
      :key="cat.id"
      :src="cat.url"
      :tags="cat.tags"
      :zIndex="cats.length - index"
      @swipe="handleSwipe(index, $event)"
    />

    <!-- Action buttons -->
    <div class="action-buttons">
      <button @click="undo" :disabled="!history.length">⏪</button>
      <button @click="swipeLeft" :disabled="!cats.length">❌</button>
      <button @click="swipeRight" :disabled="!cats.length">❤️</button>
    </div>
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
    const history = ref<{ cat: { id: string; tags: string[]; url: string }, direction: string }[]>([]);
    const router = useRouter();

    onMounted(async () => {
      for (let i = 0; i < total; i++) {
        const res = await fetch("https://cataas.com/cat?json=true");
        const data = await res.json();
        cats.value.push({
          id: data.id,
          tags: data.tags || [],
          url: data.url
        });
      }
    });

    const handleSwipe = (index: number, direction: string) => {
  const cat = cats.value[index];
  if (!cat) return; // guard against undefined

  if (direction === "right") liked.value.push(cat);

  history.value.push({ cat, direction });
  cats.value.splice(index, 1);

  if (!cats.value.length) {
    router.push({ name: "Summary", query: { liked: JSON.stringify(liked.value) } });
  }
};


    // Undo the last swipe
    const undo = () => {
      if (!history.value.length) return;
      const last = history.value.pop()!;
      cats.value.unshift(last.cat); // put back on top

      if (last.direction === "right") {
        // remove from liked if it was liked
        liked.value = liked.value.filter(c => c.id !== last.cat.id);
      }
    };

    // Swipe buttons
    const swipeLeft = () => {
      if (!cats.value.length) return;
      handleSwipe(0, "left");
    };

    const swipeRight = () => {
      if (!cats.value.length) return;
      handleSwipe(0, "right");
    };

    const progressPercentage = computed(() => ((total - cats.value.length) / total) * 100);

    return { cats, handleSwipe, total, progressPercentage, undo, swipeLeft, swipeRight, history };
  }
});
</script>

<style>
.home-view {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: #fdf6f0;
  overflow: hidden;
}

.progress-bar-container {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 20px;
  background: #eee;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-bar {
  height: 100%;
  background: #ff6b81; /* nice pink color */
  transition: width 0.25s ease;
}

.progress-text {
  position: absolute;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  color: #333;
  font-weight: bold;
}

.action-buttons {
  position: absolute;
  bottom: 30px;
  display: flex;
  gap: 16px;
  justify-content: center;
  width: 100%;
}

.action-buttons button {
  background: white;
  border: none;
  padding: 12px 12px;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
  transition: transform 0.1s;
}

.action-buttons button:active {
  transform: scale(0.9);
}

.action-buttons button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

</style>
