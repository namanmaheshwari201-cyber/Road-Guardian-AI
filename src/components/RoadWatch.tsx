/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Map, ThumbsUp, AlertTriangle, ShieldCheck, DollarSign, 
  User, ChevronRight, ListCollapse, BarChart3, Upload, 
  TrendingUp, CheckCircle, FileSpreadsheet, Eye, HelpCircle, RefreshCw, Award
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { RoadItem, Complaint, BudgetStats, ContractorPerformance } from "../types";

// Seed data based on Indian highways & transport hubs
const SEED_ROADS: RoadItem[] = [
  {
    id: "road-1",
    name: "National Highway 44 (NH-44 Bypass)",
    type: "National Highway",
    location: "Outer Delhi segment to Sonepat",
    city: "Delhi NCR",
    coordinates: { lat: 28.784, lng: 77.124 },
    constructionAgency: "NHAI (National Highways Authority of India)",
    contractorName: "L&T Infrastructure Projects Ltd",
    sanctionedAmount: 850.50, // Lakhs
    amountSpent: 810.20,
    repairHistory: ["Top bitumization completed in Nov 2024", "Pothole injection Nov 2025"],
    lastMaintenanceDate: "2025-11-15",
    health: { surfaceScore: 82, safetyScore: 78, maintenanceScore: 85, citizenRating: 4.2 },
    nightSafetyScore: 85,
    decayForecast: "Subbase stable. High risk of moisture pooling at kilometer-34 in upcoming July monsoon."
  },
  {
    id: "road-2",
    name: "Outer Ring Road sector 4",
    type: "State Highway",
    location: "Bellandur tech corridor - Marathahalli",
    city: "Bengaluru",
    coordinates: { lat: 12.934, lng: 77.684 },
    constructionAgency: "PWD Karnataka (Public Works Dept)",
    contractorName: "Aditya Infrastructure Corporate",
    sanctionedAmount: 420.00,
    amountSpent: 395.00,
    repairHistory: ["Subgrade drainage pipes added in March 2024", "Asphalt patching Sep 2025"],
    lastMaintenanceDate: "2025-09-08",
    health: { surfaceScore: 40, safetyScore: 55, maintenanceScore: 35, citizenRating: 2.1 },
    nightSafetyScore: 50,
    decayForecast: "Excessive waterlogging near tech-park gates has eroded 45% of binder course. Sudden crater cluster predicted by June 15."
  },
  {
    id: "road-3",
    name: "Subhash Marg Crossing",
    type: "Major District Road",
    location: "Daryaganj Old Delhi Junction",
    city: "Delhi NCR",
    coordinates: { lat: 28.643, lng: 77.241 },
    constructionAgency: "MCD (Municipal Corporation of Delhi)",
    contractorName: "Shree Shiv Balaji Builders",
    sanctionedAmount: 180.00,
    amountSpent: 175.00,
    repairHistory: ["Utility trenching restore in Oct 2024", "Manual patching Jan 2026"],
    lastMaintenanceDate: "2026-01-22",
    health: { surfaceScore: 65, safetyScore: 70, maintenanceScore: 68, citizenRating: 3.4 },
    nightSafetyScore: 72,
    decayForecast: "High heavy freight loads combined with poor drainage points to rapid surface decay. Expect severe alignment deviation within 4 months."
  },
  {
    id: "road-4",
    name: "Western Express Highway Outer Spur",
    type: "State Highway",
    location: "Dahisar Toll Plaza area",
    city: "Mumbai",
    coordinates: { lat: 19.255, lng: 72.859 },
    constructionAgency: "MMRDA (Mumbai Metropolitan Region Development)",
    contractorName: "KNR Constructions",
    sanctionedAmount: 950.00,
    amountSpent: 910.00,
    repairHistory: ["Monsoon-proof micro-surfacing in April 2025"],
    lastMaintenanceDate: "2025-04-18",
    health: { surfaceScore: 88, safetyScore: 90, maintenanceScore: 92, citizenRating: 4.6 },
    nightSafetyScore: 95,
    decayForecast: "Stable structure. Next routine overlay recommended by Dec 2027."
  }
];

