/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Flame, Activity, Volume2, Phone, ShieldAlert, Heart, Syringe, Ambulance, X, Crosshair, Truck, MapPin, CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const FIRST_AID_STEPS: Record<string, { title: string; steps: string[] }> = {
  Bleeding: {
    title: "Severe Hemorrhage / Bleeding Management",
    steps: [
      "Expose the wound site and inspect for foreign bodies. Do not pull out deeply embedded objects.",
      "Apply localized direct pressure using clean sterile gauze or a dense cotton cloth.",
      "Elevate the bleeding limb above the patient's heart line if fractures are not suspected.",
      "Apply a medical tourniquet 2-3 inches above the wound if bleeding is extreme and uncontrolled. Log the exact timestamp of application."
    ]
  },
  Fractures: {
    title: "Bone Fracture and Immobilization Guidelines",
    steps: [
      "Do not attempt to push back protruding bone ends or realign joint structures under any circumstances.",
      "Immobilize the injured limb using adjacent straight splints (heavy cardboard, timber, or folded newspapers).",
      "Secure splints with wrapping bandages on both sides of the fracture site without cutting off capillary flow.",
      "Apply localized ice packs wrapped in clean towels to curb inflammatory swelling."
    ]
  },
  Burns: {
    title: "Severe Thermal Burn Crisis Management",
    steps: [
      "Extinguish remaining flames or move victim away from active hazard, heat sources, and heavy carbon smoke.",
      "Cool the burned area with cool, running water for a minimum of 10-15 continuous minutes.",
      "Do not puncture skins or apply grease, butter, or common home ointments to vulnerable raw dermal tissue.",
      "Cover the burn loosely under clean, sterile plastic wrap or non-adhesive medical dressings."
    ]
  }
};

const EMER_PROFILE = {
  name: "Naman Maheshwari",
  bloodGroup: "O-Negative (Universal Donor)",
  driverSafetyScore: 88,
  allergies: "Penicillin, sulfur dust sensitiveness",
  insurancePolicy: "Bajaj Allianz Critical Care Plan • Pol ID: 88201-MH",
  emergencyContacts: [
    "Vandana Maheshwari (Spouse) - +91 98112 00412",
    "Rajesh Maheshwari (Father) - +91 98110 99422"
  ]
};

const SEED_SERVICES = [
  { id: "s-1", name: "Fortis Trauma & Intensive Hub", type: "Trauma Centre", distance: 1.4, phone: "102", description: "Level-1 emergency facilities specializing in severe orthopedic trauma and neurotrauma care." },
  { id: "s-2", name: "MCD Municipal Ambulance", type: "Ambulance", distance: 2.5, phone: "102", description: "Advanced Life Support response vehicle equipped with defibrillators and oxygen manifolds." },
  { id: "s-3", name: "National Highway Patrol NH-44", type: "Highway Patrol", distance: 3.1, phone: "1033", description: "Government police interceptors ensuring fast corridor clearance and basic first-responder assistance." },
  { id: "s-4", name: "Apollo Medical Clinic Sector 12", type: "Hospital", distance: 4.8, phone: "+91114258122", description: "Tertiary multi-specialty station with active cardiac support and immediate burns unit facilities." }
];

