<script setup lang="ts">
import { InfoFilled, List, PieChart } from '@element-plus/icons-vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <el-container class="layout-container">
    <el-aside width="250px" class="aside-menu">
      <div class="logo">
        <h2>💰 Quản lý chi tiêu</h2>
      </div>

      <el-menu
        active-text-color="#fff"
        background-color="#0000AA"
        text-color="#CCCCCC"
        :default-active-="$route.path"
        router
        class="el-menu-vertical"
      >
        <el-menu-item index="/">
          <el-icon><PieChart /></el-icon>
          <span>Tổng quan (Dashboard)</span>
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

    <el-container>
      <el-header class="header">
        <span>Xin chào, Admin!</span>
      </el-header>

      <el-main class="main-content">
        <RouterView />
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
  font-family: Arial, sans-serif;
}

#app {
  height: 10%;
}
</style>

<style scoped>
.layout-container {
  height: 100vh;
}

.aside-menu {
  background-color: #0000aa;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border-bottom: 1px solid #1f2d3d;
}

.el-menu-vertical {
  border-right: none;
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.main-content {
  background-color: #f0f2f5;
}
</style>
