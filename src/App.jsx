import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Activity, 
  Calendar, 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  HeartPulse, 
  Award,
  ChevronRight,
  Menu,
  X,
  MessageCircle
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // States for Shuffler (Card 1)
  const [shufflerItems, setShufflerItems] = useState([
    { id: 1, title: 'Fisioterapia Ortopédica', desc: 'Tratamento de hérnias de disco, coluna e pós-operatório', badge: 'Alta Eficiência' },
    { id: 2, title: 'Liberação Miofascial', desc: 'Desativação de pontos gatilho e alívio muscular imediato', badge: 'Manual & Instrumental' },
    { id: 3, title: 'Pilates Clínico & RPG', desc: 'Reabilitação postural, fortalecimento de core e flexibilidade', badge: 'Estabilização' },
  ]);

  // States for Typewriter (Card 2)
  const [telemetryText, setTelemetryText] = useState('');
  const telemetryMessages = [
    "[09:14] Avaliação Biomecânica concluída...",
    "[09:15] Tensão muscular reduzida em 87% com Liberação Miofascial",
    "[09:16] Estabilização segmentar ativada no Pilates Clínico",
    "[09:17] Paciente sem dor: Amplitude de movimento 100% restaurada"
  ];
  const [msgIdx, setMsgIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  // States for Cursor Scheduler (Card 3)
  const [selectedDays, setSelectedDays] = useState(['TUE', 'THU']);
  const [cursorPos, setCursorPos] = useState({ x: 10, y: 10 });
  const [isClicking, setIsClicking] = useState(false);

  // References for GSAP
  const heroRef = useRef(null);
  const philosophyRef = useRef(null);
  const protocolRef = useRef(null);

  // Navbar scroll observer
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setNavScrolled(true);
      } else {
        setNavScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Card 1 Shuffler Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setShufflerItems((prev) => {
        const arr = [...prev];
        const last = arr.pop();
        arr.unshift(last);
        return arr;
      });
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Card 2 Typewriter Loop
  useEffect(() => {
    const currentFull = telemetryMessages[msgIdx];
    if (charIdx < currentFull.length) {
      const timeout = setTimeout(() => {
        setTelemetryText((prev) => prev + currentFull[charIdx]);
        setCharIdx((prev) => prev + 1);
      }, 45);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setTelemetryText('');
        setCharIdx(0);
        setMsgIdx((prev) => (prev + 1) % telemetryMessages.length);
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, [charIdx, msgIdx]);

  // Card 3 Scheduler Cursor Animation Simulation
  useEffect(() => {
    const sequence = [
      { x: 30, y: 25, click: false, toggleDay: null },
      { x: 120, y: 40, click: true, toggleDay: 'MON' },
      { x: 210, y: 40, click: true, toggleDay: 'WED' },
      { x: 260, y: 95, click: true, toggleDay: 'SAVE' },
      { x: 20, y: 20, click: false, toggleDay: null },
    ];
    let step = 0;
    const interval = setInterval(() => {
      const target = sequence[step];
      setCursorPos({ x: target.x, y: target.y });
      if (target.click) {
        setIsClicking(true);
        setTimeout(() => setIsClicking(false), 200);
        if (target.toggleDay && target.toggleDay !== 'SAVE') {
          setSelectedDays((prev) => 
            prev.includes(target.toggleDay) 
              ? prev.filter(d => d !== target.toggleDay) 
              : [...prev, target.toggleDay]
          );
        }
      }
      step = (step + 1) % sequence.length;
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  // GSAP Animations Context
  useEffect(() => {
    let ctx = gsap.context(() => {
      // Hero staggered entrance
      gsap.from('.hero-anim', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out'
      });

      // Philosophy ScrollTrigger Reveal
      gsap.from('.philosophy-text', {
        scrollTrigger: {
          trigger: philosophyRef.current,
          start: 'top 75%',
        },
        y: 50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out'
      });

      // Sticky Stacking Cards (Protocol Section)
      const cards = gsap.utils.toArray('.sticky-card');
      cards.forEach((card, index) => {
        if (index < cards.length - 1) {
          gsap.to(card, {
            scrollTrigger: {
              trigger: card,
              start: 'top top+=100',
              endTrigger: cards[index + 1],
              end: 'top top+=100',
              scrub: true,
            },
            scale: 0.92,
            opacity: 0.5,
            filter: 'blur(10px)',
            ease: 'none'
          });
        }
      });

    }, [heroRef, philosophyRef, protocolRef]);

    return () => ctx.revert();
  }, []);

  // WhatsApp Link Helper
  const whatsappUrl = "https://wa.me/5543996251566?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o%20fisioterap%C3%AAtica%20na%20Quality%20Cl%C3%ADnica%20do%20Movimento.";

  return (
    <div className="relative w-full min-h-screen bg-[#F2F0E9] text-[#1A1A1A] font-sans selection:bg-[#CC5833] selection:text-white">
      
      {/* GLOBAL SVG NOISE OVERLAY (Opacidade 0.05) */}
      <div className="pointer-events-none fixed inset-0 z-[999] opacity-[0.05] mix-blend-overlay">
        <svg className="h-full w-full">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* A. NAVBAR — "A ILHA FLUTUANTE" */}
      <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-6xl transition-all duration-300">
        <div className={`flex items-center justify-between px-6 py-3.5 rounded-full transition-all duration-300 ${
          navScrolled 
            ? 'bg-[#F2F0E9]/85 backdrop-blur-xl border border-[#2E4036]/15 shadow-xl shadow-[#2E4036]/5' 
            : 'bg-[#2E4036]/60 backdrop-blur-md border border-white/10 text-white'
        }`}>
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full bg-[#CC5833] flex items-center justify-center text-white font-bold shadow-md shadow-[#CC5833]/30 transition-transform group-hover:scale-105">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className={`font-bold tracking-tight text-base leading-none ${navScrolled ? 'text-[#2E4036]' : 'text-white'}`}>
                QUALITY
              </span>
              <span className={`text-[10px] tracking-widest uppercase font-mono-data opacity-80 ${navScrolled ? 'text-[#2E4036]' : 'text-white/80'}`}>
                Clínica do Movimento
              </span>
            </div>
          </a>

          {/* Desktop Links */}
          <nav className={`hidden md:flex items-center gap-8 text-sm font-medium ${navScrolled ? 'text-[#2E4036]' : 'text-white/90'}`}>
            <a href="#modalidades" className="hover:text-[#CC5833] transition-colors">Modalidades</a>
            <a href="#filosofia" className="hover:text-[#CC5833] transition-colors">Filosofia</a>
            <a href="#protocolo" className="hover:text-[#CC5833] transition-colors">Protocolo</a>
            <a href="#avaliacoes" className="hover:text-[#CC5833] transition-colors">Depoimentos</a>
            <a href="#contato" className="hover:text-[#CC5833] transition-colors">Localização</a>
          </nav>

          {/* CTA Button */}
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#CC5833] text-white text-xs font-semibold uppercase tracking-wider magnetic-btn btn-sliding-bg shadow-md shadow-[#CC5833]/30"
          >
            <span>Agendar Avaliação</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-full ${navScrolled ? 'text-[#2E4036]' : 'text-white'}`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-6 rounded-3xl bg-[#2E4036] text-white border border-white/10 shadow-2xl flex flex-col gap-4 animate-in fade-in slide-in-from-top-4">
            <a href="#modalidades" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-[#CC5833]">Modalidades</a>
            <a href="#filosofia" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-[#CC5833]">Filosofia</a>
            <a href="#protocolo" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-[#CC5833]">Protocolo</a>
            <a href="#avaliacoes" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-[#CC5833]">Depoimentos</a>
            <a href="#contato" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-[#CC5833]">Localização</a>
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-center py-3 rounded-full bg-[#CC5833] text-white font-semibold flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Agendar no WhatsApp</span>
            </a>
          </div>
        )}
      </header>

      {/* B. HERO SECTION — "A CENA DE ABERTURA" */}
      <section ref={heroRef} className="relative min-h-[100dvh] flex flex-col justify-end pt-32 pb-16 px-6 md:px-16 overflow-hidden bg-[#2E4036] text-white rounded-b-[3rem] shadow-2xl">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=2000&q=85" 
            alt="Fisioterapia & Reabilitação do Movimento" 
            className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#2E4036]/90 to-transparent" />
        </div>

        {/* Hero Content - Lower Third Left */}
        <div className="relative z-10 max-w-4xl mx-auto md:mx-0">
          {/* Rating Badge */}
          <div className="hero-anim inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 mb-6 text-xs md:text-sm">
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              4.8 <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </span>
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <span className="text-white/90">Google Reviews Londrina</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-300 font-mono-data text-[11px]">Centro | Londrina-PR</span>
          </div>

          {/* Preset A Hero Headline Pattern */}
          <h1 className="hero-anim text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6">
            <span className="block font-sans text-white">O movimento consciente é a</span>
            <span className="block font-drama text-[#CC5833] text-5xl md:text-7xl lg:text-8xl font-normal mt-1">
              sua melhor cura.
            </span>
          </h1>

          <p className="hero-anim text-base md:text-xl text-white/80 max-w-2xl font-normal mb-8 leading-relaxed">
            Especialistas em Fisioterapia Ortopédica, Liberação Miofascial, RPG e Pilates Clínico. 
            Elimine a dor na causa raiz com acompanhamento individualizado no centro de Londrina.
          </p>

          {/* Action Buttons */}
          <div className="hero-anim flex flex-wrap items-center gap-4">
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full bg-[#CC5833] text-white font-semibold text-sm uppercase tracking-wider magnetic-btn btn-sliding-bg shadow-lg shadow-[#CC5833]/40 flex items-center gap-3"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Agendar Avaliação Fisioterapêutica</span>
            </a>

            <a 
              href="#modalidades"
              className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 font-semibold text-sm transition-all flex items-center gap-2"
            >
              <span>Ver Modalidades</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="hero-anim relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 mt-12 border-t border-white/10 max-w-5xl">
          <div>
            <span className="block text-2xl md:text-3xl font-bold text-white font-mono-data">4.8 ★</span>
            <span className="text-xs text-white/70">Avaliação Média no Google</span>
          </div>
          <div>
            <span className="block text-2xl md:text-3xl font-bold text-[#CC5833] font-mono-data">100%</span>
            <span className="text-xs text-white/70">Cuidado Personalizado</span>
          </div>
          <div>
            <span className="block text-2xl md:text-3xl font-bold text-white font-mono-data">Seg - Sex</span>
            <span className="text-xs text-white/70">Atendimento 07h às 20h</span>
          </div>
          <div>
            <span className="block text-2xl md:text-3xl font-bold text-[#CC5833] font-mono-data">Rua Santos</span>
            <span className="text-xs text-white/70">Centro - Londrina/PR</span>
          </div>
        </div>
      </section>

      {/* C. FEATURES (FUNCIONALIDADES) — "ARTEFATOS FUNCIONAIS INTERATIVOS" */}
      <section id="modalidades" className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-4 py-1.5 rounded-full bg-[#2E4036]/10 text-[#2E4036] font-mono-data text-xs uppercase font-semibold tracking-wider">
            Tecnologia & Artefatos de Tratamento
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#1A1A1A] mt-4 mb-4">
            Abordagem Tridimensional do Movimento
          </h2>
          <p className="text-base md:text-lg text-[#1A1A1A]/70">
            Combinamos fisioterapia manual, liberação miofascial e estabilização postural no mesmo espaço.
          </p>
        </div>

        {/* 3 Interactive Feature Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Card 1 — Diagnostic Shuffler */}
          <div className="bg-[#F9F8F3] border border-[#2E4036]/15 rounded-[2.5rem] p-8 shadow-xl shadow-[#2E4036]/5 flex flex-col justify-between hover:border-[#CC5833]/40 transition-all group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#2E4036] text-white flex items-center justify-center">
                  <Activity className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono-data bg-[#CC5833]/10 text-[#CC5833] font-semibold px-3 py-1 rounded-full">
                  Card 01 • Dynamic Shuffler
                </span>
              </div>

              <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Fisioterapia Ortopédica & Manual</h3>
              <p className="text-sm text-[#1A1A1A]/70 mb-6">
                Diagnóstico minucioso para identificar desequilíbrios musculares e restrições articulares.
              </p>

              {/* Shuffler Stack Area */}
              <div className="relative h-44 w-full flex items-center justify-center">
                {shufflerItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className="absolute w-full p-4 rounded-2xl border transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-md"
                    style={{
                      transform: `translateY(${idx * 14}px) scale(${1 - idx * 0.05})`,
                      zIndex: 30 - idx * 10,
                      opacity: 1 - idx * 0.2,
                      backgroundColor: idx === 0 ? '#2E4036' : '#E6E4DC',
                      color: idx === 0 ? '#FFFFFF' : '#1A1A1A',
                      borderColor: idx === 0 ? '#CC5833' : 'rgba(0,0,0,0.08)'
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-sm">{item.title}</span>
                      <span className={`text-[10px] font-mono-data px-2 py-0.5 rounded-full ${idx === 0 ? 'bg-[#CC5833] text-white' : 'bg-black/10 text-black'}`}>
                        {item.badge}
                      </span>
                    </div>
                    <p className={`text-xs ${idx === 0 ? 'text-white/80' : 'text-black/60'}`}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#2E4036]/10 flex items-center justify-between text-xs font-mono-data text-[#2E4036]">
              <span>[ Módulo Ortopédico ]</span>
              <span className="text-[#CC5833] font-bold">Alternando auto →</span>
            </div>
          </div>

          {/* Card 2 — Telemetry Typewriter */}
          <div className="bg-[#1A1A1A] text-white border border-white/10 rounded-[2.5rem] p-8 shadow-2xl flex flex-col justify-between hover:border-[#CC5833]/50 transition-all group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#CC5833] text-white flex items-center justify-center shadow-lg shadow-[#CC5833]/30">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 text-xs font-mono-data bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Live Feed</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">Liberação Miofascial & Alívio</h3>
              <p className="text-sm text-white/70 mb-6">
                Técnicas manuais e instrumentais avançadas para desarmar pontos de gatilho e fascias rígidas.
              </p>

              {/* Typewriter Terminal Display */}
              <div className="bg-black/60 rounded-2xl p-5 border border-white/10 font-mono-data text-xs text-emerald-400 min-h-[140px] flex flex-col justify-between relative overflow-hidden">
                <div className="text-[10px] text-white/40 border-b border-white/10 pb-2 mb-2 flex justify-between">
                  <span>TELEMETRIA DE MOBILIDADE</span>
                  <span>SISTEMA ATIVO</span>
                </div>
                <div className="flex-1">
                  <p className="leading-relaxed text-emerald-300">
                    {telemetryText}
                    <span className="inline-block w-2 h-4 bg-[#CC5833] ml-1 animate-pulse" />
                  </p>
                </div>
                <div className="text-[10px] text-white/40 pt-2 flex justify-between">
                  <span>Quality Fisioterapia</span>
                  <span className="text-[#CC5833]">Londrina/PR</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono-data text-white/60">
              <span>[ Telemetria de Mobilidade ]</span>
              <span className="text-emerald-400">100% Calibrado</span>
            </div>
          </div>

          {/* Card 3 — Cursor Protocol Scheduler */}
          <div className="bg-[#F9F8F3] border border-[#2E4036]/15 rounded-[2.5rem] p-8 shadow-xl shadow-[#2E4036]/5 flex flex-col justify-between hover:border-[#CC5833]/40 transition-all group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#2E4036] text-white flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono-data bg-[#2E4036]/10 text-[#2E4036] font-semibold px-3 py-1 rounded-full">
                  Card 03 • Scheduler
                </span>
              </div>

              <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Pilates Clínico & Estabilização</h3>
              <p className="text-sm text-[#1A1A1A]/70 mb-6">
                Agendamento de sessões individuais ou em pequenos grupos guiados por fisioterapeutas.
              </p>

              {/* Scheduler UI Simulation */}
              <div className="relative bg-white rounded-2xl p-5 border border-[#2E4036]/10 shadow-inner min-h-[140px]">
                <span className="block text-[11px] font-mono-data text-[#1A1A1A]/50 mb-3 uppercase tracking-wider">
                  GRADE SEMANAL DE REABILITAÇÃO
                </span>
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {['MON', 'TUE', 'WED', 'THU', 'FRI'].map((day) => {
                    const isSel = selectedDays.includes(day);
                    return (
                      <div
                        key={day}
                        className={`p-2 rounded-xl text-center text-xs font-bold font-mono-data transition-all ${
                          isSel 
                            ? 'bg-[#CC5833] text-white shadow-md shadow-[#CC5833]/30 scale-105' 
                            : 'bg-[#F2F0E9] text-[#1A1A1A]/70 border border-[#2E4036]/10'
                        }`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center bg-[#2E4036] text-white px-4 py-2 rounded-xl text-xs font-mono-data">
                  <span>Horários: 07h às 20h</span>
                  <span className="bg-[#CC5833] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    Salvar Horário
                  </span>
                </div>

                {/* Animated Simulated Cursor SVG */}
                <div 
                  className={`absolute pointer-events-none transition-all duration-700 ease-out z-40 ${isClicking ? 'scale-90' : 'scale-100'}`}
                  style={{ top: `${cursorPos.y}px`, left: `${cursorPos.x}px` }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="drop-shadow-md">
                    <path d="M5.5 3.5L18.5 12L12.5 13.5L16 20.5L13.5 21.5L10 14.5L5.5 18V3.5Z" fill="#CC5833" stroke="white" strokeWidth="1.5"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#2E4036]/10 flex items-center justify-between text-xs font-mono-data text-[#2E4036]">
              <span>[ Grade do Pilates ]</span>
              <span className="text-[#CC5833] font-bold">Interação Simulada</span>
            </div>
          </div>

        </div>
      </section>

      {/* D. PHILOSOPHY — "O MANIFESTO" */}
      <section id="filosofia" ref={philosophyRef} className="py-32 px-6 md:px-16 bg-[#1A1A1A] text-white rounded-[3rem] my-12 relative overflow-hidden shadow-2xl">
        {/* Organic Texture Overlay */}
        <div className="absolute inset-0 opacity-15">
          <img 
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=2000&q=80" 
            alt="Textura de Movimento" 
            className="w-full h-full object-cover mix-blend-overlay"
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <span className="px-4 py-1.5 rounded-full bg-white/10 text-[#CC5833] font-mono-data text-xs uppercase font-semibold tracking-widest border border-white/10">
            O Manifesto Quality
          </span>

          <div className="mt-12 space-y-8">
            <p className="philosophy-text text-xl md:text-3xl text-white/60 font-light leading-relaxed">
              A maioria das clínicas convencionais foca apenas em anestesiar a dor momentânea com remédios e repouso forçado.
            </p>
            
            <p className="philosophy-text text-3xl md:text-5xl lg:text-6xl font-normal leading-tight">
              <span className="font-sans text-white">Nós focamos em:</span>{' '}
              <span className="font-drama text-[#CC5833] text-4xl md:text-6xl lg:text-7xl block md:inline mt-2 md:mt-0">
                diagnosticar a causa raiz, reeducar a biomecânica e devolver a liberdade do seu movimento.
              </span>
            </p>
          </div>

          <div className="philosophy-text mt-16 pt-12 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <ShieldCheck className="w-8 h-8 text-[#CC5833] mb-3" />
              <h4 className="font-bold text-lg text-white mb-1">Avaliação Biomecânica</h4>
              <p className="text-xs text-white/70">Mapeamento preciso de onde o movimento está travado.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <Sparkles className="w-8 h-8 text-[#CC5833] mb-3" />
              <h4 className="font-bold text-lg text-white mb-1">Sem Tratamentos Genéricos</h4>
              <p className="text-xs text-white/70">Cada sessão é 100% personalizada por fisioterapeutas.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <Award className="w-8 h-8 text-[#CC5833] mb-3" />
              <h4 className="font-bold text-lg text-white mb-1">Nota 4.8 no Google</h4>
              <p className="text-xs text-white/70">Excelência comprovada por dezenas de pacientes em Londrina.</p>
            </div>
          </div>
        </div>
      </section>

      {/* E. PROTOCOL — "ARQUIVO FIXO DE EMPILHAMENTO (STICKY STACKING)" */}
      <section id="protocolo" ref={protocolRef} className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-4 py-1.5 rounded-full bg-[#2E4036]/10 text-[#2E4036] font-mono-data text-xs uppercase font-semibold tracking-wider">
            Metodologia em 3 Fases
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#1A1A1A] mt-4 mb-4">
            Nosso Protocolo de Reabilitação
          </h2>
          <p className="text-base md:text-lg text-[#1A1A1A]/70">
            Conheça o processo passo a passo para sair do estado de dor para o movimento livre.
          </p>
        </div>

        {/* Sticky Stacking Cards Container */}
        <div className="space-y-12">
          
          {/* Card 01 */}
          <div className="sticky-card sticky top-28 bg-[#2E4036] text-white p-8 md:p-14 rounded-[3rem] shadow-2xl border border-white/10 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex-1">
              <span className="text-xs font-mono-data text-[#CC5833] font-bold tracking-widest uppercase block mb-2">
                FASE 01 / INVESTIGAÇÃO
              </span>
              <h3 className="text-2xl md:text-4xl font-bold mb-4">Diagnóstico Biomecânico Integrado</h3>
              <p className="text-white/80 text-sm md:text-base leading-relaxed mb-6">
                Investigamos posturalmente e testes de mobilidade para entender por que a dor se manifestou. Mapeamos compensações musculares e articulares.
              </p>
              <ul className="space-y-2 text-xs font-mono-data text-white/90">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#CC5833]" /> Avaliação postural minuciosa</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#CC5833]" /> Teste de amplitude de movimento</li>
              </ul>
            </div>

            {/* Canvas/SVG Animation 1: Rotating Concentric Rings */}
            <div className="w-48 h-48 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden">
              <svg className="w-32 h-32 animate-[spin_20s_linear_infinite]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#CC5833" strokeWidth="2" strokeDasharray="6 6" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="4 4" />
                <circle cx="50" cy="50" r="15" fill="none" stroke="#CC5833" strokeWidth="2" />
              </svg>
              <span className="absolute font-mono-data text-[10px] text-white/50 bottom-2">FASE 01</span>
            </div>
          </div>

          {/* Card 02 */}
          <div className="sticky-card sticky top-32 bg-[#1A1A1A] text-white p-8 md:p-14 rounded-[3rem] shadow-2xl border border-white/10 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex-1">
              <span className="text-xs font-mono-data text-[#CC5833] font-bold tracking-widest uppercase block mb-2">
                FASE 02 / TRATAMENTO MANUAL
              </span>
              <h3 className="text-2xl md:text-4xl font-bold mb-4">Liberação Miofascial & RPG</h3>
              <p className="text-white/80 text-sm md:text-base leading-relaxed mb-6">
                Intervenção direta nas restrições de fáscia e músculos encurtados. Desativamos os pontos gatilho com terapia manual e aliviamos a compressão articular.
              </p>
              <ul className="space-y-2 text-xs font-mono-data text-white/90">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#CC5833]" /> Alívio de tensão profunda</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#CC5833]" /> Restauração do comprimento muscular</li>
              </ul>
            </div>

            {/* Canvas/SVG Animation 2: Laser Scanning Line */}
            <div className="w-48 h-48 rounded-3xl bg-black/60 border border-white/10 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="grid grid-cols-6 gap-2 w-28 h-28 opacity-40">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-white/60" />
                ))}
              </div>
              <div className="absolute w-full h-1 bg-[#CC5833] shadow-[0_0_15px_#CC5833] animate-[ping_3s_ease-in-out_infinite]" />
              <span className="absolute font-mono-data text-[10px] text-white/50 bottom-2">SCANNER MIOFASCIAL</span>
            </div>
          </div>

          {/* Card 03 */}
          <div className="sticky-card sticky top-36 bg-[#222925] text-white p-8 md:p-14 rounded-[3rem] shadow-2xl border border-white/10 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex-1">
              <span className="text-xs font-mono-data text-[#CC5833] font-bold tracking-widest uppercase block mb-2">
                FASE 03 / FORTALECIMENTO
              </span>
              <h3 className="text-2xl md:text-4xl font-bold mb-4">Pilates Clínico & Estabilização</h3>
              <p className="text-white/80 text-sm md:text-base leading-relaxed mb-6">
                Com a dor controlada, fortalecemos os músculos estabilizadores de coluna e articulações. Garantimos que a lesão não volte ao retornar às suas atividades diárias.
              </p>
              <ul className="space-y-2 text-xs font-mono-data text-white/90">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#CC5833]" /> Músculos do CORE fortalecidos</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#CC5833]" /> Autonomia e prevenção permanente</li>
              </ul>
            </div>

            {/* Canvas/SVG Animation 3: Pulsing Waveform */}
            <div className="w-48 h-48 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden">
              <svg className="w-36 h-20" viewBox="0 0 100 40">
                <path 
                  d="M0 20 Q20 5 40 20 T80 20 T100 20" 
                  fill="none" 
                  stroke="#CC5833" 
                  strokeWidth="3"
                  className="animate-pulse"
                />
              </svg>
              <span className="absolute font-mono-data text-[10px] text-white/50 bottom-2">ESTABILIZAÇÃO ATIVA</span>
            </div>
          </div>

        </div>
      </section>

      {/* F. MODALIDADES & PLANOS DE ATENDIMENTO */}
      <section className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-4 py-1.5 rounded-full bg-[#2E4036]/10 text-[#2E4036] font-mono-data text-xs uppercase font-semibold tracking-wider">
            Planos de Cuidado
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#1A1A1A] mt-4 mb-4">
            Escolha o Seu Formato de Atendimento
          </h2>
          <p className="text-base text-[#1A1A1A]/70">
            Atendimento individualizado com hora marcada no Centro de Londrina.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          {/* Card Pricing 1 */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-[#2E4036]/15 shadow-lg flex flex-col justify-between h-full">
            <div>
              <span className="text-xs font-mono-data text-[#2E4036] uppercase tracking-wider font-bold">AVULSO / SOB DEMANDA</span>
              <h3 className="text-2xl font-bold mt-2 mb-3">Sessão Fisioterápica</h3>
              <p className="text-xs text-[#1A1A1A]/70 mb-6">Ideal para alívio pontual de tensão muscular ou avaliação inicial.</p>
              
              <ul className="space-y-3 text-xs text-[#1A1A1A]/80 mb-8">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2E4036]" /> Avaliação Fisioterapêutica</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2E4036]" /> Liberação Miofascial dedicada</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2E4036]" /> Orientação de postura e exercícios</li>
              </ul>
            </div>
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-3.5 rounded-full bg-[#2E4036] text-white font-semibold text-xs uppercase tracking-wider magnetic-btn"
            >
              Consultar Valores
            </a>
          </div>

          {/* Card Pricing 2 (FEATURED) */}
          <div className="bg-[#2E4036] text-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border-2 border-[#CC5833] relative flex flex-col justify-between h-full transform md:-translate-y-4">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#CC5833] text-white text-[11px] font-bold font-mono-data uppercase px-4 py-1 rounded-full shadow-md">
              Mais Recomendado
            </div>
            <div>
              <span className="text-xs font-mono-data text-[#CC5833] uppercase tracking-wider font-bold block mt-2">TRATAMENTO COMPLETO</span>
              <h3 className="text-2xl md:text-3xl font-bold mt-2 mb-3">Reabilitação & Pilates</h3>
              <p className="text-xs text-white/80 mb-6">Acompanhamento contínuo focado na eliminação completa da dor e reestruturação da coluna.</p>

              <ul className="space-y-3 text-xs text-white/90 mb-8">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#CC5833]" /> Diagnóstico Biomecânico completo</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#CC5833]" /> Sessões periódicas de Pilates Clínico</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#CC5833]" /> Liberação miofascial contínua</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#CC5833]" /> Suporte direto pelo WhatsApp</li>
              </ul>
            </div>
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-4 rounded-full bg-[#CC5833] text-white font-bold text-xs uppercase tracking-wider magnetic-btn shadow-lg shadow-[#CC5833]/40"
            >
              Agendar no WhatsApp
            </a>
          </div>

          {/* Card Pricing 3 */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-[#2E4036]/15 shadow-lg flex flex-col justify-between h-full">
            <div>
              <span className="text-xs font-mono-data text-[#2E4036] uppercase tracking-wider font-bold">MANUTENÇÃO / PREVENÇÃO</span>
              <h3 className="text-2xl font-bold mt-2 mb-3">Condicionamento Físico</h3>
              <p className="text-xs text-[#1A1A1A]/70 mb-6">Para quem busca manter a saúde articular, mobilidade e evitar lesões futuras.</p>

              <ul className="space-y-3 text-xs text-[#1A1A1A]/80 mb-8">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2E4036]" /> Turmas reduzidas de Pilates</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2E4036]" /> Treinamento funcional adaptado</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2E4036]" /> Supervisão constante de fisioterapeuta</li>
              </ul>
            </div>
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-3.5 rounded-full bg-[#2E4036] text-white font-semibold text-xs uppercase tracking-wider magnetic-btn"
            >
              Conhecer Horários
            </a>
          </div>

        </div>
      </section>

      {/* G. DEPOIMENTOS / PROVA SOCIAL GOOGLE (4.8 ★) */}
      <section id="avaliacoes" className="py-24 px-6 md:px-16 bg-[#E6E4DC] rounded-[3rem] my-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2E4036] text-white font-mono-data text-xs mb-3">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>Nota 4.8 de 5 no Google Reviews</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#1A1A1A]">
            O que Nossos Pacientes Dizem
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-8 rounded-3xl border border-[#2E4036]/10 shadow-md flex flex-col justify-between">
            <p className="text-sm text-[#1A1A1A]/80 italic mb-6 leading-relaxed">
              "Cheguei com fortes dores na coluna lombar e mal conseguia sentar. O atendimento da Quality mudou minha vida. Em poucas sessões de liberação miofascial e pilates o alívio foi total!"
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-black/5">
              <div className="w-10 h-10 rounded-full bg-[#2E4036] text-white font-bold flex items-center justify-center text-sm">
                RC
              </div>
              <div>
                <span className="block font-bold text-sm text-[#1A1A1A]">Rodrigo C.</span>
                <span className="text-xs text-amber-600 flex items-center gap-1">
                  ★★★★★ <span className="text-[10px] text-gray-500 font-mono-data">Paciente em Londrina</span>
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#2E4036]/10 shadow-md flex flex-col justify-between">
            <p className="text-sm text-[#1A1A1A]/80 italic mb-6 leading-relaxed">
              "Estrutura excelente no centro de Londrina! As aulas de Pilates são super focadas nas nossas necessidades. Profissionais muito atenciosos e qualificados."
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-black/5">
              <div className="w-10 h-10 rounded-full bg-[#CC5833] text-white font-bold flex items-center justify-center text-sm">
                MA
              </div>
              <div>
                <span className="block font-bold text-sm text-[#1A1A1A]">Mariana A.</span>
                <span className="text-xs text-amber-600 flex items-center gap-1">
                  ★★★★★ <span className="text-[10px] text-gray-500 font-mono-data">Paciente em Londrina</span>
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#2E4036]/10 shadow-md flex flex-col justify-between">
            <p className="text-sm text-[#1A1A1A]/80 italic mb-6 leading-relaxed">
              "Recomendo de olhos fechados. Fiz minha reabilitação pós-cirúrgica aqui e a atenção da equipe da Rua Santos é impecável. Sem dores e com mobilidade 100%!"
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-black/5">
              <div className="w-10 h-10 rounded-full bg-[#2E4036] text-white font-bold flex items-center justify-center text-sm">
                FL
              </div>
              <div>
                <span className="block font-bold text-sm text-[#1A1A1A]">Fernanda L.</span>
                <span className="text-xs text-amber-600 flex items-center gap-1">
                  ★★★★★ <span className="text-[10px] text-gray-500 font-mono-data">Paciente em Londrina</span>
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* H. FOOTER & LOCALIZAÇÃO */}
      <footer id="contato" className="bg-[#1A1A1A] text-white pt-20 pb-12 px-6 md:px-16 rounded-t-[4rem] border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#CC5833] flex items-center justify-center text-white font-bold">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <span className="font-bold text-xl tracking-tight block leading-none">QUALITY</span>
                <span className="text-xs text-white/60 font-mono-data">Clínica do Movimento</span>
              </div>
            </div>

            <p className="text-sm text-white/70 leading-relaxed max-w-md">
              Referência em Londrina-PR em Fisioterapia Ortopédica, Liberação Miofascial, RPG, Pilates Clínico e Reabilitação do Movimento.
            </p>

            {/* Operational Status Indicator */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 font-mono-data text-xs text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>SISTEMA OPERACIONAL • Londrina/PR</span>
            </div>
          </div>

          {/* Location & Hours */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-bold text-lg text-white mb-2 font-mono-data text-xs uppercase tracking-wider text-[#CC5833]">
              Informações de Contato
            </h4>

            <div className="flex items-start gap-3 text-sm text-white/80">
              <MapPin className="w-5 h-5 text-[#CC5833] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white">Endereço:</strong>
                Rua Santos, 662 - Centro, Londrina - PR, 86020-040
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-white/80">
              <Phone className="w-5 h-5 text-[#CC5833] shrink-0" />
              <div>
                <strong className="block text-white">Telefones:</strong>
                (43) 3027-7001 | (43) 99625-1566
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm text-white/80">
              <Clock className="w-5 h-5 text-[#CC5833] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white">Horário de Atendimento:</strong>
                Segunda a Sexta: 07:00 às 20:00 (Sáb e Dom: Fechado)
              </div>
            </div>
          </div>

          {/* Embedded Google Maps Widget */}
          <div className="lg:col-span-3 rounded-3xl overflow-hidden border border-white/10 h-56 relative bg-white/5">
            <iframe 
              title="Mapa Quality Clinica do Movimento"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3664.120531587372!2d-51.157833!3d-23.311394!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94eb4341b53f6ef5%3A0x8846c9f280a56e1!2sRua%20Santos%2C%20662%20-%20Centro%2C%20Londrina%20-%20PR%2C%2086020-040!5e0!3m2!1spt-BR!2sbr!4v1700000000000" 
              className="w-full h-full border-0 filter opacity-85 hover:opacity-100 transition-opacity"
              loading="lazy"
            />
          </div>

        </div>

        {/* Copyright */}
        <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-white/50 font-mono-data gap-4">
          <p>© {new Date().getFullYear()} Quality Clínica do Movimento. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-[#CC5833] hover:underline font-bold">Atendimento WhatsApp</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
