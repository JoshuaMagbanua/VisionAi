import * as FileSystem from "expo-file-system/legacy";

const GEMINI_KEY = process.env.EXPO_PUBLIC_GEMINI_KEY;

const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;

export async function imageToBase64(uri: string) {
  return await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
}

export async function analyzeImage(base64Image: string, prompt: string) {
  if (!base64Image) throw new Error("No image provided");

  const cleanBase64 = base64Image.replace(
    /^data:image\/\w+;base64,/,
    ""
  );

  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: cleanBase64,
              },
            },
          ],
        },
      ],
    }),
  });

  const data = await response.json();

  console.log("GEMINI RAW RESPONSE:", JSON.stringify(data, null, 2));

  if (!response.ok) {
    throw new Error(data?.error?.message || "Gemini request failed");
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) throw new Error("Empty Gemini response");

  return text;
}

// ✅ PHASE 6 PROMPTS
export const PROMPTS = {
  academic: `
Act as a university professor analyzing this image.

Return ONLY valid JSON:
{
  "objects": [],
  "context": "",
  "activities": "",
  "recommendations": ""
}
`,

  safety: `
Act as a workplace safety inspector.

Identify hazards or confirm safety.

Return ONLY valid JSON:
{
  "objects": [],
  "context": "",
  "activities": "",
  "recommendations": ""
}
`,

  inventory: `
Act as an asset management clerk.

List all visible items as a clean inventory.

Return ONLY valid JSON:
{
  "objects": [],
  "context": "",
  "activities": "",
  "recommendations": ""
}
`,
};