<template>
  <div class="p-4 md:p-6">
    <h1 class="text-2xl font-semibold text-[var(--color-text-light)] mb-6">User Management</h1>

    <!-- Filters and Search -->
    <div class="mb-4 p-4 bg-[var(--color-secondary)] rounded-lg shadow">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label for="searchUser" class="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Search</label>
          <el-input
            id="searchUser"
            v-model="filters.search"
            placeholder="Search by name, email, nickname..."
            clearable
            @input="debouncedFetchUsers"
            class="custom-input"
          />
        </div>
        <div>
          <label for="filterRole" class="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Role</label>
          <el-select
            id="filterRole"
            v-model="filters.role"
            placeholder="All Roles"
            clearable
            @change="applyFiltersAndFetch"
            class="w-full custom-select"
          >
            <el-option label="Admin" value="admin"></el-option>
            <el-option label="Organizer" value="organizer"></el-option>
            <el-option label="Player" value="player"></el-option>
          </el-select>
        </div>
        <div>
          <label for="filterStatus" class="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Status</label>
           <el-select
            id="filterStatus"
            v-model="filters.status"
            placeholder="All Statuses"
            clearable
            @change="applyFiltersAndFetch"
            class="w-full custom-select"
          >
            <el-option label="Active" value="active"></el-option>
            <el-option label="Banned" value="banned"></el-option>
            <!-- Add other statuses if your backend supports them -->
          </el-select>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-10">
      <el-skeleton :rows="5" animated />
    </div>
    <div v-else-if="errorMsg" class="text-center py-10">
      <el-result icon="error" title="Error Loading Users" :sub-title="errorMsg">
        <template #extra>
          <el-button type="primary" @click="fetchUsers">Try Again</el-button>
        </template>
      </el-result>
    </div>
    <div v-else>
      <div class="overflow-x-auto bg-[var(--color-secondary)] rounded-lg shadow">
        <el-table :data="users" style="width: 100%" class="admin-user-table">
          <el-table-column prop="id" label="ID" width="80" sortable />
          <el-table-column label="Name" min-width="180" sortable prop="first_name">
            <template #default="{ row }">
              <div class="flex items-center space-x-2">
                <img :src="getAvatar(row)" :alt="row.first_name" class="w-8 h-8 rounded-full object-cover"/>
                <span>{{ row.first_name }} {{ row.last_name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="nickname" label="Nickname" width="150" />
          <el-table-column prop="email" label="Email" min-width="200" />
          <el-table-column prop="role" label="Role" width="120" sortable>
            <template #default="{ row }">
              <el-tag :type="getRoleTagType(row.role)" size="small">{{ row.role }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="Status" width="120">
             <template #default="{ row }">
              <!-- Assuming 'status' field exists on user model, or derive it -->
              <el-tag :type="row.status === 'banned' ? 'danger' : 'success'" size="small">
                {{ row.status || 'Active' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Created At" width="180" sortable prop="created_at">
            <template #default="{ row }">
              {{ formatDateTime(row.created_at) }}
            </template>
          </el-table-column>
          <el-table-column label="Actions" width="200" fixed="right">
            <template #default="{ row }">
              <el-tooltip content="Edit Role" placement="top">
                <el-button type="primary" :icon="EditPen" circle plain size="small" @click="openEditRoleModal(row)" />
              </el-tooltip>
              <el-tooltip :content="row.status === 'banned' ? 'Unban User' : 'Ban User'" placement="top">
                 <el-button
                  :type="row.status === 'banned' ? 'success' : 'warning'"
                  :icon="row.status === 'banned' ? Unlock : Lock"
                  circle plain size="small"
                  @click="toggleUserBanStatus(row)"
                />
              </el-tooltip>
              <el-tooltip content="Edit Details" placement="top">
                <el-button type="info" :icon="ViewIcon" circle plain size="small" @click="openEditDetailsModal(row)" />
              </el-tooltip>
               <el-tooltip content="Delete User" placement="top">
                <el-button type="danger" :icon="DeleteIcon" circle plain size="small" @click="confirmDeleteUser(row)" />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- Pagination -->
      <div class="mt-6 flex justify-center">
        <el-pagination
          background
          layout="prev, pager, next, total, jumper"
          :total="pagination.total"
          :page-size="pagination.limit"
          :current-page="pagination.page"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <!-- Edit Role Modal -->
    <el-dialog v-model="editRoleModal.visible" title="Edit User Role" width="400px" class="custom-dialog">
      <div v-if="editRoleModal.user">
        <p class="mb-2">User: <span class="font-semibold">{{ editRoleModal.user.first_name }} {{ editRoleModal.user.last_name }}</span></p>
        <el-form-item label="New Role">
          <el-select v-model="editRoleModal.newRole" placeholder="Select role">
            <el-option label="Admin" value="admin"></el-option>
            <el-option label="Organizer" value="organizer"></el-option>
            <el-option label="Player" value="player"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <template #footer>
        <el-button @click="editRoleModal.visible = false">Cancel</el-button>
        <el-button type="primary" @click="submitUserRoleUpdate" :loading="editRoleModal.loading">Confirm</el-button>
      </template>
    </el-dialog>

    <!-- Edit Details Modal (Simplified Example) -->
    <el-dialog v-model="editDetailsModal.visible" title="Edit User Details" width="500px" class="custom-dialog">
      <div v-if="editDetailsModal.user">
        <el-form label-position="top">
          <el-form-item label="First Name">
            <el-input v-model="editDetailsModal.formData.first_name" />
          </el-form-item>
          <el-form-item label="Last Name">
            <el-input v-model="editDetailsModal.formData.last_name" />
          </el-form-item>
          <el-form-item label="Nickname">
            <el-input v-model="editDetailsModal.formData.nickname" />
          </el-form-item>
          <!-- Add other editable fields as needed, avoid email/password for simplicity/security here -->
        </el-form>
      </div>
      <template #footer>
        <el-button @click="editDetailsModal.visible = false">Cancel</el-button>
        <el-button type="primary" @click="submitUserDetailsUpdate" :loading="editDetailsModal.loading">Save Changes</el-button>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { ElTable, ElTableColumn, ElTag, ElButton, ElPagination, ElDialog, ElSelect, ElOption, ElInput, ElFormItem, ElMessage, ElMessageBox, ElSkeleton, ElResult, ElTooltip } from 'element-plus';
import { EditPen, Delete as DeleteIcon, Lock, Unlock, View as ViewIcon } from '@element-plus/icons-vue';
import adminService from '@/services/adminService';
import { getDiceBearAvatarUrl } from '@/utils/avatarUtils'; // Assuming you have this

const users = ref([]);
const isLoading = ref(true);
const errorMsg = ref('');

const filters = reactive({
  search: '',
  role: '',
  status: '',
});

const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
});

const editRoleModal = reactive({
  visible: false,
  user: null,
  newRole: '',
  loading: false,
});

const editDetailsModal = reactive({
  visible: false,
  user: null,
  formData: { first_name: '', last_name: '', nickname: '' },
  loading: false,
});

let debounceTimer = null;

const fetchUsers = async () => {
  isLoading.value = true;
  errorMsg.value = '';
  try {
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      search: filters.search || undefined,
      role: filters.role || undefined,
      status: filters.status || undefined,
    };
    const response = await adminService.getAdminUsers(params);
    users.value = response.users || []; // Adjust based on your API response structure
    pagination.total = response.totalCount || 0; // Adjust
  } catch (err) {
    console.error("Error fetching users:", err);
    errorMsg.value = err.message || 'Failed to load users.';
  } finally {
    isLoading.value = false;
  }
};

const debouncedFetchUsers = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    pagination.page = 1; // Reset to first page on search/filter
    fetchUsers();
  }, 500); // 500ms debounce
};

