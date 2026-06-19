export type ReservationStatus = 'Confirmada' | 'Pendiente' | 'Cancelada';

export interface Reservation {
  id: string;
  client: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: ReservationStatus;
  amountPaid: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'client' | 'ia';
  text: string;
  timestamp: string;
  isSystem?: boolean;
  actionButton?: {
    text: string;
    type: 'confirm_payment' | 'select_quick_start';
    disabled?: boolean;
  };
}

export interface DashboardStats {
  reservasHoy: number;
  mesasOcupadas: number;
  pagosPendientes: number;
  reservasConfirmadas: number;
}

export interface NotificationLog {
  id: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'whatsapp';
}
