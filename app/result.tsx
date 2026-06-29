import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View, StyleSheet } from "react-native";

export default function ResultScreen() {
  const { result } = useLocalSearchParams<{ result: string }>();

  let parsed: any = null;

  try {
    parsed = result ? JSON.parse(result) : null;
  } catch (e) {
    console.log("Parse error:", e);
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>AI Result</Text>

      <View style={styles.box}>
        <Text style={styles.label}>Objects:</Text>
        <Text>{parsed?.objects?.join(", ") || "N/A"}</Text>
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
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  box: { marginBottom: 15 },
  label: { fontWeight: "bold", marginBottom: 5 },
});