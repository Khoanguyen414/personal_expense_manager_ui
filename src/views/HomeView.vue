<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

const router = useRouter()

const userInfo = ref({
  name: 'Admin',
  avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  subtitle: 'Chào mừng bạn đến với Trung tâm Quản lý Tài chính Cá nhân',
})

const projectInfo = ref([
  {
    id: 1,
    label: 'Tên dự án',
    value: 'Hệ thống "Quản lý Chi tiêu Cá nhân" (Personal Expense Manager)',
    icon: 'fluent-emoji-flat:rocket',
  },
  {
    id: 2,
    label: 'Công nghệ',
    value: 'Vue 3, Element Plus, Spring Boot, MySQL',
    icon: 'fluent-emoji-flat:laptop-computer',
  },
  {
    id: 3,
    label: 'Mục tiêu',
    value: 'Kiểm soát thu chi thông minh, trực quan và tự động hóa.',
    icon: 'fluent-emoji-flat:direct-hit',
  },
  {
    id: 4,
    label: 'Chức vụ',
    value: 'Chủ tịch kiêm Giám đốc Tài chính (CFO)',
    icon: 'fluent-emoji-flat:crown',
  },
])

const goToDashboard = () => {
  router.push('/dashboard')
}
</script>

<template>
  <div class="home-page fadeInUp">
    <el-card shadow="hover" class="home-card">
      <div class="header-section">
        <el-avatar :size="120" :src="userInfo.avatar" class="avatar-glow" />
        <h1 class="gradient-text">
          Xin chào, tôi là {{ userInfo.name }}!
          <Icon
            icon="fluent-emoji-flat:waving-hand"
            width="28"
            height="28"
            style="vertical-align: text-bottom"
          />
        </h1>
        <p class="subtitle">{{ userInfo.subtitle }}</p>
      </div>

      <el-divider border-style="dashed" />

      <div class="info-section">
        <el-descriptions title="Thông tin Dự án" :column="1" border class="custom-desc">
          <el-descriptions-item v-for="item in projectInfo" :key="item.id">
            <template #label>
              <div class="desc-label">
                <Icon :icon="item.icon" width="18" height="18" />
                {{ item.label }}
              </div>
            </template>
            <span class="desc-value">{{ item.value }}</span>
          </el-descriptions-item>
        </el-descriptions>

        <div class="action-btn">
          <el-button type="primary" size="large" round @click="goToDashboard" class="go-btn">
            <span style="font-weight: 600; font-size: 15px">Welcome to Dashboard </span>
            <Icon
              icon="fluent-emoji-flat:right-arrow"
              width="18"
              height="18"
              style="margin-left: 8px"
            />
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

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
  border: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}
html.dark .home-card {
  background: rgba(30, 30, 30, 0.8);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
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
html.dark .avatar-glow {
  border-color: #1e1e1e;
}

.gradient-text {
  margin: 0;
  font-size: 28px;
  background: linear-gradient(45deg, #409eff, #67c23a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
}
.subtitle {
  color: #797d82;
  font-size: 16px;
  margin-top: 10px;
}
html.dark .subtitle {
  color: #a3a6ad;
}

.info-section {
  padding: 10px 20px;
}
.custom-desc {
  margin-bottom: 30px;
}

.desc-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #606266;
}
html.dark .desc-label {
  color: #e5eaf3;
}
.desc-value {
  color: #303133;
}
html.dark .desc-value {
  color: #cfd3dc;
}
.custom-desc :deep(.el-descriptions__title) {
  font-size: 18px;
  color: #303133;
}
html.dark .custom-desc :deep(.el-descriptions__title) {
  color: #e5eaf3;
}

.action-btn {
  text-align: center;
  margin-top: 20px;
}
.go-btn {
  transition: all 0.3s ease;
}
.go-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(64, 158, 255, 0.4);
}

.fadeInUp {
  animation: fadeInUp 0.5s ease;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
