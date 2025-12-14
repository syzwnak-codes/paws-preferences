<template>
  <div
    class="cat-card"
    :style="{
      zIndex: zIndex,
      transform: `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg)`
    }"
    @mousedown.prevent="startDrag"
    @touchstart.prevent="startDrag"
  >

<img
  :src="src"
  alt="cat"
  draggable="false"
  @load="loaded = true"
  :class="{ loaded }"
/>

    <!-- Overlay for swipe feedback -->
<div class="overlay" :style="{backgroundColor: overlayColor, opacity: overlayOpacity }">
  <img
    v-if="overlayDirection === 'right'"
    src="/filled-heart.png"
    class="overlay-icon"
  />
  <img
    v-else-if="overlayDirection === 'left'"
    src="/close.png"
    class="overlay-icon"
  />
</div>

    <div class="info-box">
      <h3>Tags</h3>
      <p>{{ tags.length ? tags.join(', ') : "mysterious kitty" }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";

export default defineComponent({
  props: {
    src: { type: String, required: true },
    tags: { type: Array as () => string[], default: () => [] },
    zIndex: { type: Number, default: 0 }
  },
  emits: ["swipe"],
  setup(_props, { emit }) { // renamed props to _props to avoid TS error
    const loaded = ref(false);
    const translateX = ref(0);
    const translateY = ref(0);
    const rotation = ref(0);
    const startX = ref(0);
    const startY = ref(0);
    const isDragging = ref(false);

    watch(
      () => _props.src,
      () => {
        loaded.value = false;
      }
    );

    let animationFrame: number;

    const startDrag = (event: MouseEvent | TouchEvent) => {
      if (event instanceof MouseEvent) {
        if (event.button !== 0) return;
        startX.value = event.clientX;
        startY.value = event.clientY;
        isDragging.value = true;
        window.addEventListener("mousemove", onDrag);
        window.addEventListener("mouseup", endDrag);
      } else if (event.touches?.length === 1) {
        startX.value = event.touches[0]?.clientX ?? 0;
        startY.value = event.touches[0]?.clientY ?? 0;
        isDragging.value = true;
        window.addEventListener("touchmove", onDrag);
        window.addEventListener("touchend", endDrag);
      }
    };

    const onDrag = (event: MouseEvent | TouchEvent) => {
      if (!isDragging.value) return;

      let currentX = 0;
      let currentY = 0;

      if (event instanceof MouseEvent) {
        currentX = event.clientX;
        currentY = event.clientY;
      } else if (event.touches?.[0]) {
        currentX = event.touches[0].clientX ?? 0;
        currentY = event.touches[0].clientY ?? 0;
      }

      const dx = currentX - startX.value;
      const dy = currentY - startY.value;

      if (animationFrame) cancelAnimationFrame(animationFrame);

      animationFrame = requestAnimationFrame(() => {
        translateX.value = dx;
        translateY.value = dy;
        rotation.value = dx / 15;
      });
    };

    const endDrag = () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
      
      isDragging.value = false;
      const threshold = 120;

      if (translateX.value > threshold) {
        translateX.value = window.innerWidth;
        emit("swipe", "right");
      } else if (translateX.value < -threshold) {
        translateX.value = -window.innerWidth;
        emit("swipe", "left");
      } else {
        translateX.value = 0;
        translateY.value = 0;
        rotation.value = 0;
      }

      window.removeEventListener("mousemove", onDrag);
      window.removeEventListener("mouseup", endDrag);
      window.removeEventListener("touchmove", onDrag);
      window.removeEventListener("touchend", endDrag);
    };

    // Overlay feedback
    const overlayColor = computed(() =>
      translateX.value > 0 ? "rgba(255,100,150,0.5)" :
      translateX.value < 0 ? "rgba(150,100,255,0.5)" :
      "transparent"
    );

const overlayDirection = computed(() =>
  translateX.value > 0 ? "right" :
  translateX.value < 0 ? "left" :
  null
);

    const overlayOpacity = computed(() => Math.min(Math.abs(translateX.value) / 150, 1));

return {
  translateX,
  translateY,
  rotation,
  startDrag,
  overlayColor,
  overlayOpacity,
  overlayDirection,
  loaded
};
  }
});
</script>

<style>
.cat-card {
  border-radius: 18px;
  overflow: hidden;
  position: absolute;
  inset: 0;
  background-color: var(--bg-card);
  cursor: grab;
  touch-action: none;
  box-shadow: var(--shadow-card);
  transition: transform 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
  transform-origin: top center;
}

.cat-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
  z-index: 1;
  position: relative;
}

.cat-card:nth-child(n + 2) {
  transform: scale(0.95);
}

.info-box {
  position: absolute;
  bottom: 0;
  width: 100%;
  max-height: 200px;
  padding: 100px 16px;
  color: white;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.9),
    rgba(0, 0, 0, 0.3),
    transparent
  );
  z-index: 1;
}

.info-box h3 {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
}

.info-box p {
  margin: 6px 0 0;
  font-size: 14px;
  opacity: 0.9;
}

/* Swipe overlay */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64px;
  pointer-events: none;
  transition: background-color 0.2s, opacity 0.2s;
  z-index: 5; /* <-- ensures overlay is above image and skeleton */
}

.overlay-icon {
  width: 80px !important;
  height: 80px !important;
  opacity: 0.9;
  z-index: 6; /* <-- above overlay background */
  transform: scale(1.1);
}

.emoji {
  font-size: 64px;
}

.image-skeleton {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    #2a2a2a 25%,
    #333 37%,
    #2a2a2a 63%
  );
  background-size: 400% 100%;
  animation: shimmer 1.2s infinite;
  z-index: 1;
}

@keyframes shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
}

.cat-card img {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cat-card img.loaded {
  opacity: 1;
}

</style>
