<script setup lang="ts">
import {
  Collection,
  InfoFilled,
  List,
  Monitor,
  Moon,
  PieChart,
  Sunny,
  UserFilled,
} from '@element-plus/icons-vue'
import { onMounted, ref, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const goToHome = () => {
  router.push('/')
}

const theme = ref(localStorage.getItem('app-theme') || 'auto')

const applyTheme = (currentTheme: string) => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  const isDark = currentTheme === 'dark' || (currentTheme === 'auto' && prefersDark)

  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }

  localStorage.setItem('app-theme', currentTheme)
}

watch(theme, (newTheme) => {
  applyTheme(newTheme)
})

onMounted(() => {
  applyTheme(theme.value)

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (theme.value === 'auto') applyTheme('auto')
  })
})

const changeTheme = (newTheme: string) => {
  theme.value = newTheme
}
</script>

<template>
  <el-container class="layout-container">
    <el-aside class="aside-menu">
      <div class="logo" @click="goToHome">
        <span class="logo-icon">💰</span>
        <h2 class="logo-text">Quản lý chi tiêu</h2>
      </div>

      <el-menu
        active-text-color="white"
        background-color="transparent"
        text-color="#4F4F4F"
        :default-active="route.path"
        router
        class="custom-menu"
      >
        <el-menu-item index="/dashboard">
          <el-icon><PieChart /></el-icon>
          <span>Tổng quan (Dashboard)</span>
        </el-menu-item>

        <el-menu-item index="/categories">
          <el-icon><Collection /></el-icon>
          <span>Quản lý Danh mục</span>
        </el-menu-item>

        <el-menu-item index="/transactions">
          <el-icon><List /></el-icon>
          <span>Quản lý Giao dịch</span>
        </el-menu-item>

        <el-menu-item index="/about">
          <el-icon><InfoFilled /></el-icon>
          <span>Giới thiệu</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container class="right-container">
      <el-header class="modern-header">
        <div class="header-left">
          <span class="greeting">Xin chào, <b>Admin!</b> 👋 Hôm nay bạn thế nào?</span>
        </div>

        <div class="header-right" style="display: flex; align-items: center; gap: 20px">
          <el-dropdown @command="changeTheme" trigger="click">
            <el-button circle>
              <el-icon v-if="theme === 'light'"><Sunny /></el-icon>
              <el-icon v-else-if="theme === 'dark'"><Moon /></el-icon>
              <el-icon v-else><Monitor /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="light" :class="{ active: theme === 'light' }"
                  ><el-icon><Sunny /></el-icon> Sáng</el-dropdown-item
                >
                <el-dropdown-item command="dark" :class="{ active: theme === 'dark' }"
                  ><el-icon><Moon /></el-icon> Tối</el-dropdown-item
                >
                <el-dropdown-item command="auto" :class="{ active: theme === 'auto' }"
                  ><el-icon><Monitor /></el-icon> Hệ thống</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <el-avatar :icon="UserFilled" :size="40" class="user-avatar" />
        </div>
      </el-header>

      <el-main class="main-content">
        <div class="page-wrapper">
          <RouterView />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f4f4fc;
}

html.dark body {
  background-color: #141414;
}

html.dark .right-container {
  background-color: #141414;
}

html.dark .modern-header {
  background-color: rgba(30, 30, 30, 0.8);
  border-bottom: 1px solid #333;
}

html.dark .greeting {
  color: #e5eaf3;
}

#app {
  height: 100%;
}

::-webkit-scrollbar {
  width: 8px;
  height: 10px;
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

<style scoped>
.layout-container {
  height: 100vh;
  overflow: hidden;
}

.aside-menu {
  width: 260px;
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.05);
  z-index: 10;
  display: flex;
  flex-direction: column;
}

.logo {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: white;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
}

.logo:hover {
  background: rgba(255, 255, 255, 0.08);
  transition: all 0.2s ease;
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  margin: 0;
  font-size: 22px;
  background: #2e87e0;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.custom-menu {
  border-right: none;
}

.custom-menu :deep(.el-menu-item) {
  margin: 5px 5px;
  border-radius: 20px;
  transition: all 0.2s ease;
}

.custom-menu :deep(.el-menu-item:hover) {
  background-color: rgba(255, 255, 255, 0.1) !important;
  transform: translateX(5px);
}

.custom-menu :deep(.el-menu-item.is-active) {
  background-color: rgb(15, 135, 255) !important;
  font-weight: bold;
}

.right-container {
  background-color: #f4f4fc;
}

.modern-header {
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #ebeef5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  height: 70px;
  margin: 15px 20px 0 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.greeting {
  font-size: 16px;
  color: #606266;
}

.user-avatar {
  background: linear-gradient(135deg, #409eff, #a6c1ee);
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.4);
  cursor: pointer;
  transition: transform 0.3s;
}

.user-avatar:hover {
  transform: scale(1.1);
}

.main-content {
  padding: 20px;
  overflow-x: hidden;
}

.page-wrapper {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.active {
  color: #409eff;
  font-weight: bold;
  background-color: #ecf5ff;
}

html.dark .active {
  background-color: #2b333f;
}
</style>
