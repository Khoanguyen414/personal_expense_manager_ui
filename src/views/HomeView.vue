<template>
  <div class="dashboard">
    <h2 style="margin-bottom: 20px">Tổng quan (Dashboard)</h2>

    <el-row :gutter="20">
      <el-col :span="10">
        <el-card shadow="hover" class="box-card">
          <template #header>
            <b style="font-size: 16px">Biểu Đồ Thu/Chi</b>
          </template>
          <div class="chart-container">
            <Pie :data="chartData" :options="chartOptions" />
          </div>
        </el-card>
      </el-col>

      <el-col :span="14">
        <el-card shadow="hover" class="box-card">
          <template #header>
            <b style="font-size: 16px">Danh Sách Danh Mục</b>
          </template>

          <el-table :data="categories" border stripe height="300">
            <el-table-column prop="id" label="ID" width="60" align="center" />
            <el-table-column prop="name" label="Tên danh mục" width="150" />
            <el-table-column prop="description" label="Mô tả" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ArcElement, Chart, Legend, Tooltip } from 'chart.js'
import { ref, onMounted } from 'vue'
import { Pie } from 'vue-chartjs'

interface TransactionStat {
  amount: number
  type: string
  categoryId: number
  categoryName: string
}

Chart.register(ArcElement, Tooltip, Legend)

const categories = ref([])

const fetchCategories = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/categories')

    categories.value = response.data
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu: ', error)
  }
}

const fetchStatistics = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/transactions/statistics')

    const transactions = response.data as TransactionStat[]
    console.log(transactions)

    let tongThu = 0
    let tongChi = 0

    transactions.forEach((item) => {
      if (item.type === 'INCOME') {
        tongThu += item.amount
      } else if (item.type === 'EXPENSE') {
        tongChi += item.amount
      }
    })

    chartData.value = {
      labels: ['Tổng Thu', 'Tổng Chi'],
      datasets: [
        {
          backgroundColor: ['#67C23A', '#F56C6C'],
          data: [tongThu, tongChi],
        },
      ],
    }
  } catch (error) {
    console.error('Lỗi API Thống kê:', error)
  }
}

const chartData = ref({
  labels: ['Tổng Thu', 'Tổng Chi'],
  datasets: [
    {
      backgroundColor: ['#67C23A', '#F56C6C'],
      data: [15000000, 8500000],
    },
  ],
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
})

onMounted(() => {
  fetchCategories()
  fetchStatistics()
})
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
  display: flex;
  justify-content: center;
}
</style>
