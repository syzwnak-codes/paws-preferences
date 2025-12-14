<template>
  <router-view />
</template>

<script lang="ts">
export default {};
</script>

<style>
:root {
  --bg-main: #fdf6f0;
  --bg-surface: #ffffff;
  --bg-card: #ffffff;

  --text-primary: #111111;
  --text-secondary: #666666;

  --border-subtle: #e5e5e5;

  --accent-like: #ff4458;   /* Tinder red */
  --accent-nope: #7a6cff;

  --shadow-card: 0 8px 24px rgba(0, 0, 0, 0.25);
}

/* 🌙 DARK MODE */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-main: #0f0f0f;
    --bg-surface: #161616;
    --bg-card: #1c1c1c;

    --text-primary: #ffffff;
    --text-secondary: #b0b0b0;

    --border-subtle: #2a2a2a;

    --shadow-card: 0 10px 30px rgba(0, 0, 0, 0.7);
  }
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: var(--bg-main);
  color: var(--text-primary);
}
</style>
