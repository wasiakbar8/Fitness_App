import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function AvatarInitials({
  label,
  color = "#A1C4FD",
}: {
  label: string;
  color?: string;
}) {
  return (
    <View style={[styles.circle, { backgroundColor: color }]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#000",
  },
  text: { color: "#000", fontSize: 12, fontWeight: "bold" },
});
