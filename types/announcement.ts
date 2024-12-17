export interface Announcement {
  id: number;
  title: string;
  description: string;
  date: string;
  type: 'info' | 'warning' | 'maintenance';
  isRead: boolean;
} 