const applyFiltersAndFetch = () => {
  pagination.page = 1;
  fetchUsers();
};

const handlePageChange = (newPage) => {
  pagination.page = newPage;
  fetchUsers();
};

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return 'N/A';
  try {
    return new Date(dateTimeString).toLocaleString();
  } catch (e) {
    return dateTimeString;
  }
};

const getAvatar = (user) => {
  return user.logo_url || getDiceBearAvatarUrl(user);
};

const getRoleTagType = (role) => {
  if (role === 'admin') return 'danger';
  if (role === 'organizer') return 'warning';
  return 'info'; // player
};

// --- Edit Role Modal ---
const openEditRoleModal = (user) => {
  editRoleModal.user = user;
  editRoleModal.newRole = user.role;
  editRoleModal.visible = true;
  editRoleModal.loading = false;
};

const submitUserRoleUpdate = async () => {
  if (!editRoleModal.user || !editRoleModal.newRole) return;
  editRoleModal.loading = true;
  try {
    await adminService.updateAdminUserRole(editRoleModal.user.id, editRoleModal.newRole);
    ElMessage.success(`Role updated for ${editRoleModal.user.first_name}`);
    editRoleModal.visible = false;
    fetchUsers(); // Refresh list
  } catch (err) {
    ElMessage.error(err.message || 'Failed to update role.');
  } finally {
    editRoleModal.loading = false;
  }
};

// --- Ban/Unban User ---
const toggleUserBanStatus = async (user) => {
  const newStatus = user.status === 'banned' ? 'active' : 'banned';
  const actionText = newStatus === 'banned' ? 'ban' : 'unban';
  let banReason = null;

  try {
    if (newStatus === 'banned') {
      const { value } = await ElMessageBox.prompt('Please input ban reason (optional):', `Confirm ${actionText} user`, {
        confirmButtonText: 'Confirm Ban',
        cancelButtonText: 'Cancel',
        inputPattern: /.*/, // Allow empty
        inputErrorMessage: 'Invalid reason',
      });
      banReason = value; // Will be null if cancelled, or empty string if no reason
    } else {
      await ElMessageBox.confirm(`Are you sure you want to ${actionText} ${user.first_name} ${user.last_name}?`, 'Confirm Action', {
        confirmButtonText: `Confirm ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}`,
        cancelButtonText: 'Cancel',
        type: 'warning',
      });
    }

    // If user cancels prompt/confirm, it throws, caught by catch block.
    await adminService.updateAdminUserStatus(user.id, newStatus, banReason);
    ElMessage.success(`User ${user.first_name} has been ${newStatus}.`);
    fetchUsers(); // Refresh list
  } catch (err) {
    if (err !== 'cancel' && err.message !== 'cancel') { // ElMessageBox throws 'cancel' on cancel
        ElMessage.error(err.message || `Failed to ${actionText} user.`);
    }
  }
};

