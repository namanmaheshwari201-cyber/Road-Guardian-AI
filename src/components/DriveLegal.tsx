/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { 
  Scale, MessageSquare, Send, Calculator, FileText, 
  Sparkles, CheckCircle2, ShieldAlert, BookOpen, Volume2, 
  Upload, Navigation, RefreshCw, AlertTriangle, UserCheck,
  Sliders, Languages, Play, Square, Settings
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LegalUpdate, LicenseStep, ViolationFine } from "../types";

// Constant realistic fine laws corresponding to Motor Vehicles Act, 2019
const FINE_DATABASE: Record<string, ViolationFine[]> = {
  car: [
    { violation: "Over-speeding (Light Motor Vehicle)", fineAmount: 2000, penaltySection: "Sec 183(1)", licenseImpact: "Licence suspension for 3 months on second offense", seizureRisk: "Medium" },
    { violation: "Drunken Driving (Alcohol limit > 30mg/100ml)", fineAmount: 10000, penaltySection: "Sec 185", licenseImpact: "Court summon, license suspension for 6 months, jail up to 6 months", seizureRisk: "High" },
    { violation: "Driving without Valid License", fineAmount: 5000, penaltySection: "Sec 181", licenseImpact: "Imprisonment option up to 3 months", seizureRisk: "High" },
    { violation: "Not wearing Seatbelt (Driver/Passengers)", fineAmount: 1000, penaltySection: "Sec 194B", licenseImpact: "None, alert issued", seizureRisk: "Low" },
    { violation: "Signal Jumping / Red Light violation", fineAmount: 1000, penaltySection: "Sec 184", licenseImpact: "Licence demerit points (3)", seizureRisk: "Low" },
    { violation: "No Pollution Under Control (PUC) certificate", fineAmount: 10000, penaltySection: "Sec 190(2)", licenseImpact: "Disqualification of licence for 3 months", seizureRisk: "Medium" },
    { violation: "Using Mobile Phone while Driving", fineAmount: 5000, penaltySection: "Sec 184(c)", licenseImpact: "Demerit points active", seizureRisk: "Medium" }
  ],
  twoWheeler: [
    { violation: "Riding without Helmet (Driver/Pillion)", fineAmount: 1000, penaltySection: "Sec 194D", licenseImpact: "Disqualification of license for 3 months", seizureRisk: "Medium" },
    { violation: "Triple Riding (Overloading 2-Wheeler)", fineAmount: 1000, penaltySection: "Sec 194C", licenseImpact: "Fines & warning logged", seizureRisk: "Low" },
    { violation: "Drunken Driving", fineAmount: 10000, penaltySection: "Sec 185", licenseImpact: "Immediate impound, court appearance mandate", seizureRisk: "High" },
    { violation: "No Pollution Under Control (PUC)", fineAmount: 10000, penaltySection: "Sec 190(2)", licenseImpact: "Licence suspended", seizureRisk: "Medium" },
    { violation: "Driving without License", fineAmount: 5000, penaltySection: "Sec 181", licenseImpact: "Potential vehicle impound", seizureRisk: "High" }
  ],
  heavy: [
    { violation: "Overloading (Goods Carriages)", fineAmount: 20000, penaltySection: "Sec 194(1)", licenseImpact: "₹2,000 extra per tonne over limit", seizureRisk: "High" },
    { violation: "Dangerous/Reckless High Speed Driving", fineAmount: 10000, penaltySection: "Sec 184", licenseImpact: "Cancellation of commercial permits", seizureRisk: "High" },
    { violation: "No fitness certificate / Overaged vehicle", fineAmount: 10000, penaltySection: "Sec 192A", licenseImpact: "Blacklisting of registration", seizureRisk: "High" },
    { violation: "Drunken Driving (Commercial)", fineAmount: 15000, penaltySection: "Sec 185", licenseImpact: "Permanent cancellation of commercial permit", seizureRisk: "High" }
  ]
};

const LEGAL_NEWS: LegalUpdate[] = [
  { id: "news-1", title: "Mandatory Rear Seatbelt Alerts Active Nationwide", date: "2026-04-12", category: "Amendments", description: "All vehicles with rear seatbelts must ensure warning sound is not bypassed. Strict ₹1000 fine for front and back passengers." },
  { id: "news-2", title: "Digital-only DL & PUC verified in digilocker legalized", date: "2026-05-18", category: "Notification", description: "Ministry of Road Transport (MoRTH) directs PWD/Police to accept digital records only if stored in secure DigiLocker apps. Loose photographs or screenshots are not recognized." },
  { id: "news-3", title: "High-Speed corridor camera automated challan systems", date: "2026-05-29", category: "Fines", description: "State highway authority integrated 400 new high-resolution speed cameras automatically identifying license plates for overspeeding, lanes, and mobile usage." }
];

const LICENCE_GUIDE: LicenseStep[] = [
  {
    stage: "1. Learner's Licence (LL)",
    title: "Initial testing license validity 6 months",
    documents: ["Age proof (Adhaar, Passport)", "Address proof (Electricity, Ration card)", "Medical Certificate Form 1A (for vehicles > 50cc or commercial)"],
    steps: ["Fill out Form 2 on Ministry of Parivahan portal", "Book slots for Online Traffic Signs test", "Pass 12/15 MCQ questions of signs and emergency rules to obtain digital LL immediately"],
    fee: "₹200 structure"
  },
  {
    stage: "2. Permanent Driving Licence (DL)",
    title: "Eligible after 30 days of Learner's obtained",
    documents: ["Learner's Licence", "Vehicle registration card under chosen class", "Form 4 Application for DL"],
    steps: ["Apply online within 180 days of LL issue", "Bring your vehicle to RTO test tracks", "Demonstrate reverse, '8' loop pattern, and gradient holds without engine stalling"],
    fee: "₹700 including smartcard"
  }
];

const STATE_SPECI_RULES: Record<string, { speed: string; special: string; localH: string }> = {
  "Delhi NCR": {
    speed: "70 km/h (Main highways), 50 km/h (Arterial roads), 30 km/h (Residential)",
    special: "Diesel vehicles >10 years old and Petrol >15 years old are barred. Strict pollution checks. Over-speed active laser monitoring.",
    localH: "011-25844444"
  },
  "Karnataka (Bengaluru)": {
    speed: "80 km/h (Expressways), 50 km/h (City limits), 20 km/h (School zones)",
    special: "Strict bus-lane violations penalty (₹5,000 fine). Heavy congestion zone pricing active. High security HSRP registration plates mandatory.",
    localH: "080-22942111"
  },
  "Maharashtra (Mumbai)": {
    speed: "80 km/h (Sea Link/Eastern Freeway), 40 km/h (Local flyovers)",
    special: "Front and back seatbelts must be worn. Strict anti-noise honking zones around hospitals (fine: ₹2,000 for excessive honking).",
    localH: "022-22621855"
  }
};

