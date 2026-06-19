import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, Check, CheckCheck, Smartphone, Sparkles, RotateCcw, 
  Lock, ShieldCheck, HelpCircle, ArrowRight, CornerDownLeft, Bot, User
} from 'lucide-react';
import { ChatMessage } from '../types';

interface WhatsAppSimulatorProps {
  onReservationConfirmed: (res: { client: string; phone: string; date: string; time: string; guests: number; amountPaid: number }) => void;
  addNotification: (message: string, type: 'success' | 'whatsapp' | 'info') => void;
}

export default function WhatsAppSimulator({ 
  onReservationConfirmed, 
  addNotification 
}: WhatsAppSimulatorProps) {
  
  // Chat flow state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-system',
      sender: 'ia',
      text: '¡Hola! Bienvenido a ReservaPro Assistant. 🤖\n¿En qué puedo ayudarte hoy? Puedes solicitar una reserva indicando la fecha, hora y cantidad de personas.',
      timestamp: '15:40',
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Captured entity details during conversation
  const [clientDetails, setClientDetails] = useState({
    name: 'Diego Gatica',
    phone: '+56912345678',
    date: '20/06', // Mañana
    time: '20:00',
    guests: 4
  });
  
  // Track conversational progress step
  // 0: Initial greeting and reservation details
  // 1: Client sends details, AI asks for Name and Phone
  // 2: Client sends Name & Phone, AI shows availability + Payment button
  // 3: Payment processed / reservation confirmed
  const [flowStep, setFlowStep] = useState(0); 
  const [paymentPending, setPaymentPending] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  // useEffect(() => {
  //   chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // }, [messages, isTyping]);

  const addMessage = (sender: 'client' | 'ia', text: string, button?: any) => {
    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      sender,
      text,
      timestamp,
      actionButton: button
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  // Automated chatbot simulation logic
  const handleBotResponse = (userText: string, customStep?: number) => {
    setIsTyping(true);
    const textLower = userText.toLowerCase();
    const currentStep = customStep !== undefined ? customStep : flowStep;
    
    setTimeout(() => {
      setIsTyping(false);
      
      if (currentStep === 0) {
        // Did they mention number of people or time? Let's check or assume default "Diego" scenario
        const guestsMatch = textLower.match(/(\d+)\s*personas/) || textLower.match(/para\s*(\d+)/);
        const timeMatch = textLower.match(/(\d{2}:\d{2})/) || textLower.match(/a las\s*(\d+)/);
        
        const updatedDetails = { ...clientDetails };
        if (guestsMatch) updatedDetails.guests = parseInt(guestsMatch[1]);
        if (timeMatch) updatedDetails.time = timeMatch[1].includes(':') ? timeMatch[1] : `${timeMatch[1]}:00`;
        setClientDetails(updatedDetails);
        
        addMessage('ia', 'Perfecto. Entendido. ¿Me podrías indicar tu nombre y número de teléfono por favor?');
        setFlowStep(1);
        addNotification('ReservaPro IA recopilando datos de contacto', 'info');
      } 
      else if (currentStep === 1) {
        // Received Name & Phone, let's parse it
        const parts = userText.split(',');
        const updatedDetails = { ...clientDetails };
        if (parts.length >= 2) {
          updatedDetails.name = parts[0].trim();
          updatedDetails.phone = parts[1].trim();
        } else {
          // Fallback if typed differently
          updatedDetails.name = userText.replace(/[+0-9]/g, '').trim() || 'Diego Gatica';
          const phoneMatch = userText.match(/\+?\d[\d\s-]{7,}\d/);
          if (phoneMatch) updatedDetails.phone = phoneMatch[0];
        }
        setClientDetails(updatedDetails);
        
        addMessage(
          'ia', 
          `Excelente, ${updatedDetails.name || 'Diego'}. Encontramos disponibilidad para ${updatedDetails.guests} personas mañana a las ${updatedDetails.time}.\n\nPara confirmar y reservar tu mesa, debes realizar un abono de $20.000 (este monto se descuenta de tu cuenta final).`,
          {
            text: '💳 Confirmar Reserva y Pagar Abono',
            type: 'confirm_payment'
          }
        );
        addNotification('Disponibilidad confirmada. Abono solicitado.', 'success');
        setFlowStep(2);
        setPaymentPending(true);
      } 
      else if (currentStep === 2) {
        // Fallback or user typed after payment.
        addMessage('ia', 'Por favor, haz clic en el botón de abono de arriba para confirmar y asegurar tu mesa.');
      }
      else {
        addMessage('ia', 'Tu reserva ya está confirmada y registrada en el panel del restaurante. ¡Te esperamos! 🥂');
      }
    }, 1200);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText;
    addMessage('client', userText);
    setInputText('');
    
    addNotification('Mensaje enviado por WhatsApp', 'whatsapp');
    handleBotResponse(userText);
  };

  // Simulates clicking the payment button
  const handleConfirmReservation = () => {
    if (paymentProcessing || isPaid) return;
    
    setPaymentProcessing(true);
    addNotification('Procesando abono de $20.000...', 'info');

    setTimeout(() => {
      setPaymentProcessing(false);
      setIsPaid(true);
      setPaymentPending(false);
      setFlowStep(3);
      
      // Send confirmation messages in chat
      addMessage('ia', '¡Abono recibido correctamente! 💰\n\nReserva confirmada exitosamente.\n\n📅 Fecha: Mañana (20/06)\n⏰ Hora: ' + clientDetails.time + '\n👥 Personas: ' + clientDetails.guests + '\n👤 Nombre: ' + clientDetails.name + '\n📞 Celular: ' + clientDetails.phone + '\n\n¡Tu mesa está asegurada! Te llegará un recordatorio 2 horas antes.');
      addMessage('ia', '🟢 Reserva Confirmada');
      
      addNotification('¡Reserva Confirmada! Mesa asegurada en el sistema.', 'success');
      
      // Dispatch callback to update Restaurant Panel
      onReservationConfirmed({
        client: clientDetails.name,
        phone: clientDetails.phone,
        date: clientDetails.date,
        time: clientDetails.time,
        guests: clientDetails.guests,
        amountPaid: 20000
      });
    }, 1500);
  };

  // Fully guided quick automation
  const triggerGuidedStep = (stepIndex: number) => {
    if (stepIndex === 1) {
      setInputText('Hola, quiero reservar para mañana a las 20:00 para 4 personas.');
    } else if (stepIndex === 2) {
      setInputText('Diego Gatica, +56912345678');
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'welcome-system',
        sender: 'ia',
        text: '¡Hola! Bienvenido a ReservaPro Assistant. 🤖\n¿En qué puedo ayudarte hoy? Puedes solicitar una reserva indicando la fecha, hora y cantidad de personas.',
        timestamp: '15:40',
      }
    ]);
    setInputText('');
    setFlowStep(0);
    setPaymentPending(false);
    setIsPaid(false);
    setClientDetails({
      name: 'Diego Gatica',
      phone: '+56912345678',
      date: '20/06',
      time: '20:00',
      guests: 4
    });
    addNotification('Simulación de WhatsApp reiniciada.', 'info');
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-md">
      
      {/* Simulation Banner Info */}
      <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-2 flex items-center justify-between text-xs text-emerald-800">
        <div className="flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>Simulador de Cliente (WhatsApp)</span>
        </div>
        <button 
          onClick={handleReset}
          className="flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-semibold bg-emerald-100 hover:bg-emerald-200 transition-colors px-2 py-1 rounded"
          title="Reiniciar Simulación"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reiniciar</span>
        </button>
      </div>

      {/* Mobile Frame Simulation container */}
      <div className="p-4 flex-1 flex flex-col justify-center items-center bg-radial from-slate-100 to-slate-200 overflow-y-auto">
        
        {/* Quick Demo Pre-fills Assistant */}
        <div className="w-full max-w-[420px] mb-3 flex flex-col gap-1.5 p-2 bg-white rounded-xl border border-slate-200 shadow-sm text-xs">
          <div className="font-semibold text-slate-700 flex items-center justify-between">
            <span>⚡ Modo Demostración Rápida</span>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">Fácil</span>
          </div>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            Puedes escribir libremente en el chat o usar estos botones rápidos para completar la demo en 10 segundos:
          </p>
          <div className="grid grid-cols-2 gap-2 mt-1.5">
            <button
              onClick={() => triggerGuidedStep(1)}
              disabled={flowStep > 0}
              className={`py-1.5 px-2 rounded-lg text-left transition-all border text-[11px] flex flex-col ${
                flowStep === 0 
                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200 font-medium' 
                  : 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed'
              }`}
            >
              <span className="text-[9px] uppercase tracking-wider text-emerald-600 font-bold">Paso 1</span>
              <span>1. Pedir Reserva</span>
            </button>
            <button
              onClick={() => triggerGuidedStep(2)}
              disabled={flowStep !== 1}
              className={`py-1.5 px-2 rounded-lg text-left transition-all border text-[11px] flex flex-col ${
                flowStep === 1 
                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200 font-medium' 
                  : 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed'
              }`}
            >
              <span className="text-[9px] uppercase tracking-wider text-emerald-600 font-bold">Paso 2</span>
              <span>2. Enviar Datos</span>
            </button>
          </div>
        </div>

        {/* iPhone Mobile Wrapper */}
        <div className="w-full max-w-[420px] h-[660px] bg-neutral-900 rounded-[40px] p-3 shadow-xl relative border-[4px] border-neutral-800 flex flex-col">
          {/* Top Notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-neutral-900 rounded-b-xl z-20 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-neutral-800 absolute left-4"></div>
            <div className="w-12 h-1 rounded-full bg-neutral-800"></div>
          </div>

          {/* Screen Content - Styled like WhatsApp */}
          <div className="flex-1 rounded-[30px] overflow-hidden flex flex-col bg-[#efeae2] relative text-slate-800">
            
            {/* WhatsApp Header */}
            <div className="bg-[#075e54] text-white pt-6 pb-2.5 px-4 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-teal-100 border border-white/20 flex items-center justify-center relative shadow-sm overflow-hidden text-[#075e54] font-bold text-sm">
                  <div className="absolute inset-0 bg-emerald-600 flex items-center justify-center text-white">
                    <Bot className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-sm">ReservaPro IA</span>
                    <span className="bg-emerald-500 rounded-full p-0.5 text-white flex items-center justify-center" style={{ width: '12px', height: '12px' }}>
                      <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                    </span>
                  </div>
                  <div className="text-[10px] text-teal-100/90 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Asistente Inteligente • En línea</span>
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-teal-100 font-mono bg-black/10 px-1.5 py-0.5 rounded">
                WhatsApp Demo
              </div>
            </div>

            {/* Chat Messages */}
            <div 
              className="flex-1 p-3 overflow-y-auto space-y-3 flex flex-col bg-opacity-35 bg-[radial-gradient(#dfdcd6_10%,transparent_11%)]"
              style={{ backgroundSize: '12px 12px' }}
            >
              <div className="mx-auto my-1 bg-[#d1ebf4] text-slate-600 text-[10px] px-2.5 py-1 rounded-md text-center max-w-[85%] shadow-sm font-medium">
                🔒 Las reservas están protegidas con inteligencia artificial de ReservaPro.
              </div>

              <AnimatePresence initial={false}>
                {messages.map((msg) => {
                  const isIA = msg.sender === 'ia';
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className={`flex ${isIA ? 'justify-start' : 'justify-end'} w-full`}
                    >
                      <div 
                        className={`max-w-[85%] rounded-xl px-3 py-2 shadow-sm relative group text-xs ${
                          isIA 
                            ? 'bg-white text-slate-800 rounded-tl-none' 
                            : 'bg-[#dcef9b] text-slate-900 rounded-tr-none'
                        }`}
                      >
                        {/* Sender Label */}
                        <div className="flex items-center justify-between gap-4 mb-0.5">
                          <span className={`text-[9px] font-bold uppercase tracking-wider ${isIA ? 'text-teal-700' : 'text-emerald-700'}`}>
                            {isIA ? 'ReservaPro Bot' : 'Tú'}
                          </span>
                        </div>

                        {/* Bubble Text */}
                        <p className="whitespace-pre-line leading-relaxed text-[12px]">{msg.text}</p>
                        
                        {/* Time & Double Check status */}
                        <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-500">
                          <span>{msg.timestamp}</span>
                          {!isIA && <CheckCheck className="w-3.5 h-3.5 text-sky-500" />}
                        </div>

                        {/* Interactive embedded button inside chat */}
                        {msg.actionButton && msg.actionButton.type === 'confirm_payment' && (
                          <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col gap-2">
                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-slate-600 space-y-1">
                              <div className="font-bold text-slate-800 text-[11px] flex justify-between">
                                <span>Abono de Confirmación</span>
                                <span className="text-emerald-600">$20.000</span>
                              </div>
                              <div className="text-[9px] text-slate-400 flex items-center gap-1">
                                <Lock className="w-2.5 h-2.5 text-slate-400" />
                                <span>Operado por ReservaPro Secure Pay</span>
                              </div>
                            </div>
                            
                            {isPaid ? (
                              <button
                                disabled
                                className="w-full bg-emerald-50 text-emerald-700 border border-emerald-200 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-default"
                              >
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Pago Confirmado $20.000
                              </button>
                            ) : (
                              <button
                                onClick={handleConfirmReservation}
                                disabled={paymentProcessing}
                                className={`w-full text-white font-bold py-2 px-3 rounded-lg text-xs shadow-md transition-all flex items-center justify-center gap-1.5 ${
                                  paymentProcessing 
                                    ? 'bg-slate-400 cursor-wait' 
                                    : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-shadow'
                                }`}
                              >
                                {paymentProcessing ? (
                                  <>
                                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Verificando pago...</span>
                                  </>
                                ) : (
                                  <>
                                    <span>Pagar $20.000 y Confirmar</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}

                {/* Animated Typing Status */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-start w-full"
                  >
                    <div className="bg-white rounded-xl rounded-tl-none px-3 py-2 shadow-sm text-slate-500 text-xs flex items-center gap-1.5">
                      <div className="flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                      <span className="text-[10px] text-slate-400 italic">ReservaPro está escribiendo...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={chatEndRef} />
            </div>

            {/* Simulated Payment Success Modal Layer */}
            <AnimatePresence>
              {paymentProcessing && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/60 z-30 flex items-center justify-center p-4"
                >
                  <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-white rounded-2xl p-5 w-full max-w-[280px] text-center shadow-2xl border border-slate-100 flex flex-col items-center gap-3"
                  >
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 animate-pulse">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Pasarela de Pago</h4>
                      <p className="text-slate-500 text-[11px] mt-1">
                        Simulando transacción mediante abono ReservaPro
                      </p>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1.4, ease: 'easeInOut' }}
                        className="bg-emerald-500 h-full"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Monto: CLP $20.000 • Diego Gatica
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Keyboard / Input Box */}
            <form onSubmit={handleSendMessage} className="bg-[#f0f0f0] p-2 flex items-center gap-2 border-t border-slate-200">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Escribe un mensaje aquí..."
                className="flex-1 bg-white border border-slate-200 rounded-full px-4 py-1.5 text-[12px] focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-all ${
                  inputText.trim() 
                    ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-90 shadow-sm' 
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                <Send className="w-3.5 h-3.5 text-center ml-0.5" />
              </button>
            </form>

          </div>
        </div>

      </div>

      {/* Footer info about simulation */}
      <div className="bg-slate-100 px-4 py-2 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between items-center bg-white">
        <span className="flex items-center gap-1 text-slate-600 font-medium">
          <Smartphone className="w-3 h-3 text-slate-400" /> WhatsApp Simulador v1.0
        </span>
        <span className="text-slate-400 font-mono">ReservaPro Bot IA</span>
      </div>
    </div>
  );
}
