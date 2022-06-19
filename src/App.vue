<template>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
});
</script>

<style lang="scss">
html,
body {
  box-sizing: border-box;
  height: 100%;
}

#app {
  @apply md:py-4 flex flex-col min-h-full;
  background-color: rgb(245, 245, 245);

  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --primary-text: #303133;
  --regular-text: #606266;
  --secondary-text: #909399;
  --additional-text: #c0c4cc;

  color: var(--primary-text);
}
</style>
