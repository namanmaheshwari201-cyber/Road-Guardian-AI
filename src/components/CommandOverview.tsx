/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  MessageSquare, Calculator, ShieldCheck, FileText, Mic, 
  Map, AlertTriangle, DollarSign, Award, Flame, Activity, 
  Volume2, Phone, BarChart3, Clock, MapPin, Scale, ShieldAlert,
  ChevronRight, ArrowRight, Play, CheckCircle2, Siren, TrendingUp, AlertOctagon,
  Eye
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend
} from "recharts";

interface CommandOverviewProps {
  onNavigate: (featureId: string) => void;
  onSimulateScoreChange?: (newScore: number) => void;
}

const SEED_QUICK_CHALLANS = [
  { violation: "Over-speeding (>80 km/h)", section: "Section 183 MV Act", fine: 2000, risk: "High Danger" },
  { violation: "Driving Without Helmet", section: "Section 129 MV Act", fine: 1000, risk: "Moderate Danger" },
  { violation: "Dangerous/Rash Driving", section: "Section 184 MV Act", fine: 5000, risk: "Extreme Danger" },
  { violation: "Using Mobile Handheld", section: "Section 184(c) MV Act", fine: 5000, risk: "Severe Danger" }
];

const SEED_HIGHWAY_TWINS = [
  { name: "National Highway 44 (NH-44 Bypass)", type: "National Highway", health: 80, city: "Delhi NCR", status: "Stable" },
  { name: "Outer Ring Road sector 4", type: "State Highway", health: 40, city: "Bengaluru", status: "Critical Decay" },
  { name: "Western Express Highway", type: "State Highway", health: 88, city: "Mumbai", status: "Pristine" }
];

const QUICK_PROMPTS = [
  { text: "What is the fine for drunk driving?", query: "what is the fine for drunk driving in India, and does it include jail term?" },
  { text: "Rules for Maharashtra speed limits", query: "give me speed limit details and seatbelt rules in Mumbai Maharashtra" },
  { text: "Explain Section 129 Helmet Law", query: "what are helmet requirements and exceptions under Section 129 of MV Act?" }
];

