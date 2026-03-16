<template>
  <div class="dashboard fadeInUp">
    <h2 class="page-title">
      <Icon
        icon="fluent-emoji-flat:bar-chart"
        width="30"
        height="30"
        style="vertical-align: text-bottom; margin-top: 8px"
      />
      Tổng quan (Dashboard)
    </h2>

    <el-row :gutter="25" style="margin-bottom: 25px">
      <el-col :span="8">
        <StatCard
          title="Tổng Thu Nhập"
          :value="tongThu.toLocaleString()"
          icon-name="fluent-emoji-flat:money-with-wings"
          gradient-class="background-income"
        />
      </el-col>

      <el-col :span="8">
        <StatCard
          title="Tổng Chi Tiêu"
          :value="tongChi.toLocaleString()"
          icon-name="fluent-emoji-flat:shopping-bags"
          gradient-class="background-expense"
        />
      </el-col>

      <el-col :span="8">
        <StatCard
          title="Số Dư Hiện Tại"
          :value="soDu.toLocaleString()"
          icon-name="fluent-emoji-flat:credit-card"
          gradient-class="background-balance"
        />
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
import StatCard from '@/components/StatCard.vue'
import transactionService from '@/services/transactionService'
import { Icon } from '@iconify/vue'
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
    const response = await transactionService.getAll()
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
