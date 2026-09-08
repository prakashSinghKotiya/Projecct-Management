
import { request } from './apiClient';

export const taskApi = {
  getTasks(projectId, options) {
    return request(`/task/projects/${projectId}/tasks`, options);
  },

  createTask(projectId, data) {
    return request(`/task/projects/${projectId}/createtasks`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateTask(taskId, data) {
    return request(`/task/updatetasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteTask(taskId) {
    return request(`/task/deletetasks/${taskId}`, { method: 'DELETE' });
  },
};

export default taskApi;