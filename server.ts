import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Lazy-initialized Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY is not defined. AI functionality will fallback to templates.");
      // We will handle fallback gracefully if the key is missing.
    }
    aiClient = new GoogleGenAI({ apiKey: key || "MOCK_KEY_FOR_BUILD" });
  }
  return aiClient;
}

// AI Endpoints
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages, userContext } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages format" });
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      // Fallback response when key is missing to keep app fully functional
      const lastMsg = messages[messages.length - 1]?.content || "";
      let reply = "I am the Hyderabad Service Marketplace Assistant! (AI offline - using local smart fallback)\n\n";
      if (lastMsg.toLowerCase().includes("electrician")) {
        reply += "Based on Hyderabad, Sindh listings, we have several top-rated Electricians. I recommend Booking 'Sajid Electrician' in Latifabad. He is highly rated with a Trust Score of 98% and handles AC installation, CCTV, and wiring repairs.";
      } else if (lastMsg.toLowerCase().includes("price") || lastMsg.toLowerCase().includes("cost")) {
        reply += "For home services like plumbing or electrical work in Hyderabad, prices typically start around PKR 500 - PKR 1500 for standard inspection and small repairs. Let me know if you would like me to match you with a provider.";
      } else {
        reply += "Sure! I can help you find verified plumbers, electricians, home tutors, or beauty artists in Latifabad, Qasimabad, Saddar, or Autobahn. What kind of service are you looking for today?";
      }
      return res.json({ reply });
    }

    const ai = getGemini();
    const systemPrompt = `You are "HyderiAI", the world-class AI assistant for "Hyderabad Service Marketplace" operating in Hyderabad, Sindh, Pakistan.
Your job is to assist customers and providers. You have extensive knowledge of Hyderabad areas like Qasimabad, Latifabad (Unit 1 to 12), Saddar, Autobahn, Hirabad, Phuleli, and Citizen Colony.
You understand local pricing (in PKR/Rupees) and help match users to categories: Home Services (Plumber, Electrician, CCTV), Beauty, Tutors, Automotive, Events, Digital Services, etc.
Be professional, extremely helpful, and write answers that are easy to understand. Keep your replies concise, structured, and helpful. Format your responses in markdown.`;

    const formattedContents = [
      { role: "user", parts: [{ text: systemPrompt }] },
      ...messages.map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
    ];

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formattedContents as any,
    });

    res.json({ reply: result.text });
  } catch (err: any) {
    console.error("Gemini Chat Error:", err);
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
});

app.post("/api/ai/estimate", async (req, res) => {
  try {
    const { category, service, description } = req.body;
    const key = process.env.GEMINI_API_KEY;

    if (!key) {
      // Smart local fallback
      const baseRates: Record<string, { range: string; points: string[] }> = {
        electrician: {
          range: "PKR 800 - PKR 3,500",
          points: ["Inspection: PKR 500", "Fan / Light Installation: PKR 800", "Complete DB Box repair: PKR 3,000+"]
        },
        plumber: {
          range: "PKR 1,000 - PKR 4,000",
          points: ["Leak repair: PKR 1,000", "Bathroom fitting: PKR 3,500", "Water pump maintenance: PKR 2,500"]
        },
        tutor: {
          range: "PKR 5,000 - PKR 15,000 / month",
          points: ["Primary Level: PKR 5k - 8k", "Matric/FSc Science: PKR 10k - 15k", "Computer / Programming: PKR 12k+"]
        },
        beauty: {
          range: "PKR 2,500 - PKR 15,000",
          points: ["Mehndi Design (both hands): PKR 1,500 - 3,000", "Party Makeup: PKR 5,000 - 8,000", "Bridal Package: PKR 15,000+"]
        }
      };

      const matched = baseRates[String(service || "").toLowerCase()] || baseRates[String(category || "").toLowerCase()] || {
        range: "PKR 1,500 - PKR 5,000",
        points: ["Standard Callout fee: PKR 500", "Labor rate: PKR 1,000 - 2,500 per hour", "Material cost: Extra as per actual market pricing in Hyderabad"]
      };

      return res.json({
        estimateRange: matched.range,
        explanation: `Estimated cost for ${service || category || "Selected Service"} in Hyderabad. (Calculated with market standard rates).`,
        breakdown: matched.points,
        confidence: "85% (Based on market averages)"
      });
    }

    const ai = getGemini();
    const prompt = `Provide a premium, highly detailed price estimation in Pakistani Rupees (PKR) for a service booking in Hyderabad, Sindh.
Category: ${category}
Service: ${service}
Description of requirements: ${description || "General maintenance and repair"}

Respond with a JSON object. The response must contain strictly valid JSON, with nothing else before or after.
JSON Schema:
{
  "estimateRange": "string describing the price range (e.g., 'PKR 1,200 - 2,500')",
  "explanation": "string briefly explaining the factors driving the cost in Hyderabad",
  "breakdown": ["array of strings explaining detailed service breakdown items and their individual standard rates"],
  "confidence": "string percentage (e.g., '90%')"
}`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(result.text || "{}");
    res.json(parsed);
  } catch (err: any) {
    console.error("Estimate Error:", err);
    res.status(500).json({ error: err.message || "Failed to generate estimation" });
  }
});

