import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from "react-native";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function CustomButton({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
  textStyle,
}: CustomButtonProps) {
  const getButtonStyles = () => {
    switch (variant) {
      case "secondary":
        return styles.secondaryButton;
      case "outline":
        return styles.outlineButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case "outline":
        return styles.outlineText;
      case "secondary":
        return styles.secondaryText;
      default:
        return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.baseButton,
        getButtonStyles(),
        style,
        (disabled || loading) && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#000" : "#FFF"} />
      ) : (
        <Text style={[styles.baseText, getTextStyle(), textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    height: 58,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginVertical: 10,
  },
  primaryButton: {
    backgroundColor: "#FFFFFF", // Matches the "Continue" button in your design
  },
  secondaryButton: {
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#333",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  baseText: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  primaryText: {
    color: "#000000",
  },
  secondaryText: {
    color: "#FFFFFF",
  },
  outlineText: {
    color: "#FFFFFF",
  },
  disabled: {
    opacity: 0.5,
  },
});
