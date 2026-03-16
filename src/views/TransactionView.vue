<template>
  <div class="transaction fadeInUp">
    <h2 class="page-title">💳 Quản lý Giao dịch</h2>

    <el-card shadow="hover" class="filtering-card floating-tool modern-card">
      <div class="filter-wrapper">
        <span class="filter-label">🔍 Bộ lọc:</span>

        <el-select v-model="filterType" placeholder="Loại" style="width: 140px">
          <el-option label="Tất cả" value="ALL" />
          <el-option label="Thu nhập" value="INCOME" />
          <el-option label="Chi tiêu" value="EXPENSE" />
        </el-select>

        <el-date-picker
          v-model="filterMonth"
          type="month"
          placeholder="Chọn tháng"
          format="MM/YYYY"
          value-format="YYYY-MM"
          style="width: 150px"
        />

        <el-button type="info" plain @click="clearFilter">Xóa lọc</el-button>

        <div style="flex-grow: 1"></div>
        <el-button type="success" @click="openAddModal"><b>+ Thêm Mới</b></el-button>
      </div>

      <el-table :data="filteredTransactions" style="width: 100%" class="modern-table floating-card">
        <el-table-column prop="date" label="Ngày" width="120" align="center" />

        <el-table-column prop="categoryName" label="Danh mục" width="180">
          <template #default="scope">
            <el-tag :type="scope.row.type === 'INCOME' ? 'success' : 'danger'" effect="light" round>
              {{ scope.row.categoryName }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="amount" label="Số tiền" align="right">
          <template #default="scope">
            <span :class="scope.row.type === 'INCOME' ? 'income-text' : 'expense-text'">
              <b>{{ scope.row.amount.toLocaleString() }} đ</b>
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="description" label="Ghi chú" />

        <el-table-column label="Thao tác" width="130" align="center">
          <template #default="scope">
            <el-button size="small" type="primary" circle @click="openEditModal(scope.row)"
              ><el-icon><Edit /></el-icon
            ></el-button>

            <el-button size="small" type="danger" circle @click="deleteTransaction(scope.row.id)"
              ><el-icon><Delete /></el-icon
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="formData.id ? 'Sửa Giao Dịch' : 'Thêm Giao Dịch Mới'"
      width="450px"
      class="modern-dialog"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
        label-position="top"
      >
        <el-form-item label="Loại" prop="type">
          <el-radio-group v-model="formData.type">
            <el-radio-button label="INCOME">Thu nhập</el-radio-button>
            <el-radio-button label="EXPENSE">Chi tiêu</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Ngày giao dịch">
          <el-date-picker
            v-model="formData.date"
            type="date"
            placeholder="Chọn ngày"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="Số tiền">
          <el-input-number v-model="formData.amount" :min="1000" :step="1000" style="width: 100%" />
        </el-form-item>

        <el-form-item label="Danh mục">
          <el-select
            v-model="formData.categoryId"
            filterable
            placeholder="Gõ để tìm..."
            style="width: 100%"
          >
            <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="Ghi chú">
          <el-input v-model="formData.description" type="textarea" placeholder="Nhập ghi chú..." />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">Hủy</el-button>
          <el-button type="primary" @click="saveTransaction">Lưu lại</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { Delete, Edit } from '@element-plus/icons-vue'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, onMounted, ref } from 'vue'

interface TransactionItem {
  id: number
  amount: number
  type: string
  categoryId: number
  categoryName: string
  date: string
  description: string
}

const transactions = ref<TransactionItem[]>([])
const categories = ref<any[]>([])
const dialogVisible = ref(false)

const filterType = ref('ALL')
const filterMonth = ref('')

const formData = ref({
  id: null as number | null,
  amount: 0,
  type: 'EXPENSE',
  categoryId: null,
  description: '',
  date: new Date().toISOString().split('T')[0],
})

const rules = {
  amount: [
    {
      required: true,
      message: 'Vui lòng nhập số tiền lớn hơn 0',
      trigger: 'blur',
    },
  ],
  categoryId: [
    {
      required: true,
      message: 'Vui lòng chọn danh mục',
      trigger: 'change',
    },
  ],
}

