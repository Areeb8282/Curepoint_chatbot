const { GoogleGenerativeAI } = require('@google/generative-ai');
const Disease = require('../models/Disease');
const Doctor = require('../models/Doctor');
const ChatHistory = require('../models/ChatHistory');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are CurePoint AI, an advanced multi-specialty medical assistant.

DISEASE KNOWLEDGE BASE:
- General Physician: Viral Fever, Typhoid, Dengue Fever, Malaria, Diabetes, COVID-19
- Cardiologist: Hypertension, Coronary Artery Disease, Heart Failure, Arrhythmia
- Neurologist: Migraine, Epilepsy, Stroke, Parkinson's Disease, Vertigo
- Dermatologist: Eczema, Psoriasis, Acne Vulgaris, Urticaria (Hives), Fungal Skin Infection
- Orthopedic: Osteoarthritis, Fracture, Herniated Disc, Rheumatoid Arthritis, Tendinitis
- ENT Specialist: Otitis Media (Ear Infection), Sinusitis, Tonsillitis, Allergic Rhinitis
- Pediatrician: Childhood Fever & Infection, Asthma in Children, Chickenpox, Diarrhea & Dehydration in Children
- Gynecologist: Pregnancy Care, PCOD/PCOS, Endometriosis, UTI, Menopause

STRICT RULES:
- NEVER diagnose on the first message. ALWAYS ask follow-up questions first.
- Ask 3-5 focused questions covering: duration, severity (1-10), associated symptoms, triggers, patient type.
- Only give assessment after at least 3 exchanges.
- If user introduces a NEW symptom mid-conversation, treat it as a fresh case and ask new questions.
- NEVER say "You have X" — always say "could indicate" or "may suggest".
- Compare multiple diseases across specialties before concluding.

VALID SPECIALIZATIONS: General Physician, Cardiologist, Dermatologist, Orthopedic, Neurologist, ENT Specialist, Pediatrician, Gynecologist

OUTPUT: Respond ONLY with valid JSON, no markdown, no extra text.

While gathering info: {"type":"question","reply":"your questions here"}

When ready to assess: {"type":"assessment","reply":"empathetic summary","conditions":["condition1","condition2"],"severity":"low","severity_reason":"reason","advice":"advice","specialization":"General Physician","disclaimer":"This is not a medical diagnosis. Please consult a qualified doctor."}

REMEMBER: First message = ALWAYS ask questions. If user gives new symptom after assessment = ask fresh questions for that symptom.`;

// ── Symptom detection helpers ─────────────────────────────────────────────────
const SYMPTOM_WORDS = [
  'stomach','chest','head','back','skin','ear','throat','fever','pain','ache',
  'rash','cough','cold','vomit','dizzy','nausea','bleeding','swelling','itching',
  'burning','fatigue','tired','weak','joint','bone','eye','nose','breath','heart',
  'period','pregnant','seizure','tremor','ringing','discharge','sore','cramp','palpitation'
];

function extractSymptom(message) {
  const msg = message.toLowerCase();
  for (const word of SYMPTOM_WORDS) {
    if (msg.includes(word)) return word;
  }
  return 'these symptoms';
}

// ── Question sets ─────────────────────────────────────────────────────────────
const Q1 = (symptom) =>
  `I understand you're experiencing ${symptom}. To help you better, let me ask a few questions:\n\n` +
  `1. When did these symptoms start — today, or a few days ago?\n` +
  `2. How severe is the discomfort on a scale of 1–10?\n` +
  `3. Is the symptom constant or does it come and go?\n` +
  `4. Do you have any fever along with it?`;

const Q2 =
  `Thank you for sharing that. A few more questions:\n\n` +
  `1. Do you have any nausea, vomiting, or diarrhea?\n` +
  `2. Does anything make it better or worse (food, rest, movement, stress)?\n` +
  `3. Have you had similar symptoms before?`;

