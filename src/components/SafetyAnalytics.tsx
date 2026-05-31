/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from "recharts";
import { 
  BarChart3, TrendingUp, AlertTriangle, ShieldCheck, Compass, Activity, Play, Star
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const SEED_CITY_SCORES = [
  { city: "Mumbai WEH Core", score: 88, activeChallans: 12, resolvedIncd: 84, index: "A+ Grade" },
  { city: "Delhi Outer Bypass", score: 82, activeChallans: 40, resolvedIncd: 210, index: "A Grade" },
  { city: "Pune Expressway", score: 78, activeChallans: 18, resolvedIncd: 92, index: "B+ Grade" },
  { city: "Bengaluru Bellandur", score: 55, activeChallans: 95, resolvedIncd: 45, index: "D Crash Threat" }
];

const SEED_ACCIDENT_HOTSPOTS = [
  { id: "h-1", area: "Bellandur Tech-Gate Crossing", city: "Bengaluru", count: 24, reason: "Excessive deep craters combined with high waterlogging and absolute zero streetlights", risk: "Extreme Danger" },
  { id: "h-2", area: "NH-44 Bypass Kilometer-34 Corridor", city: "Delhi NCR", count: 18, reason: "Faulty bank angle curve design causing high speed drift and slide risk", risk: "Severe Danger" },
  { id: "h-3", area: "Subhash Marg Old Crossing Junction", city: "Delhi NCR", count: 12, reason: "Illegal reverse commuter driving and bad lane splitting guides", risk: "Moderate Risk" }
];

const FORECAST_CHART_RAW = [
  { year: "2024", perfectHealthLevel: 80, decayTelemetry: 78 },
  { year: "2025", perfectHealthLevel: 80, decayTelemetry: 65 },
  { year: "2026", perfectHealthLevel: 80, decayTelemetry: 54 },
  { year: "2027", perfectHealthLevel: 80, decayTelemetry: 42 }
];

export default function SafetyAnalytics() {
  const [cityLeaderboard] = useState(SEED_CITY_SCORES);
  const [hotspots] = useState(SEED_ACCIDENT_HOTSPOTS);
  const [brakingViolations, setBrakingViolations] = useState(2);
  const [highSpeedDuration, setHighSpeedDuration] = useState(3);
  const [schoolZoneActive, setSchoolZoneActive] = useState(false);
  const [simulatedVehicleSpeed, setSimulatedVehicleSpeed] = useState(48);
  const [safeNavigationSelected, setSafeNavigationSelected] = useState(false);
  const [twinSimulationMode, setTwinSimulationMode] = useState("Traffic Flow");

  // Calculates user driving score dynamically based on sliders
  const calculateDriverSafetyScore = () => {
    const penalty = (brakingViolations * 6) + (highSpeedDuration * 4);
    return Math.max(25, 100 - penalty);
  };

  const currentScoreValue = calculateDriverSafetyScore();

  const handleSimulateSchoolZone = () => {
    if (schoolZoneActive) {
      setSchoolZoneActive(false);
      setSimulatedVehicleSpeed(48);
    } else {
      setSchoolZoneActive(true);
      setSimulatedVehicleSpeed(22); // Auto govern to 22km/h
    }
  };

  return (
    <div id="safety-analytics-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
      
      {/* Primary Analytics, charts and forecasts column */}
      <div id="left-analytics-column" className="lg:col-span-8 flex flex-col gap-6">
        
        {/* State safety ranking board */}
        <div id="city-leaderboard" className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-bold text-slate-100 uppercase tracking-widest font-mono">Cities safety ranking leaderboard</h2>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">MoRTH telemetry analytics</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {cityLeaderboard.map((city, idx) => (
              <div 
                key={idx} 
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between hover:border-slate-705 transition-all text-xs"
              >
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 font-mono">RANK #{idx + 1}</span>
                    <span className={`text-[10px] font-bold font-mono ${
                      city.score >= 80 ? "text-emerald-400" : city.score >= 70 ? "text-amber-400" : "text-red-400"
                    }`}>{city.index}</span>
                  </div>
                  <h4 className="font-bold text-slate-200 mt-1">{city.city}</h4>
                </div>

                <div className="mt-3.5 pt-2 border-t border-slate-900 flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Score: <b className="text-slate-100">{city.score}</b></span>
                  <span className="text-slate-500">Challans: <b className="text-slate-350">{city.activeChallans}</b></span>
                </div>
              </div>
            ))}
          </div>

          {/* Bar Chart comparing safety index across sectors */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 h-[260px] text-xs">
            <span className="text-[10px] text-slate-500 font-mono block mb-3 uppercase tracking-wider">Sector Specific Safety Indication (Surface Grade vs Violations count)</span>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={cityLeaderboard} margin={{ top: 10, left: -20, right: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="city" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", color: "#f8fafc", fontSize: 11 }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                <Bar name="Safety Index Index" dataKey="score" fill="#c2410c" radius={[4, 4, 0, 0]} />
                <Bar name="Reported Violations Frequency" dataKey="activeChallans" fill="#312e81" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI highway Decay predictor & accident Hotspot board */}
        <div id="decay-forecaster" className="p-5 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-2.5">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest font-mono">Decay AI Predictor telemetry</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                By synthesizing traffic density logs with rainfall parameters, our neural forecast model predicts imminent road structural failures on primary corridors.
              </p>
            </div>

            <div className="h-[145px] mt-4 p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={FORECAST_CHART_RAW} margin={{ top: 10, left: -20, right: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#1e293b" />
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={9} />
                  <YAxis stroke="#94a3b8" fontSize={9} />
                  <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", fontSize: 10 }} />
                  <Line name="Decay Curve Telemetry" type="monotone" dataKey="decayTelemetry" stroke="#f97316" strokeWidth={2.5} />
                  <Line name="Ideal Surface Line" type="monotone" dataKey="perfectHealthLevel" stroke="#10b981" strokeDasharray="3 3" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-5">
            <div>
              <div className="flex items-center gap-1.5 mb-2.5">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest font-mono">Identified Heavy Hotspots</h3>
              </div>
              <p className="text-[11px] text-slate-400 mb-3 block font-mono">Total critical sectors: {hotspots.length} points</p>
            </div>

            <div className="space-y-2.5 max-h-[180px] overflow-y-auto">
              {hotspots.map((hot) => (
                <div key={hot.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-205">{hot.area}</span>
                    <span className="text-[9px] bg-red-500/15 border border-red-500/20 text-red-400 px-1.5 py-0.5 rounded uppercase font-mono font-bold">{hot.risk}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal mb-1">{hot.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Driver telemetry and Geofence Simulator side pane */}
      <div id="right-analytics-sidepanel" className="lg:col-span-4 flex flex-col gap-6 animate-fade-in">
        
        {/* Officer/Citizen Driver Telemetry calculator */}
        <div id="driver-telemetry" className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-bold text-slate-100 uppercase tracking-widest font-mono">Simulated Driver Scoreboard</h4>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Live</span>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Active Score</span>
              <span className={`text-2xl font-black ${
                currentScoreValue >= 80 ? "text-emerald-400" : currentScoreValue >= 60 ? "text-amber-400" : "text-red-405"
              }`}>{currentScoreValue}/100</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
              <Activity className="w-6 h-6 text-emerald-400 animate-pulse" />
            </div>
          </div>

          {/* User manual slide controls to modify safety score live */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-3.5 text-xs">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Telemetry simulation parameters:</span>
            
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1.5 font-mono">
                <span>Harsh Braking G-Forces:</span> 
                <span className="font-bold text-slate-202">{brakingViolations} times</span>
              </div>
              <input 
                type="range" min="0" max="6" value={brakingViolations}
                onChange={(e) => setBrakingViolations(+e.target.value)} 
                className="w-full accent-emerald-500 cursor-pointer h-1 bg-slate-900 rounded"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1.5 font-mono">
                <span>Speed violations (&gt;80km/h):</span> 
                <span className="font-bold text-slate-202">{highSpeedDuration} times</span>
              </div>
              <input 
                type="range" min="0" max="12" value={highSpeedDuration}
                onChange={(e) => setHighSpeedDuration(+e.target.value)} 
                className="w-full accent-emerald-500 cursor-pointer h-1 bg-slate-900 rounded"
              />
            </div>
          </div>
        </div>

        {/* School Zone Geofence Simulator protection */}
        <div id="school-zone-protection" className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h4 className="text-sm font-bold text-slate-100 uppercase tracking-widest font-mono">School Zone Geofence AI</h4>
          </div>

          <p className="text-slate-400 text-xs mb-4">
            Simulate crossing active geofences near primary school limits. Telemetry systems automatically restrict speeds and activate safe speed limits.
          </p>

          <button
            onClick={handleSimulateSchoolZone}
            className={`w-full py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              schoolZoneActive 
              ? "bg-amber-500/20 text-amber-400 border border-amber-500 animate-pulse" 
              : "bg-slate-950 border border-slate-800 text-slate-350 hover:text-slate-200"
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>{schoolZoneActive ? "Active: Speed Governors Capped" : "Inject School Zone Geofence"}</span>
          </button>

          <AnimatePresence>
            {schoolZoneActive && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 p-4 bg-amber-500/15 border border-amber-505/30 rounded-xl flex flex-col gap-2 text-xs"
              >
                <div className="flex justify-between items-center text-amber-400 font-bold font-mono text-[10px]">
                  <span>🔊 SCHOOL LIMIT GEOFENCE LIVE</span>
                  <span>CAP: 25 km/h</span>
                </div>
                <div className="flex justify-between items-center mt-1 text-[11px]">
                  <span className="text-slate-400">Regulated Vehicle Velocity:</span>
                  <span className="text-xs font-bold text-slate-100">{simulatedVehicleSpeed} km/h</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Safe Route recommend list */}
        <div id="safe-route-navigator" className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-4">
          <div className="flex items-center gap-1.5">
            <Compass className="w-5 h-5 text-emerald-400" />
            <h4 className="text-sm font-bold text-slate-100 uppercase tracking-widest font-mono">Safe Navigation recommendation</h4>
          </div>

          <p className="text-slate-450 text-xs">
            Select safe courses automatically optimized by low pothole counts and safe night streetlights indexing.
          </p>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col gap-2.5 text-xs leading-normal">
            <div className="flex justify-between items-center pb-2 border-b border-slate-900">
              <span className="font-semibold text-slate-400">Route A (Direct: 4.8 km)</span>
              <span className="text-red-400 font-mono font-bold text-[10px]">3 high risk hotspots</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="font-semibold text-emerald-450">Route B (Safe-Track: 5.4 km)</span>
              <span className="text-emerald-400 font-mono font-bold text-[10px]">100% lit, zero potholes</span>
            </div>
          </div>

          <button
            onClick={() => setSafeNavigationSelected(!safeNavigationSelected)}
            className={`w-full py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
              safeNavigationSelected 
              ? "bg-emerald-500 text-slate-950 font-extrabold" 
              : "bg-slate-950 border border-slate-800 text-slate-350 hover:text-slate-200"
            }`}
          >
            {safeNavigationSelected ? "✓ Route B Loaded in HUD Console" : "Select safest Route B"}
          </button>
        </div>

        {/* Road Safety Digital Twin Model inspection */}
        <div id="safety-digital-twin" className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
          <div className="flex justify-between items-center text-xs">
            <h4 className="text-sm font-semibold text-slate-205 uppercase tracking-wider font-mono">Road Twin Simulation</h4>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono">Active</span>
          </div>

          <p className="text-slate-400 text-xs leading-normal">
            Virtually audit current stress parameters, historical friction levels, and repair indexes.
          </p>

          <div className="grid grid-cols-2 gap-1.5 text-[9px] font-mono">
            {["Traffic Flow", "Stress Loads", "Accident Heat", "Repair Ledger"].map((mode) => (
              <button
                key={mode}
                onClick={() => setTwinSimulationMode(mode)}
                className={`py-1.5 px-2 rounded border text-left transition-all cursor-pointer ${
                  twinSimulationMode === mode
                  ? "bg-amber-500/15 border-amber-500 text-amber-400 font-bold"
                  : "bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300"
                }`}
              >
                {mode} Model
              </button>
            ))}
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[10px] font-mono text-slate-400 leading-normal">
            📊 Simulating: <span className="text-amber-400 font-bold uppercase">{twinSimulationMode}</span> parameters live on central MCD console.
          </div>
        </div>

      </div>

    </div>
  );
}
