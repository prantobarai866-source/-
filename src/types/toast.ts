export type ToastType = 'success' | 'warning' | 'info' | 'error';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: ToastType;
  timestamp: number;
  duration?: number; // ms, defaults to 4500
  actionLabel?: string;
  onAction?: () => void;
}
