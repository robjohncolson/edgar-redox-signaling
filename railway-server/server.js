// Edgar Redox Signaling - AI Chat Server
// Simple Express server for Groq API chat

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Groq API configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = 'llama-3.3-70b-versatile';

// System prompt with paper context
const SYSTEM_PROMPT = `You are an expert AP Biology tutor specializing in redox signaling and cellular metabolism. You are helping students understand Edgar Chavez Lopez's research paper on "Redox Signaling: How Mitochondria Regulate Cell Fate Through Reactive Oxygen Species."

## Your Knowledge Base (from the paper):

### Key Concepts:
1. **ROS (Reactive Oxygen Species)**: By-products of mitochondrial metabolism that function as both harmful oxidants AND essential signaling molecules. Include:
   - Superoxide anion (O₂•⁻)
   - Hydrogen peroxide (H₂O₂)
   - Hydroxyl radical (•OH)

2. **ROS Origin**: Primarily from the electron transport chain (ETC), especially Complex I when:
   - NADH levels are high
   - ATP synthase is sluggish
   - ETC is "backed up"

3. **ROS Conversion Pathway**:
   O₂ → O₂•⁻ (via electron leak) → H₂O₂ (via SOD) → •OH (via Fenton reaction with Fe²⁺)

4. **Concentration-Dependent Effects**:
   - LOW ROS (10⁻¹¹ to 10⁻¹² M H₂O₂): Promotes cell growth via ERK1/2 and Akt activation
   - MODERATE ROS: Triggers stress response, activates JNK and p38 MAPK, promotes differentiation
   - HIGH ROS: Initiates apoptosis via p53 activation and caspase cascade

5. **PTEN-Akt Example** (key mechanism):
   - PTEN normally dephosphorylates PIP₃ → PIP₂ (suppresses growth)
   - H₂O₂ oxidizes PTEN's Cys124 → forms disulfide with Cys71 → PTEN inactivated
   - Result: PIP₃ accumulates → Akt recruited → cell proliferation

6. **Cancer Connection** (Warburg Effect):
   - Cancer cells maintain low ROS through reduced mitochondrial respiration
   - This keeps ERK/Akt active for uncontrolled proliferation

7. **Other ROS Functions**:
   - ER: Oxidizing conditions enable disulfide bond formation for protein folding
   - Immune cells: NADPH oxidase → superoxide → HOCl (bleach) for bacterial killing

### References from the paper:
- Zhang et al. (2016) - ROS and ROS-mediated cellular signaling
- Thannickal & Fanburg (2000) - ROS in cell signaling
- Lee et al. (2002), Leslie et al. (2003), Kwon et al. (2004) - PTEN oxidation
- Liao et al. (2021) - Double-edged roles of ROS in cancer
- Papa et al. (2019) - PI3K/Akt signaling and redox metabolism

## Your Teaching Style:
- Be concise but thorough
- Use analogies when helpful
- Highlight concentration-dependent effects (the "double-edged sword" of ROS)
- Connect concepts to the bigger picture of cell fate regulation
- When relevant, mention specific pathways (ERK, Akt, JNK, p38, p53)
- Use chemical notation when appropriate (H₂O₂, O₂•⁻, etc.)

## Important:
- Stay focused on redox signaling and related topics
- If asked about unrelated topics, politely redirect to the paper's content
- Be encouraging and supportive of student learning`;

// Rate limiting
const rateLimiter = {
  requests: [],
  maxRequests: 20,
  windowMs: 60000, // 1 minute

  canMakeRequest() {
    const now = Date.now();
    this.requests = this.requests.filter(t => now - t < this.windowMs);
    return this.requests.length < this.maxRequests;
  },

  recordRequest() {
    this.requests.push(Date.now());
  }
};

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    aiAvailable: !!GROQ_API_KEY,
    model: GROQ_MODEL,
    timestamp: new Date().toISOString()
  });
});

// AI status
app.get('/api/ai/status', (req, res) => {
  res.json({
    available: !!GROQ_API_KEY,
    provider: 'groq',
    model: GROQ_MODEL,
    rateLimit: {
      remaining: rateLimiter.maxRequests - rateLimiter.requests.length,
      resetIn: Math.max(0, rateLimiter.windowMs - (Date.now() - (rateLimiter.requests[0] || Date.now())))
    }
  });
});

// Chat endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!GROQ_API_KEY) {
      return res.status(503).json({ error: 'AI service not configured. Set GROQ_API_KEY environment variable.' });
    }

    // Rate limiting
    if (!rateLimiter.canMakeRequest()) {
      return res.status(429).json({ error: 'Too many requests. Please wait a moment and try again.' });
    }

    console.log(`🧬 Chat request: "${message.substring(0, 50)}..."`);

    // Build messages array
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: message }
    ];

    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Groq API error:', response.status, errorData);
      throw new Error(`AI service error: ${response.status}`);
    }

    const data = await response.json();
    rateLimiter.recordRequest();

    const assistantMessage = data.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';

    console.log(`✅ Chat response generated (${assistantMessage.length} chars)`);

    res.json({
      response: assistantMessage,
      _provider: 'groq',
      _model: GROQ_MODEL
    });

  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🧬 Edgar Redox Chat Server running on port ${PORT}`);
  console.log(`   AI Available: ${!!GROQ_API_KEY}`);
  console.log(`   Model: ${GROQ_MODEL}`);
});
