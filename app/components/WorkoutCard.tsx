import { ChevronRight } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface WorkoutCardProps {
  title: string;
  duration: string;
  date: string;
  onPress?: () => void;
}

export default function WorkoutCard({
  title,
  duration,
  date,
  onPress,
}: WorkoutCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View>
        <Text style={styles.dateText}>
          {date} • {duration}
        </Text>
        <Text style={styles.titleText}>{title}</Text>
      </View>
      <View style={styles.iconCircle}>
        <ChevronRight color="#FFF" size={18} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1A1A1A",
    padding: 20,
    borderRadius: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  dateText: {
    color: "#4ADE80",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },
  titleText: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: -0.3,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
  },
});
