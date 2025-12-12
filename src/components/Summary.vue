<template>
  <div class="summary-page">
    <h1>You liked {{ likedCats.length }} cats 😺</h1>

    <div v-if="likedCats.length === 0" class="no-likes">
      <p>You didn’t like any cats… surprising 😼</p>
      <button @click="goHome">Try Again</button>
    </div>

    <div v-else class="cats-grid">
      <div v-for="cat in likedCats" :key="cat.id" class="cat-card-summary">
        <img :src="cat.url" />
        <div class="tags">
          <span v-for="tag in cat.tags" :key="tag">{{ tag }}</span>
        </div>
      </div>
    </div>

    <button class="retry-btn" @click="goHome">Start Over</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();

    const likedCats = JSON.parse(route.query.liked as string || "[]");

    const goHome = () => {
      router.push("/");
    };

    return { likedCats, goHome };
  }
});
</script>

<style>
.summary-page {
  padding: 32px;
  text-align: center;
  background: #fffaf5;
  min-height: 100vh;
}

h1 {
  margin-bottom: 24px;
}

.no-likes {
  margin-top: 40px;
}

.cats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  margin: 20px auto;
  max-width: 900px;
}

.cat-card-summary {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.cat-card-summary img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.tags {
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tags span {
  background: #ffe5c2;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
}

.retry-btn {
  margin-top: 26px;
  padding: 10px 20px;
  font-size: 16px;
  background: #ffb74d;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

.retry-btn:hover {
  background: #ffa726;
}
</style>
