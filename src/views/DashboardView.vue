<template>
  <div class="dashboard fadeInUp">
    <h2 class="page-title">📊 Tổng quan (Dashboard)</h2>

    <el-row :gutter="25" style="margin-bottom: 25px">
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card income floating-card">
          <div class="stat-header">
            <span class="stat-icon income-icon">💸</span>
            <div class="stat-title">Tổng Thu Nhập</div>
          </div>
          <div class="stat-value">{{ tongThu.toLocaleString() }} đ</div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover" class="stat-card expense floating-card">
          <div class="stat-header">
            <span class="stat-icon expense-icon">🛍️</span>
            <div class="stat-title">Tổng Chi Tiêu</div>
          </div>
          <div class="stat-value">{{ tongChi.toLocaleString() }} đ</div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover" class="stat-card balance floating-card">
          <div class="stat-header">
            <span class="stat-icon balance-icon">💳</span>
            <div class="stat-title">Số Dư Hiện Tại</div>
          </div>
          <div class="stat-value">{{ soDu.toLocaleString() }} đ</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="25">
      <el-col :span="10">
        <el-card shadow="hover" class="box-card modern-card">
          <template #header>
            <b>📊 Tỉ lệ Thu / Chi</b>
          </template>

          <div class="chart-container">
            <Pie :data="pieChartData" :options="pieOptions" />
          </div>
        </el-card>
      </el-col>

      <el-col :span="14">
        <el-card shadow="hover" class="box-card modern-card">
          <template #header>
            <b>📉 Biến động theo Tháng</b>
          </template>

          <div class="chart-container">
            <Bar :data="barChartData" :options="barOptions" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js'
import { ref, onMounted, computed } from 'vue'
import { Bar, Pie } from 'vue-chartjs'

Chart.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const tongThu = ref(0)
const tongChi = ref(0)
const soDu = computed(() => tongThu.value - tongChi.value)

const pieChartData = ref({
  labels: ['Tổng Thu', 'Tổng Chi'],
  datasets: [{ backgroundColor: ['#67C23A', '#F56C6C'], data: [0, 0] }],
})

const barChartData = ref({
  labels: [] as String[],
  datasets: [
    { label: 'Thu nhập', backgroundColor: '#67C23A', data: [] as number[] },
    { label: 'Chi Tiêu', backgroundColor: '#F56C6C', data: [] as number[] },
  ],
})

const pieOptions = { responsive: true, maintainAspectRatio: false }
const barOptions = { responsive: true, maintainAspectRatio: false }

const fetchStatistics = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/transactions')
    const transactions = response.data

    let thu = 0
    let chi = 0

    const monthlyData: any = {}

    transactions.forEach((tx: any) => {
      if (tx.type === 'INCOME') thu += tx.amount
      else if (tx.type === 'EXPENSE') chi += tx.amount

      const month = tx.date ? tx.date.substring(0, 7) : 'Unknown'

      if (!monthlyData[month]) {
        monthlyData[month] = { thu: 0, chi: 0 }
      }

      if (tx.type === 'INCOME') monthlyData[month].thu += tx.amount
      else if (tx.type === 'EXPENSE') monthlyData[month].chi += tx.amount
    })

    tongThu.value = thu
    tongChi.value = chi

    pieChartData.value = {
      labels: ['Tổng Thu', 'Tổng Chi'],
      datasets: [{ backgroundColor: ['#67C23A', '#F56C6C'], data: [thu, chi] }],
    }

    const sortedMonths = Object.keys(monthlyData).sort()
    const dataThu = sortedMonths.map((m) => monthlyData[m].thu)
    const dataChi = sortedMonths.map((m) => monthlyData[m].chi)

    barChartData.value = {
      labels: sortedMonths,
      datasets: [
        { label: 'Thu nhập', backgroundColor: '#67C23A', data: dataThu },
        { label: 'Chi Tiêu', backgroundColor: '#F56C6C', data: dataChi },
      ],
    }
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu: ', error)
  }
}

onMounted(() => {
  fetchStatistics()
})
</script>

<style scoped>
.dashboard {
  padding: 5px;
}

.page-title {
  color: #606266;
  font-size: 24px;
  margin-bottom: 25px;
}

html.dark .page-title {
  color: #e5eaf3;
}

.chart-container {
  position: relative;
  height: 320px;
  display: flex;
  justify-content: center;
}

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

.stat-card.income {
  background: linear-gradient(135deg, #67c23a 0%, #a6df7f 100%);
}

.stat-card.expense {
  background: linear-gradient(135deg, #f56c6c 0%, #fba0a0 100%);
}

.stat-card.balance {
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

.modern-card {
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.03);
}

.box-card :deep(.el-card__header) {
  padding: 15px 20px;
  font-size: 16px;
  color: #303133;
}

html.dark .box-card :deep(.el-card__header) {
  color: #e5eaf3;
  border-bottom: 1px solid #333;
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
