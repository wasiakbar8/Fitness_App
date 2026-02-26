import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface InsightCardProps {
  label: string;
  value: string;
  subValue: string;
  progress?: number; // 0 to 1
  isPositive?: boolean;
}

export default function InsightCard({
  label,
  value,
  subValue,
  progress,
  isPositive,
}: InsightCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.valueText}>
        {value} <Text style={styles.labelUnit}>{label}</Text>
      </Text>
      <Text style={[styles.subText, isPositive && { color: "#4ADE80" }]}>
        {subValue}
      </Text>

      {progress !== undefined && (
        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.min(progress * 100, 100)}%` },
            ]}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1A1A1A",
    flex: 1,
    padding: 18,
    borderRadius: 24,
    minHeight: 120,
  },
  valueText: { color: "#FFF", fontSize: 24, fontWeight: "bold" },
  labelUnit: { fontSize: 13, color: "#888", fontWeight: "400" },
  subText: { color: "#888", fontSize: 12, marginTop: 5 },
  progressBg: {
    height: 4,
    backgroundColor: "#333",
    borderRadius: 2,
    marginTop: 18,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#4ADE80", borderRadius: 2 },
});