const Q3 =
  `Almost done — just a couple more:\n\n` +
  `1. Do you have any existing medical conditions (diabetes, BP, asthma, etc.)?\n` +
  `2. Are you currently on any medication?\n` +
  `3. Any recent travel, injury, or unusual food intake?`;

// ── Fallback matcher (no Gemini) ──────────────────────────────────────────────
async function fallbackMatch(message, area, history, round) {
  // Detect new symptom after a previous assessment
  const hadAssessment = history.some(h => h.sender === 'bot' && h.text?.includes('Disclaimer'));
  const isNewSymptom = hadAssessment && SYMPTOM_WORDS.some(w => message.toLowerCase().includes(w));

  // Use explicit round from frontend — reset to 0 if new symptom
  const effectiveRound = isNewSymptom ? 0 : round;

  if (effectiveRound === 0) {
    const symptom = extractSymptom(message);
    const intro = isNewSymptom
      ? `I see you have a new concern — ${symptom}. Let me ask a few fresh questions about this:`
      : `I understand you're experiencing ${symptom}. To help you better, let me ask a few questions:`;
    return {
      reply: `${intro}\n\n1. When did these symptoms start — today, or a few days ago?\n2. How severe is the discomfort on a scale of 1–10?\n3. Is the symptom constant or does it come and go?\n4. Do you have any fever along with it?`,
      doctors: [], isNewSymptom
    };
  }
  if (effectiveRound === 1) {
    return { reply: Q2, doctors: [] };
  }
  if (effectiveRound === 2) {
    return { reply: Q3, doctors: [] };
  }

  // Round 3+ → give assessment using full context from this symptom thread
  const contextMessages = [];
  for (let i = history.length - 1; i >= 0; i--) {
    const h = history[i];
    if (h.sender === 'bot' && h.text?.includes('Disclaimer')) break;
    contextMessages.unshift(h.text || '');
  }
  contextMessages.push(message);
  const fullContext = contextMessages.join(' ').toLowerCase();

  const allDiseases = await Disease.find();

  // Generic words that appear in many diseases — don't count them alone
  const GENERIC_WORDS = new Set(['fever','pain','ache','fatigue','nausea','vomiting','weakness','headache','cough','diarrhea']);

  const scored = allDiseases.map(disease => {
    let score = 0;
    disease.symptoms.forEach(s => {
      const sl = s.toLowerCase();
      const words = sl.split(' ');
      const isMultiWord = words.length >= 2;
      const isGeneric = words.length === 1 && GENERIC_WORDS.has(sl);

      if (fullContext.includes(sl)) {
        score += isMultiWord ? 6 : isGeneric ? 1 : 3;
      } else {
        const sw = words.filter(w => w.length >= 5 && !GENERIC_WORDS.has(w));
        const iw = fullContext.split(/[\s,]+/).filter(w => w.length >= 5 && !GENERIC_WORDS.has(w));
        if (sw.length > 0 && sw.some(a => iw.some(b => a.includes(b) || b.includes(a)))) {
          score += 1;
        }
      }
    });
    return { disease, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];

  if (!best || best.score < 2) {
    const doctors = await Doctor.find({ specialization: 'General Physician', area }).populate('hospitals');
    return {
      reply: "Based on what you've described, I'd recommend consulting a **General Physician** for a thorough evaluation.\n\n⚠️ **Disclaimer:** This is not a medical diagnosis. Please consult a qualified doctor.",
      doctors, isAssessment: true
    };
  }

  const doctors = await Doctor.find({ specialization: best.disease.recommended_specialization, area }).populate('hospitals');

  // Build precautions text
  const precautionsList = best.disease.precautions?.length
    ? '\n\n🛡️ **Temporary Precautions (until you see a doctor):**\n' +
      best.disease.precautions.map((p, i) => `${i + 1}. ${p}`).join('\n')
    : '';

  return {
    reply: `Based on everything you've shared, your symptoms could indicate **${best.disease.disease_name}** or a related condition. I recommend seeing a **${best.disease.recommended_specialization}** for a proper evaluation.${precautionsList}\n\n🟡 **Severity:** MODERATE — A doctor's assessment is recommended.\n\n⚠️ **Disclaimer:** This is not a medical diagnosis. Please consult a qualified doctor.`,
    disease: best.disease.disease_name,
    specialization: best.disease.recommended_specialization,
    doctors, isAssessment: true
  };
}

// ── Main controller ───────────────────────────────────────────────────────────
exports.processChat = async (req, res) => {
  try {
    const { message, user_id, area, history = [], round = 0 } = req.body;

    if (!message || !area) {
      return res.status(400).json({ error: 'Message and area are required' });
    }

    const keyMissing = !process.env.GEMINI_API_KEY ||
      process.env.GEMINI_API_KEY === 'your-gemini-api-key-here';

    if (keyMissing) {
      const result = await fallbackMatch(message, area, history, round);
      if (user_id) await ChatHistory.create({ user_id, message, reply: result.reply }).catch(() => {});
      return res.json(result);
    }

    // ── Gemini path ──
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-lite',
      generationConfig: { temperature: 0.4, responseMimeType: 'application/json' },
      systemInstruction: SYSTEM_PROMPT,
    });

    const geminiHistory = [];
    for (const msg of history) {
      if (!msg?.text) continue;
      const cleanText = msg.text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/[🟢🟡🔴💊⚠️]/g, '').trim();
      if (msg.sender === 'user') {
        geminiHistory.push({ role: 'user', parts: [{ text: cleanText }] });
      } else if (msg.sender === 'bot') {
        try { JSON.parse(cleanText); geminiHistory.push({ role: 'model', parts: [{ text: cleanText }] }); }
        catch { /* skip non-JSON */ }
      }
    }

    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessage(message);
    const rawText = result.response.text().trim();

    let parsed;
    try {
      const clean = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
      parsed = JSON.parse(clean);
    } catch {
      parsed = { type: 'question', reply: rawText };
    }

    if (user_id) await ChatHistory.create({ user_id, message, reply: parsed.reply }).catch(() => {});

    if (parsed.type === 'question') {
      return res.json({ reply: parsed.reply, rawReply: parsed.reply, doctors: [] });
    }

    const specialization = parsed.specialization || 'General Physician';
    const doctors = await Doctor.find({ specialization, area }).populate('hospitals');

    // Fetch precautions from DB for the matched condition
    const matchedDisease = await Disease.findOne({
      disease_name: { $regex: new RegExp(parsed.conditions?.[0] || '', 'i') }
    });
    const precautionsList = matchedDisease?.precautions?.length
      ? '\n\n🛡️ **Temporary Precautions (until you see a doctor):**\n' +
        matchedDisease.precautions.map((p, i) => `${i + 1}. ${p}`).join('\n')
      : '';

    const sevEmoji = { low: '🟢', moderate: '🟡', high: '🔴' }[parsed.severity] || '🟡';
    const fullReply = [
      parsed.reply, '',
      `${sevEmoji} **Severity:** ${(parsed.severity || 'moderate').toUpperCase()} — ${parsed.severity_reason || ''}`,
      precautionsList,
      '',
      `💊 **Advice:** ${parsed.advice || ''}`, '',
      `⚠️ **Disclaimer:** ${parsed.disclaimer || 'This is not a medical diagnosis. Please consult a qualified doctor.'}`,
    ].join('\n');

    return res.json({
      reply: fullReply,
      rawReply: `Assessment: ${parsed.conditions?.join(', ')}. Severity: ${parsed.severity}.`,
      disease: parsed.conditions?.[0] || '',
      conditions: parsed.conditions || [],
      severity: parsed.severity,
      specialization, doctors, isAssessment: true
    });

  } catch (error) {
    console.error('Chat error:', error.message);
    try {
      const result = await fallbackMatch(req.body.message, req.body.area, req.body.history || [], req.body.round || 0);
      return res.json(result);
    } catch (e) {
      return res.status(500).json({ reply: "I'm having trouble right now. Please try again.", doctors: [] });
    }
  }
};
