import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, CheckCircle, Clock, CreditCard, Search, Calendar, 
  TrendingUp, Bell, Sparkles, AlertCircle, Trash2, XCircle
} from 'lucide-react';
import { Reservation, DashboardStats, NotificationLog } from '../types';

interface RestaurantDashboardProps {
  reservations: Reservation[];
  onUpdateStatus: (id: string, newStatus: 'Confirmada' | 'Pendiente' | 'Cancelada') => void;
  onDeleteReservation: (id: string) => void;
  logs: NotificationLog[];
}

export default function RestaurantDashboard({ 
  reservations, 
  onUpdateStatus, 
  onDeleteReservation,
  logs 
}: RestaurantDashboardProps) {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'Todos' | 'Confirmada' | 'Pendiente' | 'Cancelada'>('Todos');

  // Calculates stats dynamically, baseline matched of the initial prompt request
  const countPending = reservations.filter(r => r.status === 'Pendiente').length;
  const countConfirmed = reservations.filter(r => r.status === 'Confirmada').length;
  
  const stats: DashboardStats = {
    reservasHoy: 21 + reservations.length, // baseline starts at 24 with 3 initial items
    mesasOcupadas: 18,
    pagosPendientes: 2 + countPending, // baseline starts at 3 with 1 initial pending items
    reservasConfirmadas: 19 + countConfirmed // baseline starts at 21 with 2 initial confirmed items
  };

  const filteredReservations = reservations.filter(res => {
    const matchesSearch = 
      res.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
      res.phone.includes(searchTerm);
    const matchesFilter = filterStatus === 'Todos' ? true : res.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 rounded-2xl overflow-hidden shadow-lg border border-slate-800">
      
      {/* Header Panel */}
      <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-lg font-bold font-display tracking-tight text-white flex items-center gap-1.5">
              Panel del Restaurante <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full text-slate-400 font-normal">Sincronización Activa</span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Panel Administrativo ReservaPro • Demostración de Backoffice en Vivo</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-400 animate-bounce" />
            <div className="text-[11px]">
              <p className="text-slate-400 leading-none">Canal WhatsApp</p>
              <p className="font-bold text-white text-xs mt-0.5">WhatsApp Webhook Integrado</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dash Area */}
      <div className="p-5 flex-1 overflow-y-auto space-y-6">
        
        {/* Upper cards (Metrics) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <motion.div 
            layout
            className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Reservas Hoy</span>
              <Calendar className="w-4 h-4 text-[#e2e8f0]" />
            </div>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-white font-mono">{stats.reservasHoy}</span>
              <span className="text-[10px] text-emerald-400 font-medium">✨ En vivo</span>
            </div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full blur-2xl"></div>
          </motion.div>

          <motion.div 
            layout
            className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Mesas Ocupadas</span>
              <Users className="w-4 h-4 text-[#e2e8f0]" />
            </div>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-white font-mono">{stats.mesasOcupadas}</span>
              <span className="text-[10px] text-slate-500 font-medium">Capacidad: 85%</span>
            </div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-lime-500/5 rounded-full blur-2xl"></div>
          </motion.div>

          <motion.div 
            layout
            className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Pagos Pendientes</span>
              <Clock className="w-4 h-4 text-orange-400" />
            </div>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-white font-mono">{stats.pagosPendientes}</span>
              <span className="text-[10px] text-orange-400 font-medium">Espera abono</span>
            </div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/5 rounded-full blur-2xl"></div>
          </motion.div>

          <motion.div 
            layout
            className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Reservas Confirmadas</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-white font-mono">{stats.reservasConfirmadas}</span>
              <span className="text-[10px] text-emerald-400 font-medium">Abonadas</span>
            </div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-2xl"></div>
          </motion.div>

        </div>

        {/* Database Search & Table Section */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl overflow-hidden p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
            <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
              <span>📋 Listado de Reservas</span>
              <span className="text-slate-500">({filteredReservations.length})</span>
            </h3>
            
            {/* Filter Buttons */}
            <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
              {(['Todos', 'Confirmada', 'Pendiente', 'Cancelada'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    filterStatus === status 
                      ? 'bg-slate-800 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs">
            <Search className="w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar cliente, celular o número..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent flex-1 focus:outline-none text-slate-200 text-xs"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-slate-500 hover:text-slate-300">
                Limpiar
              </button>
            )}
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-medium">
                  <th className="py-2.5 px-3">Cliente</th>
                  <th className="py-2.5 px-3">Fecha / Hora</th>
                  <th className="py-2.5 px-3 text-center">Pers.</th>
                  <th className="py-2.5 px-3">Abono</th>
                  <th className="py-2.5 px-3">Estado</th>
                  <th className="py-2.5 px-3 text-right">Acciones de Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                <AnimatePresence initial={false}>
                  {filteredReservations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-500 select-none">
                        No hay reservas registradas que coincidan con la búsqueda.
                      </td>
                    </tr>
                  ) : (
                    filteredReservations.map((res) => (
                      <motion.tr
                        key={res.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="group hover:bg-slate-900/50 transition-colors"
                      >
                        <td className="py-3 px-3">
                          <div>
                            <p className="font-bold text-white leading-snug">{res.client}</p>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">{res.phone}</p>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div>
                            <p className="font-medium text-slate-200">{res.date}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{res.time} Hrs</p>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center text-sm font-semibold text-white">
                          {res.guests}
                        </td>
                        <td className="py-3 px-3 font-mono">
                          {res.amountPaid > 0 ? (
                            <span className="text-emerald-400 font-semibold">${res.amountPaid.toLocaleString('es-CL')}</span>
                          ) : (
                            <span className="text-slate-500">$0</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            res.status === 'Confirmada'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : res.status === 'Pendiente'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              res.status === 'Confirmada' 
                                ? 'bg-emerald-400' 
                                : res.status === 'Pendiente' 
                                  ? 'bg-amber-400 animate-pulse' 
                                  : 'bg-rose-400'
                            }`} />
                            {res.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {res.status === 'Pendiente' && (
                              <button
                                onClick={() => onUpdateStatus(res.id, 'Confirmada')}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2 py-1 rounded transition-colors text-[10px]"
                                title="Aprobar abono y confirmar"
                              >
                                Aprobar Abono
                              </button>
                            )}
                            {res.status !== 'Cancelada' ? (
                              <button
                                onClick={() => onUpdateStatus(res.id, 'Cancelada')}
                                className="bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 p-1 rounded transition-all text-[10px]"
                                title="Cancelar Reserva"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => onUpdateStatus(res.id, 'Confirmada')}
                                className="bg-slate-800 hover:bg-emerald-950 hover:text-emerald-400 text-slate-400 p-1 rounded transition-all text-[10px]"
                                title="Reconfirmar"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => onDeleteReservation(res.id)}
                              className="text-slate-600 hover:text-rose-400 p-1 transition-colors"
                              title="Eliminar de la lista"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* Live notification Log Terminal */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-900 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <h4 className="text-xs font-bold text-slate-300 font-display">
                Registro de Actividad en Tiempo Real
              </h4>
            </div>
            <span className="text-[9px] text-slate-500 font-mono">Consola Webhook</span>
          </div>
          
          <div className="h-28 overflow-y-auto space-y-1.5 pr-2 font-mono text-[10px]">
            <AnimatePresence initial={false}>
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-2 py-0.5 border-b border-slate-900 last:border-0"
                >
                  <span className="text-slate-600 shrink-0">{log.time}</span>
                  <span className={`shrink-0 ${
                    log.type === 'success' 
                      ? 'text-emerald-400 font-semibold' 
                      : log.type === 'whatsapp' 
                        ? 'text-sky-400' 
                        : log.type === 'warning'
                          ? 'text-rose-400'
                          : 'text-amber-400'
                  }`}>
                    [{log.type.toUpperCase()}]
                  </span>
                  <span className="text-slate-300 break-all">{log.message}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Info footer */}
      <div className="bg-slate-950 px-6 py-2.5 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between items-center">
        <span>ReservaPro CRM Panel • Dashboard Comercial demo</span>
        <span className="font-mono text-[9px] text-emerald-500">API status: Online</span>
      </div>
    </div>
  );
}
