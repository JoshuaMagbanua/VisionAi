import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { imageToBase64, analyzeImage, PROMPTS } from "../lib/gemini";

export default function PreviewScreen() {
  const { photoUri } = useLocalSearchParams<{ photoUri: string }>();

  if (!photoUri) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#fff" }}>No image found</Text>
      </View>
    );
  }

  async function goAnalyze(promptKey: keyof typeof PROMPTS) {
    try {
      const base64 = await imageToBase64(photoUri);
      const prompt = PROMPTS[promptKey];

      router.push({
        pathname: "/result",
        params: {
          base64Image: base64,
          promptKey,
        },
      });
    } catch (err) {
      console.log("Analyze error:", err);
    }
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: photoUri }} style={styles.preview} />

      {/* 3 PERSONAS */}
      <View style={styles.personaRow}>
        <TouchableOpacity onPress={() => goAnalyze("academic")} style={styles.btn}>
          <Text style={styles.text}>Academic</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => goAnalyze("safety")} style={styles.btn}>
          <Text style={styles.text}>Safety</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => goAnalyze("inventory")} style={styles.btn}>
          <Text style={styles.text}>Inventory</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  preview: { flex: 1, resizeMode: "contain" },

  personaRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
  },

  btn: {
    backgroundColor: "#2E5BBA",
    padding: 12,
    borderRadius: 8,
  },

  text: { color: "#fff", fontWeight: "bold" },
});