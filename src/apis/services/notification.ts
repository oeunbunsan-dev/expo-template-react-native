import { apiCore } from '../core';

class NotificationService {

  async getNotifications() {
    const response = await apiCore.get('/notifications/');
    return response.data;

  }

  async markAsRead(id: string | number) {
    const response = await apiCore.patch(`/notifications/${id}/read`);
    return response.data;
  }

  async markAllAsRead() {
    const response = await apiCore.post('/notifications/read-all');
    return response.data;
  }
}

export const notificationService = new NotificationService();
