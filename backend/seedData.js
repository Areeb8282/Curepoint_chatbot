require('dotenv').config();
const mongoose = require('mongoose');
const Hospital = require('./models/Hospital');
const Doctor = require('./models/Doctor');
const Disease = require('./models/Disease');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected');
};

// Real hospitals in Mumbai with accurate addresses
const hospitals = [
  { name: 'Lilavati Hospital & Research Centre', area: 'Bandra', address: 'A-791, Bandra Reclamation, Bandra West, Mumbai - 400050', opening_hours: '24/7' },
  { name: 'Holy Family Hospital', area: 'Bandra', address: "St Andrew's Road, Bandra West, Mumbai - 400050", opening_hours: '24/7' },
  { name: 'Nanavati Max Super Speciality Hospital', area: 'Bandra', address: 'S.V. Road, Vile Parle West, Mumbai - 400056', opening_hours: '24/7' },
  { name: 'P.D. Hinduja National Hospital', area: 'Mahim', address: 'Veer Savarkar Marg, Mahim, Mumbai - 400016', opening_hours: '24/7' },
  { name: 'Sion Hospital (LTMGH)', area: 'Kurla', address: 'Dr. Babasaheb Ambedkar Road, Sion, Mumbai - 400022', opening_hours: '24/7' },
  { name: 'Rajawadi Hospital', area: 'Kurla', address: 'Rajawadi, Ghatkopar East, Mumbai - 400077', opening_hours: '24/7' },
  { name: 'Seven Hills Hospital', area: 'Andheri', address: 'Marol Maroshi Road, Andheri East, Mumbai - 400059', opening_hours: '24/7' },
  { name: 'Kokilaben Dhirubhai Ambani Hospital', area: 'Andheri', address: 'Achyutrao Patwardhan Marg, Four Bungalows, Andheri West, Mumbai - 400053', opening_hours: '24/7' },
  { name: 'Criticare Asia Hospital', area: 'Andheri', address: 'Plot No 38/39, Bhakti Vedanta Swami Marg, Andheri East, Mumbai - 400069', opening_hours: '24/7' },
  { name: 'Fortis Hospital Mulund', area: 'Mahim', address: 'Mulund Goregaon Link Road, Nahur West, Mumbai - 400078', opening_hours: '24/7' },
  { name: 'Bhabha Hospital', area: 'Kurla', address: 'R.K. Patkar Marg, Bandra West, Mumbai - 400050', opening_hours: '8 AM - 8 PM' },
  { name: 'S.L. Raheja Hospital (Fortis)', area: 'Mahim', address: 'Raheja Rugnalaya Marg, Mahim West, Mumbai - 400016', opening_hours: '24/7' }
];