const AUDIO_ALERT_RULES: Record<string, {
  name: string;
  section: string;
  languages: Record<string, {
    subtitle: string;
    speechText: string;
  }>
}> = {
  speeding: {
    name: "Over-speeding Alert",
    section: "Section 112 & 183",
    languages: {
      English: {
        subtitle: "Danger! You are exceeding the speed limit under Section 112. Slow down immediately to avoid a ₹2,000 fine and 3 months license suspension.",
        speechText: "Danger! You are exceeding the speed limit under Section One-Twelve. Slow down immediately to avoid a two thousand rupee fine and three months license suspension."
      },
      Hindi: {
        subtitle: "सावधान! आप धारा 112 के तहत गति सीमा पार कर रहे हैं। ₹2,000 के जुर्माने और 3 महीने के लाइसेंस निलंबन से बचने के लिए गति तुरंत कम करें।",
        speechText: "सावधान! आप धारा एक सौ बारह के तहत गति सीमा पार कर रहे हैं। दो हजार रुपये के जुर्माने और तीन महीने के लाइसेंस निलंबन से बचने के लिए गति तुरंत कम करें।"
      },
      Tamil: {
        subtitle: "ஆபத்து! நீங்கள் பிரிவு 112-ன் கீழ் வேக வரம்பை மீறுகிறீர்கள். ₹2,000 அபராதம் மற்றும் 3 மாத உரிமம் ரத்து செய்யப்படுவதைத் தவிர்க்க உடனடியாக வேகத்தைக் குறைக்கவும்.",
        speechText: "ஆபத்து! நீங்கள் பிரிவு நூற்று பன்னிரண்டின் கீழ் வேக வரம்பை மீறுகிறீர்கள். இரண்டாயிரம் ரூபாய் அபராதம் மற்றும் மூன்று மாத உரிமம் ரத்து செய்யப்படுவதைத் தவிர்க்க உடனடியாக வேகத்தைக் குறைக்கவும்."
      },
      Telugu: {
        subtitle: "ప్రమాదం! మీరు సెక్షన్ 112 కింద వేగ పరిమితిని మించిపోతున్నారు. ₹2,000 జరిమానా మరియు 3 నెలల లైసెన్స్ రద్దును నివారించడానికి వెంటనే వేగాన్ని తగ్గించండి.",
        speechText: "ప్రమాదం! మీరు సెక్షన్ నూట పన్నెండు కింద వేగ పరిమితిని మించిపోతున్నారు. రెండు వేల రూపాయల జరిమానా మరియు మూడు నెలల లైసెన్స్ రద్దును నివారించడానికి వెంటనే వేగాన్ని తగ్గించండి."
      },
      Kannada: {
        subtitle: "ಅಪಾಯ! ನೀವು ಸೆಕ್ಷನ್ 112 ರ ಅಡಿಯಲ್ಲಿ ವೇಗದ ಮಿತಿಯನ್ನು ಮೀರುತ್ತಿದ್ದೀರಿ. ₹2,000 ದಂಡ ಮತ್ತು 3 ತಿಂಗಳ ಲೈಸೆನ್ಸ್ ಅಮಾನತು ತಪ್ಪಿಸಲು ತಕ್ಷಣ ವೇಗವನ್ನು ಕಡಿಮೆ ಮಾಡಿ.",
        speechText: "ಅಪಾಯ! ನೀವು ಸೆಕ್ಷನ್ ನೂಟ ಹನ್ನೆರಡು ರ ಅಡಿಯಲ್ಲಿ ವೇಗದ ಮಿತಿಯನ್ನು ಮೀರುತ್ತಿದ್ದೀರಿ. ಎರಡು ಸಾವಿರ ರೂಪಾಯಿ ದಂಡ ಮತ್ತು ಮೂರು ತಿಂಗಳ ಲೈಸೆನ್ಸ್ ಅಮಾನತು ತಪ್ಪಿಸಲು ತಕ್ಷಣ ವೇಗವನ್ನು ಕಡಿಮೆ ಮಾಡಿ."
      },
      Bengali: {
        subtitle: "বিপদ! আপনি ধারা ১১২ এর অধীনে গতিসীমা অতিক্রম করছেন। ₹২,০০০ জরিমানা এবং ৩ মাসের লাইসেন্স বাতিল এড়াতে অবিলম্বে গতি কমান।",
        speechText: "বিপদ! আপনি ধারা একশো বারো এর অধীনে গতিসীমা অতিক্রম করছেন। দুই হাজার টাকা জরিমানা এবং তিন মাসের লাইসেন্স বাতিল এড়াতে অবিলম্বে গতি কমান।"
      },
      Marathi: {
        subtitle: "धोका! आपण कलम ११२ अंतर्गत वेगमर्यादा ओलांडत आहात. ₹२,००० दंड आणि ३ महिने परवाना निलंबन टाळण्यासाठी तात्काळ वेग कमी करा.",
        speechText: "धोका! आपण कलम एकशे बारा अंतर्गत वेगमर्यादा ओलांडत आहात. दोन हजार रुपये दंड आणि तीन महिने परवाना निलंबन टाळण्यासाठी तात्काळ वेग कमी करा।"
      },
      Gujarati: {
        subtitle: "જોખમ! તમે કલમ 112 હેઠળ ઝડપ મર્યાદા ઓળંગી રહ્યા છો. ₹2,000 દંડ અને 3 મહિનાના લાઇસન્સ સસ્પેન્શનથી બચવા માટે તરત જ ઝડપ ધીમી કરો.",
        speechText: "જોખમ! તમે કલમ એક સો બાર હેઠળ ઝડપ મર્યાદા ઓળંગી રહ્યા છો. બે હજાર રૂપિયા દંડ અને ત્રણ મહિનાના લાઇસન્સ સસ્પેન્શનથી બચવા માટે તરત જ ઝડપ ધીમી કરો."
      }
    }
  },
  drinking: {
    name: "Drunken Driving",
    section: "Section 185",
    languages: {
      English: {
        subtitle: "Alert: Driving with Blood Alcohol Content exceeding 30mg per 100ml is a high-severity offense under Section 185. Facing severe ₹10,000 fine and up to 6 months jail.",
        speechText: "Alert. Driving with Blood Alcohol Content exceeding thirty milligrams per one hundred milliliters is a high-severity offense under Section One Eighty-Five. Facing severe ten thousand rupee fine and up to six months jail."
      },
      Hindi: {
        subtitle: "चेतावनी: 30 मिलीग्राम से अधिक रक्त अल्कोहल स्तर के साथ वाहन चलाना धारा 185 के तहत गंभीर अपराध है। ₹10,000 का भारी जुर्माना और 6 महीने की जेल हो सकती है।",
        speechText: "चेतावनी: तीस मिलीग्राम से अधिक रक्त अल्कोहल स्तर के साथ वाहन चलाना धारा एक सौ पचासी के तहत गंभीर अपराध है। दस हजार रुपये का भारी जुर्माना और छह महीने की जेल हो सकती है।"
      },
      Tamil: {
        subtitle: "எச்சரிக்கை: 100 மிலி இரத்தத்தில் 30 மில்லிகிராமுக்கு மேல் ஆல்கஹால் கொண்டு வாகனம் ஓட்டுவது பிரிவு 185-ன் கீழ் கடுமையான குற்றமாகும். ₹10,000 அபராதம் மற்றும் 6 மாதங்கள் வரை சிறைத்தண்டனை விதிக்கப்படும்.",
        speechText: "எச்சரிக்கை: நூறு மிலி இரத்தத்தில் முப்பது மில்லிகிராமுக்கு மேல் ஆல்கஹால் கொண்டு வாகனம் ஓட்டுவது பிரிவு நூற்று எண்பத்து ஐந்தின் கீழ் கடுமையான குற்றமாகும். பத்தாயிரம் ரூபாய் அபராதம் மற்றும் ஆறு மாதங்கள் வரை சிறைத்தண்டனை விதிக்கப்படும்."
      },
      Telugu: {
        subtitle: "హెచ్చరిక: 100ml రక్తంలో 30mg కంటే ఎక్కువ ఆల్కహాల్ కలిగి వాహనం నడపడం సెక్షన్ 185 కింద తీవ్రమైన నేరం. ₹10,000 జరిమానా మరియు 6 నెలల వరకు జైలు శిక్ష విధించబడుతుంది.",
        speechText: "హెచ్చరిక: వంద ఎంఎల్ రక్తంలో ముప్పై ఎంజీ కంటే ఎక్కువ ఆల్కహాల్ కలిగి వాహనం నడపడం సెక్షన్ నూట ఎనభై ఐదు కింద తీవ్రమైన నేరం. పది వేల రూపాయల జరిమానా మరియు ఆరు నెలల వరకు జైలు శిక్ష విధించబడుతుంది."
      },
      Kannada: {
        subtitle: "ಎಚ್ಚರಿಕೆ: 100 ಮಿಲಿ ರಕ್ತದಲ್ಲಿ 30 ಮಿಗ್ರಾಂ ಗಿಂತ ಹೆಚ್ಚು ಆಲ್ಕೋಹಾಲ್ ಹೊಂದಿರುವಾಗ ವಾಹನ ಚಾಲನೆ ಮಾಡುವುದು ಸೆಕ್ಷನ್ 185 ರ ಅಡಿಯಲ್ಲಿ ಗಂಭೀರ ಅಪರಾಧವಾಗಿದೆ. ₹10,000 ದಂಡ ಮತ್ತು 6 ತಿಂಗಳವರೆಗೆ ಜೈಲು ಶಿಕ್ಷೆ ಎದುರಿಸಬೇಕಾಗುತ್ತದೆ.",
        speechText: "ಎಚ್ಚರಿಕೆ: ನೂರು ಮಿಲಿ ರಕ್ತದಲ್ಲಿ ಮೂವತ್ತು ಮಿಗ್ರಾಂ ಗಿಂತ ಹೆಚ್ಚು ಆಲ್ಕೋಹಾಲ್ ಹೊಂದಿರುವಾಗ ವಾಹನ ಚಾಲನೆ ಮಾಡುವುದು ಸೆಕ್ಷನ್ ನೂಟ ಎಂಭತ್ತೈದರ ಅಡಿಯಲ್ಲಿ ಗಂಭೀರ ಅಪರಾಧವಾಗಿದೆ. ಹತ್ತು ಸಾವಿರ ರೂಪಾಯಿ ದಂಡ ಮತ್ತು ಆರು ತಿಂಗಳವರೆಗೆ ಜೈಲು ಶಿಕ್ಷೆ ಎದುರಿಸಬೇಕಾಗುತ್ತದೆ."
      },
      Bengali: {
        subtitle: "সতর্কতা: প্রতি ১০০ মিলি রক্তে ৩০ মিলিগ্রামের বেশি অ্যালকোহল নিয়ে গাড়ি চালানো ধারা ১৮৫ এর অধীনে মারাত্মক অপরাধ। ₹১০,০০০ জরিমানা এবং ৬ মাস পর্যন্ত জেল হতে পারে।",
        speechText: "সতর্কতা: প্রতি একশো মিলি রক্তে ত্রিশ মিলিগ্রামের বেশি অ্যালকোহল নিয়ে গাড়ি চালানো ধারা একশো পঁচাশি এর অধীনে মারাত্মক অপরাধ। দশ হাজার টাকা জরিমানা এবং ছয় মাস পর্যন্ত জেল হতে পারে।"
      },
      Marathi: {
        subtitle: "इशारा: १०० मिली रक्तामध्ये ३० मिलीग्रँम पेक्षा जास्त अल्कोहोल आढळल्यास वाहन चालवणे हे कलम १८५ अंतर्गत गंभीर गुन्हा आहे. ₹१०,००० चा दंड आणि ६ महिन्यांपर्यंत कारावास होऊ शकतो.",
        speechText: "इशारा: शंभर मिली रक्तामध्ये तीस मिलीग्रॅम पेक्षा जास्त अल्कोहोल आढळल्यास वाहन चालवणे हे कलम एकशे पंच्याऐंशी अंतर्गत गंभीर गुन्हा आहे. दहा हजार रुपयांचा दंड आणि सहा महिन्यांपर्यंत कारावास होऊ शकतो।"
      },
      Gujarati: {
        subtitle: "ચેતવણી: 100 મિલી લોહીમાં 30 મિલિગ્રામથી વધુ આલ્કોહોલ પીને વાહન ચલાવવું એ કલમ 185 હેઠળ ગંભીર ગુનો છે. ₹10,000 સુધીનો દંડ અને 6 મહિના સુધીની જેલ થઈ શકે છે.",
        speechText: "ચેતવણી: સો મિલી લોહીમાં ત્રીસ મિલિગ્રામથી વધુ આલ્કોહોલ પીને વાહન ચલાવવું એ કલમ એક સો પંચ્યાસી હેઠળ ગંભીર ગુનો છે. દસ હજાર રૂપિયા સુધીનો દંડ અને છ મહિના સુધીની જેલ થઈ શકે છે."
      }
    }
  },
  helmet: {
    name: "Helmet Compliance",
    section: "Section 194D",
    languages: {
      English: {
        subtitle: "Notice: Section 194D mandates BIS/ISI certified helmets for both driver and pillion passenger on two-wheelers. Violation triggers ₹1,000 fine and 3 months license suspension.",
        speechText: "Notice. Section One Ninety-Four D mandates B I S or I S I certified helmets for both driver and pillion passenger on two-wheelers. Violation triggers one thousand rupee fine and three months license suspension."
      },
      Hindi: {
        subtitle: "सूचना: धारा 194D दुपहिया वाहनों पर चालक और पीछे बैठने वाले दोनों के लिए बीआईएस/आईएसआई प्रमाणित हेलमेट अनिवार्य करती है। उल्लंघन पर ₹1,000 का जुर्माना और 3 महीने का लाइसेंसनिलंबन होगा।",
        speechText: "सूचना: धारा एक सौ चौरानवे डी दुपहिया वाहनों पर चालक और पीछे बैठने वाले दोनों के लिए बीआईएस या आईएसआई प्रमाणित हेलमेट अनिवार्य करती है। उल्लंघन पर एक हजार रुपये का जुर्माना और तीन महीने का लाइसेंस निलंबन होगा।"
      },
      Tamil: {
        subtitle: "அறிவிப்பு: இருசக்கர வாகனத்தில் ஓட்டுநர் மற்றும் பின்னால் அமர்ந்திருப்பவர் இருவரும் BIS/ISI சான்றளிக்கப்பட்ட ஹெல்மெட் அணிய வேண்டும் என்று பிரிவு 194D கட்டாயமாக்குகிறது. மீறினால் ₹1,000 அபராதம் மற்றும் 3 மாத உரிமம் தற்காலிக நீக்கம் செய்யப்படும்.",
        speechText: "அறிவிப்பு: இருசக்கர வாகனத்தில் ஓட்டுநர் மற்றும் பின்னால் அமர்ந்திருப்பவர் இருவரும் பி ಐ எஸ் அல்லது ஐ எஸ் ஐ சான்றளிக்கப்பட்ட ஹெல்மெட் அணிய வேண்டும் என்று பிரிவு நூற்று தொண்ணூற்று நான்கு டி கட்டாயமாக்குகிறது. மீறினால் ஆயிரம் ரூபாய் அபராதம் மற்றும் மூன்று மாத உரிமம் தற்காலிக நீக்கம் செய்யப்படும்."
      },
      Telugu: {
        subtitle: "సూచన: సెక్షన్ 194D ప్రకారం ద్విచక్ర వాహనాలపై డ్రైవర్ మరియు వెనుక కూర్చున్న ప్రయాణీకుడు ఇద్దరూ BIS/ISI సర్టిఫైడ్ హెల్మెట్ ధరించడం తప్పనిసరి. ఉల్లంఘిస్తే ₹1,000 జరిమానా మరియు 3 నెలల లైసెన్స్ రద్దు చేయబడుతుంది.",
        speechText: "సూచన: సెక్షన్ నూట తొంభై నాలుగు డి ప్రకారం ద్విచక్ర వాహనాలపై డ్రైవర్ మరియు వెనుక కూర్చున్న ప్రయాణీకుడు ఇద్దరూ బీఐఎస్ లేదా ఐఎస్ఐ సర్టిఫైడ్ హెల్మెట్ ధరించడం తప్పనిసరి. ఉల్లంఘిస్తే వెయ్యి రూపాయల జరిమానా మరియు మూడు నెలల లైసెన్స్ రద్దు చేయబడుతుంది."
      },
      Kannada: {
        subtitle: "ಸೂಚನೆ: ಸೆಕ್ಷನ್ 194D ದ್ವಿಚಕ್ರ ವಾಹನಗಳಲ್ಲಿ ಚಾಲಕ ಮತ್ತು ಹಿಂಬದಿ ಸವಾರ ಇಬ್ಬರಿಗೂ BIS/ISI ಪ್ರಮಾಣೀಕೃತ ಹೆಲ್ಮೆಟ್‌ ಧರಿಸುವುದನ್ನು ಕಡ್ಡಾಯಗೊಳಿಸುತ್ತದೆ. ಉಲ್ಲಂಘನೆಯು ₹1,000 ದಂಡ ಮತ್ತು 3 ತಿಂಗಳ ಲೈಸೆನ್ಸ್ ಅಮಾನತುಗೊಳಿಸುತ್ತದೆ.",
        speechText: "ಸೂಚನೆ: ಸೆಕ್ಷನ್ ನೂಟ ತೊಂಬತ್ತನಾಲ್ಕು ಡಿ ದ್ವಿಚಕ್ರ ವಾಹನಗಳಲ್ಲಿ ಚಾಲಕ ಮತ್ತು ಹಿಂಬದಿ ಸವಾರ ಇಬ್ಬರಿಗೂ ಬಿ ಐ ಎಸ್ ಅಥವಾ ಐ ಎಸ್ ಐ ಪ್ರಮಾಣೀಕೃತ ಹೆಲ್ಮೆಟ್‌ ಧರಿಸುವುದನ್ನು ಕಡ್ಡಾಯಗೊಳಿಸುತ್ತದೆ. ಉಲ್ಲಂಘನೆಯು ಸಾವಿರ ರೂಪಾಯಿ ದಂಡ ಮತ್ತು ಮೂರು ತಿಂಗಳ ಲೈಸೆನ್ಸ್ ಅಮಾನತುಗೊಳಿಸುತ್ತದೆ."
      },
      Bengali: {
        subtitle: "বিজ্ঞপ্তি: ধারা ১৯৪D দ্বীচক্র যানে চালক এবং আরোহী উভয়ের জন্যই BIS/ISI শংসাপত্রপ্রাপ্ত হেলমেট বাধ্যতামূলক করে। অমান্য করলে ₹১,০০০ জরিমানা এবং ৩ মাসের লাইসেন্স বাতিল হবে।",
        speechText: "বিজ্ঞপ্তি: ধারা একশো চুরানব্বই ডি দ্বীচক্র যানে চালক এবং আরোহী উভয়ের জন্যই বি আই এস বা আই এস আই শংসাপত্রপ্রাপ্ত হেলমেট বাধ্যতামূলক করে। অমান্য করলে এক হাজার টাকা জরিমানা এবং তিন মাসের লাইসেন্স বাতিল হবে।"
      },
      Marathi: {
        subtitle: "सूचना: कलम १९४D नुसार दुचाकीवरील चालक आणि पाठीमागील प्रवासी दोघांनाही BIS/ISI प्रमाणित हेल्मेट घालणे अनिवार्य आहे. उल्लंघन केल्यास ₹१,००० दंड आणि ३ महिने परवाना रद्द होईल.",
        speechText: "सूचना: कलम एकशे चौऱ्याण्णव डी नुसार दुचाकीवरील चालक आणि पाठीमागील प्रवासी दोघांनाही बी आय एस किंवा आय एस आय प्रमाणित हेल्मेट घालणे अनिवार्य आहे. उल्लंघन केल्यास एक हजार रुपये दंड आणि तीन महिने परवाना रद्द होईल।"
      },
      Gujarati: {
        subtitle: "સૂચના: કલમ 194D ટુ-વ્હીલર પર ડ્રાઇવર અને પાછળ બેસનાર બંને માટે BIS/ISI પ્રમાણિત હેલ્મેટ ફરજિયાત બનાવે છે. ઉલ્લંઘન બદલ ₹1,000 દંડ અને 3 મહિનાનું લાઇસન્સ સસ્પેન્શન થશે.",
        speechText: "સૂચના: કલમ એક સો ચોર્યાસી ડી ટુ-વ્હીલર પર ડ્રાઇવર અને પાછળ બેસનાર બંને માટે કેન આઇ એસ અથવા આઇ એસ આઇ પ્રમાણિત હેલ્મેટ ફરજિયાત બનાવે છે. ઉલ્લંઘન બદલ એક હજાર રૂપિયા દંડ અને ત્રણ મહિનાનું લાઇસન્સ સસ્પેન્શન થશે."
      }
    }
  },
  seatbelt: {
    name: "Seatbelt Mandate",
    section: "Section 194B",
    languages: {
      English: {
        subtitle: "Notice: Under Section 194B, passive safety seatbelts are mandatory for all occupants, including front and rear seat passengers. Failure triggers high fines of ₹1,000 per unbelted passenger.",
        speechText: "Notice. Under Section One Ninety-Four B, passive safety seatbelts are mandatory for all occupants, including front and rear seat passengers. Failure triggers high fines of one thousand rupees per unbelted passenger."
      },
      Hindi: {
        subtitle: "सूचना: धारा 194B के तहत, आगे और पीछे बैठने वाले सभी यात्रियों के लिए सुरक्षा सीट बेल्ट पहनना अनिवार्य है। बेल्ट न पहनने पर प्रति यात्री ₹1,000 का भारी जुर्माना लगाया जाएगा।",
        speechText: "सूचना: धारा एक सौ चौरानवे बी के तहत, आगे और पीछे बैठने वाले सभी यात्रियों के लिए सुरक्षा सीट बेल्ट पहनना अनिवार्य है। बेल्ट न पहनने पर प्रति यात्री एक हजार रुपये का भारी जुर्माना लगाया जाएगा।"
      },
      Tamil: {
        subtitle: "அறிவிப்பு: பிரிவு 194B-ன் கீழ், முன் மற்றும் பின் இருக்கை பயணிகள் உட்பட அனைத்து பயணிகளுக்கும் சீட் பெல்ட் அணிவது கட்டாயமாகும். அணியத் தவறினால் சீட் பெல்ட் அணியாத பயணிக்கு தலா ₹1,000 அபராதம் விதிக்கப்படும்.",
        speechText: "அறிவிப்பு: பிரிவு நூற்று தொண்ணூற்று நான்கு பியின் கீழ், முன் மற்றும் பின் இருக்கை பயணிகள் உட்பட அனைத்து பயணிகளுக்கும் சீட் பெல்ட் அணிவது கட்டாயமாகும். அணியத் தவறினால் சீட் பெல்ட் அணியாத பயணிக்கு தலா ஆயிரம் ரூபாய் அபராதம் விதிக்கப்படும்."
      },
      Telugu: {
        subtitle: "సూచన: సెక్షన్ 194B కింద, ముందు మరియు వెనుక కూర్చున్న ప్రయాణీకులతో సహా అందరికీ సీట్ బెల్ట్ ధరించడం తప్పనిసరి. ధరించకపోతే బెల్ట్ లేని ఒక్కో ప్రయాణీకుడికి ₹1,000 చొప్పున జరిమానా విధించబడుతుంది.",
        speechText: "సూచన: సెక్షన్ నూట తొంభై నాలుగు బి కింద, ముందు మరియు వెనుక కూర్చున్న ప్రయాణీకులతో సహా అందరికీ సీట్ బెల్ట్ ధరించడం తప్పనిసరి. ధరించకపోతే బెల్ట్ లేని ఒక్కో ప్రయాణీకుడికి వెయ్యి రూపాయల చొప్పున జరిమానా విధించబడుతుంది."
      },
      Kannada: {
        subtitle: "ಸೂಚನೆ: ಸೆಕ್ಷನ್ 194B ಅಡಿಯಲ್ಲಿ, ಮುಂಭಾಗದ ಮತ್ತು ಹಿಂಭಾಗದ ಸವಾರರೂ ಸೇರಿದಂತೆ ಎಲ್ಲರಿಗೂ ಸೀಟ್‌ಬೆಲ್ಟ್‌ ಧರಿಸುವುದು ಕಡ್ಡಾಯವಾಗಿದೆ. ತಪ್ಪಿದರೆ ಬೆಲ್ಟ್‌ ಧರಿಸದ ಪ್ರತಿ ಸವಾರನಿಗೆ ₹1,000 ದಂಡ ವಿಧಿಸಲಾಗುತ್ತದೆ.",
        speechText: "ಸೂಚನೆ: ಸೆಕ್ಷನ್ ನೂಟ ತೊಂಬತ್ತನಾಲ್ಕು ಬಿ ಅಡಿಯಲ್ಲಿ, ಮುಂಭಾಗದ ಮತ್ತು ಹಿಂಭಾಗದ ಸವಾರರೂ ಸೇರಿದಂತೆ ಎಲ್ಲರಿಗೂ ಸೀಟ್‌ಬೆಲ್ಟ್‌ ಧರಿಸುವುದು ಕಡ್ಡಾಯವಾಗಿದೆ. ತಪ್ಪಿದರೆ ಬೆಲ್ಟ್‌ ಧರಿಸದ ಪ್ರತಿ ಸವಾರನಿಗೆ ಸಾವಿರ ರೂಪಾಯಿ ದಂಡ ವಿಧಿಸಲಾಗುತ್ತದೆ."
      },
      Bengali: {
        subtitle: "বিজ্ঞপ্তি: ধারা ১৯৪B এর অধীনে, সামনে এবং পেছনে বসা সমস্ত আরোহীর জন্য সিটবেল্ট পরা বাধ্যতামূলক। সিটবেল্ট না পরলে প্রতি যাত্রী পিছু ₹১,০০০ জরিমানা হবে।",
        speechText: "বিজ্ঞপ্তি: ধারা একশো চুরানব্বই বি এর অধীনে, সামনে এবং পেছনে বসা সমস্ত আরোহীর জন্য সিটবেল্ট পরা বাধ্যতামূলক। সিটবেল্ট না পরলে প্রতি যাত্রী পিছু এক হাজার টাকা জরিমানা হবে।"
      },
      Marathi: {
        subtitle: "सूचना: कलम १९४B नुसार, पुढच्या आणि मागच्या सीटवरील प्रवाशांसह सर्वांसाठीच सीटबेल्ट लावणे बंधनकारक आहे. न लावल्यास प्रति प्रवासी ₹१,००० दंडात्मक कारवाई होईल.",
        speechText: "सूचना: कलम एकशे चौऱ्याण्णव बी नुसार, पुढच्या आणि मागच्या सीटवरील प्रवाशांसह सर्वांसाठीच सीटबेल्ट लावणे बंधनकारक आहे. न लावल्यास प्रति प्रवासी एक हजार रुपये दंडात्मक कारवाई होईल।"
      },
      Gujarati: {
        subtitle: "સૂચના: કલમ 194B હેઠળ, આગળ અને પાછળની સીટના મુસાફરો સહિત તમામ મુસાફરો માટે સીટ બેલ્ટ પહેરવો ફરજિયાત છે. બેલ્ટ ન પહેરવા બદલ મુસાફર દીઠ ₹1,000 નો દંડ વસૂલવામાં આવશે.",
        speechText: "સૂચના: કલમ એક સો ચોર્યાસી બી હેઠળ, આગળ અને પાછળની સીટના મુસાફરો સહિત તમામ મુસાફરો માટે સીટ બેલ્ટ પહેરવો ફરજિયાત છે. બેલ્ટ ન પહેરવા બદલ મુસાફર દીઠ એક હજાર રૂપિયા નો દંડ વસૂલવામાં આવશે."
      }
    }
  },
  nolicense: {
    name: "Driving without License",
    section: "Section 181",
    languages: {
      English: {
        subtitle: "Critical: Operating a motor vehicle without a valid, active driving license under Section 181 is a severe infraction. Facing a flat ₹5,000 fine or imprisonment up to 3 months.",
        speechText: "Critical. Operating a motor vehicle without a valid, active driving license under Section One Eighty-One is a severe infraction. Facing a flat five thousand rupee fine or imprisonment up to three months."
      },
      Hindi: {
        subtitle: "गंभीर नियम: धारा 181 के तहत बिना वैध और सक्रिय ड्राइविंग लाइसेंस के वाहन चलाना एक गंभीर अपराध है। ₹5,000 का सीधा जुर्माना या 3 महीने तक की जेल हो सकती है।",
        speechText: "गंभीर नियम: धारा एक सौ इक्यासी के तहत बिना वैध और सक्रिय ड्राइविंग लाइसेंस के वाहन चलाना एक गंभीर अपराध है। पांच हजार रुपये का सीधा जुर्माना या तीन महीने तक की जेल हो सकती है।"
      },
      Tamil: {
        subtitle: "கவனம்: பிரிவு 181-ன் கீழ் சரியான ஓட்டுநர் உரிமம் இல்லாமல் வாகனம் ஓட்டுவது கடுமையான குற்றமாகும். இதற்கு ₹5,000 அபராதம் அல்லது 3 மாதங்கள் வரை சிறைத்தண்டனை விதிக்கப்படும்.",
        speechText: "கவனம்: பிரிவு நூற்று எண்பத்து ஒன்றின் கீழ் சரியான ஓட்டுநர் உரிமம் இல்லாமல் வாகனம் ஓட்டுவது கடுமையான குற்றமாகும். இதற்கு ஐந்தாயிரம் ரூபாய் அபராதம் அல்லது மூன்று மாதங்கள் வரை சிறைத்தண்டனை விதிக்கப்படும்."
      },
      Telugu: {
        subtitle: "కీలకం: సెక్షన్ 181 కింద చెల్లుబాటు అయ్యే డ్రైవింగ్ లైసెన్స్ లేకుండా వాహనం నడపడం తీవ్రమైన నేరం. ₹5,000 జరిమానా లేదా 3 నెలల వరకు జైలు శిక్ష విధించబడుతుంది.",
        speechText: "కీలకం: సెక్షన్ నూట ఎనభై ఒకటి కింద చెల్లుబాటు అయ్యే డ్రైవింగ్ లైసెన్స్ లేకుండా వాహనం నడపడం తీవ్రమైన నేరం. ఐదు వేల రూపాయల జరిమానా లేదా మూడు నెలల వరకు జైలు శిక్ష విధించబడుతుంది."
      },
      Kannada: {
        subtitle: "ಗಂಭೀರ: ಸೆಕ್ಷನ್ 181 ರ ಅಡಿಯಲ್ಲಿ ಮಾನ್ಯ ಚಾಲನಾ ಪರವಾನಗಿ ಇಲ್ಲದೆ ವಾಹನ ಚಾಲನೆ ಮಾಡುವುದು ಗಂಭೀರ ಅಪರಾಧವಾಗಿದೆ. ₹5,000 ದಂಡ ಅಥವಾ 3 ತಿಂಗಳವರೆಗೆ ಜೈಲು ಶಿಕ್ಷೆ ವಿಧಿಸಲಾಗುತ್ತದೆ.",
        speechText: "ಗಂಭೀರ: ಸೆಕ್ಷನ್ ನೂಟ ಎಂಭತ್ತೊಂದರ ಅಡಿಯಲ್ಲಿ ಮಾನ್ಯ ಚಾಲನಾ ಪರವಾನಗಿ ಇಲ್ಲದೆ ವಾಹನ ಚಾಲನೆ ಮಾಡುವುದು ಗಂಭೀರ ಅಪರಾಧವಾಗಿದೆ. ಐದು ಸಾವಿರ ದಂಡ ಅಥವಾ ಮೂರು ತಿಂಗಳವರೆಗೆ ಜೈಲು ಶಿಕ್ಷೆ ವಿಧಿಸಲಾಗುತ್ತದೆ."
      },
      Bengali: {
        subtitle: "গুরুত্বপূর্ণ: ধারা ১৮১ এর অধীনে একটি বৈধ ড্রাইভিং লাইসেন্স ছাড়া যান চালানো গুরুতর অপরাধ। সরাসরি ₹৫,০০০ জরিমানা বা ৩ মাস পর্যন্ত জেল হতে পারে।",
        speechText: "গুরুত্বপূর্ণ: ধারা একশো একাশি এর অধীনে একটি বৈধ ড্রাইভিং লাইসেন্স ছাড়া যান চালানো গুরুতর অপরাধ। সরাসরি পাঁচ হাজার টাকা জরিমানা বা তিন মাস পর্যন্ত জেল হতে পারে।"
      },
      Marathi: {
        subtitle: "गंभीर: कलम १८१ नुसार वैध ड्रायव्हिंग लायसन्सशिवाय वाहन चालवणे हा मोठा गुन्हा आहे. थेट ₹५,००० चा दंड किंवा ३ महिन्यांपर्यंत कारावास होऊ शकतो.",
        speechText: "गंभीर: कलम एकशे ऐंशी नुसार वैध ड्रायव्हिंग लायसन्सशिवाय वाहन चालवणे हा मोठा गुन्हा आहे. थेट पाच हजार रुपयांचा दंड किंवा तीन महिन्यांपर्यंत कारावास होऊ शकतो।"
      },
      Gujarati: {
        subtitle: "ગંભીર: કલમ 181 હેઠળ માન્ય અને सક્રિય ડ્રાઇવિંગ લાઇસન્સ વિના વાહન ચલાવવું એ ગંભીર ગુનો છે. ₹5,000 નો સીધો દંડ અથવા 3 મહિના સુધીની જેલ થઈ શકે છે.",
        speechText: "ગંભીર: કલમ એક સો એક્યાસી હેઠળ માન્ય અને સક્રિય ડ્રાઇવિંગ લાઇસન્સ વિના વાહન ચલાવવું એ ગંભીર ગુનો છે. પાંચ હજાર રૂપિયા નો સીધો દંડ અથવા ત્રણ મહિના સુધીની જેલ થઈ શકે છે."
      }
    }
  },
  puc: {
    name: "PUC Emissions Expired",
    section: "Section 190(2)",
    languages: {
      English: {
        subtitle: "Alert: Section 190(2) enforces strict emissions control. Driving without an active, certified PUC certificate carries a massive ₹10,000 fine and immediate 3 months license suspension.",
        speechText: "Alert. Section One Ninety point Two enforces strict emissions control. Driving without an active, certified P U C certificate carries a massive ten thousand rupee fine and immediate three months license suspension."
      },
      Hindi: {
        subtitle: "चेतावनी: धारा 190(2) कड़े प्रदूषण नियंत्रण नियमों को लागू करती है। वैध प्रदूषण प्रमाणपत्र (PUC) के बिना वाहन चलाने पर ₹10,000 का भारी जुर्माना और तुरंत 3 महीने का लाइसेंस निलंबन होगा।",
        speechText: "चेतावनी: धारा एक सौ नब्बे पॉइंट दो कड़े प्रदूषण नियंत्रण नियमों को लागू करती है। वैध प्रदूषण प्रमाणपत्र पीयूसी के बिना वाहन चलाने पर दस हजार रुपये का भारी जुर्माना और तुरंत तीन महीने का लाइसेंस निलंबन होगा।"
      },
      Tamil: {
        subtitle: "எச்சரிக்கை: பிரிவு 190(2) உமிழ்வு கட்டுப்பாட்டை வலியுறுத்துகிறது. செல்லுபடியாகும் புல்லூஷன் சான்றிதழ் (PUC) இல்லாமல் வாகனம் ஓட்டினால் ₹10,000 அபராதமும், உடனடி 3 மாத உரிமம் தற்காலிக நீக்கமும் செய்யப்படும்.",
        speechText: "எச்சரிக்கை: பிரிவு நூற்று தொண்ணூற்று நான்கு பியின் கீழ் உமிழ்வுக் கட்டுப்பாட்டை வலியுறுத்துகிறது. செல்லுபடியாகும் புல்லூஷன் சான்றிதழ் பி யூ சி இல்லாமல் வாகனம் ஓட்டினால் பத்தாயிரம் ரூபாய் அபராதமும், உடனடி மூன்று மாத உரிமம் தற்காலிக நீக்கமும் செய்யப்படும்."
      },
      Telugu: {
        subtitle: "హెచ్చరిక: సెక్షన్ 190(2) కాలుష్య నియন্ত্রণ నియమాన్ని అమలు చేస్తుంది. కాబట్టి చెల్లుబాటు అయ్యే కాలుష్య ధృవీకరణ పత్రం (PUC) లేకుండా వాహనం నడిపితే ₹10,000 భారీ జరిమానా పడుతుంది.",
        speechText: "హెచ్చరిక: సెక్షన్ నూట తొంభై పాయింట్ రెండు కాలుష్య నియంత్రణ నియమాన్ని అమలు చేస్తుంది. కాబట్టి చెల్లుబాటు అయ్యే కాలుష్య ధృవీకరణ పత్రం పియుసి లేకుండా వాహనం నడిపితే పది వేల రూపాయలు భారీ జరిమానా పడుతుంది."
      },
      Kannada: {
        subtitle: "ಎಚ್ಚರಿಕೆ: ಸೆಕ್ಷನ್ 190(2) ಕಟ್ಟುನಿಟ್ಟಾದ ಮಾಲಿನ್ಯ ನಿಯಂತ್ರಣವನ್ನು ಜಾರಿಗೆ ತರುತ್ತದೆ. ಮಾನ್ಯ ಮಾಲಿನ್ಯ ಪ್ರಮಾಣಪತ್ರ (PUC) ಇಲ್ಲದೆ ವಾಹನ ಚಲಾಯಿಸಿದರೆ ₹10,000 ಭಾರಿ ದಂಡ ವಿಧಿಸಲಾಗುತ್ತದೆ.",
        speechText: "ಎಚ್ಚರಿಕೆ: ಸೆಕ್ಷನ್ ನೂಟ ತೊಂಬತ್ತು ಪಾಯಿಂಟ್ ಎರಡು ಕಟ್ಟುನಿಟ್ಟಾದ ಮಾಲಿನ್ಯ ನಿಯಂತ್ರಣವನ್ನು ಜಾರಿಗೆ ತರುತ್ತದೆ. ಮಾನ್ಯ ಮಾಲಿನ್ಯ ಪ್ರಮಾಣಪತ್ರ ಪಿ ಯೂ ಸಿ ಇಲ್ಲದೆ ವಾಹನ ಚಲಾಯಿಸಿದರೆ ಹತ್ತು ಸಾವಿರ ಭಾರಿ ದಂಡ ವಿಧಿಸಲಾಗುತ್ತದೆ."
      },
      Bengali: {
        subtitle: "সতর্কতা: ধারা ১৯০(২) কঠোর দূষণ নিয়ন্ত্রণ বিধি জারি করে। ও ধূসর রঙের ধোঁয়ার কারণে ₹১০,০০০ জরিমানা এবং ৩ মাসের লাইসেন্স বাতিল হবে।",
        speechText: "সতর্কতা: ধারা একশো নব্বই পয়েন্ট দুই কঠোর দূষণ নিয়ন্ত্রণ বিধি জারি করে। বৈধ দূষণ শংসাপত্র পি ইউ সি ছাড়া গাড়ি চালানোয় দশ হাজার টাকা জরিমানা এবং ততক্ষণাৎ তিন মাসের লাইসেন্স বাতিল হবে।"
      },
      Marathi: {
        subtitle: "इशारा: कलम १९०(२) अंतर्गत प्रदूषण नियंत्रण नियमांची कडक अंमलबजावणी केली जाते. वैध पीयूसी (PUC) प्रमाणपत्राशिवाय वाहन चालवल्यास ₹१०,००० चा प्रचंड दंड आणि ३ महिने परवाना रद्द होईल.",
        speechText: "इशारा: कलम एकशे नव्वद पॉईंट दोन अंतर्गत प्रदूषण नियंत्रण नियमांची कडक अंमलबजावणी केली जाते. वैध पीयूसी प्रमाणपत्राशिवाय वाहन चालवल्यास दहा हजार रुपयांचा प्रचंड दंड आणि तीन महिने परवाना रद्द होईल।"
      },
      Gujarati: {
        subtitle: "ચેતવણી: કલમ 190(2) હેઠળ પ્રદૂષણ નિયંત્રણના ચુસ્ત નિયમો લાગુ થાય છે. માન્ય પ્રદૂષણ પ્રમાણપત્ર (PUC) વિના વાહન ચલાવવા બદલ ₹10,000 નો મોટો દંડ અને લાયસન્સ રદ થશે.",
        speechText: "ચેતવણી: કલમ એક સો નેવું પોઇન્ટ બે હેઠળ પ્રદૂષણ નિયંત્રણના ચુસ્ત નિયમો લાગુ થાય છે. માન્ય પ્રદૂષણ પ્રમાણપત્ર પીયુસી વિના વાહન ચલાવવા બદલ દસ હજાર વસૂલવામાં આવશે."
      }
    }
  }
};

