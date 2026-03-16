<template>
  <div class="home-page">
    <el-card shadow="hover" class="home-card">
      <div class="header-section">
        <el-avatar
          :size="120"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          class="avatar-glow"
        />
        <h1 class="gradient-text">Xin chào, tôi là Admin! 👋</h1>
        <p class="subtitle">Chào mừng bạn đến với Trung tâm Quản lý Tài chính Cá nhân</p>
      </div>

      <el-divider border-style="dashed" />

      <div class="info-section">
        <el-descriptions title="Thông tin Dự án" :column="1" border class="custom-desc">
          <el-descriptions-item label="🚀 Tên dự án"
            >Hệ thống "Quản lý Chi tiêu Cá nhân" (Personal Expense Manager)</el-descriptions-item
          >
          <el-descriptions-item label="💻 Công nghệ"
            >Vue 3, Element Plus, Spring Boot, MySQL</el-descriptions-item
          >
          <el-descriptions-item label="🎯 Mục tiêu"
            >Kiểm soát thu chi thông minh, trực quan và tự động hóa.</el-descriptions-item
          >
          <el-descriptions-item label="👑 Chức vụ"
            >Chủ tịch kiêm Giám đốc Tài chính (CFO)</el-descriptions-item
          >
        </el-descriptions>

        <div class="action-btn">
          <el-button type="primary" size="large" round @click="goToDashboard">
            <p style="font-weight: 600; font-size: 14px">Welcome to Dashboard ➔</p>
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToDashboard = () => {
  router.push('/dashboard')
}
</script>

<style scoped>
.home-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.home-card {
  width: 100%;
  max-width: 700px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.header-section {
  text-align: center;
  padding: 20px 0;
}

.avatar-glow {
  border: 4px solid white;
  box-shadow: 0 0 20px rgba(64, 158, 255, 0.5);
  margin-bottom: 15px;
}

.gradient-text {
  margin: 0;
  font-size: 28px;
  background: linear-gradient(45deg, #409eff, #67c23a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: #797d82;
  font-size: 16px;
  margin-top: 10px;
}

.info-section {
  padding: 10px 20px;
}

.custom-desc {
  margin-bottom: 30px;
}

.action-btn {
  text-align: center;
  margin-top: 20px;
}
</style>
