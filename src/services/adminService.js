import apiClient from './apiClient';

/**

 @param {object} params
 @returns {Promise<Object>}
*/
export async function getAdminUsers(params) {
  try {
    const response = await apiClient.get('/admin/users', { params });
    return response.data;
  } catch (error) {
    console.error('[Admin Service] Error fetching admin users (GET /admin/users):', error);
    return { users: [], totalCount: 0 };
  }
}

/**
 * Fetches details for a specific user for the admin panel.
 * USES EXISTING: GET /users/{id} (Assuming backend handles admin authorization for this general endpoint)
 * If a dedicated GET /admin/users/{id} exists or is preferred, update accordingly.
 * @param {string|number} userId The ID of the user.
 * @returns {Promise<Object>} User data.
 */
export async function getAdminUserDetails(userId) {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching admin user details for ${userId} (using GET /users/${userId}):`, error);
    throw error.response?.data || error;
  }
}

/**

 * @param {string|number} userId
 * @param {object} userData
 * @returns {Promise<Object>}
 */
export async function updateAdminUserDetails(userId, userData) {
  try {
    const response = await apiClient.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating details for user ${userId} (using PUT /users/${userId}):`, error);
    throw error.response?.data || error;
  }
}

/**
 * @param {string|number} userId
 * @param {string} role
 * @returns {Promise<Object>}
 */
export async function updateAdminUserRole(userId, role) {
  console.warn(`[Admin Service] updateAdminUserRole called for user ${userId} with role ${role}. This requires a new backend endpoint and will likely fail.`);
  try {
    const response = await apiClient.patch(`/admin/users/${userId}/role-placeholder`, { role });
    return response.data;
  } catch (error) {
    console.error(`Error updating role for user ${userId} (MISSING BACKEND ENDPOINT):`, error);
    throw error.response?.data || new Error('Backend endpoint for updating user role by admin is not implemented.');
  }
}

/**
 * @param {string|number} userId
 * @param {string} status
 * @param {string} [banReason]
 * @returns {Promise<Object>}
 */
export async function updateAdminUserStatus(userId, status, banReason = null) {
  console.warn(`[Admin Service] updateAdminUserStatus called for user ${userId} with status ${status}. This requires a new backend endpoint and will likely fail.`);
  const payload = { status };
  if (banReason && status === 'banned') {
    payload.ban_reason = banReason;
  }
  try {
    const response = await apiClient.patch(`/admin/users/${userId}/status-placeholder`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error updating status for user ${userId} (MISSING BACKEND ENDPOINT):`, error);
    throw error.response?.data || new Error('Backend endpoint for updating user status by admin is not implemented.');
  }
}

/**

 * @param {string|number} userId
 * @returns {Promise<Object>}
 */
export async function deleteAdminUser(userId) {
  try {
    const response = await apiClient.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${userId} (DELETE /admin/users/${userId}):`, error);
    throw error.response?.data || error;
  }
}


export default {
  getAdminUsers,
  getAdminUserDetails,
  updateAdminUserRole,
  updateAdminUserStatus,
  updateAdminUserDetails,
  deleteAdminUser, 
};
