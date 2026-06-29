import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { imageToBase64, analyzeImage, ANALYSIS_PROMPT } from "../lib/gemini";

export default function PreviewScreen() {
  const { photoUri } = useLocalSearchParams<{ photoUri: string }>();

  if (!photoUri) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#fff" }}>No image found</Text>
      </View>
    );
  }

  async function handleAnalyze() {
    try {
      const base64 = await imageToBase64(photoUri);

      const response = await analyzeImage(base64, ANALYSIS_PROMPT);

      const text =
        response?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) throw new Error("Empty Gemini response");

      // ✅ CLEAN JSON ONLY (important fix)
      const cleaned = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      router.push({
        pathname: "/result",
        params: {
          result: cleaned, // ✅ THIS IS THE ONLY THING RESULT NEEDS
        },
      });

    } catch (err) {
      console.log("Analyze error:", err);
    }
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: photoUri }} style={styles.preview} />

      <View style={styles.row}>
        <TouchableOpacity style={styles.retake} onPress={() => router.back()}>
          <Text style={styles.text}>Retake</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.analyze} onPress={handleAnalyze}>
          <Text style={styles.text}>Analyze</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  preview: { flex: 1, resizeMode: "contain" },

  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
  },

  retake: {
    backgroundColor: "#666",
    padding: 14,
    borderRadius: 8,
  },

  analyze: {
    backgroundColor: "#2E5BBA",
    padding: 14,
    borderRadius: 8,
  },

  text: {
    color: "#fff",
    fontWeight: "bold",
  },
});