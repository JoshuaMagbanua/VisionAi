import * as FileSystem from "expo-file-system/legacy";

const GEMINI_KEY = process.env.EXPO_PUBLIC_GEMINI_KEY;

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;

export async function imageToBase64(uri: string) {
  return await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
}

export async function analyzeImage(base64Image: string, prompt: string) {
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
                data: base64Image,
              },
            },
          ],
        },
      ],
    }),
  });

  return await response.json();
}

export const ANALYSIS_PROMPT = `
Analyze this image. Identify:
1. Objects
2. Context
3. Activities
4. Recommendations

Return ONLY valid JSON:
{
  "objects": [],
  "context": "",
  "activities": "",
  "recommendations": ""
}
`;