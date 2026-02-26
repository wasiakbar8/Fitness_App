import React, { useState } from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MoodWheel from "../components/MoodWheel";
import { Colors } from "../constants/Colors";

type MoodEntry = {
  mood: string;
  emoji: string;
  time: string;
  date: string;
};

const MOOD_EMOJI_MAP: Record<string, string> = {
  Calm: "😌",
  Peaceful: "😇",
  Happy: "😊",
  Content: "😄",
  Energetic: "🤩",
};

const MOOD_COLOR_MAP: Record<string, string> = {
  Calm: "#A1C4FD",
  Peaceful: "#C2E9FB",
  Happy: "#FFD180",
  Content: "#FAD0C4",
  Energetic: "#FF9A9E",
};

const MOOD_TIPS: Record<string, string> = {
  Calm: "Great state for focused work and mindful activity. Try a light stretch or meditation.",
  Peaceful:
    "Perfect mindset for recovery. A walk outside or journaling can deepen this feeling.",
  Happy:
    "Excellent energy! Channel it into a workout or connect with someone you care about.",
  Content: "A balanced mood — ideal for steady, consistent effort today.",
  Energetic:
    "You're fired up! Hit the gym or tackle your hardest task right now.",
};

function getTimeString() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getDateString() {
  return new Date().toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function MoodScreen() {
  const [currentMood, setCurrentMood] = useState("Content");
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([
    { mood: "Happy", emoji: "😊", time: "09:15 AM", date: "Dec 21" },
    { mood: "Calm", emoji: "😌", time: "08:00 AM", date: "Dec 20" },
    { mood: "Energetic", emoji: "🤩", time: "07:45 AM", date: "Dec 19" },
  ]);
  const [showHistory, setShowHistory] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [savedMood, setSavedMood] = useState<MoodEntry | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleContinue() {
    const entry: MoodEntry = {
      mood: currentMood,
      emoji: MOOD_EMOJI_MAP[currentMood] || "😊",
      time: getTimeString(),
      date: getDateString(),
    };
    setSavedMood(entry);
    setMoodHistory((prev) => [entry, ...prev].slice(0, 10));
    setSubmitted(true);
    setShowConfirm(true);
  }

  function handleConfirmClose() {
    setShowConfirm(false);
  }

  function handleLogAnother() {
    setShowConfirm(false);
    setSubmitted(false);
    setCurrentMood("Content");
  }

  const accentColor = MOOD_COLOR_MAP[currentMood] || "#FAD0C4";

  return (
    <>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Mood</Text>
            <Text style={styles.subtitle}>Start your day</Text>
            <Text style={styles.question}>
              How are you feeling at the{"\n"}Moment?
            </Text>
          </View>
          <TouchableOpacity
            style={styles.historyBtn}
            onPress={() => setShowHistory(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.historyBtnText}>History</Text>
            <Text style={styles.historyCount}>{moodHistory.length}</Text>
          </TouchableOpacity>
        </View>

        {/* Mood Wheel */}
        <View style={styles.wheelContainer}>
          <MoodWheel
            onMoodChange={(mood) => {
              setCurrentMood(mood);
              setSubmitted(false);
            }}
          />
          <Text style={[styles.moodLabel, { color: accentColor }]}>
            {currentMood}
          </Text>
          <Text style={styles.moodTip}>{MOOD_TIPS[currentMood]}</Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[styles.button, submitted && styles.buttonDone]}
          activeOpacity={0.85}
          onPress={submitted ? handleLogAnother : handleContinue}
        >
          <Text style={styles.buttonText}>
            {submitted ? "✓ Log Another Mood" : "Continue"}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* ─── Saved Confirmation Modal ─── */}
      <Modal
        visible={showConfirm}
        transparent
        animationType="fade"
        onRequestClose={handleConfirmClose}
      >
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmEmoji}>{savedMood?.emoji}</Text>
            <Text style={[styles.confirmMood, { color: accentColor }]}>
              {savedMood?.mood}
            </Text>
            <Text style={styles.confirmText}>Mood logged successfully!</Text>
            <Text style={styles.confirmMeta}>
              {savedMood?.date} at {savedMood?.time}
            </Text>
            <Text style={styles.confirmTip}>{MOOD_TIPS[currentMood]}</Text>

            <TouchableOpacity
              style={[styles.confirmBtn, { backgroundColor: accentColor }]}
              onPress={handleConfirmClose}
              activeOpacity={0.85}
            >
              <Text style={styles.confirmBtnText}>Done</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmSecondary}
              onPress={handleLogAnother}
              activeOpacity={0.7}
            >
              <Text style={styles.confirmSecondaryText}>Log Another</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ─── Mood History Modal ─── */}
      <Modal
        visible={showHistory}
        transparent
        animationType="slide"
        onRequestClose={() => setShowHistory(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setShowHistory(false)}
        >
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Mood History</Text>
              <TouchableOpacity onPress={() => setShowHistory(false)}>
                <Text style={styles.sheetClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {moodHistory.length === 0 ? (
              <View style={styles.emptyHistory}>
                <Text style={styles.emptyHistoryText}>
                  No moods logged yet.
                </Text>
                <Text style={styles.emptyHistorySub}>
                  Start by logging how you feel!
                </Text>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                {moodHistory.map((entry, i) => (
                  <View key={i} style={styles.historyRow}>
                    <Text style={styles.historyEmoji}>{entry.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.historyMood,
                          { color: MOOD_COLOR_MAP[entry.mood] || "#FFF" },
                        ]}
                      >
                        {entry.mood}
                      </Text>
                      <Text style={styles.historyMeta}>
                        {entry.date} · {entry.time}
                      </Text>
                    </View>
                    {i === 0 && (
                      <View style={styles.latestBadge}>
                        <Text style={styles.latestBadgeText}>Latest</Text>
                      </View>
                    )}
                  </View>
                ))}

                {/* Mood summary */}
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryTitle}>This Week</Text>
                  <View style={styles.summaryRow}>
                    {Object.entries(
                      moodHistory.reduce<Record<string, number>>((acc, e) => {
                        acc[e.mood] = (acc[e.mood] || 0) + 1;
                        return acc;
                      }, {}),
                    ).map(([mood, count]) => (
                      <View key={mood} style={styles.summaryItem}>
                        <Text style={styles.summaryEmoji}>
                          {MOOD_EMOJI_MAP[mood]}
                        </Text>
                        <Text
                          style={[
                            styles.summaryMood,
                            { color: MOOD_COLOR_MAP[mood] },
                          ]}
                        >
                          {mood}
                        </Text>
                        <Text style={styles.summaryCount}>×{count}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
  },

  // Header
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 40,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: Colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 20,
    fontWeight: "500",
  },
  question: {
    fontSize: 20,
    color: Colors.text,
    fontWeight: "600",
    marginTop: 6,
    lineHeight: 28,
  },
  historyBtn: {
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: "center",
    marginTop: 4,
    flexDirection: "row",
    gap: 8,
  },
  historyBtnText: { color: "#888", fontSize: 13, fontWeight: "600" },
  historyCount: {
    backgroundColor: "#2A2A2A",
    color: "#FFF",
    fontSize: 11,
    fontWeight: "700",
    width: 20,
    height: 20,
    borderRadius: 10,
    textAlign: "center",
    lineHeight: 20,
  },

  // Wheel
  wheelContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  moodLabel: {
    fontSize: 30,
    marginTop: 24,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  moodTip: {
    fontSize: 13,
    color: "#555",
    marginTop: 10,
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 18,
  },

  // Button
  button: {
    backgroundColor: "#FFFFFF",
    height: 58,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  buttonDone: {
    backgroundColor: "#1A2A1A",
    borderWidth: 1,
    borderColor: "#4ADE80",
  },
  buttonText: { fontSize: 18, fontWeight: "700", color: "#000" },

  // Confirm modal
  confirmOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  confirmCard: {
    backgroundColor: "#111",
    borderRadius: 28,
    padding: 30,
    alignItems: "center",
    width: "100%",
  },
  confirmEmoji: { fontSize: 64, marginBottom: 12 },
  confirmMood: { fontSize: 28, fontWeight: "700", marginBottom: 6 },
  confirmText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  confirmMeta: { color: "#555", fontSize: 13, marginTop: 4, marginBottom: 16 },
  confirmTip: {
    color: "#666",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 24,
  },
  confirmBtn: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  confirmBtnText: { color: "#000", fontSize: 16, fontWeight: "700" },
  confirmSecondary: { padding: 10 },
  confirmSecondaryText: { color: "#555", fontSize: 14 },

  // History modal
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#111",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: 48,
    maxHeight: "75%",
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#2A2A2A",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sheetTitle: { color: "#FFF", fontSize: 20, fontWeight: "700" },
  sheetClose: { color: "#555", fontSize: 18 },

  // History list
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  historyEmoji: { fontSize: 30 },
  historyMood: { fontWeight: "700", fontSize: 15 },
  historyMeta: { color: "#555", fontSize: 12, marginTop: 2 },
  latestBadge: {
    backgroundColor: "#1A2A1A",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#4ADE80",
  },
  latestBadgeText: { color: "#4ADE80", fontSize: 11, fontWeight: "600" },

  // Empty state
  emptyHistory: { alignItems: "center", paddingVertical: 40 },
  emptyHistoryText: { color: "#555", fontSize: 16, fontWeight: "600" },
  emptyHistorySub: { color: "#333", fontSize: 13, marginTop: 6 },

  // Summary card
  summaryCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    padding: 18,
    marginTop: 8,
  },
  summaryTitle: {
    color: "#888",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 14,
  },
  summaryRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  summaryItem: {
    alignItems: "center",
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 12,
    minWidth: 70,
  },
  summaryEmoji: { fontSize: 22 },
  summaryMood: { fontWeight: "600", fontSize: 12, marginTop: 4 },
  summaryCount: { color: "#555", fontSize: 11, marginTop: 2 },
});
