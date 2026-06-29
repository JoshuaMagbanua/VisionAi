import * as FileSystem from "expo-file-system/legacy";

const GEMINI_KEY = process.env.EXPO_PUBLIC_GEMINI_KEY;

const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;

export async function imageToBase64(uri: string) {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return base64;
}

export async function analyzeImage(base64Image: string, prompt: string) {
  if (!base64Image) throw new Error("No image provided");

  const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

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

  if (!data?.candidates?.[0]) {
    throw new Error("Empty Gemini response");
  }

  return data;
}

export const ANALYSIS_PROMPT = `
Analyze this image. Identify:
- objects
- context
- activities
- recommendations

Return ONLY valid JSON:
{
  "objects": [],
  "context": "",
  "activities": "",
  "recommendations": ""
}
`;