
import { request } from './apiClient';

export const projectApi = {
  getMyProjects(options) {
    return request('/project/', options);
  },

  getProject(id, options) {
    return request(`/project/getproject/${id}`, options);
  },

  createProject(data) {
    return request('/project/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateProject(id, data) {
    return request(`/project/update/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteProject(id) {
    return request(`/project/delete/${id}`, { method: 'DELETE' });
  },

  addMember(id, email) {
    return request(`/project/add/${id}/members`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

export default projectApi;