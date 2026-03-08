<template>
  <div class="transaction-page">
    <h2 style="margin-bottom: 20px">💸 Quản lý Giao dịch</h2>

    <el-card shadow="hover">
      <el-button type="primary" @click="openAddModal" style="margin-bottom: 20px">
        Thêm Giao Dịch
      </el-button>

      <el-table :data="transactions" border stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="60" align="center" />

        <el-table-column prop="amount" label="Số tiền" width="150">
          <template #default="scope">
            <b style="color: #409eff"> {{ scope.row.amount.toLocaleString() }} đ </b>
          </template>
        </el-table-column>

        <el-table-column prop="type" label="Loại" width="120" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.type === 'INCOME' ? 'success' : 'danger'">
              {{ scope.row.type === 'INCOME' ? 'Thu nhập' : 'Chi tiêu' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="categoryName" label="Danh mục" width="150" />
        <el-table-column prop="date" label="Ngày" width="120" align="center" />
        <el-table-column prop="description" label="Ghi chú" />

        <el-table-column label="Thao tác" width="150" align="center">
          <template #default="scope">
            <el-button size="small" type="primary" @click="openEditModal(scope.row)">Sửa</el-button>
            <el-button size="small" type="danger" @click="deleteTransaction(scope.row.id)"
              >Xóa</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" title="Thêm Giao Dịch Mới" width="500px">
      <el-form label-width="100px">
        <el-form-item label="Loại">
          <el-radio-group v-model="formData.type">
            <el-radio value="INCOME">Thu nhập</el-radio>
            <el-radio value="EXPENSE">Chi tiêu</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Ngày Giao dịch">
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
          <el-input-number v-model="formData.amount" :min="0" style="width: 100%" />
        </el-form-item>

        <el-form-item label="Danh mục">
          <el-select v-model="formData.categoryId" placeholder="Chọn danh mục" style="width: 100%">
            <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="Ghi chú">
          <el-input v-model="formData.description" type="textarea" placeholder="Nhập ghi chú..." />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Hủy</el-button>
          <el-button type="primary" @click="saveTransaction">Lưu giao dịch</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, ref } from 'vue'

const transactions = ref([])
const categories = ref<any[]>([])
const dialogVisible = ref(false)

const formData = ref({
  id: null as number | null,
  amount: 0,
  type: 'EXPENSE',
  categoryId: null,
  description: '',
  date: new Date().toISOString().split('T')[0],
})

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
  ElMessageBox.confirm('Bạn có chắc chắn muốn xóa giao dịch này vĩnh viễn không?', 'Cảnh báo', {
    confirmButtonText: 'Xóa ngay',
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

onMounted(() => {
  fetchCategories()
  fetchTransactions()
})
</script>

<style></style>
