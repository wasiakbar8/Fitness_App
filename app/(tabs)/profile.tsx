import {
  Check,
  ChevronRight,
  Edit3,
  Flame,
  Lock,
  LogOut,
  Settings,
  Shield,
  Target,
  Trophy,
  X
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MOCK_USER } from "../constants/MockData";

const ACHIEVEMENTS = [
  {
    icon: "🔥",
    title: "7 Day Streak",
    desc: "Worked out 7 days in a row",
    earned: true,
  },
  {
    icon: "💪",
    title: "First Workout",
    desc: "Completed your first session",
    earned: true,
  },
  {
    icon: "🏆",
    title: "10 Workouts",
    desc: "Completed 10 total workouts",
    earned: true,
  },
  {
    icon: "⚡",
    title: "Speed Demon",
    desc: "Finish a workout under 20 min",
    earned: true,
  },
  {
    icon: "🎯",
    title: "Goal Setter",
    desc: "Set your first fitness goal",
    earned: true,
  },
  {
    icon: "🌙",
    title: "Night Owl",
    desc: "Work out after 9 PM",
    earned: false,
  },
  {
    icon: "🌅",
    title: "Early Bird",
    desc: "Work out before 7 AM",
    earned: false,
  },
  {
    icon: "💯",
    title: "Perfect Week",
    desc: "Hit every workout in a week",
    earned: false,
  },
];

const WORKOUT_HISTORY = [
  { date: "Dec 22", title: "Upper Body", duration: "28 min", calories: 320 },
  { date: "Dec 20", title: "Leg Day Blitz", duration: "42 min", calories: 510 },
  { date: "Dec 18", title: "Arm Blaster", duration: "25 min", calories: 280 },
  { date: "Dec 16", title: "HIIT Cardio", duration: "22 min", calories: 390 },
  { date: "Dec 14", title: "Pull Day", duration: "35 min", calories: 340 },
  { date: "Dec 12", title: "Push Day", duration: "38 min", calories: 360 },
];

