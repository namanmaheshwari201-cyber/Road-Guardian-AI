/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export interface ViolationFine {
  violation: string;
  fineAmount: number;
  penaltySection: string;
  licenseImpact: string;
  seizureRisk: 'Low' | 'Medium' | 'High';
}

export interface StateLawInfo {
  state: string;
  city: string;
  speedLimits: {
    car: number;
    twoWheeler: number;
    heavy: number;
  };
  specialRules: string[];
  helpline: string;
}

export interface LegalUpdate {
  id: string;
  title: string;
  date: string;
  category: 'Amendments' | 'Fines' | 'Notification';
  description: string;
  link?: string;
}

export interface LicenseStep {
  stage: string;
  title: string;
  documents: string[];
  steps: string[];
  fee: string;
}

export interface RoadHealth {
  surfaceScore: number; // out of 100
  safetyScore: number;  // out of 100
  maintenanceScore: number; // out of 100
  citizenRating: number; // out of 5
}

export interface RoadItem {
  id: string;
  name: string;
  type: 'National Highway' | 'State Highway' | 'Major District Road' | 'Rural Road';
  location: string;
  city: string;
  coordinates: { lat: number; lng: number };
  constructionAgency: string;
  contractorName: string;
  sanctionedAmount: number; // in INR Lakhs
  amountSpent: number; // in INR Lakhs
  repairHistory: string[];
  lastMaintenanceDate: string;
  health: RoadHealth;
  isBlackspot?: boolean;
  blackspotSeverity?: 'Moderate' | 'Critical';
  nightSafetyScore: number; // out of 100
  decayForecast?: string; // AI maintenance prediction
}

export interface Complaint {
  id: string;
  roadId: string;
  roadName: string;
  issueType: 'Pothole' | 'Crack' | 'Waterlogging' | 'No Streetlights' | 'Debris';
  severity: 'Low' | 'Medium' | 'High';
  description: string;
  gps: { lat: number; lng: number };
  imageUri?: string;
  status: 'Submitted' | 'Under Review' | 'Assigned' | 'In Progress' | 'Resolved';
  authority: string;
  submittedAt: string;
  verifications: number; // citizen repair verifications
}

export interface BudgetStats {
  approved: number;   // In INR Crores
  released: number;   // In INR Crores
  utilized: number;   // In INR Crores
  remaining: number;  // In INR Crores
}

export interface ContractorPerformance {
  id: string;
  name: string;
  rating: number; // out of 5 stars
  qualityScore: number; // out of 100
  resolvedComplaints: number;
  activeWorkloads: number;
  delayIncidents: number;
}

export interface EmergencyContact {
  id: string;
  name: string;
  type: 'Hospital' | 'Trauma Centre' | 'Ambulance' | 'Police Station' | 'Fire Station' | 'Towing';
  city: string;
  phone: string;
  lat: number;
  lng: number;
  distance: number; // in km from user's current geo
}

export interface CitizenUser {
  name: string;
  bloodGroup: string;
  allergies: string;
  emergencyContacts: string[];
  insurancePolicy: string;
  driverSafetyScore: number;
}

export interface CitySafetyScore {
  city: string;
  safetyScore: number; // out of 100
  infraScore: number; // out of 100
  resolutionRate: number; // percentage
  activeComplaints: number;
}
