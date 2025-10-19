// llmconfig.js
import { ChatGroq } from "@langchain/groq";
import { MemorySaver } from "@langchain/langgraph";
import "dotenv/config";

// ==============================
// ⚙️ Setup Core Dependencies
// ==============================

// LLM configuration
const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0,
  apiKey: process.env.GROQ_API_KEY,
});

// Checkpointer for state persistence
const checkpointer = new MemorySaver();

export { llm, checkpointer };