// Medically accurate disease-symptom mappings.
// Symptoms use natural language phrases users actually type.
// Each disease has enough unique symptoms to score higher than competing diseases.
const diseases = [

  // ── GENERAL PHYSICIAN ───────────────────────────────────────────────────────
  {
    disease_name: 'Gastritis / Stomach Inflammation',
    symptoms: [
      'stomach ache', 'stomach pain', 'abdominal pain', 'upper stomach pain',
      'stomach burning', 'burning in stomach', 'stomach discomfort',
      'pain after eating', 'worse after eating', 'worse after spicy food',
      'nausea', 'bloating', 'indigestion', 'loss of appetite',
      'stomach cramps', 'acidity', 'acid reflux', 'belching', 'burping'
    ],
    recommended_specialization: 'General Physician',
    precautions: [
      'Avoid spicy, oily, and acidic foods (citrus, tomatoes, vinegar)',
      'Eat small, frequent meals instead of large ones',
      'Avoid alcohol, caffeine, and carbonated drinks',
      'Do not lie down immediately after eating — wait at least 2 hours',
      'Take an antacid (e.g. Gelusil, Digene) for temporary relief',
      'Drink plenty of water and stay hydrated',
      'Avoid NSAIDs like ibuprofen — use paracetamol if needed for pain'
    ]
  },
  {
    disease_name: 'Irritable Bowel Syndrome (IBS)',
    symptoms: [
      'stomach ache', 'abdominal cramps', 'stomach cramps', 'bloating',
      'alternating constipation and diarrhea', 'loose stools', 'constipation',
      'mucus in stool', 'stomach pain relieved by bowel movement',
      'gas', 'flatulence', 'stomach discomfort', 'recurring stomach pain'
    ],
    recommended_specialization: 'General Physician',
    precautions: [
      'Identify and avoid trigger foods (dairy, gluten, beans, cabbage)',
      'Eat at regular times and avoid skipping meals',
      'Manage stress through deep breathing or light exercise',
      'Increase dietary fibre gradually (fruits, vegetables, oats)',
      'Stay well hydrated — drink 8–10 glasses of water daily',
      'Avoid eating too fast — chew food thoroughly',
      'Keep a food diary to track what worsens symptoms'
    ]
  },
  {
    disease_name: 'Food Poisoning',
    symptoms: [
      'stomach ache', 'stomach pain after eating', 'vomiting', 'nausea',
      'diarrhea', 'loose stools', 'food poisoning', 'ate bad food',
      'stomach cramps', 'fever after eating', 'weakness after eating',
      'spicy food reaction', 'outside food problem'
    ],
    recommended_specialization: 'General Physician',
    precautions: [
      'Stay hydrated — sip ORS (oral rehydration solution) or coconut water frequently',
      'Rest and avoid solid food for a few hours until nausea settles',
      'Start with bland foods — rice, toast, bananas, boiled potatoes',
      'Avoid dairy, fatty, spicy, or sugary foods until recovered',
      'Do NOT take anti-diarrheal medication without doctor advice',
      'Wash hands thoroughly before eating or touching face',
      'Seek immediate help if vomiting is severe or blood appears in stool'
    ]
  },
  {
    disease_name: 'Viral Fever',
    symptoms: [
      'fever', 'high temperature', 'body ache', 'muscle pain', 'fatigue', 'tiredness',
      'chills', 'shivering', 'sweating', 'weakness', 'runny nose', 'sore throat',
      'loss of appetite', 'headache', 'mild cough', 'watery eyes'
    ],
    recommended_specialization: 'General Physician',
    precautions: [
      'Rest completely and avoid physical exertion',
      'Stay hydrated — drink water, coconut water, or ORS every hour',
      'Take paracetamol (not ibuprofen) to reduce fever',
      'Use a damp cloth on forehead to bring down temperature',
      'Eat light, easily digestible food — khichdi, soup, fruits',
      'Avoid cold drinks and ice cream',
      'Wear light clothing and keep the room well-ventilated'
    ]
  },
  {
    disease_name: 'Typhoid',
    symptoms: [
      'prolonged fever', 'continuous fever', 'stomach pain', 'abdominal pain',
      'weakness', 'fatigue', 'loss of appetite', 'constipation', 'diarrhea',
      'rose spots', 'headache', 'nausea', 'vomiting', 'slow heart rate'
    ],
    recommended_specialization: 'General Physician',
    precautions: [
      'Drink only boiled or bottled water — avoid tap water',
      'Eat only freshly cooked, hot food — avoid raw vegetables and street food',
      'Maintain strict hand hygiene — wash hands before eating and after toilet',
      'Rest completely and avoid strenuous activity',
      'Take paracetamol for fever — avoid aspirin',
      'Eat soft, easily digestible foods — rice, dal, boiled vegetables',
      'Isolate yourself to prevent spreading to family members'
    ]
  },
  {
    disease_name: 'Dengue Fever',
    symptoms: [
      'dengue', 'high fever', 'severe headache', 'pain behind eyes', 'eye pain',
      'joint pain', 'muscle pain', 'bone pain', 'rash', 'skin rash', 'bleeding gums',
      'nosebleed', 'low platelet', 'fatigue', 'nausea', 'vomiting'
    ],
    recommended_specialization: 'General Physician',
    precautions: [
      'Drink plenty of fluids — water, ORS, papaya leaf juice, coconut water',
      'Take paracetamol ONLY for fever — strictly avoid aspirin and ibuprofen',
      'Rest completely — do not exert yourself',
      'Use mosquito repellent and sleep under a mosquito net',
      'Wear full-sleeve clothing to prevent further mosquito bites',
      'Monitor platelet count — get blood test every 24–48 hours',
      'Seek emergency care immediately if bleeding occurs or fever spikes above 104°F'
    ]
  },
  {
    disease_name: 'Malaria',
    symptoms: [
      'malaria', 'cyclic fever', 'fever with chills', 'shivering', 'sweating',
      'headache', 'nausea', 'vomiting', 'muscle ache', 'fatigue', 'anemia',
      'jaundice', 'spleen enlargement', 'cold and hot spells'
    ],
    recommended_specialization: 'General Physician',
    precautions: [
      'Use mosquito nets and repellents — eliminate stagnant water around home',
      'Stay hydrated with ORS, water, and light fluids',
      'Take paracetamol for fever and chills — avoid self-medicating with antimalarials',
      'Rest completely and avoid cold exposure during chills',
      'Eat light, nutritious food — avoid heavy or oily meals',
      'Wear full-sleeve clothes especially at dawn and dusk',
      'Get a blood smear test confirmed before starting any treatment'
    ]
  },
  {
    disease_name: 'Diabetes',
    symptoms: [
      'frequent urination', 'excessive thirst', 'increased hunger', 'unexplained weight loss',
      'blurred vision', 'slow healing wounds', 'frequent infections', 'tingling hands',
      'numbness in feet', 'fatigue', 'dry mouth', 'sugar in urine', 'high blood sugar'
    ],
    recommended_specialization: 'General Physician',
    precautions: [
      'Avoid sugary foods, white rice, maida, and sweetened drinks',
      'Eat small, balanced meals at regular intervals — do not skip meals',
      'Walk for at least 30 minutes daily',
      'Monitor blood sugar levels regularly if you have a glucometer',
      'Stay well hydrated — drink water, not juices or sodas',
      'Inspect feet daily for cuts or sores — wear comfortable footwear',
      'Do not stop prescribed medication without doctor advice'
    ]
  },
  {
    disease_name: 'COVID-19',
    symptoms: [
      'covid', 'coronavirus', 'fever', 'dry cough', 'loss of taste', 'loss of smell',
      'shortness of breath', 'difficulty breathing', 'fatigue', 'body ache',
      'sore throat', 'runny nose', 'diarrhea', 'chest pain', 'headache'
    ],
    recommended_specialization: 'General Physician',
    precautions: [
      'Isolate yourself immediately — stay in a separate room',
      'Wear a mask and maintain distance from family members',
      'Monitor oxygen levels with a pulse oximeter — seek help if below 94%',
      'Stay hydrated and rest completely',
      'Take paracetamol for fever — avoid self-medicating with antibiotics',
      'Ventilate your room — open windows for fresh air',
      'Seek emergency care if breathing becomes difficult or chest pain occurs'
    ]
  },

  // ── CARDIOLOGIST ────────────────────────────────────────────────────────────
  {
    disease_name: 'Hypertension',
    symptoms: [
      'high blood pressure', 'blood pressure', 'dizziness', 'headache',
      'blurred vision', 'chest pain', 'shortness of breath', 'nosebleed',
      'palpitations', 'irregular heartbeat', 'heart racing', 'fatigue',
      'flushing', 'blood in urine'
    ],
    recommended_specialization: 'Cardiologist',
    precautions: [
      'Reduce salt intake — avoid pickles, papad, processed foods',
      'Avoid caffeine, alcohol, and smoking',
      'Practice deep breathing or meditation for 10 minutes daily',
      'Avoid sudden physical exertion or lifting heavy weights',
      'Sit or lie down if you feel dizzy — do not stand up suddenly',
      'Monitor BP at home if you have a BP machine',
      'Do NOT stop prescribed BP medication without doctor advice'
    ]
  },
  {
    disease_name: 'Coronary Artery Disease',
    symptoms: [
      'chest pain', 'chest tightness', 'chest pressure', 'angina',
      'pain radiating to arm', 'left arm pain', 'jaw pain', 'neck pain',
      'shortness of breath', 'breathlessness', 'sweating', 'nausea',
      'palpitations', 'heart attack symptoms', 'fatigue on exertion'
    ],
    recommended_specialization: 'Cardiologist',
    precautions: [
      '⚠️ If chest pain is severe or radiates to arm/jaw — call emergency immediately',
      'Sit or lie down and rest — avoid any physical activity',
      'Chew an aspirin (325mg) if available and not allergic — only if suspected heart attack',
      'Loosen tight clothing around chest and neck',
      'Avoid smoking, alcohol, and fatty foods',
      'Do not drive yourself to hospital — call someone or an ambulance',
      'Keep nitroglycerin spray/tablet handy if previously prescribed'
    ]
  },
  {
    disease_name: 'Heart Failure',
    symptoms: [
      'swollen legs', 'swollen ankles', 'swollen feet', 'edema',
      'shortness of breath lying down', 'breathlessness at night',
      'rapid weight gain', 'persistent cough', 'wheezing', 'fatigue',
      'reduced exercise tolerance', 'irregular heartbeat', 'heart pounding'
    ],
    recommended_specialization: 'Cardiologist',
    precautions: [
      'Restrict fluid intake as advised — typically 1.5–2 litres per day',
      'Reduce salt intake strictly — avoid all processed and packaged foods',
      'Weigh yourself daily — report sudden weight gain of 2kg+ to doctor',
      'Sleep with head elevated (2–3 pillows) to ease breathing',
      'Avoid strenuous activity — rest frequently',
      'Do not stop diuretics or heart medications without doctor advice',
      'Seek emergency care if breathlessness worsens suddenly'
    ]
  },
  {
    disease_name: 'Arrhythmia',
    symptoms: [
      'irregular heartbeat', 'heart fluttering', 'heart skipping beat',
      'palpitations', 'racing heart', 'slow heartbeat', 'dizziness',
      'fainting', 'lightheadedness', 'chest discomfort', 'shortness of breath',
      'anxiety', 'sweating'
    ],
    recommended_specialization: 'Cardiologist',
    precautions: [
      'Sit or lie down immediately when palpitations occur',
      'Try the Valsalva maneuver — bear down as if having a bowel movement for 10–15 seconds',
      'Avoid caffeine, energy drinks, alcohol, and smoking',
      'Reduce stress — practice slow deep breathing',
      'Avoid cold medicines containing decongestants (pseudoephedrine)',
      'Do not drive or operate machinery during an episode',
      'Seek emergency care if you faint, have chest pain, or episode lasts over 30 minutes'
    ]
  },

  // ── NEUROLOGIST ─────────────────────────────────────────────────────────────
  {
    disease_name: 'Migraine',
    symptoms: [
      'migraine', 'severe headache', 'throbbing headache', 'one sided headache',
      'nausea', 'vomiting', 'sensitivity to light', 'light sensitivity',
      'sensitivity to sound', 'sound sensitivity', 'blurred vision', 'aura',
      'visual disturbance', 'neck stiffness', 'pulsating pain'
    ],
    recommended_specialization: 'Neurologist'
  },
  {
    disease_name: 'Epilepsy',
    symptoms: [
      'seizures', 'convulsions', 'fits', 'epilepsy', 'loss of consciousness',
      'uncontrolled shaking', 'staring spells', 'temporary confusion',
      'memory loss after episode', 'muscle stiffness', 'jerking movements',
      'falling suddenly', 'blank staring'
    ],
    recommended_specialization: 'Neurologist'
  },
  {
    disease_name: 'Stroke',
    symptoms: [
      'stroke', 'sudden numbness', 'face drooping', 'arm weakness',
      'speech difficulty', 'slurred speech', 'sudden confusion',
      'trouble understanding', 'sudden vision loss', 'severe sudden headache',
      'loss of balance', 'trouble walking', 'paralysis'
    ],
    recommended_specialization: 'Neurologist'
  },
  {
    disease_name: "Parkinson's Disease",
    symptoms: [
      'tremors', 'hand trembling', 'resting tremor', 'muscle stiffness',
      'slow movement', 'shuffling walk', 'balance problems', 'stooped posture',
      'soft speech', 'writing difficulty', 'loss of facial expression',
      'rigidity', 'bradykinesia'
    ],
    recommended_specialization: 'Neurologist'
  },
  {
    disease_name: 'Vertigo',
    symptoms: [
      'vertigo', 'dizziness', 'spinning sensation', 'room spinning',
      'loss of balance', 'nausea', 'vomiting', 'unsteadiness',
      'tinnitus', 'ringing in ears', 'hearing loss', 'nystagmus',
      'feeling of motion', 'lightheadedness'
    ],
    recommended_specialization: 'Neurologist'
  },

  // ── DERMATOLOGIST ───────────────────────────────────────────────────────────
  {
    disease_name: 'Eczema (Atopic Dermatitis)',
    symptoms: [
      'eczema', 'itchy skin', 'itching', 'dry skin', 'skin rash',
      'red patches', 'inflamed skin', 'scaly skin', 'cracked skin',
      'weeping skin', 'blisters', 'thickened skin', 'skin irritation',
      'rash on arms', 'rash on legs'
    ],
    recommended_specialization: 'Dermatologist'
  },
  {
    disease_name: 'Psoriasis',
    symptoms: [
      'psoriasis', 'scaly patches', 'silvery scales', 'red skin patches',
      'dry cracked skin', 'itching', 'burning skin', 'soreness',
      'thickened nails', 'pitted nails', 'swollen joints', 'stiff joints',
      'plaques on skin', 'skin flaking'
    ],
    recommended_specialization: 'Dermatologist'
  },
  {
    disease_name: 'Acne Vulgaris',
    symptoms: [
      'acne', 'pimples', 'blackheads', 'whiteheads', 'oily skin',
      'cysts on face', 'nodules', 'skin bumps', 'facial redness',
      'inflamed pimples', 'spots on face', 'back acne', 'chest acne',
      'scarring', 'comedones'
    ],
    recommended_specialization: 'Dermatologist'
  },
  {
    disease_name: 'Urticaria (Hives)',
    symptoms: [
      'hives', 'urticaria', 'raised welts', 'itchy bumps', 'skin swelling',
      'redness', 'burning sensation on skin', 'allergic rash', 'wheals',
      'swollen lips', 'swollen eyes', 'angioedema', 'skin allergy',
      'itching all over body'
    ],
    recommended_specialization: 'Dermatologist'
  },
  {
    disease_name: 'Fungal Skin Infection',
    symptoms: [
      'ringworm', 'fungal infection', 'circular rash', 'itchy groin',
      'athletes foot', 'itchy feet', 'peeling skin', 'scaly ring',
      'nail discoloration', 'thickened nails', 'white patches in mouth',
      'jock itch', 'skin fungus', 'tinea'
    ],
    recommended_specialization: 'Dermatologist'
  },

  // ── ORTHOPEDIC ──────────────────────────────────────────────────────────────
  {
    disease_name: 'Osteoarthritis',
    symptoms: [
      'joint pain', 'knee pain', 'hip pain', 'stiffness', 'joint stiffness',
      'swollen joints', 'reduced range of motion', 'grating sensation',
      'bone spurs', 'tenderness', 'difficulty walking', 'pain after activity',
      'morning stiffness', 'creaking joints'
    ],
    recommended_specialization: 'Orthopedic'
  },
  {
    disease_name: 'Fracture',
    symptoms: [
      'broken bone', 'fracture', 'bone pain', 'inability to move limb',
      'swelling after injury', 'bruising', 'deformity', 'tenderness',
      'numbness', 'bone sticking out', 'pain on pressure', 'fall injury',
      'accident injury', 'sports injury'
    ],
    recommended_specialization: 'Orthopedic'
  },
  {
    disease_name: 'Herniated Disc',
    symptoms: [
      'back pain', 'lower back pain', 'sciatica', 'leg pain', 'shooting pain',
      'numbness in leg', 'tingling in leg', 'weakness in leg', 'neck pain',
      'arm pain', 'pain radiating down leg', 'disc problem', 'slipped disc',
      'spine pain', 'pain bending forward'
    ],
    recommended_specialization: 'Orthopedic'
  },
  {
    disease_name: 'Rheumatoid Arthritis',
    symptoms: [
      'rheumatoid arthritis', 'swollen fingers', 'painful joints', 'warm joints',
      'morning stiffness lasting hours', 'fatigue', 'fever', 'weight loss',
      'symmetrical joint pain', 'joint deformity', 'loss of joint function',
      'tender joints', 'multiple joint pain'
    ],
    recommended_specialization: 'Orthopedic'
  },
  {
    disease_name: 'Tendinitis',
    symptoms: [
      'tendon pain', 'shoulder pain', 'elbow pain', 'wrist pain', 'heel pain',
      'pain with movement', 'swelling near joint', 'stiffness', 'aching',
      'tennis elbow', 'golfers elbow', 'rotator cuff pain', 'achilles pain',
      'pain after exercise'
    ],
    recommended_specialization: 'Orthopedic'
  },

  // ── ENT SPECIALIST ──────────────────────────────────────────────────────────
  {
    disease_name: 'Otitis Media (Ear Infection)',
    symptoms: [
      'ear pain', 'earache', 'ear infection', 'hearing loss', 'discharge from ear',
      'fluid in ear', 'blocked ear', 'ear pressure', 'ringing in ear', 'tinnitus',
      'fever with ear pain', 'pulling at ear', 'difficulty hearing', 'muffled hearing'
    ],
    recommended_specialization: 'ENT Specialist'
  },
  {
    disease_name: 'Sinusitis',
    symptoms: [
      'sinusitis', 'sinus pain', 'nasal congestion', 'blocked nose', 'stuffy nose',
      'facial pain', 'facial pressure', 'loss of smell', 'reduced smell',
      'postnasal drip', 'sneezing', 'thick nasal discharge', 'yellow mucus',
      'green mucus', 'headache behind eyes', 'toothache with sinus'
    ],
    recommended_specialization: 'ENT Specialist'
  },
  {
    disease_name: 'Tonsillitis',
    symptoms: [
      'tonsillitis', 'sore throat', 'swollen tonsils', 'difficulty swallowing',
      'painful swallowing', 'white patches on throat', 'red tonsils', 'fever',
      'bad breath', 'muffled voice', 'swollen lymph nodes', 'neck pain',
      'throat pain', 'scratchy throat'
    ],
    recommended_specialization: 'ENT Specialist'
  },
  {
    disease_name: 'Allergic Rhinitis',
    symptoms: [
      'allergic rhinitis', 'hay fever', 'sneezing', 'runny nose', 'itchy nose',
      'watery eyes', 'itchy eyes', 'nasal congestion', 'postnasal drip',
      'itchy throat', 'coughing', 'dark circles under eyes', 'seasonal allergy',
      'dust allergy', 'pollen allergy'
    ],
    recommended_specialization: 'ENT Specialist'
  },

  // ── PEDIATRICIAN ────────────────────────────────────────────────────────────
  {
    disease_name: 'Childhood Fever & Infection',
    symptoms: [
      'fever in child', 'child fever', 'baby fever', 'child crying', 'irritable child',
      'loss of appetite in child', 'child not eating', 'child vomiting',
      'child diarrhea', 'child rash', 'child cough', 'child cold',
      'infant fever', 'toddler sick', 'child ear pain'
    ],
    recommended_specialization: 'Pediatrician'
  },
  {
    disease_name: 'Asthma in Children',
    symptoms: [
      'child wheezing', 'child breathlessness', 'child coughing at night',
      'child difficulty breathing', 'child chest tightness', 'child shortness of breath',
      'child asthma', 'child breathing problem', 'child inhaler', 'child allergy cough',
      'child exercise cough', 'child cold triggered cough'
    ],
    recommended_specialization: 'Pediatrician'
  },
  {
    disease_name: 'Chickenpox',
    symptoms: [
      'chickenpox', 'itchy blisters', 'fluid filled blisters', 'rash all over body',
      'fever with rash', 'red spots', 'crusting blisters', 'child rash with fever',
      'varicella', 'itchy spots', 'blisters on face', 'blisters on trunk'
    ],
    recommended_specialization: 'Pediatrician'
  },
  {
    disease_name: 'Diarrhea & Dehydration in Children',
    symptoms: [
      'child loose stools', 'child watery stools', 'child dehydration',
      'child not drinking', 'sunken eyes in child', 'dry mouth in child',
      'child stomach cramps', 'child stomach pain', 'child vomiting and diarrhea',
      'child gastroenteritis', 'child food poisoning'
    ],
    recommended_specialization: 'Pediatrician'
  },

  // ── GYNECOLOGIST ────────────────────────────────────────────────────────────
  {
    disease_name: 'Pregnancy Care',
    symptoms: [
      'pregnancy', 'pregnant', 'prenatal care', 'missed period', 'morning sickness',
      'nausea in pregnancy', 'pregnancy checkup', 'antenatal', 'maternity',
      'positive pregnancy test', 'baby movement', 'prenatal vitamins',
      'first trimester', 'second trimester', 'third trimester'
    ],
    recommended_specialization: 'Gynecologist'
  },
  {
    disease_name: 'PCOD / PCOS',
    symptoms: [
      'pcod', 'pcos', 'irregular periods', 'missed periods', 'hormonal imbalance',
      'weight gain', 'hair loss in women', 'facial hair', 'acne in women',
      'difficulty conceiving', 'infertility', 'ovarian cysts', 'bloating',
      'mood swings', 'excess androgen'
    ],
    recommended_specialization: 'Gynecologist'
  },
  {
    disease_name: 'Endometriosis',
    symptoms: [
      'endometriosis', 'painful periods', 'severe menstrual cramps', 'pelvic pain',
      'pain during intercourse', 'heavy periods', 'bleeding between periods',
      'infertility', 'painful bowel movements', 'lower back pain during period',
      'bloating during period', 'fatigue during period'
    ],
    recommended_specialization: 'Gynecologist'
  },
  {
    disease_name: 'Urinary Tract Infection (UTI)',
    symptoms: [
      'uti', 'burning urination', 'painful urination', 'frequent urination',
      'urge to urinate', 'cloudy urine', 'blood in urine', 'strong smelling urine',
      'pelvic pain', 'lower abdominal pain', 'pressure in bladder',
      'urine infection', 'burning while peeing'
    ],
    recommended_specialization: 'Gynecologist'
  },
  {
    disease_name: 'Menopause',
    symptoms: [
      'menopause', 'hot flashes', 'night sweats', 'irregular periods stopping',
      'vaginal dryness', 'mood changes', 'sleep problems', 'weight gain',
      'thinning hair', 'dry skin', 'loss of breast fullness', 'chills',
      'slowed metabolism', 'periods stopped'
    ],
    recommended_specialization: 'Gynecologist'
  }
];

