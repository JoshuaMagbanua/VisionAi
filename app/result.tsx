import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { analyzeImage, PROMPTS } from "../lib/gemini";

export default function ResultScreen() {
  const { base64Image, promptKey } =
    useLocalSearchParams<{ base64Image: string; promptKey: keyof typeof PROMPTS }>();

  const [loading, setLoading] = useState(true);
  const [parsed, setParsed] = useState<any>(null);

  useEffect(() => {
    async function run() {
      try {
        const prompt = PROMPTS[promptKey];

        const response = await analyzeImage(base64Image, prompt);

        const text =
          response?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) throw new Error("Empty response");

        const cleaned = text
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .replace(/`/g, "")
          .trim();

        setParsed(JSON.parse(cleaned));
      } catch (err) {
        console.log("Parse/Analyze error:", err);
      } finally {
        setLoading(false);
      }
    }

    run();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2E5BBA" />
        <Text>Analyzing...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Result ({promptKey})</Text>

      <View style={styles.box}>
        <Text style={styles.label}>Objects</Text>
        <Text>{parsed?.objects?.join(", ") || "N/A"}</Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.label}>Context</Text>
        <Text>{parsed?.context || "N/A"}</Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.label}>Activities</Text>
        <Text>{parsed?.activities || "N/A"}</Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.label}>Recommendations</Text>
        <Text>{parsed?.recommendations || "N/A"}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  box: { marginBottom: 15 },
  label: { fontWeight: "bold" },
});