export default function ProfileScreen() {
  const [userName, setUserName] = useState(MOCK_USER.name);
  const [userGoal, setUserGoal] = useState(MOCK_USER.goal);
  const [userLevel, setUserLevel] = useState(MOCK_USER.level);
  const [streak] = useState(MOCK_USER.streak);

  // Modal visibility
  const [achievementsModal, setAchievementsModal] = useState(false);
  const [historyModal, setHistoryModal] = useState(false);
  const [privacyModal, setPrivacyModal] = useState(false);
  const [settingsModal, setSettingsModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  // Edit form
  const [editName, setEditName] = useState(userName);
  const [editGoal, setEditGoal] = useState(userGoal);

  // Settings toggles
  const [notifOn, setNotifOn] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [reminders, setReminders] = useState(true);

  function handleSaveEdit() {
    setUserName(editName);
    setUserGoal(editGoal);
    setEditModal(false);
  }

  function handleLogout() {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: () => Alert.alert("Logged Out", "See you next time! 👋"),
      },
    ]);
  }

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity
            style={styles.settingsBtn}
            activeOpacity={0.7}
            onPress={() => setSettingsModal(true)}
          >
            <Settings color="#FFF" size={22} />
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View style={styles.profileInfo}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() => setEditModal(true)}
            activeOpacity={0.8}
          >
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={styles.editBadge}>
              <Edit3 color="#000" size={12} />
            </View>
          </TouchableOpacity>
          <Text style={styles.name}>{userName}</Text>
          <Text style={styles.level}>{userLevel}</Text>
          <Text style={styles.goalLabel}>🎯 {userGoal}</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            icon={<Flame color="#FF9A9E" size={20} />}
            label="Streak"
            value={`${streak} Days`}
            color="#FF9A9E"
          />
          <StatCard
            icon={<Trophy color="#FFD180" size={20} />}
            label="Badges"
            value={`${MOCK_USER.badges}`}
            color="#FFD180"
          />
          <StatCard
            icon={<Target color="#A1C4FD" size={20} />}
            label="Workouts"
            value={`${WORKOUT_HISTORY.length}`}
            color="#A1C4FD"
          />
        </View>

        {/* Weekly Progress */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Weekly Progress</Text>
          <View style={styles.bars}>
            {[0.9, 0.6, 0.8, 0.4, 0.7, 0.3, 0].map((h, i) => (
              <View key={i} style={styles.barWrap}>
                <View style={styles.barBg}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${h * 100}%`,
                        backgroundColor: h > 0.7 ? "#4ADE80" : "#2C2C2C",
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>
                  {["M", "T", "W", "T", "F", "S", "S"][i]}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menu}>
          <MenuItem
            icon={<Trophy color="#FFD180" size={20} />}
            label="My Achievements"
            onPress={() => setAchievementsModal(true)}
          />
          <MenuItem
            icon={<Flame color="#FF9A9E" size={20} />}
            label="Workout History"
            onPress={() => setHistoryModal(true)}
          />
          <MenuItem
            icon={<Shield color="#A1C4FD" size={20} />}
            label="Privacy & Security"
            onPress={() => setPrivacyModal(true)}
          />
          <MenuItem
            icon={<LogOut color="#FF4B4B" size={20} />}
            label="Logout"
            color="#FF4B4B"
            last
            onPress={handleLogout}
          />
        </View>
      </ScrollView>

      {/* ─── Achievements Modal ─── */}
      <BottomSheet
        visible={achievementsModal}
        onClose={() => setAchievementsModal(false)}
        title="My Achievements"
      >
        <Text style={styles.sheetSub}>
          {ACHIEVEMENTS.filter((a) => a.earned).length} / {ACHIEVEMENTS.length}{" "}
          earned
        </Text>
        {ACHIEVEMENTS.map((a, i) => (
          <View
            key={i}
            style={[styles.achieveRow, !a.earned && styles.achieveRowLocked]}
          >
            <Text style={styles.achieveIcon}>{a.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text
                style={[styles.achieveTitle, !a.earned && { color: "#444" }]}
              >
                {a.title}
              </Text>
              <Text style={styles.achieveDesc}>{a.desc}</Text>
            </View>
            {a.earned ? (
              <View style={styles.earnedBadge}>
                <Check color="#000" size={14} />
              </View>
            ) : (
              <Lock color="#333" size={16} />
            )}
          </View>
        ))}
      </BottomSheet>

      {/* ─── Workout History Modal ─── */}
      <BottomSheet
        visible={historyModal}
        onClose={() => setHistoryModal(false)}
        title="Workout History"
      >
        <Text style={styles.sheetSub}>
          {WORKOUT_HISTORY.length} sessions this month
        </Text>
        {WORKOUT_HISTORY.map((w, i) => (
          <View key={i} style={styles.historyRow}>
            <View style={styles.historyLeft}>
              <View style={styles.historyDot} />
              <View>
                <Text style={styles.historyTitle}>{w.title}</Text>
                <Text style={styles.historyMeta}>
                  {w.date} · {w.duration}
                </Text>
              </View>
            </View>
            <Text style={styles.historyCals}>{w.calories} kcal</Text>
          </View>
        ))}
      </BottomSheet>

      {/* ─── Privacy Modal ─── */}
      <BottomSheet
        visible={privacyModal}
        onClose={() => setPrivacyModal(false)}
        title="Privacy & Security"
      >
        <PrivacyRow
          icon={<Lock color="#A1C4FD" size={18} />}
          label="Change Password"
          onPress={() =>
            Alert.alert(
              "Change Password",
              "A reset link will be sent to your email.",
            )
          }
        />
        <PrivacyRow
          icon={<Shield color="#4ADE80" size={18} />}
          label="Two-Factor Auth"
          onPress={() =>
            Alert.alert(
              "2FA",
              "Two-factor authentication is currently OFF.\nTap to enable.",
            )
          }
        />
        <PrivacyRow
          icon={<Shield color="#FFD180" size={18} />}
          label="Data & Privacy"
          onPress={() =>
            Alert.alert(
              "Data & Privacy",
              "Your data is encrypted and never sold to third parties.",
            )
          }
        />
        <PrivacyRow
          icon={<LogOut color="#FF4B4B" size={18} />}
          label="Delete Account"
          color="#FF4B4B"
          onPress={() =>
            Alert.alert(
              "Delete Account",
              "This action is irreversible. Contact support to proceed.",
              [{ text: "Cancel" }, { text: "Contact Support" }],
            )
          }
        />
      </BottomSheet>

      {/* ─── Settings Modal ─── */}
      <BottomSheet
        visible={settingsModal}
        onClose={() => setSettingsModal(false)}
        title="Settings"
      >
        <ToggleRow
          label="Push Notifications"
          value={notifOn}
          onToggle={() => setNotifOn(!notifOn)}
        />
        <ToggleRow
          label="Dark Mode"
          value={darkMode}
          onToggle={() => setDarkMode(!darkMode)}
        />
        <ToggleRow
          label="Workout Reminders"
          value={reminders}
          onToggle={() => setReminders(!reminders)}
        />
        <View style={{ marginTop: 16 }}>
          <PrivacyRow
            icon={<Edit3 color="#A1C4FD" size={18} />}
            label="Edit Profile"
            onPress={() => {
              setSettingsModal(false);
              setTimeout(() => setEditModal(true), 300);
            }}
          />
        </View>
      </BottomSheet>

      {/* ─── Edit Profile Modal ─── */}
      <BottomSheet
        visible={editModal}
        onClose={() => setEditModal(false)}
        title="Edit Profile"
      >
        <View style={styles.inputWrap}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={editName}
            onChangeText={setEditName}
            placeholderTextColor="#444"
            selectionColor="#4ADE80"
          />
        </View>
        <View style={styles.inputWrap}>
          <Text style={styles.inputLabel}>Fitness Goal</Text>
          <TextInput
            style={styles.input}
            value={editGoal}
            onChangeText={setEditGoal}
            placeholderTextColor="#444"
            selectionColor="#4ADE80"
          />
        </View>
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSaveEdit}
          activeOpacity={0.85}
        >
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
      </BottomSheet>
    </>
  );
}

// ─── Sub-components ───

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View style={styles.statCard}>
      {icon}
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function MenuItem({
  icon,
  label,
  color = "#FFF",
  last = false,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  color?: string;
  last?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.menuItem, last && { borderBottomWidth: 0 }]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.menuLeft}>
        {icon}
        <Text style={[styles.menuText, { color }]}>{label}</Text>
      </View>
      <ChevronRight color="#333" size={18} />
    </TouchableOpacity>
  );
}

function BottomSheet({
  visible,
  onClose,
  title,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <X color="#888" size={22} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

function PrivacyRow({
  icon,
  label,
  color = "#FFF",
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  color?: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.privacyRow}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.privacyLeft}>
        {icon}
        <Text style={[styles.privacyLabel, { color }]}>{label}</Text>
      </View>
      <ChevronRight color="#333" size={16} />
    </TouchableOpacity>
  );
}

function ToggleRow({
  label,
  value,
  onToggle,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <TouchableOpacity
        style={[styles.toggle, value && styles.toggleOn]}
        onPress={onToggle}
        activeOpacity={0.8}
      >
        <View style={[styles.toggleKnob, value && styles.toggleKnobOn]} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 56,
    alignItems: "center",
    marginBottom: 28,
  },
  title: {
    color: "#FFF",
    fontSize: 34,
    fontWeight: "bold",
    letterSpacing: -0.5,
  },
  settingsBtn: { backgroundColor: "#1A1A1A", padding: 10, borderRadius: 12 },

  // Profile
  profileInfo: { alignItems: "center", marginBottom: 24 },
  avatarContainer: { position: "relative", marginBottom: 14 },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#222",
    borderWidth: 2,
    borderColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#FFF", fontSize: 28, fontWeight: "bold" },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4ADE80",
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#000",
  },
  name: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: -0.3,
  },
  level: { color: "#4ADE80", fontSize: 14, marginTop: 4, fontWeight: "600" },
  goalLabel: { color: "#666", fontSize: 13, marginTop: 6 },

  // Stats
  statsGrid: { flexDirection: "row", gap: 10, marginBottom: 14 },
  statCard: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    padding: 14,
    borderRadius: 20,
    alignItems: "center",
    gap: 6,
    minHeight: 90,
    justifyContent: "center",
  },
  statValue: { fontWeight: "bold", fontSize: 14, textAlign: "center" },
  statLabel: { color: "#666", fontSize: 11 },

  // Progress bars
  progressCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 24,
    padding: 20,
    marginBottom: 14,
  },
  progressTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
  },
  bars: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 70,
  },
  barWrap: { alignItems: "center", flex: 1 },
  barBg: {
    width: 24,
    height: 60,
    backgroundColor: "#111",
    borderRadius: 6,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: { width: "100%", borderRadius: 6 },
  barLabel: { color: "#555", fontSize: 10, marginTop: 6 },

  // Menu
  menu: {
    backgroundColor: "#1A1A1A",
    borderRadius: 24,
    padding: 6,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  menuLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
  menuText: { fontSize: 16, fontWeight: "500" },

  // Modal
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
    maxHeight: "80%",
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
    marginBottom: 6,
  },
  sheetTitle: { color: "#FFF", fontSize: 20, fontWeight: "700" },
  sheetSub: { color: "#555", fontSize: 13, marginBottom: 20 },

  // Achievements
  achieveRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  achieveRowLocked: { opacity: 0.4 },
  achieveIcon: { fontSize: 28 },
  achieveTitle: { color: "#FFF", fontWeight: "700", fontSize: 14 },
  achieveDesc: { color: "#666", fontSize: 12, marginTop: 2 },
  earnedBadge: {
    backgroundColor: "#4ADE80",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  // History
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  historyLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  historyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4ADE80",
  },
  historyTitle: { color: "#FFF", fontWeight: "600", fontSize: 14 },
  historyMeta: { color: "#666", fontSize: 12, marginTop: 2 },
  historyCals: { color: "#4ADE80", fontSize: 13, fontWeight: "600" },

  // Privacy rows
  privacyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  privacyLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  privacyLabel: { fontSize: 15, fontWeight: "500" },

  // Toggle
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  toggleLabel: { color: "#FFF", fontSize: 15, fontWeight: "500" },
  toggle: {
    width: 48,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#333",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  toggleOn: { backgroundColor: "#4ADE80" },
  toggleKnob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFF",
  },
  toggleKnobOn: { alignSelf: "flex-end" },

  // Edit form
  inputWrap: { marginBottom: 16 },
  inputLabel: {
    color: "#888",
    fontSize: 12,
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#1A1A1A",
    color: "#FFF",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#252525",
  },
  saveBtn: {
    backgroundColor: "#4ADE80",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  saveBtnText: { color: "#000", fontSize: 16, fontWeight: "700" },
});
