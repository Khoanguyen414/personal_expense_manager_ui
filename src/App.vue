<script setup lang="ts">
import MainLayout from './layouts/MainLayout.vue'
</script>

<template>
  <MainLayout />
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f4f7fc;
}
#app {
  height: 100%;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #909399;
}
</style>
