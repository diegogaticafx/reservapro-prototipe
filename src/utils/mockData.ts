import { Reservation } from '../types';

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-maria-perez',
    client: 'María Pérez',
    phone: '+56988776655',
    date: '20/06',
    time: '21:00',
    guests: 2,
    status: 'Pendiente',
    amountPaid: 0,
    createdAt: '2026-06-18T14:15:00Z',
  },
  {
    id: 'res-juan-soto',
    client: 'Juan Soto',
    phone: '+56977665544',
    date: '21/06',
    time: '19:30',
    guests: 6,
    status: 'Confirmada',
    amountPaid: 30000,
    createdAt: '2026-06-18T11:30:00Z',
  },
  {
    id: 'res-loreto-munoz',
    client: 'Carlos Andrade',
    phone: '+56966554433',
    date: '20/06',
    time: '22:15',
    guests: 3,
    status: 'Confirmada',
    amountPaid: 15000,
    createdAt: '2026-06-18T10:05:00Z',
  }
];

export const SUGGESTED_STEPS = [
  {
    id: 'step-1',
    label: '1. Saludo Inicial',
    chatMessage: 'Hola, quiero reservar para mañana a las 20:00 para 4 personas.',
    aiResponse: 'Perfecto. ¿Me indicas tu nombre y teléfono?',
    nextStepId: 'step-2',
  },
  {
    id: 'step-2',
    label: '2. Enviar Datos',
    chatMessage: 'Diego Gatica, +56912345678',
    aiResponse: 'Excelente. Encontramos disponibilidad para 4 personas mañana a las 20:00. Para confirmar la reserva debes realizar un abono de $20.000.',
    nextStepId: 'step-3',
  },
];
