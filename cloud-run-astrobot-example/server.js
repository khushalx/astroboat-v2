const express = require("express");
const { VertexAI } = require("@google-cloud/vertexai");

const app = express();
const port = process.env.PORT || 8080;
const project = process.env.GOOGLE_CLOUD_PROJECT;
const location = process.env.VERTEX_LOCATION || "us-central1";
const modelName = process.env.VERTEX_MODEL || "gemini-1.5-flash";
const maxMessageLength = 1000;

const systemPrompt = `You are Astroboat Assistant, a calm astronomy helper.
Answer only astronomy, space science, skywatching, Moon, asteroids, satellites, space missions, and Astroboat-related questions.
Keep answers concise and beginner-friendly.
If the user asks for live/current data, say that live data should be checked on Astroboat's Events, Moon, or Asteroid Watch pages unless current context is provided.
Do not make up exact current events.
Do not provide unsafe or irrelevant content.`;

app.use(express.json({ limit: "16kb" }));

app.get("/", (_request, response) => {
  response.json({
    status: "ok",
    service: "Astroboat Assistant"
  });
});

app.get("/health", (_request, response) => {
  response.json({
    status: "ok",
    service: "Astroboat Assistant"
  });
});

app.post("/chat", handleChat);

// Keep POST / available for older ASTROBOT_BACKEND_URL values.
app.post("/", handleChat);

app.use((request, response) => {
  response.status(404).json({
    error: `Route not found: ${request.method} ${request.path}`
  });
});

app.use((error, _request, response, _next) => {
  console.error("Astrobot request error:", error?.message || error);
  response.status(400).json({
    error: "Invalid request body."
  });
});

async function handleChat(request, response) {
  const message = typeof request.body?.message === "string" ? request.body.message.trim() : "";

  if (!message) {
    return response.status(400).json({ error: "Message is required." });
  }

  if (message.length > maxMessageLength) {
    return response.status(400).json({ error: `Message must be ${maxMessageLength} characters or fewer.` });
  }

  if (!project) {
    return response.status(500).json({ error: "GOOGLE_CLOUD_PROJECT is not configured." });
  }

  try {
    const vertexAI = new VertexAI({ project, location });
    const generativeModel = vertexAI.getGenerativeModel({
      model: modelName,
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 450
      }
    });

    const result = await generativeModel.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: message }]
        }
      ]
    });

    const answer = result.response?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .trim();

    if (!answer) {
      return response.status(502).json({ error: "Vertex AI returned an empty answer." });
    }

    return response.json({ answer });
  } catch (error) {
    console.error("Astrobot backend error:", error?.message || error);
    return response.status(502).json({ error: "Astroboat Assistant could not answer right now." });
  }
}

app.listen(port, () => {
  console.log(`Astroboat Assistant backend listening on port ${port}`);
});