const openAddModal = () => {
  formData.value = {
    id: null,
    amount: 0,
    type: 'EXPENSE',
    categoryId: null,
    description: '',
    date: new Date().toISOString().split('T')[0],
  }
  dialogVisible.value = true
}

const openEditModal = (row: any) => {
  formData.value = { ...row }
  dialogVisible.value = true
}

const fetchTransactions = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/transactions')
    transactions.value = response.data
  } catch (error) {
    console.error('Lỗi lấy Giao dịch: ', error)
  }
}

const fetchCategories = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/categories')
    categories.value = response.data
  } catch (error) {
    console.error('Lỗi lấy Danh mục: ', error)
  }
}

const saveTransaction = async () => {
  if (!formData.value.categoryId || formData.value.amount <= 0) {
    ElMessage.warning('Vui lòng nhập số tiền và chọn danh mục!')
    return
  }

  try {
    if (formData.value.id) {
      await axios.put(`http://localhost:8080/api/transactions/${formData.value.id}`, formData.value)
      ElMessage.success('Cập nhật giao dịch thành công!')
    } else {
      await axios.post('http://localhost:8080/api/transactions', formData.value)
      ElMessage.success('Thêm giao dịch thành công!')
    }

    dialogVisible.value = false
    fetchTransactions()
  } catch (error) {
    ElMessage.error('Có lỗi xảy ra khi lưu!')
    console.error(error)
  }
}

const deleteTransaction = (id: number) => {
  ElMessageBox.confirm('Bạn có chắc chắn muốn xóa giao dịch này vĩnh viễn không?', 'CẢNH BÁO', {
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy',
    type: 'warning',
  })
    .then(async () => {
      try {
        await axios.delete(`http://localhost:8080/api/transactions/${id}`)
        ElMessage.success('Đã xóa giao dịch thành công!')
        fetchTransactions()
      } catch (error) {
        ElMessage.error('Lỗi khi xóa giao dịch!')
        console.error(error)
      }
    })
    .catch(() => {
      ElMessage.info('Đã hủy thao tác xóa')
    })
}

const filteredTransactions = computed(() => {
  return transactions.value.filter((tx) => {
    const matchType = filterType.value === 'ALL' || tx.type === filterType.value

    const matchMonth = !filterType.value || tx.date.startsWith(filterMonth.value)

    return matchType && matchMonth
  })
})

const clearFilter = () => {
  filterType.value = 'ALL'
  filterMonth.value = ''
}

onMounted(() => {
  fetchCategories()
  fetchTransactions()
})
</script>

<style scoped>
.page-title {
  color: #606266;
  font-size: 24px;
  margin-bottom: 25px;
}

html.dark .page-title {
  color: #e5eaf3;
}

.filtering-card {
  margin-bottom: 25px;
  border-radius: 12px;
}

.filter-wrapper {
  display: flex;
  gap: 15px;
  align-items: center;
  padding: 5px;
}

.filter-label {
  font-weight: bold;
  color: #606266;
  font-size: 15px;
}

html.dark .filter-label {
  color: #e5eaf3;
}

.floating-tool {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03) !important;
}

html.dark .floating-tool {
  background-color: #1e1e1e;
  border-color: #333;
}

.modern-table {
  border-radius: 12px;
  overflow: hidden;
  border: none !important;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.03);
}

.modern-table :deep(th.el-table__cell) {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: bold;
}

html.dark .modern-table :deep(th.el-table__cell) {
  background-color: #2b2b2b;
  color: #e5eaf3;
}

.modern-table :deep(.el-table__row) {
  transition: all 0.3s ease;
}

.modern-table :deep(.el-table__row:hover) {
  transform: scale(1.005);
}

.modern-dialog :deep(.el-dialog) {
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.modern-dialog :deep(.el-dialog__header) {
  background: linear-gradient(90deg, #ecf5ff, white);
  padding: 15px 20px;
}

html.dark .modern-dialog :deep(.el-dialog__header) {
  background: linear-gradient(90deg, #2b333f, #1e1e1e);
}

.income-text {
  color: #67c23a;
}

.expense-text {
  color: #f56c6c;
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