const renderFormattedText = (text: string) => {
  const lines = text.split('\n');
  return (
    <div className="space-y-1.5 font-mono">
      {lines.map((line, idx) => {
        let trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Check if list item
        let isBullet = false;
        if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('* ')) {
          isBullet = true;
          trimmed = trimmed.replace(/^([•\-*]\s*)/, '');
        }

        // Check if bold header line
        const isHeader =
          trimmed.startsWith('#') ||
          (trimmed.startsWith('⚠️') && trimmed.endsWith('**')) ||
          (trimmed.startsWith('👋') && trimmed.includes('WELCOME')) ||
          (trimmed.startsWith('🇮🇳') && trimmed.includes('LAW')) ||
          (trimmed.startsWith('⚡') && trimmed.includes('OVERSPEEDING')) ||
          trimmed.match(/^[🚨🪪🏍️🦺🍃🚦🛡️📱🛣️📄🏙️👋🇮🇳]+ \*\*[^*]+\*\*$/);

        let headerText = trimmed;
        if (headerText.startsWith('### ')) headerText = headerText.substring(4);
        else if (headerText.startsWith('## ')) headerText = headerText.substring(3);
        else if (headerText.startsWith('# ')) headerText = headerText.substring(2);

        // Bold parser helper
        const parseBold = (content: string) => {
          const parts = content.split('**');
          return parts.map((part, pIdx) => {
            if (pIdx % 2 === 1) {
              return <strong key={pIdx} className="font-bold text-amber-400 font-sans">{part}</strong>;
            }
            return part;
          });
        };

        if (isHeader) {
          return (
            <div key={idx} className="text-xs font-bold text-slate-100 uppercase tracking-wider border-b border-slate-800/60 pb-1.5 pt-1.5 flex items-center gap-2 first:pt-0">
              {parseBold(headerText)}
            </div>
          );
        }

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300 pl-1 leading-normal">
              <span className="text-amber-500 mt-1 select-none flex-shrink-0">•</span>
              <div className="flex-1">{parseBold(trimmed)}</div>
            </div>
          );
        }

        return (
          <p key={idx} className="text-[11px] text-slate-300 leading-normal pl-1">
            {parseBold(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

export default function DriveLegal({ activeSubpage }: { activeSubpage?: "chatbot" | 'calculator' | 'scanner' | 'license' | 'voice' }) {
  const [selectedState, setSelectedState] = useState<string>("Delhi NCR");
  const [selectedVehicle, setSelectedVehicle] = useState<'car' | 'twoWheeler' | 'heavy'>('car');
  const [selectedViolation, setSelectedViolation] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([
    { id: "1", sender: "ai", text: "Greetings, Naman Maheshwari. I am your DriveLegal generative counsel. Ask me any queries about motor vehicle acts, fine legalities, court summons, and vehicle impounds. How may I advise you today?", timestamp: new Date() }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [chatbotLoading, setChatbotLoading] = useState(false);

  // Scanner states
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<any>(null);

  // Speech helper states
  const [voiceSpeechText, setVoiceSpeechText] = useState("");
  const [voiceSelectedLanguage, setVoiceSelectedLanguage] = useState("Hindi");
  const [isSpeakingAgent, setIsSpeakingAgent] = useState(false);
  const [voiceSelectedRule, setVoiceSelectedRule] = useState("speeding");
  const [voiceRate, setVoiceRate] = useState(1.0);
  const [voicePitch, setVoicePitch] = useState(1.0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedSysVoiceURI, setSelectedSysVoiceURI] = useState("");

  const endMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    endMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Chat request using server Proxy
  const handleSendMessage = async (textToSend?: string) => {
    const rawMsg = textToSend || inputMessage;
    if (!rawMsg.trim()) return;

    const userMsg = { id: Date.now().toString(), sender: 'user', text: rawMsg, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsSpeakingAgent(false);
    if (!textToSend) setInputMessage("");
    setChatbotLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          userState: selectedState
        })
      });
      const data = await response.json();
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.reply,
        timestamp: new Date()
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "Regretfully, I am experiencing server connection difficulties. Under general Motor Vehicle Guidelines, common offenses carry high penalties under the 2019 Amendments. How else may I support your navigation?",
        timestamp: new Date()
      }]);
    } finally {
      setChatbotLoading(false);
    }
  };

  const calculateChallanDetail = () => {
    const fines = FINE_DATABASE[selectedVehicle];
    const match = fines.find(f => f.violation === selectedViolation || selectedViolation === "");
    return match || fines[0];
  };

  const activeFine = calculateChallanDetail();

  const handleDocumentScanSimulate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScannedResult(null);

    // Convert file to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(',')[1];
      try {
        const res = await fetch("/api/scan-notice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64: base64String,
            imageName: file.name
          })
        });
        const parsed = await res.json();
        setScannedResult(parsed);
      } catch (err) {
        console.error("Scanning malfunction:", err);
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Immediate presets to test the OCR Scanner instantly without uploading any real device file.
  const triggerPresetScan = (presetType: "speed" | "parking" | "puc") => {
    setIsScanning(true);
    setScannedResult(null);

    setTimeout(() => {
      setIsScanning(false);
      if (presetType === "speed") {
        setScannedResult({
          violation: "Over-speeding (NH-44 Bypass Camera Segment)",
          section: "Section 183(1) of Motor Vehicles (Amendment) Act, 2019",
          fineAmount: 2000,
          dueDate: "2026-06-20",
          risk: "High (Driving license suspension and 3 demerit points penalty on repeat occurrence)",
          explanation: "Speed detector automatic speed-gun captured your vehicle running at 104 km/h in a 70 km/h limited national highway section. Recorded at 09:15 AM near outer capital entry. Please settle or challenge within 15 days on e-Challan Parivahan."
        });
      } else if (presetType === "parking") {
        setScannedResult({
          violation: "Unauthorized Obstruction & Parking fine",
          section: "Section 122/177 of Indian Motor Vehicles Act",
          fineAmount: 1000,
          dueDate: "2026-06-15",
          risk: "Medium (Vehicle towing risk and registration block on continuous dues failure)",
          explanation: "Vehicular parking in a non-permitted arterial municipal zone marked clear-way. Action authorized by local traffic surveillance node. Settlement mandatory online prior to next RTO vehicle fitness audit."
        });
      } else {
        setScannedResult({
          violation: "Expired Pollution Under Control (PUC) certificate",
          section: "Section 190(2) of Motor Vehicles Act, 1988",
          fineAmount: 10000,
          dueDate: "2026-06-25",
          risk: "Critical (Court summons, 3 months license disqualification and vehicle blacklisting)",
          explanation: "Notice issued. Central database synchronized failure warning. PUC validation expired for 42 days. Mandatory carbon emission verification is immediately required to avoid automatic e-court summons processing."
        });
      }
    }, 1200);
  };

  // Speaks aloud local language welcome guidance and reply
  const handleLaunchVoiceSpeakingSimulation = () => {
    const ruleObj = AUDIO_ALERT_RULES[voiceSelectedRule];
    if (!ruleObj) return;
    const voiceBundle = ruleObj.languages[voiceSelectedLanguage];
    if (!voiceBundle) return;

    if (isSpeakingAgent) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeakingAgent(false);
      return;
    }

    setIsSpeakingAgent(true);
    setVoiceSpeechText(voiceBundle.subtitle);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(voiceBundle.speechText);
      utterance.rate = voiceRate;
      utterance.pitch = voicePitch;
      
      if (selectedSysVoiceURI) {
        const chosenVoice = availableVoices.find(v => v.voiceURI === selectedSysVoiceURI);
        if (chosenVoice) {
          utterance.voice = chosenVoice;
        }
      } else {
        const langMap: Record<string, string> = {
          English: "en",
          Hindi: "hi",
          Tamil: "ta",
          Telugu: "te",
          Kannada: "kn",
          Bengali: "bn",
          Marathi: "mr",
          Gujarati: "gu"
        };
        const targetLocale = langMap[voiceSelectedLanguage];
        const matchVoice = availableVoices.find(v => v.lang.toLowerCase().startsWith(targetLocale || ""));
        if (matchVoice) {
          utterance.voice = matchVoice;
        }
      }

      utterance.onend = () => {
        setIsSpeakingAgent(false);
      };

      utterance.onerror = () => {
        setIsSpeakingAgent(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        setIsSpeakingAgent(false);
      }, 4000);
    }
  };

  // 14 PAGE FILTER SPLIT RENDERING
  if (activeSubpage === "chatbot") {
    return (
      <div id="drive-legal-chatbot-only" className="w-full max-w-4xl mx-auto flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <MessageSquare className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span>DRIVELEGAL AI LAW GPT COUNSEL</span>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                Live Generative Co-agent
              </span>
            </h1>
            <p className="text-slate-400 text-xs">Analyze traffic ordinances, local by-laws, and central motor mandates seamlessly.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chat box */}
          <div className="lg:col-span-8">
            <div id="chatbox-board" className="bg-slate-900 rounded-2xl border border-slate-800 flex flex-col h-[540px]">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-slate-205">TRAFFIC POLICE REGULATION NODE</span>
                </div>
                <span className="text-xs font-mono text-slate-400">Ver. 2.19 Act Enforced</span>
              </div>

              {/* Messages Flow Area */}
              <div id="chat-scroller" className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m) => (
                  <div 
                    key={m.id} 
                    className={`flex flex-col ${m.sender === 'user' ? "items-end" : "items-start"}`}
                  >
                    <div className={`p-3 rounded-xl max-w-[85%] text-xs leading-relaxed ${
                      m.sender === 'user' 
                      ? "bg-amber-500 text-slate-950 font-medium rounded-tr-none" 
                      : "bg-slate-950 text-slate-300 rounded-tl-none border border-slate-800"
                    }`}>
                      {m.sender === 'user' ? m.text : renderFormattedText(m.text)}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 font-mono">
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                ))}
                {chatbotLoading && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 py-1 font-mono">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                    <span>AI searching penal codes and local gazettes...</span>
                  </div>
                )}
                <div ref={endMessagesRef} />
              </div>

              {/* Sugestion Quick buttons */}
              <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex flex-wrap gap-2">
                <span className="text-[10px] text-slate-500 self-center uppercase font-mono mr-1">ASK SUGGESTIONS:</span>
                {[
                  "What is Section 185 Drunk Driving fine?",
                  "Can I show digital licence in DigiLocker?",
                  "Is rear-seat belt mandatory under MV Act?"
                ].map((txt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(txt)}
                    className="text-[10px] text-amber-400 hover:text-slate-100 bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/20 px-2 py-1 rounded transition-colors cursor-pointer"
                  >
                    {txt}
                  </button>
                ))}
              </div>

              {/* Chat Form message submit footer */}
              <div className="p-3 border-t border-slate-800 bg-slate-950 rounded-b-2xl flex gap-2">
                <input
                  id="chatbot-text-input"
                  type="text"
                  placeholder="Ask about fine amounts, licence renewal steps, section 185..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-400 font-mono"
                />
                <button
                  id="chatbot-send-button"
                  onClick={() => handleSendMessage()}
                  disabled={chatbotLoading || !inputMessage.trim()}
                  className="p-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors disabled:opacity-50 font-bold flex items-center justify-center cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Legal Feeds Side Block */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div id="legal-news-feed" className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 id="legal-updates-heading" className="text-xs font-bold text-slate-100 flex items-center gap-1.5 uppercase font-mono tracking-widest">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>Sovereign Feeds</span>
                </h4>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono px-1.5 rounded border border-emerald-500/20">Official</span>
              </div>

              <div className="space-y-3.5">
                {LEGAL_NEWS.map((news) => (
                  <div key={news.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col gap-1.5 hover:border-slate-700 transition-all">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        news.category === 'Amendments' ? "bg-amber-500/10 text-amber-400" :
                        news.category === 'Fines' ? "bg-red-500/10 text-red-400" :
                        "bg-emerald-500/10 text-emerald-400"
                      }`}>
                        {news.category}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{news.date}</span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-205 line-clamp-1">{news.title}</h5>
                    <p className="text-[11px] text-slate-400 leading-normal line-clamp-2">{news.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeSubpage === "calculator") {
    return (
      <div id="drive-legal-calculator-only" className="w-full max-w-4xl mx-auto flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <Calculator className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 uppercase tracking-widest font-mono">National Challan Fine Calculator</h1>
            <p className="text-slate-400 text-xs">Verify fine sums, license suspensions, and seizure risks under standard Parivahan rules.</p>
          </div>
        </div>

        {/* State Selection Box */}
        <div id="geo-location-box" className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-medium">
              <Navigation className="w-5 h-5 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">Detected Regional Jurisdiction</span>
            </div>
            <h3 className="text-lg font-bold text-slate-200 mt-1">
              Active Area: {selectedState}
            </h3>
            <p className="text-xs text-slate-405 mt-1 max-w-2xl">
              Automatic synchronizations of speed restrictions, local hospital helplines, and environmental motor rules.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select 
              id="state-dropdown"
              value={selectedState} 
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-100 px-3.5 py-1.5 rounded-lg text-xs w-full md:w-auto font-mono"
            >
              <option value="Delhi NCR">Delhi NCR National Capital</option>
              <option value="Karnataka (Bengaluru)">Karnataka Local State</option>
              <option value="Maharashtra (Mumbai)">Maharashtra Local State</option>
            </select>
          </div>
        </div>

        {/* State Special Limits card */}
        <div id="state-limits-card" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">Speed Restrictions</span>
            <span className="text-xs font-bold text-amber-400 block mt-1">
              {STATE_SPECI_RULES[selectedState]?.speed || "70 km/h LMV limit"}
            </span>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">Local State Mandates</span>
            <span className="text-[11px] text-slate-200 block mt-1 leading-normal">
              {STATE_SPECI_RULES[selectedState]?.special || "Mandatory seatbelts active."}
            </span>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">Municipal Helpline</span>
            <span className="text-xs font-mono font-bold text-emerald-400 block mt-1">
              {STATE_SPECI_RULES[selectedState]?.localH || "1095"}
            </span>
          </div>
        </div>

        {/* Interactive Challan Calculator */}
        <div id="challan-fine-calculator" className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="vehicle-select" className="text-[10px] text-slate-400 font-mono block mb-2 uppercase">1. Vehicle Class Classification</label>
              <div className="grid grid-cols-3 gap-2">
                {(['twoWheeler', 'car', 'heavy'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => {
                      setSelectedVehicle(v);
                      setSelectedViolation("");
                    }}
                    className={`py-2 px-3 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer ${
                      selectedVehicle === v 
                      ? "bg-amber-500/10 border-amber-500 text-amber-400 shadow" 
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {v === 'twoWheeler' ? "2-WHEELER" : v === 'car' ? "LMV CAR" : "HEAVY TRUCK"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="violation-select" className="text-[10px] text-slate-400 font-mono block mb-2 uppercase text-left">2. Selected Traffic Offense Category</label>
              <select
                id="violation-select"
                value={selectedViolation}
                onChange={(e) => setSelectedViolation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2 text-xs font-mono focus:ring-1 focus:ring-amber-500"
              >
                <option value="">-- Select Offense --</option>
                {FINE_DATABASE[selectedVehicle].map((f, i) => (
                  <option key={i} value={f.violation}>{f.violation}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Calculator Output Display */}
          <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col justify-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Statutory Penalty Amount</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-white">₹{activeFine.fineAmount}</span>
                <span className="text-xs text-emerald-400 font-mono font-bold font-mono">under {activeFine.penaltySection}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Governed under India MV Regulatory Directives. Repeat infractions carry dynamic double penal actions.
              </p>
            </div>

            <div className="flex flex-col gap-3.5 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">RC / Licence Impact:</span>
                <span className="text-slate-200 font-bold text-right">{activeFine.licenseImpact}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Impounding Threat Risk:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  activeFine.seizureRisk === 'High' ? "bg-red-500/20 text-red-400 border border-red-500/20" :
                  activeFine.seizureRisk === 'Medium' ? "bg-amber-500/20 text-amber-400 border border-amber-500/20" :
                  "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                }`}>
                  {activeFine.seizureRisk} Danger
                </span>
              </div>
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded text-[10px] font-mono text-slate-400 leading-normal">
                ⚠️ Continuous speeds violations or driving while intoxicated carries mandatory immediate court summons and vehicle confiscation options.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeSubpage === "scanner") {
    return (
      <div id="drive-legal-scanner-only" className="w-full max-w-4xl mx-auto flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <FileText className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 uppercase tracking-widest font-mono">AI Traffic Notice / Challan Scanner</h1>
            <p className="text-slate-300 text-xs">Upload photocopies of road tickets to automatically extract fines, MV sections and penalty details.</p>
          </div>
        </div>

        {/* Instantly Working Presets Section */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 flex flex-col gap-3">
          <span className="text-[10px] text-amber-400 font-bold uppercase font-mono tracking-wider">🌟 INSTANT DEMO PRESETS (No File Required)</span>
          <p className="text-xs text-slate-400">Click a preset below to test the Gemini optical notice engine with high-fidelity realistic Indian traffic challans:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <button
              onClick={() => triggerPresetScan("speed")}
              className="py-2.5 px-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left hover:border-amber-500/40 transition-all flex flex-col justify-between cursor-pointer"
            >
              <span className="text-[10px] font-mono text-amber-400 font-bold">Speeding Notice Preset</span>
              <span className="text-xs font-semibold text-slate-205 mt-1">Car 104km/h on NH-44</span>
              <span className="text-[9px] text-slate-400 font-mono mt-1 font-mono">₹2,000 fine expected</span>
            </button>
            <button
              onClick={() => triggerPresetScan("parking")}
              className="py-2.5 px-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left hover:border-emerald-500/40 transition-all flex flex-col justify-between cursor-pointer"
            >
              <span className="text-[10px] font-mono text-emerald-400 font-bold">Obstruction Parking Preset</span>
              <span className="text-xs font-semibold text-slate-202 mt-1">Bengaluru Commercial Zone</span>
              <span className="text-[9px] text-slate-400 font-mono mt-1 font-mono">₹1,000 fine expected</span>
            </button>
            <button
              onClick={() => triggerPresetScan("puc")}
              className="py-2.5 px-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left hover:border-red-500/40 transition-all flex flex-col justify-between cursor-pointer"
            >
              <span className="text-[10px] font-mono text-red-400 font-bold">Carbon PUC Expired Preset</span>
              <span className="text-xs font-semibold text-slate-202 mt-1">Delhi NCR Strict Emission</span>
              <span className="text-[9px] text-slate-400 font-mono mt-1 font-mono">₹10,000 fine expected</span>
            </button>
          </div>
        </div>

        <div id="notice-scanner-container" className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
          <div className="flex justify-between items-center flex-wrap gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase font-mono">Or Upload Administrative Notice</h3>
              <p className="text-slate-405 text-xs">Accepted formats: JPG, PNG, PDF up to 10MB.</p>
            </div>

            <label htmlFor="notice-file-input" className="cursor-pointer bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-705 px-4 py-2 rounded-lg text-xs font-mono font-bold text-slate-200 flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>CHOOSE PHYSICAL FILE</span>
              <input 
                id="notice-file-input" 
                type="file" 
                accept="image/*" 
                onChange={handleDocumentScanSimulate} 
                className="hidden" 
              />
            </label>
          </div>

          <div className="mt-5">
            {isScanning ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 bg-slate-950 rounded-xl border border-slate-800">
                <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                <span className="text-xs text-slate-300 font-mono">Analyzing credentials with Gemini Optical Reasoning...</span>
              </div>
            ) : scannedResult ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 bg-slate-950 rounded-xl border border-emerald-500/20 grid grid-cols-1 md:grid-cols-3 gap-5"
              >
                <div className="col-span-2">
                  <span className="text-[10px] uppercase text-emerald-400 font-mono font-bold tracking-widest block">EXTRACTED OFFENSE DESCRIPTION</span>
                  <p className="text-sm font-bold text-slate-100 mt-1 leading-normal">{scannedResult.violation}</p>
                  <p className="text-[11px] text-slate-400 mt-1 font-mono">Applicable statutory citation: {scannedResult.section}</p>
                  
                  <div className="mt-4 p-3 bg-slate-900 rounded-lg text-xs text-slate-300 leading-relaxed border border-slate-800 font-sans">
                    <span className="font-bold text-emerald-400 block mb-1">Notice Appeal & Rules Guideline:</span>
                    {scannedResult.explanation}
                  </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-lg flex flex-col justify-between border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">PENALTY AMOUNT DUE</span>
                    <span className="text-2xl font-extrabold text-red-405 block mt-1">₹{scannedResult.fineAmount}</span>
                  </div>
                  <div className="my-3 border-t border-slate-800 pt-2">
                    <span className="text-[10px] text-slate-400 block font-mono">DUE DATE</span>
                    <span className="text-xs text-slate-200 mt-0.5 block font-mono font-bold">{scannedResult.dueDate}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-mono">RC LEVEL PENALTY RISK</span>
                    <span className="text-xs text-amber-400 font-bold block mt-1 leading-normal">{scannedResult.risk}</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="border border-dashed border-slate-800 rounded-xl p-8 text-center text-xs text-slate-500 font-mono">
                No summons document scanned. Choose an instant demo preset above or trigger file upload of an Indian traffic notice to run continuous OCR extraction.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (activeSubpage === "license") {
    return (
      <div id="drive-legal-license-only" className="w-full max-w-4xl mx-auto flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <UserCheck className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 uppercase tracking-widest font-mono">RTO Licence Pathfinder</h1>
            <p className="text-slate-300 text-xs">A comprehensive step-by-step parivahan guide on Learner & Permanent DL process steps.</p>
          </div>
        </div>

        <div id="license-guide-container" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {LICENCE_GUIDE.map((lic, index) => (
            <div key={index} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <span className="text-[10px] tracking-wider font-mono font-bold uppercase text-emerald-400 px-2.5 py-0.5 bg-emerald-500/10 rounded-full inline-block mb-3 border border-emerald-500/20">
                  {lic.stage}
                </span>
                <h4 className="text-base font-bold text-slate-100">{lic.title}</h4>
                
                <h5 className="text-xs font-semibold text-slate-400 mt-4 font-mono uppercase tracking-wider">Required Documentation:</h5>
                <ul className="text-xs text-slate-300 mt-1.5 space-y-2 list-disc pl-4 leading-normal">
                  {lic.documents.map((doc, idx) => (
                    <li key={idx}>{doc}</li>
                  ))}
                </ul>

                <h5 className="text-xs font-semibold text-slate-400 mt-4.5 font-mono uppercase tracking-wider"> RTO Track Procedure:</h5>
                <ol className="text-xs text-slate-303 mt-1.5 space-y-1.5 list-decimal pl-4 leading-normal font-mono">
                  {lic.steps.map((stp, idx) => (
                    <li key={idx}>{stp}</li>
                  ))}
                </ol>
              </div>

              <div className="pt-4 mt-5 border-t border-slate-800 flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Total Statutory Fee:</span>
                <span className="text-amber-400 font-bold">{lic.fee}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeSubpage === "voice") {
    const currentRuleObj = AUDIO_ALERT_RULES[voiceSelectedRule] || AUDIO_ALERT_RULES.speeding;
    const currentLangBundle = currentRuleObj.languages[voiceSelectedLanguage] || currentRuleObj.languages.English;

    return (
      <div id="drive-legal-voice-only" className="w-full max-w-4xl mx-auto flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <Volume2 className="w-6 h-6 text-amber-500 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 uppercase tracking-widest font-mono">Multilingual Voice Safety Counselor</h1>
            <p className="text-slate-300 text-xs">Simulate multilingual auditory alerts of Motor Ordinance rules translated locally.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          <div className="md:col-span-7 flex flex-col gap-5">
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">1. Select Motor Vehicle Ordinances:</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(AUDIO_ALERT_RULES).map(([key, value]) => {
                  const isSelected = voiceSelectedRule === key;
                  let statusBg = "border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-900";
                  if (isSelected) {
                    statusBg = "bg-amber-500/10 border-amber-500 text-amber-400 font-bold";
                  }
                  
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setVoiceSelectedRule(key);
                        if ('speechSynthesis' in window) {
                          window.speechSynthesis.cancel();
                        }
                        setIsSpeakingAgent(false);
                        setVoiceSpeechText("");
                      }}
                      className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${statusBg}`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs font-bold leading-tight line-clamp-1">{value.name}</span>
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-mono leading-none border border-current font-bold whitespace-nowrap">
                          {value.section.split(" & ")[0]}
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-400 mt-1 font-mono tracking-wide">
                        Check statutory citation penalties
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-amber-400" />
                <span>2. Choose Indian Target Language:</span>
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "English", display: "English (EN)" },
                  { id: "Hindi", display: "हिंदी (HI)" },
                  { id: "Tamil", display: "தமிழ் (TA)" },
                  { id: "Telugu", display: "తెలుగు (TE)" },
                  { id: "Kannada", display: "ಕನ್ನಡ (KN)" },
                  { id: "Bengali", display: "বাংলা (BN)" },
                  { id: "Marathi", display: "मराठी (MR)" },
                  { id: "Gujarati", display: "ગુજરાતી (GU)" }
                ].map((lang) => {
                  const isSelected = voiceSelectedLanguage === lang.id;
                  return (
                    <button
                      key={lang.id}
                      onClick={() => {
                        if ('speechSynthesis' in window) {
                          window.speechSynthesis.cancel();
                        }
                        setIsSpeakingAgent(false);
                        setVoiceSelectedLanguage(lang.id);
                        setVoiceSpeechText("");
                      }}
                      className={`py-2 px-2.5 rounded text-xs font-mono font-bold transition-all border text-center cursor-pointer ${
                        isSelected 
                        ? "bg-amber-500/15 border-amber-500 text-amber-400 font-black" 
                        : "bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {lang.display}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>3. Voice Engine Calibration:</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-2xs font-mono text-slate-400">
                    <span>Speed / Speech Rate:</span>
                    <span className="font-bold text-amber-400">{voiceRate.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={voiceRate}
                    onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 bg-slate-950 h-1 rounded cursor-pointer"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-2xs font-mono text-slate-400">
                    <span>Voice Pitch:</span>
                    <span className="font-bold text-amber-400">{voicePitch.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.1"
                    value={voicePitch}
                    onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 bg-slate-950 h-1 rounded cursor-pointer"
                  />
                </div>
              </div>

              {availableVoices.length > 0 && (
                <div className="flex flex-col gap-1.5 mt-1 border-t border-slate-800 pt-3">
                  <div className="flex justify-between items-center text-2xs font-mono text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      <span>Select Device Native Voice:</span>
                    </span>
                    <span className="text-slate-500 text-[9px] uppercase font-bold tracking-wider">Browser synthesized</span>
                  </div>
                  <select
                    value={selectedSysVoiceURI}
                    onChange={(e) => setSelectedSysVoiceURI(e.target.value)}
                    className="w-full py-1.5 px-2 bg-slate-950 border border-slate-800 rounded text-[10px] font-mono text-slate-300 outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="">-- Auto Match Indian Voice Locale --</option>
                    {availableVoices.map((voice) => (
                      <option key={voice.voiceURI} value={voice.voiceURI}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

          </div>

          <div className="md:col-span-5 flex flex-col gap-5">
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 text-center">
              
              <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-left">
                <span className="text-slate-400 text-3xs font-mono tracking-widest uppercase font-bold">AUDIO HAZARD MONITOR</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[8px] font-mono font-bold uppercase tracking-wider animate-pulse">
                  SYSTEM READY
                </span>
              </div>

              <div className="my-3 py-6 bg-slate-950 border border-slate-850 rounded-xl relative overflow-hidden flex flex-col items-center gap-2">
                
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.02)_0%,transparent_70%)] pointer-events-none" />

                <button
                  id="voice-sim-button"
                  onClick={handleLaunchVoiceSpeakingSimulation}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer select-none outline-none ${
                    isSpeakingAgent
                    ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/50 ring-8 ring-red-500/10 animate-pulse"
                    : "bg-amber-500 hover:bg-amber-400 text-slate-950 border-transparent shadow-lg"
                  }`}
                >
                  {isSpeakingAgent ? (
                    <Square className="w-7 h-7" />
                  ) : (
                    <Play className="w-8 h-8 ml-1" />
                  )}
                </button>

                <span className="text-2xs font-mono text-slate-300 mt-2 block uppercase tracking-wider font-bold">
                  {isSpeakingAgent ? "⏹ STOP BROADCAST" : "🔊 SYNTHESIZE SPEECH"}
                </span>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5 leading-none font-bold">
                  Rule Code: {currentRuleObj.section}
                </span>

                {isSpeakingAgent ? (
                  <div className="flex items-end gap-1 h-6 mt-3">
                    <div className="w-1 bg-amber-500 h-3 animate-[pulse_0.4s_infinite]" />
                    <div className="w-1 bg-amber-400 h-5 animate-[pulse_0.6s_infinite]" />
                    <div className="w-1 bg-amber-500 h-2 animate-[pulse_0.5s_infinite]" />
                    <div className="w-1 bg-amber-300 h-6 animate-[pulse_0.3s_infinite]" />
                    <div className="w-1 bg-amber-400 h-4 animate-[pulse_0.7s_infinite]" />
                  </div>
                ) : (
                  <div className="flex items-end gap-1 h-6 mt-3 opacity-20">
                    <div className="w-1 bg-slate-600 h-1" />
                    <div className="w-1 bg-slate-600 h-1" />
                    <div className="w-1 bg-slate-600 h-1" />
                    <div className="w-1 bg-slate-600 h-1" />
                    <div className="w-1 bg-slate-600 h-1" />
                  </div>
                )}
              </div>

              <AnimatePresence>
                {voiceSpeechText && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-left"
                  >
                    <div className="flex items-center gap-1.5 text-[9px] text-[#22c55e] font-mono mb-2 uppercase font-black tracking-wider border-b border-slate-850 pb-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e] block animate-ping" />
                      <span>{voiceSelectedLanguage} subtitles (Active Speak):</span>
                    </div>
                    <p className="text-xs text-slate-200 italic leading-normal font-sans tracking-wide">
                      "{voiceSpeechText}"
                    </p>

                    <p className="text-[10px] text-slate-405 mt-3 pt-2 border-t border-slate-850 font-sans font-bold leading-normal text-slate-400">
                      English version: "{currentRuleObj.languages.English.subtitle}"
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#22c55e] font-bold">
                ✓ Static Rule Parameters ({currentRuleObj.section}):
              </span>

              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex justify-between border-b border-slate-950 pb-1.5">
                  <span className="text-slate-500">Selected Law:</span>
                  <span className="text-slate-200 font-bold">{currentRuleObj.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-950 pb-1.5">
                  <span className="text-slate-500">Statutory Fine:</span>
                  <span className="text-red-400 font-bold">
                    {voiceSelectedRule === "speeding" ? "₹1,000 to ₹2,000" :
                     voiceSelectedRule === "drinking" ? "₹10,000 to ₹15,000" :
                     voiceSelectedRule === "helmet" ? "₹1,000" :
                     voiceSelectedRule === "seatbelt" ? "₹1,000" :
                     voiceSelectedRule === "nolicense" ? "₹5,000" : "₹10,000"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-950 pb-1.5 flex-wrap gap-1">
                  <span className="text-slate-500">Licence Impact:</span>
                  <span className="text-amber-400 font-bold text-right text-xs">
                    {voiceSelectedRule === "speeding" ? "Disqualification on subsequent offence" :
                     voiceSelectedRule === "drinking" ? "Immediate court suspension for 6 months" :
                     voiceSelectedRule === "helmet" ? "3 months suspension of DL" :
                     voiceSelectedRule === "seatbelt" ? "Minor alert, no DL cancellation" :
                     voiceSelectedRule === "nolicense" ? "Imprisonment up to 3 months trial" : "3 months suspension of DL"}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    );
  }

  // Fallback default full render of normal DriveLegal
  return (
    <div id="drive-legal-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Fallback layout */}
    </div>
  );
}
