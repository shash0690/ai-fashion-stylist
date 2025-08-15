/**
 * Hugging Face Inference API integration with MOCK fallback.
 * If HF_API_KEY is not provided or MOCK_MODE=true, returns a random style.
 */
import dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config();

const MODEL_URL = process.env.HF_MODEL_URL || "https://api-inference.huggingface.co/models/nateraw/vision-transformer";

export async function detectStyle(imageBuffer) {
  if (process.env.MOCK_MODE === "true" || !process.env.HF_API_KEY) {
    const sample = ["Casual", "Formal", "Athleisure", "Streetwear"];
    return sample[Math.floor(Math.random() * sample.length)];
  }

  const response = await fetch(MODEL_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HF_API_KEY}`,
      "Content-Type": "application/octet-stream"
    },
    body: imageBuffer
  });

  const result = await response.json();
  if (Array.isArray(result) && result.length && result[0].label) {
    return result[0].label;
  }
  return "Casual";
}