const SEED_CONTRACTORS: ContractorPerformance[] = [
  { id: "c-1", name: "L&T Infrastructure Projects Ltd", rating: 4.5, qualityScore: 92, resolvedComplaints: 240, activeWorkloads: 3, delayIncidents: 1 },
  { id: "c-2", name: "KNR Constructions", rating: 4.3, qualityScore: 89, resolvedComplaints: 180, activeWorkloads: 2, delayIncidents: 0 },
  { id: "c-3", name: "Aditya Infrastructure Corporate", rating: 2.2, qualityScore: 48, resolvedComplaints: 35, activeWorkloads: 5, delayIncidents: 9 },
  { id: "c-4", name: "Shree Shiv Balaji Builders", rating: 3.5, qualityScore: 71, resolvedComplaints: 92, activeWorkloads: 2, delayIncidents: 3 }
];

const SEED_BUDGET: BudgetStats = {
  approved: 1250.00, // Crores
  released: 980.00,
  utilized: 810.50,
  remaining: 169.50
};

const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: "comp-101",
    roadId: "road-2",
    roadName: "Outer Ring Road sector 4",
    issueType: "Pothole",
    severity: "High",
    description: "Gigantic crater outside tech hub entrance gate causing massive traffic gridlocks and immediate tyre rim damage.",
    gps: { lat: 12.9348, lng: 77.6841 },
    status: "In Progress",
    authority: "PWD Karnataka (Public Works Dept)",
    submittedAt: "2026-05-25",
    verifications: 14
  },
  {
    id: "comp-102",
    roadId: "road-3",
    roadName: "Subhash Marg Crossing",
    issueType: "No Streetlights",
    severity: "Medium",
    description: "Ten consecutive utility poles are offline, completely dark after 7 PM. Severe hazard for pedestrians.",
    gps: { lat: 28.6432, lng: 77.2415 },
    status: "Assigned",
    authority: "MCD (Municipal Corporation of Delhi)",
    submittedAt: "2026-05-28",
    verifications: 4
  }
];

