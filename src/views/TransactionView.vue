<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Icon } from '@iconify/vue' 
import transactionService from '../services/transactionService'
import categoryService from '../services/categoryService'

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
const formRef = ref<any>(null)

const formData = ref({
  id: null as number | null,
  amount: 0,
  type: 'EXPENSE',
  categoryId: null,
  description: '',
  date: new Date().toISOString().split('T')[0],
})

const rules = {
  amount: [{ required: true, message: 'Vui lòng nhập số tiền lớn hơn 0', trigger: 'blur' }],
  categoryId: [{ required: true, message: 'Vui lòng chọn danh mục', trigger: 'change' }],
}

const filteredTransactions = computed(() => {
  return transactions.value.filter((tx) => {
    const matchType = filterType.value === 'ALL' || tx.type === filterType.value
    const matchMonth = !filterMonth.value || tx.date.startsWith(filterMonth.value)
    return matchType && matchMonth
  })
})

const fetchTransactions = async () => {
  try {
    const res = await transactionService.getAll()
    transactions.value = res.data
  } catch (error) {
    console.error('Lỗi lấy GD:', error)
  }
}

const fetchCategories = async () => {
  try {
    const res = await categoryService.getAll()
    categories.value = res.data
  } catch (error) {
    console.error('Lỗi lấy DM:', error)
  }
}

const clearFilter = () => {
  filterType.value = 'ALL'
  filterMonth.value = ''
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
  if (formRef.value) formRef.value.clearValidate()
}

const openEditModal = (row: any) => {
  formData.value = { ...row }
  dialogVisible.value = true
}

const saveTransaction = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      if (formData.value.amount <= 0) {
        ElMessage.warning('Số tiền phải lớn hơn 0!')
        return
      }
      try {
        if (formData.value.id) {
          await transactionService.update(formData.value.id, formData.value)
          ElMessage.success('Cập nhật thành công!')
        } else {
          await transactionService.create(formData.value)
          ElMessage.success('Thêm giao dịch thành công! 🎉')
        }
        dialogVisible.value = false
        fetchTransactions()
      } catch (error) {
        ElMessage.error('Có lỗi xảy ra!')
        console.error(error)
      }
    }
  })
}

const deleteTransaction = (id: number) => {
  ElMessageBox.confirm('Bạn có chắc chắn muốn xóa giao dịch này không?', 'Cảnh báo', {
    type: 'warning',
    confirmButtonText: 'Xóa ngay',
    cancelButtonText: 'Hủy',
  })
    .then(async () => {
      try {
        await transactionService.delete(id)
        ElMessage.success('Đã xóa thành công!')
        fetchTransactions()
      } catch (error) {
        ElMessage.error('Lỗi khi xóa!')
        console.error(error)
      }
    })
    .catch(() => {})
}

onMounted(() => {
  fetchTransactions()
  fetchCategories()
})
</script>

<template>
  <div class="transaction fadeInUp">
    <h2 class="page-title">
      <Icon
        icon="fluent-emoji-flat:receipt"
        width="30"
        height="30"
        style="vertical-align: text-bottom; margin-right: 8px"
      />
      Quản lý Giao dịch
    </h2>

    <el-card shadow="hover" class="filtering-card floating-tool modern-card">
      <div class="filter-wrapper">
        <span class="filter-label">
          <Icon
            icon="fluent-emoji-flat:magnifying-glass-tilted-right"
            width="20"
            height="20"
            style="vertical-align: text-bottom; margin-right: 5px"
          />
          Bộ lọc:
        </span>
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

        <el-button type="success" @click="openAddModal" class="add-btn">
          <Icon icon="fluent-emoji-flat:plus" width="18" height="18" style="margin-right: 5px" />
          <b>Thêm Mới</b>
        </el-button>
      </div>
    </el-card>

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
          <el-button
            size="small"
            type="primary"
            circle
            class="bold-icon"
            @click="openEditModal(scope.row)"
          >
            <Icon icon="lucide:pencil" width="16" height="16" />
          </el-button>
          <el-button
            size="small"
            type="danger"
            circle
            class="bold-icon"
            @click="deleteTransaction(scope.row.id)"
          >
            <Icon icon="lucide:trash-2" width="16" height="16" />
          </el-button>
        </template>
      </el-table-column>
    </el-table>

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
        <el-form-item label="Ngày giao dịch" prop="date">
          <el-date-picker
            v-model="formData.date"
            type="date"
            placeholder="Chọn ngày"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="Số tiền" prop="amount">
          <el-input-number v-model="formData.amount" :min="0" :step="1000" style="width: 100%" />
        </el-form-item>
        <el-form-item label="Danh mục" prop="categoryId">
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

<style scoped>
/* CSS ĐÃ ĐỒNG BỘ CHUẨN MỰC VỚI CÁC TRANG KHÁC */
.page-title {
  color: #606266;
  font-size: 24px;
  margin-bottom: 25px;
  font-weight: bold;
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
  display: flex;
  align-items: center;
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

.floating-card {
  transition: all 0.3s ease !important;
  border-radius: 12px;
}
.floating-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08) !important;
}

.modern-table {
  border: none !important;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.03);
  overflow: hidden;
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
.modern-dialog :deep(.el-dialog__title) {
  font-weight: bold !important;
  font-size: 18px;
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

.bold-icon {
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
</style>
