/**
 * Google Vision integration with a friendly MOCK fallback.
 * If you set MOCK_MODE=true (default), it returns sample values
 * so you can run locally without any external keys.
 */
import dotenv from "dotenv";
dotenv.config();

let visionClient = null;
async function initVision() {
  if (process.env.MOCK_MODE === "true") return null;
  try {
    const vision = await import("@google-cloud/vision");
    return new vision.ImageAnnotatorClient();
  } catch (e) {
    console.warn("Google Vision not initialized. Falling back to MOCK mode.");
    return null;
  }
}

const clientPromise = initVision();

export async function analyzeWithVision(imageBuffer) {
  const client = await clientPromise;
  if (!client) {
    const sample = ["Warm", "Cool", "Neutral"];
    const colorTone = sample[Math.floor(Math.random() * sample.length)];
    return { colorTone };
  }

  try {
    const [result] = await client.imageProperties({ image: { content: imageBuffer } });
    const colors = result.imagePropertiesAnnotation?.dominantColors?.colors || [];
    let warmth = 0;
    colors.forEach(c => {
      const r = c.color.red || 0, g = c.color.green || 0, b = c.color.blue || 0;
      warmth += (r - b);
    });
    const colorTone = warmth > 0 ? "Warm" : warmth < 0 ? "Cool" : "Neutral";
    return { colorTone };
  } catch (e) {
    console.warn("Vision API call failed. Using MOCK fallback.", e.message);
    return { colorTone: "Neutral" };
  }
}