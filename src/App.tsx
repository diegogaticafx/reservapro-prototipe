import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, Clock, ShieldCheck, Zap, Database, Smartphone, Check, 
  RotateCcw, Sparkles, AlertCircle, FileText, UtensilsCrossed,
  MessageSquareCode, HelpCircle
} from 'lucide-react';
import WhatsAppSimulator from './components/WhatsAppSimulator';
import RestaurantDashboard from './components/RestaurantDashboard';
import { INITIAL_RESERVATIONS } from './utils/mockData';
import { Reservation, NotificationLog } from './types';

export default function App() {
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    // Attempt local storage cache or fallback to default INITIAL_RESERVATIONS
    const cached = localStorage.getItem('reservapro_reservations');
    return cached ? JSON.parse(cached) : INITIAL_RESERVATIONS;
  });

  const [logs, setLogs] = useState<NotificationLog[]>(() => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return [
      {
        id: 'log-boot-1',
        time: timeStr,
        type: 'info',
        message: 'ReservaPro CRM inicializado en puerto virtual 3000.'
      },
      {
        id: 'log-boot-2',
        time: timeStr,
        type: 'info',
        message: 'Webhook de WhatsApp registrado: https://api.reservapro.io/v1/webhook'
      },
      {
        id: 'log-boot-3',
        time: timeStr,
        type: 'info',
        message: 'Inteligencia artificial cargada: Modelo ReservaPro-Chef-LLM'
      }
    ];
  });

  // Sync to local storage for persistent demo usage
  useEffect(() => {
    localStorage.setItem('reservapro_reservations', JSON.stringify(reservations));
  }, [reservations]);

  const addLog = (message: string, type: 'info' | 'success' | 'warning' | 'whatsapp') => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newLog: NotificationLog = {
      id: Math.random().toString(36).substring(7),
      time: timeStr,
      type,
      message
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50 logs representing a busy system
  };

  const handleReservationConfirmedFromWhatsApp = (res: { 
    client: string; 
    phone: string; 
    date: string; 
    time: string; 
    guests: number; 
    amountPaid: number;
  }) => {
    // Check if Diego Gatica already exists, or other user
    const existsIndex = reservations.findIndex(r => r.client.toLowerCase() === res.client.toLowerCase());
    
    if (existsIndex >= 0) {
      // Update existing
      const updated = [...reservations];
      updated[existsIndex] = {
        ...updated[existsIndex],
        status: 'Confirmada',
        amountPaid: res.amountPaid,
        guests: res.guests,
        time: res.time,
        date: res.date
      };
      setReservations(updated);
      addLog(`Reserva actualizada para ${res.client}: abono de $${res.amountPaid.toLocaleString('es-CL')} aprobado`, 'success');
    } else {
      // Register brand new reservation at top
      const newRes: Reservation = {
        id: 'res-' + Math.random().toString(36).substring(7),
        client: res.client,
        phone: res.phone,
        date: res.date,
        time: res.time,
        guests: res.guests,
        status: 'Confirmada',
        amountPaid: res.amountPaid,
        createdAt: new Date().toISOString()
      };
      setReservations(prev => [newRes, ...prev]);
      addLog(`Nueva reserva confirmada: ${res.client} (${res.guests} personas) para mañana ` + res.time, 'success');
    }
  };

  const handleUpdateStatus = (id: string, newStatus: 'Confirmada' | 'Pendiente' | 'Cancelada') => {
    const updated = reservations.map(res => {
      if (res.id === id) {
        addLog(`Cambio de estado administrativo: ${res.client} ➔ ${newStatus}`, newStatus === 'Confirmada' ? 'success' : 'warning');
        return { 
          ...res, 
          status: newStatus,
          amountPaid: newStatus === 'Confirmada' && res.amountPaid === 0 ? 20000 : res.amountPaid // simulate payment if confirmed manually
        };
      }
      return res;
    });
    setReservations(updated);
  };

  const handleDeleteReservation = (id: string) => {
    const target = reservations.find(r => r.id === id);
    if (target) {
      addLog(`Reserva eliminada del sistema: ${target.client}`, 'warning');
    }
    setReservations(prev => prev.filter(res => res.id !== id));
  };

  const handleResetEntireDemo = () => {
    localStorage.removeItem('reservapro_reservations');
    setReservations(INITIAL_RESERVATIONS);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs([
      {
        id: 'log-reset',
        time: timeStr,
        type: 'info',
        message: 'Simulador de base de datos reiniciado a valores por defecto.'
      },
      {
        id: 'log-boot-1',
        time: timeStr,
        type: 'info',
        message: 'ReservaPro CRM inicializado en puerto virtual 3000.'
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col selection:bg-emerald-500/10 selection:text-emerald-900">
      
      {/* Top Professional Navigation Brand Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/10">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 font-display">Reserva<span className="text-emerald-600">Pro</span></span>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  PROTOTIPO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Automatización de reservas con Inteligencia Artificial</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Estado Demo: En Proceso</span>
            </div>
            <button
              onClick={handleResetEntireDemo}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition-all duration-200 px-3 py-1.5 rounded-xl flex items-center gap-1"
              title="Restablecer todos los datos al estado de partida"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar Demo</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Interactive Demo Sandbox Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        
        {/* Interaction alert clue instructions banner */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-600 text-xs">
          <div className="flex items-start gap-2.5">
            <div className="p-1 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800">💡 Instrucciones de Demostración:</p>
              <p className="text-slate-500 mt-0.5">
                Utiliza el <strong>Simulador de WhatsApp (Izquierda)</strong> para generar o actualizar una reserva con 
                Diego Gatica. Luego, observa cómo el <strong>Panel del Restaurante (Derecha)</strong> recibe la reserva, 
                actualiza las métricas clave y actualiza la tabla en tiempo real.
              </p>
            </div>
          </div>
          <div className="shrink-0 flex gap-2">
            <span className="bg-blue-50 text-blue-800 border border-blue-100 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              Sincronización WebSocket (Simulada)
            </span>
          </div>
        </div>

        {/* Split Screen Layout Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* Pantalla 1: WhatsApp Simulador (Left Column - occupies 5/12 cols) */}
          <div className="xl:col-span-5 h-[810px] flex flex-col">
            <WhatsAppSimulator 
              onReservationConfirmed={handleReservationConfirmedFromWhatsApp}
              addNotification={addLog}
            />
          </div>

          {/* Pantalla 2: Panel del Restaurante (Right Column - occupies 7/12 cols) */}
          <div className="xl:col-span-7 h-[810px] flex flex-col">
            <RestaurantDashboard 
              reservations={reservations}
              onUpdateStatus={handleUpdateStatus}
              onDeleteReservation={handleDeleteReservation}
              logs={logs}
            />
          </div>

        </div>

      </main>

      {/* Hero Explanatory Pitch Banner - Staggered entrance */}
      <section className="bg-slate-900 text-white py-8 px-4 sm:px-6 lg:px-8 border-t border-b border-slate-800 relative overflow-hidden">
        
        {/* Subtle radial light decor */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full text-xs text-emerald-400 font-medium">
                <Sparkles className="w-3 h-3" />
                <span>¿Cómo funciona ReservaPro? Presentación en 3 Minutos</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
                Automatiza las reservas de tu restaurante vía <span className="text-emerald-400">WhatsApp + IA</span>
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-2xl">
                Tus clientes conversan con un asistente virtual inteligente en WhatsApp para agendar una mesa en segundos. 
                La IA solicita datos de contacto, comprueba la disponibilidad, procesa abonos contra inasistencias y registra 
                todo instantáneamente en el Panel Administrativo del restaurant.
              </p>
            </div>

            {/* Three key micro advantages cards */}
            <div className="grid grid-cols-3 gap-3 max-w-md w-full shrink-0">
              <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex flex-col items-center text-center">
                <Smartphone className="w-5 h-5 text-emerald-400 mb-1" />
                <h4 className="font-bold text-[10px] text-white">Atención 24/7</h4>
                <p className="text-[9px] text-slate-500 mt-0.5">Responde al instante inclusive festivos</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex flex-col items-center text-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400 mb-1" />
                <h4 className="font-bold text-[10px] text-white">Cero Inasistencias</h4>
                <p className="text-[9px] text-slate-500 mt-0.5">Abonos integrados de seguridad</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex flex-col items-center text-center">
                <Database className="w-5 h-5 text-emerald-400 mb-1" />
                <h4 className="font-bold text-[10px] text-white font-sans">CRM Simple</h4>
                <p className="text-[9px] text-slate-500 mt-0.5">Controla mesas y pagos en un panel</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Roadmap / Live Demo Pitch Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <p className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <span>🚀 ReservaPro © 2026</span>
            </p>
            <p className="text-slate-400 mt-1">Este prototipo interactivo demuestra visualmente la integración entre canales de mensajería (WhatsApp webhook API) y paneles de control empresarial.</p>
          </div>
          <div className="flex gap-4 font-medium">
            <a href="#github" className="hover:text-slate-900 transition-colors">Documentación de la API</a>
            <span>•</span>
            <a href="#terms" className="hover:text-slate-900 transition-colors">Seguridad de Datos</a>
            <span>•</span>
            <a href="#privacy" className="hover:text-slate-900 transition-colors">Contacto Comercial</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
