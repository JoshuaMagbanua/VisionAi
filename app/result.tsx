import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

export default function ResultScreen() {
  const { result } = useLocalSearchParams<{ result: string }>();

  const [loading, setLoading] = useState(true);
  const [parsed, setParsed] = useState<any>(null);

  // 🔥 SAFE JSON EXTRACTOR (FIXED)
  function extractJSON(text: string) {
    try {
      let cleaned = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const start = cleaned.indexOf("{");
      const end = cleaned.lastIndexOf("}");

      if (start === -1 || end === -1) {
        throw new Error("No JSON found");
      }

      cleaned = cleaned.substring(start, end + 1);

      return JSON.parse(cleaned);
    } catch (err) {
      console.log("JSON PARSE FAILED:", err);
      return null;
    }
  }

  useEffect(() => {
    try {
      if (typeof result === "string") {
        const json = extractJSON(result);
        setParsed(json);
      }
    } catch (e) {
      console.log("Parse error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔥 LOADING STATE
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2E5BBA" />
        <Text style={styles.loadingText}>Analyzing image...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>AI Result</Text>

      {/* OBJECTS */}
      <View style={styles.box}>
        <Text style={styles.label}>Objects:</Text>
        <Text>
          {Array.isArray(parsed?.objects)
            ? parsed.objects.join(", ")
            : "N/A"}
        </Text>
      </View>

      {/* CONTEXT */}
      <View style={styles.box}>
        <Text style={styles.label}>Context:</Text>
        <Text>{parsed?.context || "N/A"}</Text>
      </View>

      {/* ACTIVITIES */}
      <View style={styles.box}>
        <Text style={styles.label}>Activities:</Text>
        <Text>{parsed?.activities || "N/A"}</Text>
      </View>

      {/* RECOMMENDATIONS */}
      <View style={styles.box}>
        <Text style={styles.label}>Recommendations:</Text>
        <Text>{parsed?.recommendations || "N/A"}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  box: {
    marginBottom: 15,
  },

  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
});