<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { onMounted, ref, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const activeMenu = ref(route.path)

watch(
  () => route.path,
  (newPath) => {
    activeMenu.value = newPath
  },
  { immediate: true },
)

const goToHome = () => {
  router.push('/')
}

const theme = ref(localStorage.getItem('app-theme') || 'auto')

const applyTheme = (currentTheme: string) => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const isDark = currentTheme === 'dark' || (currentTheme === 'auto' && prefersDark)

  if (isDark) document.documentElement.classList.add('dark')
  else document.documentElement.classList.remove('dark')

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
        <Icon icon="fluent-emoji-flat:money-bag" width="32" height="32" />
        <h2 class="logo-text">Quản Lý Chi Tiêu</h2>
      </div>

      <el-menu
        active-text-color="white"
        background-color="transparent"
        text-color="#4F4F4F"
        :default-active="activeMenu"
        router
        class="custom-menu"
      >
        <el-menu-item index="/dashboard">
          <Icon
            icon="flat-color-icons:combo-chart"
            width="24"
            height="24"
            style="margin-right: 10px"
          />
          <span>Tổng quan</span>
        </el-menu-item>

        <el-menu-item index="/categories">
          <Icon
            icon="flat-color-icons:opened-folder"
            width="24"
            height="24"
            style="margin-right: 10px"
          />
          <span>Danh mục</span>
        </el-menu-item>

        <el-menu-item index="/transactions">
          <Icon icon="flat-color-icons:list" width="24" height="24" style="margin-right: 10px" />
          <span>Giao dịch</span>
        </el-menu-item>

        <el-menu-item index="/about">
          <Icon
            icon="fluent-emoji-flat:sparkling-heart"
            width="24"
            height="24"
            style="margin-right: 10px"
          />
          <span>Giới thiệu</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container class="right-container">
      <el-header class="modern-header">
        <div class="header-left">
          <span class="greeting">
            Xin chào, <b>Admin!</b>
            <Icon
              icon="fluent-emoji-flat:waving-hand"
              width="20"
              height="20"
              style="vertical-align: middle; margin-left: 5px"
            />
          </span>
        </div>

        <div class="header-right" style="display: flex; align-items: center; gap: 20px">
          <el-dropdown @command="changeTheme" trigger="click">
            <el-button circle>
              <Icon v-if="theme === 'light'" icon="noto:sun" width="18" height="18" />
              <Icon
                v-else-if="theme === 'dark'"
                icon="noto:first-quarter-moon"
                width="18"
                height="18"
              />
              <Icon v-else icon="noto:desktop-computer" width="18" height="18" />
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="light" :class="{ active: theme === 'light' }">
                  <Icon icon="noto:sun" width="16" style="margin-right: 8px" /> Sáng
                </el-dropdown-item>
                <el-dropdown-item command="dark" :class="{ active: theme === 'dark' }">
                  <Icon icon="noto:first-quarter-moon" width="16" style="margin-right: 8px" /> Tối
                </el-dropdown-item>
                <el-dropdown-item command="auto" :class="{ active: theme === 'auto' }">
                  <Icon icon="noto:desktop-computer" width="16" style="margin-right: 8px" /> Hệ
                  thống
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <el-avatar
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            :size="40"
            class="user-avatar"
          />
        </div>
      </el-header>

      <el-main class="main-content">
        <div class="page-wrapper"><RouterView /></div>
      </el-main>
    </el-container>
  </el-container>
</template>

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
  background: #ffffff;
  transition: all 0.3s;
}
html.dark .aside-menu {
  background: #1a1a1a;
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.2);
}

.logo {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  border-bottom: 1px solid #f0f2f5;
}
html.dark .logo {
  border-bottom: 1px solid #333;
}
.logo:hover {
  opacity: 0.8;
}
.logo-text {
  margin: 0;
  font-size: 22px;
  background: #409eff;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
}
html.dark .logo-text {
  background: #e5eaf3;
  -webkit-text-fill-color: transparent;
}

.custom-menu {
  border-right: none;
  padding-top: 15px;
}
.custom-menu :deep(.el-menu-item) {
  margin: 5px 15px;
  border-radius: 12px;
  transition: all 0.2s ease;
}
.custom-menu :deep(.el-menu-item:hover) {
  background-color: rgba(64, 158, 255, 0.1) !important;
  transform: translateX(5px);
}
.custom-menu :deep(.el-menu-item.is-active) {
  background-color: #409eff !important;
  font-weight: bold;
}
html.dark .custom-menu :deep(.el-menu-item) {
  color: #a3a6ad;
}

.right-container {
  background-color: #f4f7fc;
  transition: all 0.3s;
}
html.dark .right-container {
  background-color: #141414;
}

.modern-header {
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  height: 70px;
  margin: 15px 20px 0 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  transition: all 0.3s;
  border: 1px solid #ebeef5;
}
html.dark .modern-header {
  background-color: rgba(30, 30, 30, 0.8);
  border-color: #333;
}

.greeting {
  font-size: 16px;
  color: #606266;
}
html.dark .greeting {
  color: #e5eaf3;
}
.user-avatar {
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  animation: fadeIn 0.4s ease-in-out;
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
  color: #409eff;
}
</style>