export default function RoadSOS({ activeSubpage }: { activeSubpage?: "panic" | "sensor" | "aid" | "directory" }) {
  const [activeSOS, setActiveSOS] = useState(false);
  const [goldenHourActive, setGoldenHourActive] = useState(false);
  const [gForce, setGForce] = useState(1.1);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [currentAid, setCurrentAid] = useState<string>("Bleeding");
  const [isPlayingFirstAidAudio, setIsPlayingFirstAidAudio] = useState(false);
  const [profile] = useState(EMER_PROFILE);
  const [services] = useState(SEED_SERVICES);

  // Web Audio Context & Oscillator Node reference pointers for high sound physical synthesis
  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Generates physical Indian dual-tone warning sweep siren on live browser
  const startSiren = () => {
    try {
      if (audioCtxRef.current) return; // Prevent duplicate overlays
      
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtxClass();
      audioCtxRef.current = ctx;

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
      // Limit scale to avoid blasting user ears whilst keeping high frequency perceptible
      gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.15);
      gainNodeRef.current = gainNode;

      const osc1 = ctx.createOscillator();
      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(650, ctx.currentTime);
      osc1Ref.current = osc1;

      // Low frequency modulator to create repeating wah-wah siren effect (typical Indian police/med interceptors)
      const osc2 = ctx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(2.4, ctx.currentTime); 
      osc2Ref.current = osc2;

      const modGain = ctx.createGain();
      modGain.gain.setValueAtTime(280, ctx.currentTime); // frequency sweeps between 370Hz and 930Hz

      osc2.connect(modGain);
      modGain.connect(osc1.frequency);

      osc1.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc2.start();
    } catch (err) {
      console.warn("Speech Synthesis / Audio Wave context initialization blocked:", err);
    }
  };

  const stopSiren = () => {
    try {
      if (osc1Ref.current) {
        osc1Ref.current.stop();
        osc1Ref.current.disconnect();
        osc1Ref.current = null;
      }
      if (osc2Ref.current) {
        osc2Ref.current.stop();
        osc2Ref.current.disconnect();
        osc2Ref.current = null;
      }
      if (audioCtxRef.current) {
        if (audioCtxRef.current.state !== 'closed') {
          audioCtxRef.current.close();
        }
        audioCtxRef.current = null;
      }
    } catch (err) {
      console.error("Audio Context terminal failure:", err);
    }
  };

  // Safe component unmount handler for audioContext preservation
  useEffect(() => {
    return () => {
      stopSiren();
    };
  }, []);

  // Trigger automated dispatch on high crash impact G-Force
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCountdown(null);
      setGoldenHourActive(true);
      setActiveSOS(true);
      startSiren();
      setLogs(prev => ["🚨 CRITICAL AUTOMATED DISPACTH ROUTED SUCCESSFULLY VIA INERTIAL TELEMETRY G-FORCE ACCIDENT INDICATORS", ...prev]);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleManualSOSToggle = () => {
    if (activeSOS) {
      setActiveSOS(false);
      setGoldenHourActive(false);
      stopSiren();
      setLogs(prev => ["🔒 Citizen manually deactivated emergency SOS.", ...prev]);
    } else {
      setActiveSOS(true);
      setGoldenHourActive(true);
      startSiren();
      setLogs(prev => ["🚨 Citizen triggered immediate manual SOS beacon.", ...prev]);
    }
  };

  const handleGForceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setGForce(val);

    if (val >= 4.2) {
      if (countdown === null && !goldenHourActive && !activeSOS) {
        setCountdown(10);
        setLogs(prev => [`⚠️ HIGH IMPACT G-FORCE RECORDED: ${val.toFixed(2)}G. Initiating automatic dispatch countdown...`, ...prev]);
      }
    } else {
      if (countdown !== null) {
        setCountdown(null);
        setLogs(prev => ["✓ G-Force stabilized. Automatic countdown aborted.", ...prev]);
      }
    }
  };

  const handleCancelCountdown = () => {
    setCountdown(null);
    setGForce(1.1);
    stopSiren();
    setLogs(prev => ["✓ Automated dispatch aborted manually by driver. Safety status restored.", ...prev]);
  };

  const handleHearFirstAidVoice = () => {
    if (isPlayingFirstAidAudio) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingFirstAidAudio(false);
      return;
    }

    setIsPlayingFirstAidAudio(true);
    const textToSpeak = `Starting guides for ${FIRST_AID_STEPS[currentAid].title}. Step 1. ${FIRST_AID_STEPS[currentAid].steps[0]} Step 2. ${FIRST_AID_STEPS[currentAid].steps[1]}`;
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.onend = () => {
        setIsPlayingFirstAidAudio(false);
      };
      utterance.onerror = () => {
        setIsPlayingFirstAidAudio(false);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingFirstAidAudio(false), 5500);
    }
  };

  // Simulate active dispatch when dialing service on directory of agencies
  const handleMockDialService = (name: string, phone: string) => {
    setActiveSOS(true);
    setGoldenHourActive(true);
    startSiren();
    setLogs(prev => [
      `🚨 DIRECT PHONE LINE HOOKED TO AGENCY: ${name} [${phone}]. Broadcaster synchronized logs with centralized regional server.`,
      ...prev
    ]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      
      {/* Beacon visual status strip at top for ALL styles/pages */}
      <div className={`rounded-2xl border p-4.5 flex flex-col sm:flex-row justify-between items-center gap-4.5 transition-all ${
        activeSOS 
        ? "bg-red-500/10 border-red-500/40 text-red-200" 
        : "bg-slate-900 border-slate-800 text-slate-350"
      }`}>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {activeSOS ? (
            <div className="flex gap-1 shrink-0">
              <span className="w-3.5 h-3.5 bg-red-650 rounded-full animate-ping" />
              <span className="w-3.5 h-3.5 bg-blue-650 rounded-full animate-pulse" />
            </div>
          ) : (
            <div className="w-3.5 h-3.5 bg-slate-600 rounded-full shrink-0" />
          )}
          
          <div className="min-w-0">
            <span className="text-[10px] text-slate-500 font-mono block uppercase tracking-wider">
              Republic of India • Central Distress Portal Agency
            </span>
            <span className="text-xs font-bold font-mono text-slate-200 leading-tight block mt-0.5 mt-1 sm:line-clamp-2 md:line-clamp-none">
              {activeSOS 
                ? "🚨 HIGH FREQUENCY ALARM BROADCAST ACTIVE • REPORTED TO PARIVAHAN TRAUMA DESK" 
                : "Armed Status: Continuous deceleration telemetry active. Tap below to sound distress alarm."
              }
            </span>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto justify-end">
          {activeSOS ? (
            <button
              onClick={handleManualSOSToggle}
              className="w-full sm:w-auto py-1.5 px-3 bg-red-600 hover:bg-red-500 text-white font-bold text-2xs uppercase tracking-widest font-mono rounded-lg border border-red-500 transition-colors cursor-pointer"
            >
              ⏹️ SILENCE ALARM & SIREN
            </button>
          ) : (
            <button
              onClick={handleManualSOSToggle}
              className="w-full sm:w-auto py-1.5 px-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-2xs uppercase tracking-widest font-mono rounded-lg transition-colors cursor-pointer"
            >
              🚨 FORCE SOS DISPATCH BEACON
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Wave Equalizer during Active Sirening */}
      {activeSOS && (
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border border-red-500/20 rounded-xl">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4.5 h-4.5 text-red-400 animate-spin" />
            <span className="text-[10px] text-red-400 font-mono uppercase font-black">Sirens sweeping frequencies (650Hz dual-tone loop):</span>
          </div>
          <div className="flex items-end gap-1.5 h-6">
            <div className="w-1 bg-red-500 h-4 animate-[pulse_0.6s_infinite]" />
            <div className="w-1 bg-blue-500 h-6 animate-[pulse_0.4s_infinite]" />
            <div className="w-1 bg-red-500 h-3 animate-[pulse_0.75s_infinite]" />
            <div className="w-1 bg-blue-500 h-5 animate-[pulse_0.45s_infinite]" />
            <div className="w-1 bg-red-500 h-2 animate-[pulse_0.8s_infinite]" />
          </div>
        </div>
      )}

      {/* RENDER DYNAMIC PAGES INTEGRATED WITH THE SOS SYSTEM BEACON */}

      {activeSubpage === 'panic' && (
        <div id="panic-subpage-root" className="flex flex-col gap-6">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
            <div className="py-8 flex flex-col items-center">
              <button
                onClick={handleManualSOSToggle}
                className={`w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer select-none outline-none ${
                  activeSOS 
                  ? "bg-red-650 text-slate-100 ring-[15px] ring-red-500/20 animate-pulse border-none" 
                  : "bg-slate-950 border-4 border-red-500 hover:border-red-450 hover:bg-slate-900 text-red-500 ring-8 ring-red-500/5 shadow-2xl"
                }`}
              >
                <ShieldAlert className="w-12 h-12 mb-1" />
                <span className="text-xs font-extrabold tracking-widest font-mono">
                  {activeSOS ? "SOS LIVE" : "TAP SOS"}
                </span>
              </button>

              <h3 className="text-base font-bold text-slate-100 mt-6 font-mono uppercase tracking-widest">Sovereign Mobile Distress Launcher</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1.5 text-center leading-normal">
                Direct statutory interface to signal physical distress dispatchers, automatically transmitting satellite vectors.
              </p>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-slate-400 pt-4.5 border-t border-slate-800/80">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-850">
                <span className="text-slate-500 block text-[10px]">VERIFIED OPERATOR PROFILE</span>
                <span className="text-slate-200 font-bold block mt-0.5">{profile.name} ({profile.bloodGroup})</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-850">
                <span className="text-slate-500 block text-[10px]">COORDINATE CAPTURE (WGS84)</span>
                <span className="text-emerald-400 font-bold block mt-0.5">28.784° N, 77.124° E [Active]</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-850">
                <span className="text-slate-500 block text-[10px]">EMERGENCY CELL DISPATCH</span>
                <span className="text-slate-250 font-bold block mt-0.5">Bajaj Allianz: {profile.insurancePolicy.split("•")[1]}</span>
              </div>
            </div>
          </div>

          {/* Persistent Timeline Dispatch Tracker when SOS is live */}
          <AnimatePresence>
            {activeSOS && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-5 rounded-2xl bg-slate-950 border border-red-500/20 flex flex-col gap-4">
                  <div className="flex justify-between items-center pb-2 border-b border-red-500/10">
                    <span className="text-red-400 font-mono text-xs font-bold flex items-center gap-2">
                      <Ambulance className="w-4.5 h-4.5 animate-bounce" />
                      <span>🚨 CENTRAL RESPONSE DISPATCH TIMELINE</span>
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">STATUS: REPORTED</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-2xs font-mono">
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-500 uppercase block">Response Command</span>
                      <span className="text-slate-250 font-bold block mt-0.5">MCD & Fortis Trauma</span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-500 uppercase block">Dispatched Unit</span>
                      <span className="text-emerald-400 font-bold block mt-0.5">Advanced Life Support (ALS-3)</span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-500 uppercase block">Sovereign ETA Range</span>
                      <span className="text-amber-400 font-bold block mt-0.5">1.4 km • 4.5 Mins ETA</span>
                    </div>
                  </div>

                  <div className="mt-2 space-y-4 text-xs pl-3 relative border-l border-red-500/30">
                    <div className="relative">
                      <div className="absolute -left-[16px] top-[3px] w-2 h-2 rounded-full bg-emerald-400" />
                      <div className="font-semibold text-slate-200">SOS Distress Broadcaster Initiated</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">Coordinates logged successfully, sending telemetry frames...</div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[16px] top-[3px] w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <div className="font-semibold text-slate-200">National Medical Hub Intercept Alerted</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">Fortis Trauma Command Room alerted. Dispatch team mobilized with direct GPS lock.</div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[16px] top-[3px] w-2 h-2 rounded-full bg-red-400" />
                      <div className="font-semibold text-slate-200">Sovereign SMS Contact Alert Swarm Dispatched</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">Sms dispatched to Vandana Maheshwari (+91 98112 00412) & Rajesh Maheshwari (+91 98110 99422).</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {activeSubpage === 'sensor' && (
        <div id="sensor-subpage-root" className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-500 animate-pulse" />
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-widest font-mono">Simulate Impact Accelerometer Crash sensors</h3>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Stream: Live</span>
          </div>

          <div className="flex flex-col gap-4 text-xs">
            <p className="text-slate-400 leading-normal">
              Slide the sensory impact limits above <b>4.2 G-Forces</b> to mimic direct vehicular crash signatures (e.g., collisions, barrier rolls). A strict 10 second automated dispatch countdown will fire sirens immediately if not aborted.
            </p>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex items-center justify-between">
              <span className="font-mono text-slate-400">Sensory G-Threshold Rating:</span>
              <span className={`text-xl font-mono font-black ${gForce >= 4.2 ? "text-red-400 animate-pulse" : "text-emerald-400"}`}>
                {gForce.toFixed(2)} G
              </span>
            </div>

            <input
              type="range"
              min="0.5"
              max="9.0"
              step="0.1"
              value={gForce}
              onChange={handleGForceChange}
              className="w-full accent-red-500 bg-slate-950 h-1 rounded cursor-pointer"
            />
          </div>

          {countdown !== null && (
            <div className="p-5 bg-red-950/20 border-2 border-red-500 rounded-xl mt-2 text-center flex flex-col items-center gap-2">
              <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider font-mono">AUTOMATED ACCIDENT COUNGOUNT DISPATCH ACTIVE</h4>
              <p className="text-xs text-slate-300">Centralized emergency dispatch desk has initiated emergency SOS countdown sequence due to critical impact trigger:</p>
              
              <div className="text-3xl font-black text-red-500 font-mono animate-pulse my-2">
                ⏱️ T-MINUS {countdown}s
              </div>

              <button
                onClick={handleCancelCountdown}
                className="px-6 py-2 bg-slate-100 hover:bg-slate-205 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
              >
                Abort & Cancel Beacon
              </button>
            </div>
          )}

          {/* Sensory Logger */}
          <div className="mt-2 p-3 bg-slate-950 rounded-lg border border-slate-850 text-2xs font-mono">
            <span className="text-slate-500 block mb-2 font-bold select-none uppercase">Sensor telemetry streams:</span>
            <div className="space-y-1 max-h-32 overflow-y-auto leading-normal text-slate-450">
              {logs.length === 0 ? (
                <div className="italic text-slate-650">Normal driving deceleration limits. Range safe between (0.9G and 1.2G)...</div>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span>
                    <span className={log.includes("🚨") || log.includes("⚠️") ? "text-red-400 font-semibold" : ""}>{log}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeSubpage === 'aid' && (
        <div id="aid-subpage-root" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Syringe className="w-4.5 h-4.5 text-emerald-400" />
              <span>Sovereign First-Aid Auditory Guides</span>
            </h4>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider">MoRTH REGISTRY</span>
          </div>

          <p className="text-xs text-slate-400 leading-normal">
            Listen to secure multilingual voice safety guides during a health crisis. Select your topic class and play the guide. Sound system remains synchronized to dispatchers.
          </p>

          <div className="grid grid-cols-3 gap-2">
            {Object.keys(FIRST_AID_STEPS).map((key) => (
              <button
                key={key}
                onClick={() => {
                  setCurrentAid(key);
                  if (isPlayingFirstAidAudio) {
                    window.speechSynthesis.cancel();
                    setIsPlayingFirstAidAudio(false);
                  }
                }}
                className={`py-2 rounded text-xs font-bold uppercase font-mono text-center tracking-wider transition-all cursor-pointer border ${
                  currentAid === key 
                  ? "bg-emerald-500/15 border-emerald-500 text-emerald-400" 
                  : "bg-slate-950 border-slate-800 text-slate-500 hover:bg-slate-900 hover:text-slate-300"
                }`}
              >
                {key}
              </button>
            ))}
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-slate-900">
              <h5 className="text-xs font-bold text-slate-100 font-mono">{FIRST_AID_STEPS[currentAid].title}</h5>
              <button
                onClick={handleHearFirstAidVoice}
                className={`px-3 py-1.5 rounded text-[11px] font-bold font-mono border flex items-center gap-1.5 cursor-pointer transition-all ${
                  isPlayingFirstAidAudio
                  ? "bg-red-500/10 border-red-500/50 text-red-400 animate-pulse"
                  : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-transparent"
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{isPlayingFirstAidAudio ? "⏹️ STOP AUDIO GUIDE" : "🔊 PLAY NATIVE SPOKEN GUIDE"}</span>
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300 leading-normal font-sans">
              {FIRST_AID_STEPS[currentAid].steps.map((step, idx) => (
                <div key={idx} className="flex gap-2.5 items-start">
                  <span className="h-5 w-5 rounded bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">{idx + 1}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSubpage === 'directory' && (
        <div id="directory-subpage-root" className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-widest font-mono flex items-center gap-2">
              <Phone className="w-5 h-5 text-red-500" />
              <span>Trauma Agencies & Incident Report Lines</span>
            </h4>
            <span className="text-[10px] bg-red-500/15 border border-red-500/20 text-red-400 font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider">NH-44 CONNECTED</span>
          </div>

          <p className="text-xs text-slate-400 leading-normal">
            Click DIAL LINK to immediately notify any local trauma medical hub or highway patrol intercept unit. Clicking dialing links triggers local distress sirens and coordinates reporting systems to centralized databases!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((serv) => (
              <div key={serv.id} className="p-4 bg-slate-950 rounded-xl border border-slate-850 flex flex-col justify-between hover:border-slate-750 transition-all">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold">{serv.type}</span>
                    <span className="text-[9px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 block animate-ping" />
                      <span>ARMD DISPATCH ROOM</span>
                    </span>
                  </div>
                  <h5 className="font-extrabold text-xs text-slate-200 mt-2">{serv.name}</h5>
                  <p className="text-[11px] text-slate-405 mt-1 leading-normal">{serv.description}</p>
                </div>

                <div className="pt-3.5 mt-3.5 border-t border-slate-900 flex justify-between items-center gap-2 text-xs">
                  <span className="font-mono font-bold text-slate-400">Hotline: {serv.phone}</span>
                  <button
                    onClick={() => handleMockDialService(serv.name, serv.phone)}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-[11px] font-bold text-red-400 rounded-lg flex items-center gap-1 cursor-pointer transition-all"
                  >
                    <Phone className="w-3.5 h-3.5 text-red-500" />
                    <span>DIAL LINK</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
