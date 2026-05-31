/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  MessageSquare, Calculator, ShieldCheck, FileText, Mic, 
  Map, AlertTriangle, DollarSign, Award, Flame, Activity, 
  Volume2, Phone, BarChart3, Clock, MapPin, Scale, ShieldAlert,
  LayoutGrid
} from "lucide-react";
import DriveLegal from "./components/DriveLegal";
import RoadWatch from "./components/RoadWatch";
import RoadSOS from "./components/RoadSOS";
import SafetyAnalytics from "./components/SafetyAnalytics";
import CommandOverview from "./components/CommandOverview";

export default function App() {
  const [activeFeature, setActiveFeature] = useState<string>("overview");
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace("GMT", "UTC"));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const categories = [
    {
      title: "CONTROL DECK",
      colorClass: "text-amber-500 border-amber-500/20",
      activeBg: "bg-amber-500/10 border-amber-500/30 text-amber-400 font-extrabold",
      hoverBg: "hover:bg-amber-500/5 hover:text-amber-300",
      features: [
        { id: "overview", label: "Command Overview", icon: LayoutGrid }
      ]
    },
    {
      title: "DRIVELEGAL AI",
      colorClass: "text-amber-400 border-amber-500/20",
      activeBg: "bg-amber-500/10 border-amber-500/30 text-amber-400 font-extrabold",
      hoverBg: "hover:bg-amber-500/5 hover:text-amber-300",
      features: [
        { id: "chatbot", label: "AI Law Chatbot", icon: MessageSquare },
        { id: "calculator", label: "Challan Calculator", icon: Calculator },
        { id: "license", label: "License Verifier", icon: ShieldCheck },
        { id: "scanner", label: "OCR Document Sandbox", icon: FileText },
        { id: "voice", label: "Voice Safety Assistant", icon: Mic }
      ]
    },
    {
      title: "ROADWATCH INFRA",
      colorClass: "text-[#10b981] border-emerald-500/20",
      activeBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-extrabold",
      hoverBg: "hover:bg-emerald-500/5 hover:text-emerald-300",
      features: [
        { id: "twins", label: "Active Highway Twins", icon: Map },
        { id: "incidents", label: "Distress Pothole Reporter", icon: AlertTriangle },
        { id: "budget", label: "Municipal Budget Hub", icon: DollarSign },
        { id: "contractors", label: "Contractor scoreboard", icon: Award }
      ]
    },
    {
      title: "ROADSOS EMERGENCY",
      colorClass: "text-red-400 border-red-500/20",
      activeBg: "bg-red-500/10 border-red-500/30 text-red-400 font-extrabold animate-pulse",
      hoverBg: "hover:bg-red-500/5 hover:text-red-300",
      features: [
        { id: "panic", label: "Rescue Panic Alarm", icon: Flame },
        { id: "sensor", label: "Crash Deceleration Sensor", icon: Activity },
        { id: "aid", label: "CPR & First-Aid Guides", icon: Volume2 },
        { id: "directory", label: "Highway Patrol Directory", icon: Phone }
      ]
    },
    {
      title: "COGNITIVE STATS",
      colorClass: "text-indigo-400 border-indigo-500/20",
      activeBg: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 font-extrabold",
      hoverBg: "hover:bg-indigo-500/5 hover:text-indigo-300",
      features: [
        { id: "analytics", label: "AI Decay & Rankings", icon: BarChart3 }
      ]
    }
  ];

  const currentCategory = categories.find(cat => cat.features.some(f => f.id === activeFeature));
  const activeFeatureLabel = currentCategory?.features.find(f => f.id === activeFeature)?.label || "Sovereign Dispatch console";

  return (
    <div id="app-root-container" className="min-h-screen bg-[#060914] text-[#f1f5f9] font-sans flex flex-col md:flex-row justify-between selection:bg-amber-500 selection:text-slate-950">
      
      {/* Scrollable Compact Left Navigation Sidebar */}
      <aside id="sidebar-panel" className="w-full md:w-64 bg-[#0a0f1e] border-b md:border-b-0 md:border-r border-[rgba(241,245,249,0.1)] p-4 flex flex-col justify-between shrink-0 md:h-screen md:overflow-y-auto">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-lg font-black tracking-tight text-[#f1f5f9] flex items-center gap-1.5 justify-center md:justify-start">
              <span>ROAD</span><span className="text-amber-400">GUARDIAN</span> AI
            </h1>
            <p className="text-[9px] text-[rgba(241,245,249,0.5)] font-bold tracking-widest font-mono mt-0.5 text-center md:text-left uppercase">
              REPUBLIC OF INDIA • REGULATORY CONSOLE
            </p>
          </div>

          <nav id="sidebar-navigation" className="flex flex-col gap-5">
            {categories.map((cat, idx) => (
              <div key={idx} className="flex flex-col gap-1.5">
                <span className={`text-[9px] font-bold tracking-widest font-mono uppercase opacity-60 px-1 pl-1.5 border-l-2 ${cat.colorClass}`}>
                  {cat.title}
                </span>

                <div className="flex flex-col gap-1">
                  {cat.features.map((feat) => {
                    const Icon = feat.icon;
                    const isActive = activeFeature === feat.id;
                    return (
                      <button
                        key={feat.id}
                        id={`tab-link-${feat.id}`}
                        onClick={() => setActiveFeature(feat.id)}
                        className={`w-full py-2 px-3 rounded-lg text-[11px] font-mono font-semibold text-left flex items-center gap-2 border transition-all cursor-pointer ${
                          isActive 
                          ? cat.activeBg
                          : `border-transparent text-[rgba(241,245,249,0.6)] ${cat.hoverBg}`
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{feat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Live citizen user badge at sidebar footer */}
        <div id="sidebar-user-footer" className="mt-6 pt-4 border-t border-[rgba(241,245,249,0.1)] flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs select-none shadow shrink-0">
            NM
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-xs text-white truncate">Naman Maheshwari</div>
            <div className="text-[9px] text-[rgba(241,245,249,0.5)] font-mono truncate">Officer ID: 89921-MH</div>
          </div>
        </div>
      </aside>

      {/* Primary viewport content area with Immersive visual status bar */}
      <main id="main-content-window" className="flex-1 flex flex-col min-w-0 bg-[#060914] h-screen overflow-y-auto">
        
        {/* Transparent header status bar */}
        <header id="immersive-top-header" className="border-b border-[rgba(241,245,249,0.05)] bg-[#090e1d]/40 backdrop-blur px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] text-[rgba(241,245,249,0.5)] uppercase tracking-wider font-bold font-mono">INTELLIGENT SECTOR ACTIVE</span>
            <span className="text-xs font-semibold text-white flex items-center gap-1.5 uppercase font-mono tracking-wide">
              <MapPin className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              {activeFeatureLabel}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-2xs font-mono text-slate-300">
            
            {/* Clock */}
            <div className="flex flex-col">
              <span className="text-[8px] text-[rgba(241,245,249,0.4)] uppercase">COGNITIVE TIME</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-400 animate-pulse" />
                {currentTime || "2026-05-31 08:53:17 UTC"}
              </span>
            </div>

            {/* Driving Score */}
            <div className="flex flex-col text-center">
              <span className="text-[8px] text-[rgba(241,245,249,0.4)] uppercase">SAFETY GRADE</span>
              <span className="font-semibold text-[#10b981] text-xs">88/100</span>
            </div>

            {/* Active Challans */}
            <div className="flex flex-col text-center">
              <span className="text-[8px] text-[rgba(241,245,249,0.4)] uppercase">ACTIVE CHALLANS</span>
              <span className="font-bold text-[#ef4444] text-xs">0</span>
            </div>

          </div>
        </header>

        {/* Dynamic viewport panel */}
        <div id="immersive-tab-body" className="flex-1 p-4 md:p-6">
          <div id="tab-holder" className="transition-all duration-300 h-full">
            
            {/* Sovereign Command Overview */}
            {activeFeature === 'overview' && <CommandOverview onNavigate={setActiveFeature} />}

            {/* DriveLegal subpage mapping */}
            {activeFeature === 'chatbot' && <DriveLegal activeSubpage="chatbot" />}
            {activeFeature === 'calculator' && <DriveLegal activeSubpage="calculator" />}
            {activeFeature === 'license' && <DriveLegal activeSubpage="license" />}
            {activeFeature === 'scanner' && <DriveLegal activeSubpage="scanner" />}
            {activeFeature === 'voice' && <DriveLegal activeSubpage="voice" />}

            {/* RoadWatch subpage mapping */}
            {activeFeature === 'twins' && <RoadWatch activeSubpage="twins" />}
            {activeFeature === 'incidents' && <RoadWatch activeSubpage="incidents" />}
            {activeFeature === 'budget' && <RoadWatch activeSubpage="budget" />}
            {activeFeature === 'contractors' && <RoadWatch activeSubpage="contractors" />}

            {/* RoadSOS subpage mapping */}
            {activeFeature === 'panic' && <RoadSOS activeSubpage="panic" />}
            {activeFeature === 'sensor' && <RoadSOS activeSubpage="sensor" />}
            {activeFeature === 'aid' && <RoadSOS activeSubpage="aid" />}
            {activeFeature === 'directory' && <RoadSOS activeSubpage="directory" />}

            {/* SafetyAnalytics mapping */}
            {activeFeature === 'analytics' && <SafetyAnalytics />}

          </div>
        </div>

        {/* Clean sovereign national footer */}
        <footer id="dashboard-footer" className="border-t border-[rgba(241,245,249,0.05)] bg-[#040710]/20 py-3 px-6 shrink-0">
          <div className="text-[9px] font-mono text-[rgba(241,245,249,0.3)] uppercase tracking-wider flex flex-col sm:flex-row justify-between items-center gap-2">
            <span>RoadGuardian AI Sovereign Platform</span>
            <span>Secured under Republic of India IT Act Sec 43A</span>
          </div>
        </footer>

      </main>

    </div>
  );
}
