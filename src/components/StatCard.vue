<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{
  title: string
  value: string
  iconName: string
  gradientClass: string
}>()
</script>

<template>
  <el-card shadow="hover" class="stat-card floating-card" :class="gradientClass">
    <div class="stat-header">
      <Icon :icon="iconName" width="28" height="28" class="stat-icon" />
      <div class="stat-title">{{ title }}</div>
    </div>

    <div class="stat-value">{{ value }}</div>
  </el-card>
</template>

<style scoped>
.floating-card {
  transition: all 0.3s ease !important;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05) !important;
}

.floating-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
}

html.dark .floating-card {
  box-shadow: 0 10px 25px rgba(64, 158, 255, 0.1) !important;
}

.stat-card {
  text-align: center;
  border-radius: 8px;
  color: white;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.background-income {
  background: linear-gradient(135deg, #67c23a 0%, #a6df7f 100%);
}

.background-expense {
  background: linear-gradient(135deg, #f56c6c 0%, #fba0a0 100%);
}

.background-balance {
  background: linear-gradient(135deg, #409eff 0%, #85c4ff 100%);
}

.stat-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 10px;
}

.stat-icon {
  font-size: 20px;
  opacity: 0.8;
}

.stat-title {
  font-size: 16px;
  font-weight: bold;
}

.stat-value {
  font-size: 26px;
  font-weight: 900;
}
</style>
