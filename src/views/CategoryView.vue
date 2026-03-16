<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Icon } from '@iconify/vue'
import categoryService from '../services/categoryService'

interface CategoryItem {
  id: number
  name: string
  description: string
}

const categories = ref<CategoryItem[]>([])
const dialogVisible = ref(false)
const formData = ref({ id: null as number | null, name: '', description: '' })
const formRef = ref<any>(null)

const rules = {
  name: [
    { required: true, message: 'Vui lòng nhập tên danh mục!', trigger: 'blur' },
    { min: 2, message: 'Tên phải có ít nhất 2 ký tự', trigger: 'blur' },
  ],
}

const fetchCategories = async () => {
  try {
    const res = await categoryService.getAll()
    categories.value = res.data
  } catch (error) {
    console.error('Lỗi lấy DM:', error)
  }
}

const openAddModal = () => {
  formData.value = { id: null, name: '', description: '' }
  dialogVisible.value = true
  if (formRef.value) formRef.value.clearValidate()
}

const openEditModal = (row: CategoryItem) => {
  formData.value = { ...row }
  dialogVisible.value = true
}

const saveCategory = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        if (formData.value.id) {
          await categoryService.update(formData.value.id, formData.value)
          ElMessage.success('Cập nhật thành công!')
        } else {
          await categoryService.create(formData.value)
          ElMessage.success('Thêm danh mục thành công! 🏷️')
        }
        dialogVisible.value = false
        fetchCategories()
      } catch (error) {
        ElMessage.error('Có lỗi xảy ra!')
      }
    }
  })
}

const deleteCategory = (id: number) => {
  ElMessageBox.confirm(
    'Xóa danh mục này có thể ảnh hưởng đến giao dịch. Bạn có chắc không?',
    'Cảnh báo',
    { type: 'error', confirmButtonText: 'Xóa', cancelButtonText: 'Hủy' },
  )
    .then(async () => {
      try {
        await categoryService.delete(id)
        ElMessage.success('Đã xóa danh mục!')
        fetchCategories()
      } catch (error) {
        ElMessage.error('Không thể xóa! (Có thể do đang có giao dịch dùng nó)')
      }
    })
    .catch(() => {})
}

onMounted(() => fetchCategories())
</script>

<template>
  <div class="category fadeInUp">
    <h2 class="page-title">
      <Icon
        icon="fluent-emoji-flat:open-file-folder"
        width="30"
        height="30"
        style="vertical-align: text-bottom; margin-right: 8px"
      />
      Quản lý Danh mục
    </h2>

    <el-card shadow="hover" class="modern-card floating-card">
      <div style="display: flex; justify-content: flex-start; margin-bottom: 25px">
        <el-button type="success" @click="openAddModal" class="add-btn">
          <Icon icon="fluent-emoji-flat:plus" width="18" height="18" style="margin-right: 5px" />
          <b>Thêm Mới</b>
        </el-button>
      </div>

      <el-table :data="categories" style="width: 100%" class="modern-table">
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="name" label="Tên danh mục" width="250">
          <template #default="scope"
            ><b>{{ scope.row.name }}</b></template
          >
        </el-table-column>
        <el-table-column prop="description" label="Mô tả" />
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
              @click="deleteCategory(scope.row.id)"
            >
              <Icon icon="lucide:trash-2" width="16" height="16" />
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="formData.id ? 'Sửa Danh Mục' : 'Thêm Danh Mục Mới'"
      width="420px"
      class="modern-dialog"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
        label-position="top"
      >
        <el-form-item label="Tên danh mục" prop="name">
          <el-input v-model="formData.name" placeholder="VD: Đổ xăng, Mua sắm..." />
        </el-form-item>
        <el-form-item label="Mô tả">
          <el-input
            v-model="formData.description"
            type="textarea"
            placeholder="Nhập ghi chú (Không bắt buộc)"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">Hủy</el-button>
          <el-button type="primary" @click="saveCategory">Lưu lại</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.page-title {
  color: #606266;
  font-size: 24px;
  margin-bottom: 25px;
}
html.dark .page-title {
  color: #e5eaf3;
}
.modern-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  border: none;
}
.floating-card {
  transition: all 0.3s ease !important;
}
.floating-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08) !important;
}
.modern-table {
  border: none !important;
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
  transform: translateX(5px);
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
  background: linear-gradient(90deg, #f0f9eb, white);
  padding: 15px 20px;
}
html.dark .modern-dialog :deep(.el-dialog__header) {
  background: linear-gradient(90deg, #2e3b2e, #1e1e1e);
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
