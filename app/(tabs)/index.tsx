import { useRouter } from "expo-router";
import { Bell, ChevronRight, Droplets, Plus, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AvatarInitials from "../components/AvatarInitials";
import InsightCard from "../components/InsightCard";
import WorkoutCard from "../components/WorkoutCard";
import { MOCK_INSIGHTS, MOCK_WORKOUTS } from "../constants/MockData";

const DAYS = ["M", "Tu", "W", "Th", "F", "Sa", "Su"];
const DATES = [21, 22, 23, 24, 25, 26, 27];

// Map each day index to workouts
const WORKOUT_BY_DAY: Record<number, typeof MOCK_WORKOUTS> = {
  0: [],
  1: [MOCK_WORKOUTS[0]], // Tuesday - Upper Body
  2: [],
  3: [MOCK_WORKOUTS[1]], // Thursday - Leg Day Blitz
  4: [MOCK_WORKOUTS[2]], // Friday - Arm Blaster
  5: [],
  6: [],
};

const HYDRATION_OPTIONS = [
  { label: "150ml", value: 150 },
  { label: "250ml", value: 250 },
  { label: "330ml", value: 330 },
  { label: "500ml", value: 500 },
  { label: "750ml", value: 750 },
  { label: "1000ml", value: 1000 },
];

export default function HomeScreen() {
  const router = useRouter();

  const [activeDay, setActiveDay] = useState(1);
  const [caloriesConsumed] = useState(MOCK_INSIGHTS.calories.consumed);
  const caloriesGoal = MOCK_INSIGHTS.calories.goal;
  const [weight] = useState(MOCK_INSIGHTS.weight.current);

  // Hydration
  const hydrationGoal = 2500;
  const [hydrationMl, setHydrationMl] = useState(0);
  const [hydrationLog, setHydrationLog] = useState<number[]>([]);
  const [showHydrationModal, setShowHydrationModal] = useState(false);
  const hydrationPct = Math.round((hydrationMl / hydrationGoal) * 100);

  // Notifications
  const [notifCount, setNotifCount] = useState(2);

  const todayWorkouts = WORKOUT_BY_DAY[activeDay] ?? [];

  function handleLogWater(ml: number) {
    setHydrationMl((prev) => Math.min(prev + ml, hydrationGoal));
    setHydrationLog((prev) => [ml, ...prev].slice(0, 5));
    setShowHydrationModal(false);
  }

  function handleUndoLastLog() {
    if (hydrationLog.length === 0) return;
    const last = hydrationLog[0];
    setHydrationMl((prev) => Math.max(prev - last, 0));
    setHydrationLog((prev) => prev.slice(1));
  }

  function handleBellPress() {
    setNotifCount(0);
    Alert.alert("Notifications", "You're all caught up! No new notifications.");
  }

  function handleWorkoutPress(title: string) {
    Alert.alert(title, "Ready to start this workout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Start Workout 💪",
        onPress: () =>
          Alert.alert(
            "Workout Started!",
            `${title} is now in progress. Good luck!`,
          ),
      },
    ]);
  }

  function handleAddWorkout() {
    Alert.alert(
      "Add Workout",
      `Add a workout for ${DAYS[activeDay]} ${DATES[activeDay]} Dec?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Add",
          onPress: () =>
            Alert.alert("Coming Soon", "Custom workout builder coming soon!"),
        },
      ],
    );
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBellPress}
            activeOpacity={0.7}
            style={styles.bellWrap}
          >
            <Bell color="#FFF" size={24} />
            {notifCount > 0 && (
              <View style={styles.notifBadge}>
                <Text style={styles.notifText}>{notifCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={() => router.push("/training-cal")}
              style={styles.weekBadge}
              activeOpacity={0.7}
            >
              <Text style={styles.weekLabel}>Week 1/4 →</Text>
            </TouchableOpacity>
            <View style={styles.avatarRow}>
              <AvatarInitials label="R" color="#A1C4FD" />
              <AvatarInitials label="M" color="#FF9A9E" />
            </View>
          </View>
        </View>

        {/* Date */}
        <Text style={styles.dateText}>Today, 22 Dec 2024</Text>

        {/* Calendar Strip */}
        <View style={styles.calendarStrip}>
          {DAYS.map((day, i) => {
            const hasWorkout = (WORKOUT_BY_DAY[i] ?? []).length > 0;
            const isActive = activeDay === i;
            return (
              <TouchableOpacity
                key={i}
                style={[styles.dayBox, isActive && styles.activeDay]}
                onPress={() => setActiveDay(i)}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.dayLabel, isActive && styles.activeDayLabel]}
                >
                  {day}
                </Text>
                <Text
                  style={[styles.dateNum, isActive && styles.activeDateNum]}
                >
                  {DATES[i]}
                </Text>
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor: hasWorkout
                        ? isActive
                          ? "#4ADE80"
                          : "#2A2A2A"
                        : "transparent",
                    },
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Workouts Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Workouts</Text>
          <TouchableOpacity
            style={styles.calBtn}
            onPress={() => router.push("/training-cal")}
            activeOpacity={0.7}
          >
            <Text style={styles.calBtnText}>Full Calendar</Text>
            <ChevronRight color="#888" size={14} />
          </TouchableOpacity>
        </View>

        {/* Workout Cards or Rest Day */}
        {todayWorkouts.length > 0 ? (
          todayWorkouts.map((w) => (
            <WorkoutCard
              key={w.id}
              title={w.title}
              duration={w.duration}
              date={w.date}
              onPress={() => handleWorkoutPress(w.title)}
            />
          ))
        ) : (
          <TouchableOpacity
            style={styles.restDayCard}
            onPress={handleAddWorkout}
            activeOpacity={0.7}
          >
            <View style={styles.restDayLeft}>
              <Text style={styles.restEmoji}>😴</Text>
              <View>
                <Text style={styles.restTitle}>Rest Day</Text>
                <Text style={styles.restSub}>Tap to add a workout</Text>
              </View>
            </View>
            <Plus color="#444" size={20} />
          </TouchableOpacity>
        )}

        {/* My Insights */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Insights</Text>
        </View>

        <View style={styles.insightsGrid}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() =>
              Alert.alert(
                "Calories",
                `Consumed: ${caloriesConsumed} kcal\nGoal: ${caloriesGoal} kcal\nRemaining: ${caloriesGoal - caloriesConsumed} kcal`,
              )
            }
            style={{ flex: 1 }}
          >
            <InsightCard
              label="Calories"
              value={String(caloriesConsumed)}
              subValue={`${caloriesGoal - caloriesConsumed} Remaining`}
              progress={caloriesConsumed / caloriesGoal}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() =>
              Alert.alert(
                "Weight",
                `Current: ${weight} kg\nTrend: ${MOCK_INSIGHTS.weight.trend}`,
              )
            }
            style={{ flex: 1 }}
          >
            <InsightCard
              label="kg"
              value={String(weight)}
              subValue={MOCK_INSIGHTS.weight.trend}
              isPositive={MOCK_INSIGHTS.weight.isPositive}
            />
          </TouchableOpacity>
        </View>

        {/* Hydration Card */}
        <View style={styles.hydrationCard}>
          <View style={styles.hydrationTop}>
            <View>
              <Text style={styles.hydrationPct}>{hydrationPct}%</Text>
              <Text style={styles.hydrationSub}>
                {hydrationMl}ml / {hydrationGoal}ml
              </Text>
            </View>
            <Droplets
              color={hydrationPct >= 50 ? "#A1C4FD" : "#334"}
              size={34}
            />
          </View>

          <View style={styles.hydBarBg}>
            <View
              style={[
                styles.hydBarFill,
                { width: `${Math.min(hydrationPct, 100)}%` },
              ]}
            />
          </View>

          <Text style={styles.hydrationLabel}>Hydration</Text>

          <View style={styles.hydActions}>
            <TouchableOpacity
              style={styles.logBtn}
              onPress={() => setShowHydrationModal(true)}
              activeOpacity={0.8}
            >
              <Plus color="#000" size={15} />
              <Text style={styles.logBtnText}>Log Water</Text>
            </TouchableOpacity>

            {hydrationLog.length > 0 && (
              <TouchableOpacity
                style={styles.undoBtn}
                onPress={handleUndoLastLog}
                activeOpacity={0.8}
              >
                <Text style={styles.undoBtnText}>
                  ↩ Undo {hydrationLog[0]}ml
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {hydrationLog.length > 0 && (
            <View style={styles.logHistory}>
              {hydrationLog.map((ml, i) => (
                <Text key={i} style={styles.logHistoryItem}>
                  +{ml}ml logged
                </Text>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Hydration Bottom Sheet Modal */}
      <Modal
        visible={showHydrationModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowHydrationModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowHydrationModal(false)}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Log Water Intake</Text>
              <TouchableOpacity
                onPress={() => setShowHydrationModal(false)}
                activeOpacity={0.7}
              >
                <X color="#888" size={22} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSub}>
              {hydrationMl}ml logged · {hydrationGoal - hydrationMl}ml remaining
            </Text>

            <View style={styles.optionsGrid}>
              {HYDRATION_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={styles.optionBtn}
                  onPress={() => handleLogWater(opt.value)}
                  activeOpacity={0.75}
                >
                  <Droplets color="#A1C4FD" size={18} />
                  <Text style={styles.optionText}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", paddingHorizontal: 20 },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 56,
    alignItems: "center",
  },
  bellWrap: { position: "relative" },
  notifBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF4B4B",
    width: 17,
    height: 17,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#000",
  },
  notifText: { color: "#FFF", fontSize: 9, fontWeight: "bold" },
  headerRight: { alignItems: "flex-end", gap: 8 },
  weekBadge: {
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  weekLabel: { color: "#888", fontSize: 12, fontWeight: "600" },
  avatarRow: { flexDirection: "row" },

  // Date
  dateText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 18,
    marginBottom: 20,
    letterSpacing: -0.3,
  },

  // Calendar Strip
  calendarStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
    backgroundColor: "#111",
    borderRadius: 16,
    padding: 8,
  },
  dayBox: {
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 12,
    flex: 1,
  },
  activeDay: { backgroundColor: "#1A1A1A" },
  dayLabel: { color: "#555", fontSize: 10, fontWeight: "600" },
  activeDayLabel: { color: "#FFF" },
  dateNum: { color: "#666", fontSize: 15, fontWeight: "700", marginTop: 4 },
  activeDateNum: { color: "#FFF" },
  dot: { width: 5, height: 5, borderRadius: 3, marginTop: 5 },

  // Section header
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: -0.3,
  },
  calBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  calBtnText: { color: "#888", fontSize: 12, fontWeight: "600" },

  // Rest day card
  restDayCard: {
    backgroundColor: "#0D0D0D",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1E1E1E",
  },
  restDayLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
  restEmoji: { fontSize: 28 },
  restTitle: { color: "#444", fontSize: 17, fontWeight: "700" },
  restSub: { color: "#2A2A2A", fontSize: 12, marginTop: 2 },

  // Insights
  insightsGrid: { flexDirection: "row", gap: 12, marginBottom: 12 },

  // Hydration
  hydrationCard: {
    backgroundColor: "#1A1A1A",
    padding: 20,
    borderRadius: 24,
    marginTop: 4,
  },
  hydrationTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  hydrationPct: { color: "#FFF", fontSize: 32, fontWeight: "bold" },
  hydrationSub: { color: "#666", fontSize: 13, marginTop: 3 },
  hydBarBg: {
    height: 6,
    backgroundColor: "#2A2A2A",
    borderRadius: 3,
    marginTop: 14,
    overflow: "hidden",
  },
  hydBarFill: { height: "100%", backgroundColor: "#A1C4FD", borderRadius: 3 },
  hydrationLabel: {
    color: "#666",
    fontSize: 13,
    marginTop: 8,
    fontWeight: "500",
  },
  hydActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
    alignItems: "center",
  },
  logBtn: {
    backgroundColor: "#A1C4FD",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  logBtnText: { color: "#000", fontSize: 14, fontWeight: "700" },
  undoBtn: {
    backgroundColor: "#222",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  undoBtnText: { color: "#888", fontSize: 13, fontWeight: "600" },
  logHistory: { marginTop: 12, gap: 3 },
  logHistoryItem: { color: "#3A4A5A", fontSize: 11 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#111",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: 48,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#2A2A2A",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 22,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  modalTitle: { color: "#FFF", fontSize: 20, fontWeight: "700" },
  modalSub: { color: "#555", fontSize: 13, marginBottom: 22 },
  optionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  optionBtn: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    paddingVertical: 18,
    width: "30%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#252525",
    gap: 6,
  },
  optionText: { color: "#FFF", fontSize: 15, fontWeight: "700" },
});
