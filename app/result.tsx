import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View, StyleSheet, ActivityIndicator } from "react-native";

export default function ResultScreen() {
  const { result } = useLocalSearchParams<{ result: string }>();

  const [loading, setLoading] = useState(true);
  const [parsed, setParsed] = useState<any>(null);

  useEffect(() => {
    try {
      if (typeof result === "string") {
        const cleaned = result
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .replace(/`/g, "")
          .trim();

        const json = JSON.parse(cleaned);
        setParsed(json);
      }
    } catch (e) {
      console.log("Parse error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔥 LOADING STATE (Phase 5 requirement)
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

      <View style={styles.box}>
        <Text style={styles.label}>Objects:</Text>
        <Text>
          {Array.isArray(parsed?.objects)
            ? parsed.objects.join(", ")
            : "N/A"}
        </Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.label}>Context:</Text>
        <Text>{parsed?.context || "N/A"}</Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.label}>Activities:</Text>
        <Text>{parsed?.activities || "N/A"}</Text>
      </View>

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

  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  box: { marginBottom: 15 },
  label: { fontWeight: "bold", marginBottom: 5 },
});