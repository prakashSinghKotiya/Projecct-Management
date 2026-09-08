
import { request } from './apiClient';

export const authApi = {
  register({ name, email, password }) {
    return request('/user/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  login({ email, password }) {
    return request('/user/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getMe() {
    return request('/user/');
  },

  logout() {
    return request('/user/logout', { method: 'POST' });
  },
};

export default authApi;