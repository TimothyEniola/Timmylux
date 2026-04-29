import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useNotificationStore = create(
  persist(
    (set, get) => ({
      notifications: [],
      addNotification: (notification) => {
        const newNotification = {
          id: Date.now().toString(),
          ...notification,
          date: new Date().toISOString(),
          read: false,
        };
        set({ notifications: [newNotification, ...get().notifications] });
      },
      markAsRead: (id) => {
        set({
          notifications: get().notifications.map(notif =>
            notif.id === id ? { ...notif, read: true } : notif
          )
        });
      },
      markAllAsRead: () => {
        set({
          notifications: get().notifications.map(notif => ({ ...notif, read: true }))
        });
      },
      deleteNotification: (id) => {
        set({ notifications: get().notifications.filter(notif => notif.id !== id) });
      },
      getUnreadCount: () => {
        return get().notifications.filter(notif => !notif.read).length;
      }
    }),
    {
      name: 'notification-storage',
    }
  )
);

export default useNotificationStore;