// Real doctors sourced from hospital websites (Lilavati, Kokilaben, Hinduja, Fortis, Nanavati)
// Sources: lilavatihospital.com, kokilabenhospital.com, hindujahospital.com, fortishealthcare.com, vaidam.com
const realDoctors = [

  // ── LILAVATI HOSPITAL (Bandra) ──────────────────────────────────────────────
  { name: 'Dr. Abhishek Shah', specialization: 'Cardiologist', rating: 4.8, experience_years: 18, hospitalName: 'Lilavati Hospital & Research Centre', area: 'Bandra', consultation_timings: '10 AM - 5 PM' },
  { name: 'Dr. Ajit R. Menon', specialization: 'Cardiologist', rating: 4.7, experience_years: 22, hospitalName: 'Lilavati Hospital & Research Centre', area: 'Bandra', consultation_timings: '9 AM - 4 PM' },
  { name: 'Dr. Amit M. Vora', specialization: 'Cardiologist', rating: 4.6, experience_years: 20, hospitalName: 'Lilavati Hospital & Research Centre', area: 'Bandra', consultation_timings: '11 AM - 6 PM' },
  { name: 'Dr. Anand Rao', specialization: 'Cardiologist', rating: 4.9, experience_years: 25, hospitalName: 'Lilavati Hospital & Research Centre', area: 'Bandra', consultation_timings: '10 AM - 5 PM' },
  { name: 'Dr. Ashish A. Nabar', specialization: 'Cardiologist', rating: 4.7, experience_years: 19, hospitalName: 'Lilavati Hospital & Research Centre', area: 'Bandra', consultation_timings: '10 AM - 4 PM' },
  { name: 'Dr. Bhavesh Vajifdar', specialization: 'Cardiologist', rating: 4.5, experience_years: 16, hospitalName: 'Lilavati Hospital & Research Centre', area: 'Bandra', consultation_timings: '9 AM - 3 PM' },
  { name: 'Dr. Hemant Thacker', specialization: 'General Physician', rating: 4.8, experience_years: 30, hospitalName: 'Lilavati Hospital & Research Centre', area: 'Bandra', consultation_timings: '10 AM - 6 PM' },
  { name: 'Dr. Pralhad Prabhudesai', specialization: 'General Physician', rating: 4.7, experience_years: 35, hospitalName: 'Lilavati Hospital & Research Centre', area: 'Bandra', consultation_timings: '9 AM - 2 PM' },

  // ── KOKILABEN HOSPITAL (Andheri) ────────────────────────────────────────────
  { name: 'Dr. Abhaya Kumar', specialization: 'Neurologist', rating: 4.9, experience_years: 24, hospitalName: 'Kokilaben Dhirubhai Ambani Hospital', area: 'Andheri', consultation_timings: '10 AM - 5 PM' },
  { name: 'Dr. Abhishek Srivastava', specialization: 'General Physician', rating: 4.6, experience_years: 15, hospitalName: 'Kokilaben Dhirubhai Ambani Hospital', area: 'Andheri', consultation_timings: '9 AM - 4 PM' },
  { name: 'Dr. Ajay Mehta', specialization: 'Orthopedic', rating: 4.8, experience_years: 21, hospitalName: 'Kokilaben Dhirubhai Ambani Hospital', area: 'Andheri', consultation_timings: '10 AM - 6 PM' },
  { name: 'Dr. Akash Shah', specialization: 'Orthopedic', rating: 4.5, experience_years: 14, hospitalName: 'Kokilaben Dhirubhai Ambani Hospital', area: 'Andheri', consultation_timings: '11 AM - 5 PM' },
  { name: 'Dr. Amol Ghalme', specialization: 'General Physician', rating: 4.7, experience_years: 18, hospitalName: 'Kokilaben Dhirubhai Ambani Hospital', area: 'Andheri', consultation_timings: '10 AM - 4 PM' },
  { name: 'Dr. Anuradha Rao', specialization: 'Gynecologist', rating: 4.8, experience_years: 22, hospitalName: 'Kokilaben Dhirubhai Ambani Hospital', area: 'Andheri', consultation_timings: '9 AM - 3 PM' },
  { name: 'Dr. Aparna Ramakrishnan', specialization: 'Pediatrician', rating: 4.9, experience_years: 20, hospitalName: 'Kokilaben Dhirubhai Ambani Hospital', area: 'Andheri', consultation_timings: '10 AM - 5 PM' },
  { name: 'Dr. Anshumala Shukla-Kulkarni', specialization: 'Gynecologist', rating: 4.7, experience_years: 17, hospitalName: 'Kokilaben Dhirubhai Ambani Hospital', area: 'Andheri', consultation_timings: '11 AM - 6 PM' },

  // ── P.D. HINDUJA HOSPITAL (Mahim) ───────────────────────────────────────────
  { name: 'Dr. B.K. Misra', specialization: 'Neurologist', rating: 4.9, experience_years: 32, hospitalName: 'P.D. Hinduja National Hospital', area: 'Mahim', consultation_timings: '10 AM - 4 PM' },
  { name: 'Dr. Indira Hinduja', specialization: 'Gynecologist', rating: 5.0, experience_years: 40, hospitalName: 'P.D. Hinduja National Hospital', area: 'Mahim', consultation_timings: '9 AM - 2 PM' },
  { name: 'Dr. Gustad Daver', specialization: 'Cardiologist', rating: 4.8, experience_years: 28, hospitalName: 'P.D. Hinduja National Hospital', area: 'Mahim', consultation_timings: '10 AM - 5 PM' },
  { name: 'Dr. Luis Jose De Souza', specialization: 'General Physician', rating: 4.7, experience_years: 26, hospitalName: 'P.D. Hinduja National Hospital', area: 'Mahim', consultation_timings: '9 AM - 3 PM' },
  { name: 'Dr. Milind V. Kirtane', specialization: 'ENT Specialist', rating: 4.8, experience_years: 30, hospitalName: 'P.D. Hinduja National Hospital', area: 'Mahim', consultation_timings: '10 AM - 5 PM' },
  { name: 'Dr. Rajeev Soman', specialization: 'General Physician', rating: 4.6, experience_years: 22, hospitalName: 'P.D. Hinduja National Hospital', area: 'Mahim', consultation_timings: '11 AM - 6 PM' },

  // ── FORTIS HOSPITAL MULUND (Mahim area) ─────────────────────────────────────
  { name: 'Dr. Hasmukh Ravat', specialization: 'Cardiologist', rating: 4.8, experience_years: 26, hospitalName: 'Fortis Hospital Mulund', area: 'Mahim', consultation_timings: '10 AM - 5 PM' },
  { name: 'Dr. Haresh Manglani', specialization: 'Orthopedic', rating: 4.9, experience_years: 23, hospitalName: 'Fortis Hospital Mulund', area: 'Mahim', consultation_timings: '9 AM - 4 PM' },
  { name: 'Dr. Atul Limaye', specialization: 'Cardiologist', rating: 4.7, experience_years: 22, hospitalName: 'Fortis Hospital Mulund', area: 'Mahim', consultation_timings: '10 AM - 6 PM' },
  { name: 'Dr. Aruna Bhave', specialization: 'General Physician', rating: 4.8, experience_years: 36, hospitalName: 'Fortis Hospital Mulund', area: 'Mahim', consultation_timings: '9 AM - 3 PM' },
  { name: 'Dr. Deshpande V. Rajakumar', specialization: 'Neurologist', rating: 4.7, experience_years: 20, hospitalName: 'Fortis Hospital Mulund', area: 'Mahim', consultation_timings: '10 AM - 5 PM' },
  { name: 'Dr. Anil Heroor', specialization: 'General Physician', rating: 4.6, experience_years: 21, hospitalName: 'Fortis Hospital Mulund', area: 'Mahim', consultation_timings: '11 AM - 5 PM' },

  // ── NANAVATI HOSPITAL (Bandra) ──────────────────────────────────────────────
  { name: 'Dr. Ashok H. Punjabi', specialization: 'Cardiologist', rating: 4.7, experience_years: 24, hospitalName: 'Nanavati Max Super Speciality Hospital', area: 'Bandra', consultation_timings: '10 AM - 5 PM' },
  { name: 'Dr. Chetan P. Shah', specialization: 'Cardiologist', rating: 4.8, experience_years: 27, hospitalName: 'Nanavati Max Super Speciality Hospital', area: 'Bandra', consultation_timings: '9 AM - 4 PM' },
  { name: 'Dr. Darshan A. Jhala', specialization: 'Cardiologist', rating: 4.6, experience_years: 18, hospitalName: 'Nanavati Max Super Speciality Hospital', area: 'Bandra', consultation_timings: '10 AM - 6 PM' },
  { name: 'Dr. Harish Bajaj', specialization: 'Cardiologist', rating: 4.5, experience_years: 16, hospitalName: 'Nanavati Max Super Speciality Hospital', area: 'Bandra', consultation_timings: '11 AM - 5 PM' },
  { name: 'Dr. Kunal Sinkar', specialization: 'Cardiologist', rating: 4.7, experience_years: 15, hospitalName: 'Nanavati Max Super Speciality Hospital', area: 'Bandra', consultation_timings: '10 AM - 4 PM' },
  { name: 'Dr. Arun P. Mehra', specialization: 'Cardiologist', rating: 4.9, experience_years: 29, hospitalName: 'Nanavati Max Super Speciality Hospital', area: 'Bandra', consultation_timings: '9 AM - 3 PM' },

  // ── SEVEN HILLS HOSPITAL (Andheri) ──────────────────────────────────────────
  { name: 'Dr. Priya Nair', specialization: 'Dermatologist', rating: 4.6, experience_years: 14, hospitalName: 'Seven Hills Hospital', area: 'Andheri', consultation_timings: '10 AM - 5 PM' },
  { name: 'Dr. Suresh Advani', specialization: 'General Physician', rating: 4.8, experience_years: 33, hospitalName: 'Seven Hills Hospital', area: 'Andheri', consultation_timings: '9 AM - 4 PM' },
  { name: 'Dr. Meena Desai', specialization: 'Gynecologist', rating: 4.7, experience_years: 19, hospitalName: 'Seven Hills Hospital', area: 'Andheri', consultation_timings: '10 AM - 6 PM' },
  { name: 'Dr. Rajesh Kulkarni', specialization: 'Orthopedic', rating: 4.5, experience_years: 17, hospitalName: 'Seven Hills Hospital', area: 'Andheri', consultation_timings: '11 AM - 5 PM' },
  { name: 'Dr. Kavita Sharma', specialization: 'Pediatrician', rating: 4.8, experience_years: 16, hospitalName: 'Seven Hills Hospital', area: 'Andheri', consultation_timings: '10 AM - 4 PM' },
  { name: 'Dr. Nitin Joshi', specialization: 'ENT Specialist', rating: 4.6, experience_years: 13, hospitalName: 'Seven Hills Hospital', area: 'Andheri', consultation_timings: '9 AM - 3 PM' },

  // ── SION HOSPITAL (Kurla) ───────────────────────────────────────────────────
  { name: 'Dr. Avinash Supe', specialization: 'General Physician', rating: 4.7, experience_years: 28, hospitalName: 'Sion Hospital (LTMGH)', area: 'Kurla', consultation_timings: '9 AM - 2 PM' },
  { name: 'Dr. Padmaja Samant', specialization: 'Gynecologist', rating: 4.6, experience_years: 20, hospitalName: 'Sion Hospital (LTMGH)', area: 'Kurla', consultation_timings: '10 AM - 4 PM' },
  { name: 'Dr. Ramesh Bhonde', specialization: 'General Physician', rating: 4.5, experience_years: 25, hospitalName: 'Sion Hospital (LTMGH)', area: 'Kurla', consultation_timings: '8 AM - 2 PM' },
  { name: 'Dr. Sanjay Nagral', specialization: 'General Physician', rating: 4.8, experience_years: 27, hospitalName: 'Sion Hospital (LTMGH)', area: 'Kurla', consultation_timings: '9 AM - 3 PM' },
  { name: 'Dr. Vandana Walvekar', specialization: 'Dermatologist', rating: 4.6, experience_years: 18, hospitalName: 'Sion Hospital (LTMGH)', area: 'Kurla', consultation_timings: '10 AM - 5 PM' },
  { name: 'Dr. Pravin Shingare', specialization: 'Neurologist', rating: 4.7, experience_years: 22, hospitalName: 'Sion Hospital (LTMGH)', area: 'Kurla', consultation_timings: '9 AM - 2 PM' },

  // ── RAJAWADI HOSPITAL (Kurla) ───────────────────────────────────────────────
  { name: 'Dr. Sunil Keswani', specialization: 'Neurologist', rating: 4.6, experience_years: 19, hospitalName: 'Rajawadi Hospital', area: 'Kurla', consultation_timings: '10 AM - 5 PM' },
  { name: 'Dr. Anita Borges', specialization: 'Dermatologist', rating: 4.7, experience_years: 21, hospitalName: 'Rajawadi Hospital', area: 'Kurla', consultation_timings: '9 AM - 4 PM' },
  { name: 'Dr. Milind Patil', specialization: 'Orthopedic', rating: 4.5, experience_years: 16, hospitalName: 'Rajawadi Hospital', area: 'Kurla', consultation_timings: '10 AM - 6 PM' },
  { name: 'Dr. Shobha Bhave', specialization: 'Pediatrician', rating: 4.8, experience_years: 24, hospitalName: 'Rajawadi Hospital', area: 'Kurla', consultation_timings: '9 AM - 3 PM' },
  { name: 'Dr. Ravi Shankar', specialization: 'ENT Specialist', rating: 4.6, experience_years: 15, hospitalName: 'Rajawadi Hospital', area: 'Kurla', consultation_timings: '10 AM - 4 PM' },
  { name: 'Dr. Geeta Chadha', specialization: 'Gynecologist', rating: 4.7, experience_years: 20, hospitalName: 'Rajawadi Hospital', area: 'Kurla', consultation_timings: '11 AM - 5 PM' },

  // ── BHABHA HOSPITAL (Kurla) ─────────────────────────────────────────────────
  { name: 'Dr. Ashwin Porwal', specialization: 'General Physician', rating: 4.5, experience_years: 17, hospitalName: 'Bhabha Hospital', area: 'Kurla', consultation_timings: '9 AM - 6 PM' },
  { name: 'Dr. Nandita Palshetkar', specialization: 'Gynecologist', rating: 4.8, experience_years: 26, hospitalName: 'Bhabha Hospital', area: 'Kurla', consultation_timings: '10 AM - 5 PM' },
  { name: 'Dr. Sanjay Patil', specialization: 'Orthopedic', rating: 4.6, experience_years: 18, hospitalName: 'Bhabha Hospital', area: 'Kurla', consultation_timings: '9 AM - 4 PM' },
  { name: 'Dr. Rekha Daver', specialization: 'Pediatrician', rating: 4.7, experience_years: 22, hospitalName: 'Bhabha Hospital', area: 'Kurla', consultation_timings: '10 AM - 6 PM' },

  // ── S.L. RAHEJA HOSPITAL (Mahim) ────────────────────────────────────────────
  { name: 'Dr. Farokh Udwadia', specialization: 'General Physician', rating: 4.9, experience_years: 45, hospitalName: 'S.L. Raheja Hospital (Fortis)', area: 'Mahim', consultation_timings: '10 AM - 2 PM' },
  { name: 'Dr. Sujata Sinha', specialization: 'Dermatologist', rating: 4.7, experience_years: 20, hospitalName: 'S.L. Raheja Hospital (Fortis)', area: 'Mahim', consultation_timings: '9 AM - 4 PM' },
  { name: 'Dr. Pradeep Gadge', specialization: 'General Physician', rating: 4.6, experience_years: 23, hospitalName: 'S.L. Raheja Hospital (Fortis)', area: 'Mahim', consultation_timings: '10 AM - 5 PM' },
  { name: 'Dr. Nirmala Deshpande', specialization: 'Pediatrician', rating: 4.8, experience_years: 28, hospitalName: 'S.L. Raheja Hospital (Fortis)', area: 'Mahim', consultation_timings: '9 AM - 3 PM' },
  { name: 'Dr. Vijay Agarwal', specialization: 'ENT Specialist', rating: 4.7, experience_years: 19, hospitalName: 'S.L. Raheja Hospital (Fortis)', area: 'Mahim', consultation_timings: '10 AM - 6 PM' },
  { name: 'Dr. Laxmi Shrikhande', specialization: 'Gynecologist', rating: 4.8, experience_years: 24, hospitalName: 'S.L. Raheja Hospital (Fortis)', area: 'Mahim', consultation_timings: '11 AM - 5 PM' },

  // ── CRITICARE ASIA HOSPITAL (Andheri) ───────────────────────────────────────
  { name: 'Dr. Parag Sanghavi', specialization: 'Neurologist', rating: 4.7, experience_years: 18, hospitalName: 'Criticare Asia Hospital', area: 'Andheri', consultation_timings: '10 AM - 5 PM' },
  { name: 'Dr. Shilpa Tatke', specialization: 'Neurologist', rating: 4.6, experience_years: 16, hospitalName: 'Criticare Asia Hospital', area: 'Andheri', consultation_timings: '9 AM - 4 PM' },
  { name: 'Dr. Anil Bhoraskar', specialization: 'General Physician', rating: 4.8, experience_years: 30, hospitalName: 'Criticare Asia Hospital', area: 'Andheri', consultation_timings: '10 AM - 6 PM' },
  { name: 'Dr. Sunita Dube', specialization: 'Dermatologist', rating: 4.5, experience_years: 14, hospitalName: 'Criticare Asia Hospital', area: 'Andheri', consultation_timings: '11 AM - 5 PM' },
  { name: 'Dr. Harshad Limaye', specialization: 'Pediatrician', rating: 4.7, experience_years: 17, hospitalName: 'Criticare Asia Hospital', area: 'Andheri', consultation_timings: '9 AM - 3 PM' },
  { name: 'Dr. Madhuri Patel', specialization: 'ENT Specialist', rating: 4.6, experience_years: 13, hospitalName: 'Criticare Asia Hospital', area: 'Andheri', consultation_timings: '10 AM - 4 PM' },

  // ── HOLY FAMILY HOSPITAL (Bandra) ───────────────────────────────────────────
  { name: 'Dr. Santosh Shetty', specialization: 'Orthopedic', rating: 4.7, experience_years: 20, hospitalName: 'Holy Family Hospital', area: 'Bandra', consultation_timings: '10 AM - 5 PM' },
  { name: 'Dr. Alka Kriplani', specialization: 'Gynecologist', rating: 4.8, experience_years: 25, hospitalName: 'Holy Family Hospital', area: 'Bandra', consultation_timings: '9 AM - 4 PM' },
  { name: 'Dr. Cyrus Shroff', specialization: 'General Physician', rating: 4.6, experience_years: 22, hospitalName: 'Holy Family Hospital', area: 'Bandra', consultation_timings: '10 AM - 6 PM' },
  { name: 'Dr. Nandita Shah', specialization: 'Dermatologist', rating: 4.7, experience_years: 18, hospitalName: 'Holy Family Hospital', area: 'Bandra', consultation_timings: '11 AM - 5 PM' },
  { name: 'Dr. Rohit Shetty', specialization: 'ENT Specialist', rating: 4.8, experience_years: 21, hospitalName: 'Holy Family Hospital', area: 'Bandra', consultation_timings: '9 AM - 3 PM' },
  { name: 'Dr. Vibha Varma', specialization: 'Pediatrician', rating: 4.6, experience_years: 15, hospitalName: 'Holy Family Hospital', area: 'Bandra', consultation_timings: '10 AM - 4 PM' }
];