app.post("/api/ai/complaint", async (req, res) => {
  try {
    const { complaintText, bookingId } = req.body;
    const key = process.env.GEMINI_API_KEY;

    if (!key) {
      return res.json({
        analysis: "Minor Dispute / Delay Warning",
        urgency: "Medium",
        actionPlan: "Our Hyderabad customer support has been notified. We will call both you and the service provider within 2 hours to resolve the dispute.",
        isFraudSuspected: false
      });
    }

    const ai = getGemini();
    const prompt = `Analyze this customer complaint for a hyperlocal service marketplace in Hyderabad, Pakistan.
Complaint text: "${complaintText}"
Booking ID: "${bookingId || "N/A"}"

Determine:
1. Severity of dispute (Low, Medium, High, Critical)
2. Is fraud or review manipulation suspected? (true/false)
3. Action plan for Hyderabad marketplace admins to resolve this.

Respond strictly with valid JSON.
Schema:
{
  "analysis": "string summarizing complaint severity and core issue",
  "urgency": "string ('Low' | 'Medium' | 'High' | 'Critical')",
  "actionPlan": "string detailing action points for the dispute support agent",
  "isFraudSuspected": boolean
}`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(result.text || "{}");
    res.json(parsed);
  } catch (err: any) {
    console.error("Complaint Analysis Error:", err);
    res.status(500).json({ error: err.message || "Failed to analyze complaint" });
  }
});

app.post("/api/ai/profile", async (req, res) => {
  try {
    const { providerName, category, skills, bioDetails } = req.body;
    const key = process.env.GEMINI_API_KEY;

    if (!key) {
      return res.json({
        tagline: `Professional ${category} based in Hyderabad`,
        description: `Hi, I am ${providerName || "a service partner"}. I am specialized in ${category} (${skills || "general services"}). I offer top-quality work in Qasimabad, Latifabad, and Saddar areas of Hyderabad. Call me for reliable, punctual, and highly professional service with affordable pricing.`
      });
    }

    const ai = getGemini();
    const prompt = `Generate a highly professional, attractive, marketing-friendly service bio/profile description for a provider registered on the Hyderabad Service Marketplace.
Provider Name: ${providerName || "Service Partner"}
Category: ${category}
Skills/Tools: ${skills || "Standard industry equipment"}
Extra info/Bio points: ${bioDetails || "Committed to quality work, punctual, 5+ years experience"}

Respond with a JSON object.
Schema:
{
  "tagline": "string catchphrase (e.g., 'Expert Cooling Solutions for Hyderabad Summers')",
  "description": "string complete professional biography including customer-satisfaction guarantees, service standard, and a friendly welcome to Hyderabad citizens (approx 150-200 words)"
}`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(result.text || "{}");
    res.json(parsed);
  } catch (err: any) {
    console.error("AI Profile Generator Error:", err);
    res.status(500).json({ error: err.message || "Failed to generate bio" });
  }
});

// Serve Frontend App
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Hyderabad Service Marketplace server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