export default function RoadWatch({ activeSubpage }: { activeSubpage?: "twins" | "incidents" | "budget" | "contractors" }) {
  const [roads, setRoads] = useState<RoadItem[]>(SEED_ROADS);
  const [selectedRoadId, setSelectedRoadId] = useState<string>("road-2");
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [contractors] = useState<ContractorPerformance[]>(SEED_CONTRACTORS);
  const [budget] = useState<BudgetStats>(SEED_BUDGET);

  // New complaint form states
  const [formIssueType, setFormIssueType] = useState<'Pothole' | 'Crack' | 'Waterlogging' | 'No Streetlights' | 'Debris'>('Pothole');
  const [formSeverity, setFormSeverity] = useState<'Low' | 'Medium' | 'High'>('High');
  const [formDescription, setFormDescription] = useState("");
  const [formRoadId, setFormRoadId] = useState("road-2");

  // AI Damage scanner state
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [scannedDamageData, setScannedDamageData] = useState<any>(null);

  const selectedRoad = roads.find(r => r.id === selectedRoadId) || roads[0];

  // Submit a live complaint and update current list
  const handleAddNewComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDescription.trim()) return;

    const targetRoad = roads.find(r => r.id === formRoadId) || roads[0];
    const newComp: Complaint = {
      id: "comp-" + (100 + complaints.length + 1),
      roadId: formRoadId,
      roadName: targetRoad.name,
      issueType: formIssueType,
      severity: formSeverity,
      description: formDescription,
      gps: { lat: targetRoad.coordinates.lat + 0.001, lng: targetRoad.coordinates.lng + 0.001 },
      status: "Assigned",
      authority: targetRoad.constructionAgency,
      submittedAt: new Date().toISOString().split('T')[0],
      verifications: 1
    };

    setComplaints([newComp, ...complaints]);
    setFormDescription("");
  };

  const handleVerifyRepairCompleted = (id: string) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        const nextVote = c.verifications + 1;
        // Auto resolve after 15 upvotes
        const nextStatus = nextVote >= 20 ? "Resolved" : "In Progress";
        return { ...c, verifications: nextVote, status: nextStatus as any };
      }
      return c;
    }));
  };

  const handleAiDamageFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAiScanning(true);
    setScannedDamageData(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(',')[1];
      try {
        const response = await fetch("/api/detect-damage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64String, roadId: selectedRoadId })
        });
        const data = await response.json();
        setScannedDamageData(data);
        
        // Dynamically decay the chosen road's surface rating to simulate real impacts
        if (data.severityScore) {
          setRoads(prev => prev.map(r => {
            if (r.id === selectedRoadId) {
              const currentSurface = r.health.surfaceScore;
              const nextSurface = Math.max(15, currentSurface - Math.floor(data.severityScore / 5));
              return {
                ...r,
                health: { ...r.health, surfaceScore: nextSurface }
              };
            }
            return r;
          }));
        }
      } catch (err) {
        console.error("Machine vision error:", err);
      } finally {
        setIsAiScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerPresetDamageScan = (presetName: "crater" | "drainage" | "crack") => {
    setIsAiScanning(true);
    setScannedDamageData(null);

    setTimeout(() => {
      setIsAiScanning(false);
      if (presetName === "crater") {
        const damage = {
          type: "Severe Volumetric Crater Pothole",
          severityScore: 92,
          volumetricEstimate: "8.4 cubic feet of lost bituminous course. Pothole depth averages 14cm. Dangerous for high speed traffic.",
          remedy: "Immediate cold-asphalt injection and localized steam roller leveling. Structural rating degraded."
        };
        setScannedDamageData(damage);

        setRoads(prev => prev.map(r => {
          if (r.id === selectedRoadId) {
            return {
              ...r,
              health: { ...r.health, surfaceScore: Math.max(15, r.health.surfaceScore - 25) }
            };
          }
          return r;
        }));
      } else if (presetName === "drainage") {
        const damage = {
          type: "Edge Crumbling Secondary to Waterlogging",
          severityScore: 78,
          volumetricEstimate: "14.5 square meters binder surface erosion. High moisture saturation within subgrade.",
          remedy: "Pneumatic trenching drain clean followed by high-aggregate micro-surfacing overlay."
        };
        setScannedDamageData(damage);
        setRoads(prev => prev.map(r => {
          if (r.id === selectedRoadId) {
            return {
              ...r,
              health: { ...r.health, surfaceScore: Math.max(15, r.health.surfaceScore - 15) }
            };
          }
          return r;
        }));
      } else {
        const damage = {
          type: "Transverse Thermal Splitting Failure",
          severityScore: 52,
          volumetricEstimate: "24 linear meters of deep structural splitting. Moisture seepage risk detected.",
          remedy: "Polymer bitumen sealing compound injection to avoid winter expand-decay loop."
        };
        setScannedDamageData(damage);
        setRoads(prev => prev.map(r => {
          if (r.id === selectedRoadId) {
            return {
              ...r,
              health: { ...r.health, surfaceScore: Math.max(15, r.health.surfaceScore - 10) }
            };
          }
          return r;
        }));
      }
    }, 1200);
  };

  // 14 PAGES RESTRUCTURE SEGREGATED CODES
  if (activeSubpage === 'twins') {
    return (
      <div id="twins-only" className="w-full max-w-5xl mx-auto flex flex-col gap-6 ">
        
        {/* Interactive map visualization */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-slate-100 uppercase tracking-widest font-mono">National & State Digital Highway Twins</h2>
            </div>
            <div className="flex gap-1.5 items-center">
              <span className="h-2 w-2 rounded-full bg-emerald-500 block animate-ping" />
              <span className="text-[10px] text-emerald-400 font-mono">GRID ONLINE</span>
            </div>
          </div>

          <p className="text-slate-400 text-xs">
            A centralized digital twin visualization platform. Click a physical route token node on the grid canvas to analyze active maintenance budgets, contractors, or compute decay indices using Vision AI.
          </p>

          {/* Interactive route coordinate box */}
          <div className="relative h-[280px] bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center">
            {/* Ambient grid */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500 via-transparent to-transparent bg-[size:16px_16px] bg-repeat" />
            
            <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
              <path d="M 0,90 L 800,160" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="6" fill="none" />
              <path d="M 100,280 L 480,20" stroke="#10b981" strokeWidth="3" fill="none" />
              <path d="M 40,200 C 200,140 450,240 780,70" stroke="#ef4444" strokeWidth="2" strokeDasharray="4" fill="none" />
            </svg>

            {roads.map((road) => {
              const customLefts: Record<string, string> = { "road-1": "72%", "road-2": "42%", "road-3": "23%", "road-4": "56%" };
              const customTops: Record<string, string> = { "road-1": "30%", "road-2": "55%", "road-3": "18%", "road-4": "72%" };
              const isSelected = selectedRoadId === road.id;
              const score = road.health.surfaceScore;

              return (
                <button
                  key={road.id}
                  onClick={() => {
                    setSelectedRoadId(road.id);
                    setFormRoadId(road.id);
                  }}
                  style={{
                    position: "absolute",
                    left: customLefts[road.id] || "50%",
                    top: customTops[road.id] || "50%",
                  }}
                  className={`-translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center font-mono text-[9px] font-bold shadow-lg transition-transform hover:scale-125 cursor-pointer ${
                    isSelected 
                    ? "bg-slate-200 border-2 border-emerald-500 text-slate-950 font-extrabold scale-110" 
                    : score < 50 
                      ? "bg-red-500/20 text-red-400 border border-red-500" 
                      : score < 75 
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500" 
                        : "bg-emerald-500/25 text-emerald-400 border border-emerald-500"
                  }`}
                >
                  {road.id === 'road-1' ? "NH-4" : road.id === 'road-2' ? "SH-8" : road.id === 'road-3' ? "DM-1" : "WEH"}
                </button>
              );
            })}

            <div className="absolute bottom-2 left-2 bg-slate-900 border border-slate-800 p-2 rounded text-[9px] font-mono flex flex-col gap-1 text-slate-400">
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 block" /> <span>Perfect Structure (&gt;75)</span></div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 block" /> <span>Minor Damage (50-75)</span></div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 block animate-pulse" /> <span>Critical Decay (&lt;50)</span></div>
            </div>

            <div className="absolute top-2 right-2 bg-slate-900/90 px-2 py-1 rounded text-[9px] font-mono text-slate-500">
              Officer Console: <b>Naman Maheshwari</b>
            </div>
          </div>
        </div>

        {/* Selected Road Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono tracking-wider bg-slate-950 text-emerald-400 px-2.5 py-0.5 rounded border border-slate-800">
                  {selectedRoad.type}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">ID: {selectedRoad.id}</span>
              </div>
              <h3 className="text-base font-bold text-slate-100 mt-2">{selectedRoad.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{selectedRoad.location}</p>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-800">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">Agency in charge:</span>
                  <span className="font-semibold text-slate-200 block mt-0.5">{selectedRoad.constructionAgency}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">Assigned Contractor:</span>
                  <span className="font-semibold text-slate-200 block mt-0.5 line-clamp-1">{selectedRoad.contractorName}</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-800">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">Sanctioned Budget:</span>
                  <span className="font-bold text-amber-500 block mt-0.5">₹{selectedRoad.sanctionedAmount.toFixed(1)} Lakhs</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">Expended Capital:</span>
                  <span className="font-bold text-slate-200 block mt-0.5">₹{selectedRoad.amountSpent.toFixed(1)} Lakhs</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] text-amber-400 font-mono font-bold block mb-1">🔮 CONTINUOUS AI DECAY FORECAST:</span>
              <p className="text-xs text-slate-300 leading-normal">
                {selectedRoad.decayForecast}
              </p>
            </div>
          </div>

          {/* AI Machine Vision Sandbox */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between">
            <div>
              <h4 className="text-base font-bold text-slate-100 uppercase tracking-widest font-mono">AI Visual Audit Sandbox</h4>
              <p className="text-xs text-slate-400 mt-1.5">
                Simulate uploading real pothole imagery. The Gemini Computer Vision model extracts structural deterioration parameters immediately.
              </p>

              {/* Live clickable presets */}
              <div className="mt-3.5 space-y-2">
                <span className="text-[10px] text-amber-450 uppercase font-mono block">Simulate instant photo capture:</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => triggerPresetDamageScan("crater")}
                    className="py-1.5 rounded bg-slate-950 hover:bg-slate-800 border border-slate-805 text-[10px] text-slate-300 font-mono font-semibold cursor-pointer"
                  >
                    Deep Crater
                  </button>
                  <button
                    onClick={() => triggerPresetDamageScan("drainage")}
                    className="py-1.5 rounded bg-slate-950 hover:bg-slate-800 border border-slate-805 text-[10px] text-slate-300 font-mono font-semibold cursor-pointer"
                  >
                    Waterlogged
                  </button>
                  <button
                    onClick={() => triggerPresetDamageScan("crack")}
                    className="py-1.5 rounded bg-slate-950 hover:bg-slate-800 border border-slate-805 text-[10px] text-slate-300 font-mono font-semibold cursor-pointer"
                  >
                    Thermal Split
                  </button>
                </div>
              </div>

              {/* Standard manual file selector */}
              <div className="mt-4">
                <label className="w-full flex items-center justify-center p-3 border border-dashed border-slate-800 rounded-xl bg-slate-950 hover:bg-slate-900 transition-all cursor-pointer">
                  <Upload className="w-4 h-4 text-emerald-400 mr-2" />
                  <span className="text-xs text-slate-400 font-mono">Upload JPG/PNG road file</span>
                  <input type="file" accept="image/*" onChange={handleAiDamageFileSelect} className="hidden" />
                </label>
              </div>
            </div>

            {/* Display AI Audit scan data */}
            <div className="mt-4">
              {isAiScanning ? (
                <div className="p-4 bg-slate-950 border border-slate-800 text-center rounded-xl flex items-center justify-center gap-2 text-xs text-slate-400 font-mono">
                  <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
                  <span>Segmenting pixel matrices and depth offsets...</span>
                </div>
              ) : scannedDamageData ? (
                <div className="p-3 bg-slate-950 border border-emerald-500/20 rounded-xl flex flex-col gap-1.5 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">CLASSIFIED TYPE:</span>
                    <span className="text-red-400 font-bold">{scannedDamageData.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">SEVERITY VALUE:</span>
                    <span className="text-amber-400 font-bold">{scannedDamageData.severityScore}% Impact</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal mt-1 border-t border-slate-900 pt-1.5">
                    <b>Volumetric estimate:</b> {scannedDamageData.volumetricEstimate}
                  </p>
                </div>
              ) : (
                <div className="text-center p-3.5 border border-dashed border-slate-800 rounded-xl text-xs text-slate-500 font-mono bg-slate-955/5">
                  Select a live demo simulation capture preset above to test real-time surface quality deterioration tracking.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    );
  }

  if (activeSubpage === 'incidents') {
    return (
      <div id="incidents-only" className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-5xl mx-auto">
        {/* Submit distress column */}
        <div className="lg:col-span-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h4 className="text-xs font-bold text-slate-100 uppercase font-mono tracking-widest">Raise Distress Complaint</h4>
            </div>

            <form onSubmit={handleAddNewComplaint} className="flex flex-col gap-3.5 text-xs">
              <div>
                <label htmlFor="form-road" className="text-[10px] text-slate-400 font-mono block mb-1">Target Road site</label>
                <select
                  id="form-road"
                  value={formRoadId}
                  onChange={(e) => setFormRoadId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded px-2.5 py-1.5 font-sans"
                >
                  {roads.map(r => (
                    <option key={r.id} value={r.id}>{r.name} ({r.city})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="form-issue" className="text-[10px] text-slate-400 font-mono block mb-1">Infraction Class</label>
                  <select
                    id="form-issue"
                    value={formIssueType}
                    onChange={(e) => setFormIssueType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded p-1.5"
                  >
                    <option value="Pothole">Pothole</option>
                    <option value="Crack">Major Crack</option>
                    <option value="Waterlogging">Waterlogging</option>
                    <option value="No Streetlights">No Streetlights</option>
                    <option value="Debris">Debris Block</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="form-severity" className="text-[10px] text-slate-400 font-mono block mb-1">Danger Severity</label>
                  <select
                    id="form-severity"
                    value={formSeverity}
                    onChange={(e) => setFormSeverity(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded p-1.5"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">Emergency High</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="form-desc" className="text-[10px] text-slate-400 font-mono block mb-1">Detailed Description</label>
                <textarea
                  id="form-desc"
                  rows={3}
                  placeholder="Describe exact coordinates or landmark location..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded p-2 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 font-bold text-slate-950 transition-colors cursor-pointer"
              >
                Raise Ticket & Route Authority
              </button>
            </form>
          </div>
        </div>

        {/* Live Complaint board column */}
        <div className="lg:col-span-8">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold text-slate-100 uppercase tracking-widest font-mono">Live Citizen Complaint desk</h4>
              <span className="text-[10px] text-slate-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{complaints.length} tickets open</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {complaints.map((comp) => (
                <div key={comp.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[10px] text-slate-500 font-semibold">TICKET: {comp.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold font-mono ${
                        comp.status === 'Resolved' ? "bg-emerald-500/15 text-emerald-400" :
                        comp.status === 'In Progress' ? "bg-amber-500/15 text-amber-400" :
                        "bg-blue-500/15 text-blue-400"
                      }`}>{comp.status}</span>
                    </div>

                    <div className="mt-2.5">
                      <h5 className="font-bold text-xs text-slate-200 leading-tight">
                        {comp.issueType} on {comp.roadName}
                      </h5>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5 inline-block">{comp.submittedAt}</span>
                      <p className="text-[11px] text-slate-450 mt-1">{comp.description}</p>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-900 flex flex-col gap-2">
                    <span className="text-[10px] text-slate-500 font-mono">Routed destination: {comp.authority}</span>
                    
                    {/* Repair Verification block */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-900 bg-slate-900/40 p-2 rounded">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-slate-550 uppercase font-mono">UPVOTED BY</span>
                        <span className="text-[11px] text-emerald-400 font-mono font-bold">{comp.verifications} Citizens</span>
                      </div>
                      <button
                        onClick={() => handleVerifyRepairCompleted(comp.id)}
                        disabled={comp.status === 'Resolved'}
                        className={`px-3 py-1 bg-slate-950 hover:bg-slate-900 rounded border border-slate-800 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all ${
                          comp.status === 'Resolved' ? "opacity-30 cursor-not-allowed text-slate-500" : "text-emerald-400 hover:border-emerald-500/40"
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Upvote Fix</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeSubpage === 'budget') {
    return (
      <div id="budget-only" className="w-full max-w-4xl mx-auto flex flex-col gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-6 h-6 text-[#10b981]" />
            <h4 className="text-base font-bold text-slate-100 uppercase tracking-widest font-mono">Municipal Capital Budget Hub (FY26)</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono uppercase block mb-0.5">Approved Budget</span>
              <span className="text-lg font-bold text-slate-100">₹{budget.approved.toFixed(1)} Crores</span>
              <p className="text-[10px] text-slate-500 mt-1">Full-year state infrastructure limit</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono uppercase block mb-0.5">Released Funds</span>
              <span className="text-lg font-bold text-slate-200">₹{budget.released.toFixed(1)} Crores</span>
              <p className="text-[10px] text-slate-500 mt-1">Released from sovereign treasury</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono uppercase block mb-0.5">Utilized Capital</span>
              <span className="text-lg font-bold text-emerald-400">₹{budget.utilized.toFixed(1)} Crores</span>
              <p className="text-[10px] text-emerald-400/60 mt-1 font-mono">{(budget.utilized/budget.released * 100).toFixed(1)}% safe index</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono uppercase block mb-0.5">Unused Reserve</span>
              <span className="text-lg font-bold text-slate-400">₹{budget.remaining.toFixed(1)} Crores</span>
              <p className="text-[10px] text-slate-500 mt-1 font-mono">Escrow balances reserve</p>
            </div>
          </div>
          
          <div className="mt-5 p-4 bg-emerald-500/5 rounded-xl text-xs text-slate-300 border border-emerald-500/15 leading-relaxed font-sans">
            🛡️ Notice: All road work allocations are cryptographically audited on our public ledger system for 100% accountability. Each line-item payout matches corresponding site coordinates and contractor IDs.
          </div>
        </div>
      </div>
    );
  }

  if (activeSubpage === 'contractors') {
    return (
      <div id="contractor-only" className="w-full max-w-4xl mx-auto flex flex-col gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h4 className="text-base font-bold text-slate-100 uppercase tracking-widest font-mono flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Contractor Performance Scoreboard</span>
            </h4>
            <span className="text-[10px] text-emerald-400 font-mono">MoRTH Public scoring</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
            {contractors.map((con) => (
              <div key={con.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between gap-3.5 hover:border-slate-700 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-xs font-bold text-slate-100">{con.name}</h5>
                    <span className="text-[10px] text-slate-500 font-mono">ID: {con.id}</span>
                  </div>
                  <span className={`text-[11px] font-extrabold font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 ${
                    con.rating >= 4.0 ? "text-emerald-400" : con.rating >= 3.0 ? "text-amber-400" : "text-red-400"
                  }`}>⭐ {con.rating}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-455 pt-2 border-t border-slate-900">
                  <div className="text-center p-1 bg-slate-900 rounded">Quality index: <b className="text-slate-150 block text-xs mt-0.5">{con.qualityScore}%</b></div>
                  <div className="text-center p-1 bg-slate-900 rounded">Complaints Fix: <b className="text-slate-150 block text-xs mt-0.5">{con.resolvedComplaints}</b></div>
                  <div className="text-center p-1 bg-slate-900 rounded">Delays count: <b className={`block text-xs mt-0.5 ${con.delayIncidents > 3 ? "text-red-400 font-bold" : "text-slate-150"}`}>{con.delayIncidents} times</b></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Fallback default full render
  return null;
}
