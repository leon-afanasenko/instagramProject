export interface Notification {
  _id: string;
  user_id: string;
  type: string;
  content: string;
  sender_id: string;
  is_read: boolean;
  created_at: string;
}