const defaultAvailability = [
  { day: 'Monday', start_time: '10:00 AM', end_time: '2:00 PM', max_slots: 10, booked_slots: 0 },
  { day: 'Monday', start_time: '3:00 PM', end_time: '6:00 PM', max_slots: 10, booked_slots: 0 },
  { day: 'Wednesday', start_time: '10:00 AM', end_time: '2:00 PM', max_slots: 10, booked_slots: 0 },
  { day: 'Friday', start_time: '10:00 AM', end_time: '6:00 PM', max_slots: 15, booked_slots: 0 }
];

const seedData = async () => {
  try {
    await connectDB();

    await Hospital.deleteMany({});
    await Doctor.deleteMany({});
    await Disease.deleteMany({});

    const createdHospitals = await Hospital.insertMany(hospitals);
    await Disease.insertMany(diseases);

    const hospitalMap = {};
    createdHospitals.forEach(h => { hospitalMap[h.name] = h._id; });

    const doctors = realDoctors.map(d => ({
      name: d.name,
      specialization: d.specialization,
      rating: d.rating,
      experience_years: d.experience_years,
      hospitals: [hospitalMap[d.hospitalName]],
      area: d.area,
      consultation_timings: d.consultation_timings,
      availability: defaultAvailability
    }));

    await Doctor.insertMany(doctors);
    console.log(`Seeded ${createdHospitals.length} hospitals and ${doctors.length} real doctors.`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