export default function CommandOverview({ onNavigate }: CommandOverviewProps) {
  // Local state for simulator inside Overview
  const [brakingSim, setBrakingSim] = useState(1);
  const [speedingSim, setSpeedingSim] = useState(2);
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [feedbackLog, setFeedbackLog] = useState<string[]>(["✓ All sovereign safety services loaded and monitoring live.", "✓ GIS GPS telemetry synchronized with Parivahan servers."]);

  // Derived current driver safety score
  const derivedScore = Math.max(25, 100 - (brakingSim * 6) - (speedingSim * 4));

  const handleTriggerSimAlert = () => {
    setIsAlertActive(!isAlertActive);
    if (!isAlertActive) {
      setFeedbackLog(prev => [
        `🚨 WARNING [${new Date().toLocaleTimeString()}]: Simulated overspeeding warning on NH-44 Sonepat Bypass. Capped telemetry limits exceeded.`,
        ...prev
      ]);
    } else {
      setFeedbackLog(prev => [
        `✓ RESTORED [${new Date().toLocaleTimeString()}]: Vehicle deceleration stabilised within lawful sector limits.`,
        ...prev
      ]);
    }
  };

  // Safe and beautiful Recharts comparison of regional road indexes
  const chartData = [
    { name: "NH-44 (Delhi)", "Surface Rating": 82, "Safety Score": 78, "Expenditure (Lakhs)": 810 },
    { name: "ORR Sec-4 (Blr)", "Surface Rating": 40, "Safety Score": 55, "Expenditure (Lakhs)": 395 },
    { name: "Subhash Marg (Daryaganj)", "Surface Rating": 65, "Safety Score": 70, "Expenditure (Lakhs)": 175 },
    { name: "WEH Spur (Mumb)", "Surface Rating": 88, "Safety Score": 90, "Expenditure (Lakhs)": 910 }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Dynamic Immersive Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/10 bg-gradient-to-r from-slate-950 via-[#0a0f24] to-[#04081c] p-6 lg:p-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-500/15 border border-amber-500/20 text-amber-400 uppercase tracking-widest">
                System Command Dashboard
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] text-slate-400 font-mono">Live Session Active</span>
            </div>
            <h2 className="text-xl lg:text-2xl font-black text-slate-100 tracking-tight font-sans">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">Naman Maheshwari</span>
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              This overview consolidates India's road safety metrics, AI-driven legal assistance, active pothole distress desks, and municipal digital twin structures into a coordinated command system. Switch modules instantly or test physical situations below.
            </p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur rounded-xl border border-slate-800 p-4 shrink-0 grid grid-cols-2 gap-x-6 gap-y-1.5 min-w-[200px] text-xs font-mono">
            <div>
              <span className="text-slate-500 block text-[9px]">OFFICER STATUS</span>
              <span className="text-[#10b981] font-bold">Authorized (MCR)</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px]">MUNICIPAL SECTOR</span>
              <span className="text-slate-200 font-bold">National Zone 1</span>
            </div>
            <div className="mt-1 pt-1 border-t border-slate-800/60 col-span-2 flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Total System Index:</span>
              <span className="text-amber-400 font-extrabold">A+ Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Global Action Center - Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Quick Card 1: Driving score telemetry */}
        <div className="rounded-xl border border-slate-800 bg-[#0a0f1e] p-5 flex flex-col justify-between hover:border-slate-700/60 transition-all group">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-wide">01 • Driver Compliance</span>
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="my-3">
            <span className="text-2xl font-black text-slate-100 font-mono tracking-tight">{derivedScore}</span>
            <span className="text-xs text-slate-500 font-mono ml-1">/100 Grade</span>
            <div className="mt-1.5 h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  derivedScore >= 80 ? "bg-emerald-500" : derivedScore >= 60 ? "bg-amber-500" : "bg-red-500"
                }`}
                style={{ width: `${derivedScore}%` }}
              />
            </div>
          </div>
          <button 
            onClick={() => onNavigate("analytics")}
            className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer pt-2 group-hover:translate-x-1 transition-transform"
          >
            <span>Telemetry details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Card 2: Active Distress Alerts */}
        <div className="rounded-xl border border-slate-800 bg-[#0a0f1e] p-5 flex flex-col justify-between hover:border-slate-700/60 transition-all group">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-mono font-bold text-amber-400 uppercase tracking-wide">02 • Pothole Distress Desk</span>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div className="my-3">
            <span className="text-2xl font-black text-slate-100 font-mono tracking-tight">2</span>
            <span className="text-xs text-slate-550 font-mono ml-1">Tickets Open</span>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1 leading-tight font-mono">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>SLA: 2 hours average assigned PWD</span>
            </div>
          </div>
          <button 
            onClick={() => onNavigate("incidents")}
            className="text-[10px] font-mono text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer pt-2 group-hover:translate-x-1 transition-transform"
          >
            <span>Resolve citizen tickets</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Card 3: Sovereign Budget */}
        <div className="rounded-xl border border-slate-800 bg-[#0a0f1e] p-5 flex flex-col justify-between hover:border-slate-700/60 transition-all group">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-wide">03 • Municipal Capital</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="my-3">
            <span className="text-2xl font-black text-slate-100 font-mono tracking-tight">₹810.5</span>
            <span className="text-xs text-slate-500 font-mono ml-1">Cr Utilized</span>
            <p className="text-[10px] text-slate-405 leading-tight font-mono mt-1">
              Escrow release index: 82.7%
            </p>
          </div>
          <button 
            onClick={() => onNavigate("budget")}
            className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer pt-2 group-hover:translate-x-1 transition-transform"
          >
            <span>Budget ledger</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Card 4: SOS emergency status */}
        <div className={`rounded-xl border p-5 flex flex-col justify-between transition-all group ${
          isAlertActive 
            ? "border-red-500/40 bg-red-950/15" 
            : "border-slate-805 bg-[#0a0f1e] hover:border-slate-700/60"
        }`}>
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-mono font-bold text-red-400 uppercase tracking-wide">04 • Distress Panic Beacon</span>
            <Flame className="w-5 h-5 text-red-500 animate-pulse" />
          </div>
          <div className="my-3">
            <span className={`text-xl font-extrabold tracking-tight font-mono ${isAlertActive ? "text-red-400 animate-pulse" : "text-slate-300"}`}>
              {isAlertActive ? "🚨 DISPATCHING" : "ARMED / SECURE"}
            </span>
            <div className="text-[9px] text-slate-450 leading-tight font-mono mt-1">
              GPS Coordinates linked to fortis trauma unit
            </div>
          </div>
          <button 
            onClick={() => onNavigate("panic")}
            className="text-[10px] font-mono text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer pt-2 group-hover:translate-x-1 transition-transform"
          >
            <span>Launch SOS terminal</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Grid: Columns of everything (Bento Core) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Heavy Column - DriveLegal & Interactive simulations */}
        <div className="lg:col-span-8 flex flex-col gap-6">

          {/* SECTION: DRIVLEGAL SEGMENT SUMMARY */}
          <div className="rounded-2xl border border-slate-800 bg-[#090e1d] p-5">
            <div className="flex justify-between items-center pb-3 border-b border-rose-500/10 mb-4">
              <div className="flex items-center gap-2">
                <Scale className="w-4.5 h-4.5 text-amber-400" />
                <h3 className="text-xs font-bold font-mono tracking-widest text-slate-100 uppercase">
                  DriveLegal Regulatory Core Brief
                </h3>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Motor Vehicle Acts</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 leading-normal">
              
              {/* Fine query / Offense tool shortcut preview */}
              <div className="md:col-span-7 space-y-3.5">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Statutory Fine Structure (Preset Checks):</span>
                
                <div className="space-y-2">
                  {SEED_QUICK_CHALLANS.map((ch, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex justify-between items-center text-xs">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-202 block text-[11px]">{ch.violation}</span>
                        <span className="text-[9px] text-slate-500 font-mono block">{ch.section}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-amber-400 font-mono block">₹{ch.fine.toLocaleString()}</span>
                        <span className="text-[8px] bg-red-950/10 text-red-400 border border-red-950/20 px-1 font-mono rounded inline-block">{ch.risk}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => onNavigate("calculator")}
                    className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex justify-center items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Calculator className="w-4 h-4" />
                    <span>Open Multi-State Challan Calculator</span>
                  </button>
                </div>
              </div>

              {/* Bot prompt starter quick links */}
              <div className="md:col-span-5 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-5">
                <div className="space-y-3">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Ask AI Legal Chatbot:</span>
                  <p className="text-xs text-slate-450 leading-relaxed">
                    Direct access to statutory knowledge bases. Tap any prompt to feed into the dialogue center:
                  </p>

                  <div className="flex flex-col gap-2">
                    {QUICK_PROMPTS.map((qp, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          // Redirect to chatbot in main panel
                          onNavigate("chatbot");
                        }}
                        className="p-2 w-full text-left bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg text-[11px] font-mono text-slate-350 transition-colors cursor-pointer flex justify-between items-center"
                      >
                        <span className="line-clamp-1">{qp.text}</span>
                        <ArrowRight className="w-3 h-3 text-amber-500 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-900 mt-4 text-[10px] flex items-center justify-between text-slate-500 font-mono">
                  <span>DL Database Integration:</span>
                  <span className="text-emerald-400">Online</span>
                </div>
              </div>

            </div>
          </div>

          {/* SECTION: PHYSICAL DIGITAL TWINS & CORRIDORS */}
          <div className="rounded-2xl border border-slate-800 bg-[#090e1d] p-5">
            <div className="flex justify-between items-center pb-3 border-b border-indigo-500/10 mb-4">
              <div className="flex items-center gap-2">
                <Map className="w-4.5 h-4.5 text-emerald-400" />
                <h3 className="text-xs font-bold font-mono tracking-widest text-slate-100 uppercase">
                  RoadWatch Highway Twin Ledger Brief
                </h3>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Digital Asset Twin</span>
            </div>

            <p className="text-xs text-slate-400 leading-normal mb-4">
              Continuous monitoring of civil assets under NHAI jurisdiction. Current twins record asphalt surface grades and compute decay indexes from weather parameters.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SEED_HIGHWAY_TWINS.map((road, idx) => (
                <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex flex-col justify-between hover:border-slate-800 transition-all text-xs">
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] bg-slate-900 text-slate-400 px-1 font-mono rounded uppercase">{road.type}</span>
                      <span className={`text-[9px] font-bold font-mono ${
                        road.health >= 75 ? "text-emerald-400" : "text-amber-400"
                      }`}>{road.health}% Health</span>
                    </div>
                    <h4 className="font-bold text-slate-202 mt-2 leading-tight line-clamp-1">{road.name}</h4>
                    <span className="text-[9px] text-slate-500 block mt-0.5">{road.city}</span>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-900 flex justify-between items-center text-[10px] font-mono">
                    <span className="text-slate-500">Status:</span>
                    <span className={`font-bold ${road.health < 50 ? "text-red-400 animate-pulse" : "text-slate-350"}`}>{road.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => onNavigate("twins")}
                className="flex-1 py-2 border border-slate-800 hover:border-slate-700 rounded-lg text-xs font-semibold text-slate-300 hover:text-slate-100 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-emerald-400" />
                <span>Simulate Twin stresses on Maps</span>
              </button>
              <button 
                onClick={() => onNavigate("incidents")}
                className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-xs font-semibold text-amber-400 border border-amber-500/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Submit local road damage site</span>
              </button>
            </div>
          </div>

          {/* SECTION: SYSTEM FEEDBACK LOGS & AUDITTING CODES */}
          <div className="rounded-2xl border border-slate-800 bg-[#090e1d] p-5">
            <span className="text-[10px] text-slate-500 font-mono block mb-2 uppercase select-none font-bold">
              Active Security & Compliance Log Streams:
            </span>
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-850 space-y-1.5 max-h-[120px] overflow-y-auto font-mono text-[10px] leading-normal text-slate-400">
              {feedbackLog.map((log, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="text-slate-600">[{new Date().toLocaleDateString()}]</span>
                  <span className={log.includes("🚨") || log.includes("WARNING") ? "text-red-400 font-semibold" : ""}>{log}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Pane Column - Telementry simulation, Emergency and Charts */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* DRIVER TELEMETRY SIMULATOR */}
          <div className="rounded-2xl border border-slate-800 bg-[#090e1d] p-5">
            <div className="flex justify-between items-center pb-2 border-b border-rose-500/10 mb-4">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4.5 h-4.5 text-indigo-400" />
                <h4 className="text-xs font-bold font-mono tracking-widest text-[#f1f5f9] uppercase">
                  Physical Driver Simulation
                </h4>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Live Session</span>
            </div>

            <p className="text-xs text-slate-400 leading-normal mb-3">
              Adjust driving occurrences live. The safety compliance model computes a score out of 100 which triggers alert warnings in real-time.
            </p>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-3 text-xs font-mono">
              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Occurrences of sudden harsh braking:</span>
                  <span className="font-bold text-indigo-405">{brakingSim} times</span>
                </div>
                <input 
                  type="range" min="0" max="6" value={brakingSim}
                  onChange={(e) => {
                    setBrakingSim(+e.target.value);
                    setFeedbackLog(prev => [`✓ Driver braking violations adjusted to ${e.target.value}`, ...prev]);
                  }}
                  className="w-full accent-indigo-500 bg-slate-900 h-1 rounded cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Occurrences of overspeeding limits:</span>
                  <span className="font-bold text-indigo-405">{speedingSim} times</span>
                </div>
                <input 
                  type="range" min="0" max="10" value={speedingSim}
                  onChange={(e) => {
                    setSpeedingSim(+e.target.value);
                    setFeedbackLog(prev => [`✓ Driver overspeeding occurrences adjusted to ${e.target.value}`, ...prev]);
                  }}
                  className="w-full accent-indigo-500 bg-slate-900 h-1 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Simulated overspeed incident injection trigger */}
            <div className="mt-4">
              <button
                onClick={handleTriggerSimAlert}
                className={`w-full py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  isAlertActive 
                    ? "bg-red-500/10 border-red-500 text-red-400 animate-pulse font-extrabold"
                    : "bg-slate-950 border-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>{isAlertActive ? "Abrupt Warning: Decelerating..." : "Simulate Speeding Incident"}</span>
              </button>
            </div>
          </div>

          {/* TRAUMA & DISTRESS QUICK BUTTONS */}
          <div className="rounded-2xl border border-slate-800 bg-[#090e1d] p-5 flex flex-col gap-4">
            <div className="flex justify-between items-center text-xs pb-1.5 border-b border-rose-500/10 mb-1">
              <h4 className="text-xs font-bold font-mono tracking-widest text-[#f1f5f9] uppercase">
                Distress Agencies
              </h4>
              <span className="text-[10px] text-red-500 bg-red-500/10 px-1.5 rounded font-mono font-bold animate-pulse">NH-44 Desk</span>
            </div>

            <p className="text-xs text-slate-400 leading-normal">
              Direct hotlines to dispatch trauma units and alert patrol services. Coordinates automatically with telemetry centers.
            </p>

            <div className="grid grid-cols-2 gap-2 text-2xs font-mono">
              <button 
                onClick={() => {
                  onNavigate("panic");
                  setFeedbackLog(prev => ["🚨 Emergency SOS Console loaded from master overview page.", ...prev]);
                }}
                className="p-3 bg-red-950/10 border border-red-900/35 hover:border-red-500 rounded-lg text-left text-red-400 cursor-pointer flex flex-col justify-between gap-1 transition-all"
              >
                <Siren className="w-4 h-4 text-red-500" />
                <span className="font-black">PANIC TERMINAL</span>
              </button>

              <button 
                onClick={() => onNavigate("aid")}
                className="p-3 bg-slate-950 border border-slate-850 hover:border-slate-700 rounded-lg text-left text-slate-300 cursor-pointer flex flex-col justify-between gap-1 transition-all"
              >
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span className="font-black">FIRST-AID SPEECH</span>
              </button>
            </div>

            {/* Direct Dial numbers */}
            <div className="bg-slate-950 rounded-xl border border-slate-850 p-3 space-y-2.5 text-xs">
              <span className="text-[9px] text-slate-500 uppercase font-mono block">Direct Dial Hotlines (Simulated dispatch):</span>
              
              <div className="flex justify-between items-center text-slate-350">
                <span>National Highway Patrol</span>
                <span className="font-extrabold text-red-400 font-mono">1033</span>
              </div>
              <div className="flex justify-between items-center text-slate-350">
                <span>Integrated Police Emergency</span>
                <span className="font-extrabold text-slate-400 font-mono">112</span>
              </div>
              <div className="flex justify-between items-center text-slate-350">
                <span>Centralized Trauma Desk</span>
                <span className="font-extrabold text-[#10b981] font-mono">102 / 108</span>
              </div>
            </div>

            <button 
              onClick={() => onNavigate("directory")}
              className="text-2xs font-mono text-center text-slate-500 hover:text-slate-300 block pt-1.5 uppercase cursor-pointer"
            >
              See complete distress dispatcher list ➜
            </button>
          </div>

          {/* DYNAMIC REGIONAL CHART METRICS */}
          <div className="rounded-2xl border border-slate-800 bg-[#090e1d] p-5">
            <span className="text-[10px] text-slate-500 font-mono block mb-2 uppercase select-none font-bold">
              Regional Quality Index Comparisons:
            </span>
            <div className="h-[145px] p-2 bg-slate-950 border border-slate-850 rounded-xl text-[9px] font-mono">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, left: -25, right: 5, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1c1917" />
                  <XAxis dataKey="name" stroke="#57534e" fontSize={8} />
                  <YAxis stroke="#57534e" fontSize={8} />
                  <Tooltip contentStyle={{ backgroundColor: "#0c0a09", borderColor: "#292524", color: "#e7e5e4", fontSize: 9 }} />
                  <Line name="Surface Rating" type="monotone" dataKey="Surface Rating" stroke="#f59e0b" strokeWidth={2} />
                  <Line name="Safety Score" type="monotone" dataKey="Safety Score" stroke="#6366f1" strokeWidth={1.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[9px] text-slate-500 font-mono text-center mt-2">
              📊 Continuous comparison across 4 national sectors
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