// --- Edit Details Modal ---
const openEditDetailsModal = (user) => {
  editDetailsModal.user = user;
  editDetailsModal.formData = {
    first_name: user.first_name,
    last_name: user.last_name,
    nickname: user.nickname || ''
  };
  editDetailsModal.visible = true;
  editDetailsModal.loading = false;
};

const submitUserDetailsUpdate = async () => {
  if (!editDetailsModal.user) return;
  editDetailsModal.loading = true;
  try {
    await adminService.updateAdminUserDetails(editDetailsModal.user.id, editDetailsModal.formData);
    ElMessage.success(`Details updated for ${editDetailsModal.user.first_name}`);
    editDetailsModal.visible = false;
    fetchUsers(); // Refresh list
  } catch (err) {
    ElMessage.error(err.message || 'Failed to update user details.');
  } finally {
    editDetailsModal.loading = false;
  }
};

// --- Delete User ---
const confirmDeleteUser = async (user) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to permanently delete user ${user.first_name} ${user.last_name} (ID: ${user.id})? This action cannot be undone.`,
      'Confirm Deletion',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'error',
      }
    );
    // If confirmed:
    await adminService.deleteAdminUser(user.id);
    ElMessage.success(`User ${user.first_name} deleted successfully.`);
    fetchUsers(); // Refresh list
  } catch (err) {
     if (err !== 'cancel') { // ElMessageBox throws 'cancel' on cancel
        ElMessage.error(err.message || 'Failed to delete user.');
    }
  }
};


onMounted(() => {
  fetchUsers();
});

</script>

<style scoped>
.admin-user-table th {
  background-color: var(--color-primary) !important;
  color: var(--color-text-light) !important;
}

.custom-input .el-input__inner,
.custom-select .el-input__inner {
  background-color: var(--color-primary-dark);
  border-color: var(--color-border-light);
  color: var(--color-text-light);
}
.custom-input .el-input__inner::placeholder,
.custom-select .el-input__inner::placeholder {
  color: var(--color-text-muted);
}

/* Ensure dialogs also pick up some theme variables if needed */
.custom-dialog {
  background-color: var(--color-primary);
  color: var(--color-text-light);
}
.custom-dialog .el-dialog__title {
  color: var(--color-text-light);
}
.custom-dialog .el-form-item__label {
  color: var(--color-text-muted);
}
.el-table {
    --el-table-border-color: var(--color-primary);
    --el-table-border: 1px solid var(--el-table-border-color);
    --el-table-text-color: var(--color-white);
    --el-table-header-text-color: var(--el-text-color-secondary);
    --el-table-row-hover-bg-color: var(--color-secondary);
    --el-table-current-row-bg-color: var(--color-primary);
    --el-table-header-bg-color: var(--color-primary);
    --el-table-fixed-box-shadow: var(--el-box-shadow-light);
    --el-table-bg-color: var(--color-primary);
    --el-table-tr-bg-color: var(--color-primary);
    --el-table-expanded-cell-bg-color: var(--color-primary);
    --el-table-fixed-left-column: inset 10px 0 10px -10px rgba(0, 0, 0, 0.15);
    --el-table-fixed-right-column: inset -10px 0 10px -10px rgba(0, 0, 0, 0.15);
    --el-table-index: var(--el-index-normal);
    background-color: var(--color-primary);
    box-sizing: border-box;
    color: var(--el-table-text-color);
    font-size: var(--el-font-size-base);
    height: -moz-fit-content;
    height: fit-content;
    max-width: 100%;
    overflow: hidden;
    position: relative;
    width: 100%;
}
.el-pagination{
    --el-pagination-font-size: 14px;
    --el-pagination-bg-color: var(--color-primary);
    --el-pagination-text-color: var(--color-white);
    --el-pagination-border-radius: 2px;
    --el-pagination-button-color: var(--color-primary);
    --el-pagination-button-width: 32px;
    --el-pagination-button-height: 32px;
    --el-pagination-button-disabled-color: var(--el-text-color-placeholder);
    --el-pagination-button-disabled-bg-color: var(--el-fill-color-blank);
    --el-pagination-button-bg-color: var(--el-fill-color);
    --el-pagination-hover-color: var(--el-color-primary);
    --el-pagination-font-size-small: 12px;
    --el-pagination-button-width-small: 24px;
    --el-pagination-button-height-small: 24px;
    --el-pagination-button-width-large: 40px;
    --el-pagination-button-height-large: 40px;
    --el-pagination-item-gap: 16px;
    align-items: center;
    color: var(--el-pagination-text-color);
    display: flex
;
    font-size: var(--el-pagination-font-size);
    font-weight: normal;
    white-space: nowrap;
}
</style>
