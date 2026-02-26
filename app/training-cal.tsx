import { useRouter } from "expo-router";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  X,
} from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────
type WorkoutEntry = {
  title: string;
  time: string;
};

// key = "YYYY-MM-DD", value = workout or null (rest day)
type Schedule = Record<string, WorkoutEntry | null>;

// ─── Constants ────────────────────────────────────────────────────────────────
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const WORKOUT_TEMPLATES = [
  { title: "Upper Body", time: "25m - 30m" },
  { title: "Lower Body", time: "30m - 40m" },
  { title: "Push Day", time: "35m - 45m" },
  { title: "Pull Day", time: "30m - 40m" },
  { title: "Leg Day Blitz", time: "40m - 45m" },
  { title: "HIIT Cardio", time: "20m - 25m" },
  { title: "Arm Blaster", time: "25m - 30m" },
  { title: "Full Body Yoga", time: "20m" },
  { title: "Core & Abs", time: "15m - 20m" },
];

// Pre-seeded workouts for Dec 2024
const INITIAL_SCHEDULE: Schedule = {
  "2024-12-08": { title: "Arm Blaster", time: "25m - 30m" },
  "2024-12-11": { title: "Leg Day Blitz", time: "25m - 30m" },
  "2024-12-13": { title: "Full Body Yoga", time: "20m" },
  "2024-12-15": { title: "Push Day", time: "35m - 45m" },
  "2024-12-17": { title: "Pull Day", time: "30m - 40m" },
  "2024-12-19": { title: "HIIT Cardio", time: "20m - 25m" },
  "2024-12-22": { title: "Upper Body", time: "25m - 30m" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function toKey(year: number, month: number, date: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
}

function buildCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const startOffset = (firstDay + 6) % 7; // Mon-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const cells: { date: number; currentMonth: boolean }[] = [];

  for (let i = startOffset - 1; i >= 0; i--)
    cells.push({ date: daysInPrev - i, currentMonth: false });

  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ date: d, currentMonth: true });

  const rem = cells.length % 7;
  if (rem !== 0)
    for (let d = 1; d <= 7 - rem; d++)
      cells.push({ date: d, currentMonth: false });

  return cells;
}

/** All days in a given month that are in the schedule */
function getDaysInMonth(
  schedule: Schedule,
  year: number,
  month: number,
): number[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const result: number[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const key = toKey(year, month, d);
    if (schedule[key]) result.push(d);
  }
  return result;
}

/** Returns array of {date, dayName, key, workout} for a whole month (only days 1–end) */
function getMonthScheduleRows(schedule: Schedule, year: number, month: number) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const rows = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const key = toKey(year, month, d);
    const dow = new Date(year, month, d).getDay(); // 0=Sun
    const dayName = DAY_SHORT[dow];
    rows.push({ date: d, dayName, key, workout: schedule[key] ?? null });
  }
  return rows;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TrainingCalendar() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  const today = new Date();
  const [calYear, setCalYear] = useState(2024);
  const [calMonth, setCalMonth] = useState(11); // Dec 2024

  const [schedule, setSchedule] = useState<Schedule>(INITIAL_SCHEDULE);
  const [selectedDate, setSelectedDate] = useState<number>(22);

  // modal
  const [addModal, setAddModal] = useState(false);
  const [pendingKey, setPendingKey] = useState<string>("");

  // ── derived ──
  const cells = buildCalendarDays(calYear, calMonth);
  const workoutDays = new Set(getDaysInMonth(schedule, calYear, calMonth));
  const monthRows = getMonthScheduleRows(schedule, calYear, calMonth);
  const selectedKey = toKey(calYear, calMonth, selectedDate);
  const selectedWorkout = schedule[selectedKey] ?? null;
  const totalWorkouts = Object.keys(schedule).filter((k) => schedule[k]).length;

  // ── calendar navigation ──
  function prevMonth() {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else setCalMonth((m) => m - 1);
    setSelectedDate(1);
  }
  function nextMonth() {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else setCalMonth((m) => m + 1);
    setSelectedDate(1);
  }

  // ── tap a date on the calendar ──
  function handleDatePress(date: number) {
    setSelectedDate(date);
    // scroll the list to show this date
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: 500, animated: true });
    }, 100);
  }

  // ── open add modal for a specific date ──
  function openAddModal(key: string) {
    setPendingKey(key);
    setAddModal(true);
  }

  // ── select a template ──
  function handleSelectTemplate(t: WorkoutEntry) {
    setSchedule((prev) => ({ ...prev, [pendingKey]: t }));
    setAddModal(false);
  }

  // ── delete a workout ──
  function handleDelete(key: string) {
    Alert.alert("Remove Workout", "Remove this workout from your schedule?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          setSchedule((prev) => {
            const next = { ...prev };
            delete next[key];
            return next;
          });
        },
      },
    ]);
  }

  // ── start workout ──
  function handleStartWorkout(title: string) {
    Alert.alert(title, "Ready to start?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Start 💪",
        onPress: () => Alert.alert("Started!", `${title} in progress!`),
      },
    ]);
  }

  // ── save ──
  function handleSave() {
    Alert.alert("✅ Saved!", `${totalWorkouts} workouts scheduled.`);
  }

  return (
    <>
      <View style={s.root}>
        {/* ── Header ── */}
        <View style={s.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={s.backBtn}
            activeOpacity={0.7}
          >
            <ChevronLeft color="#FFF" size={24} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Training Calendar</Text>
          <TouchableOpacity
            onPress={handleSave}
            style={s.saveBtn}
            activeOpacity={0.8}
          >
            <Text style={s.saveTxt}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
        >
          {/* ── Stats row ── */}
          <View style={s.statsRow}>
            <View style={s.statBadge}>
              <Text style={s.statVal}>{totalWorkouts}</Text>
              <Text style={s.statLbl}>Workouts</Text>
            </View>
            <View style={s.statBadge}>
              <Text style={s.statVal}>{totalWorkouts * 30}m</Text>
              <Text style={s.statLbl}>Est. Time</Text>
            </View>
            <View style={s.statBadge}>
              <Text style={s.statVal}>Week 2/8</Text>
              <Text style={s.statLbl}>Program</Text>
            </View>
          </View>

          {/* ── Calendar Card ── */}
          <View style={s.calCard}>
            {/* month nav */}
            <View style={s.monthNav}>
              <TouchableOpacity
                onPress={prevMonth}
                style={s.navBtn}
                activeOpacity={0.7}
              >
                <ChevronLeft color="#FFF" size={18} />
              </TouchableOpacity>
              <Text style={s.monthTitle}>
                {MONTH_NAMES[calMonth]} {calYear}
              </Text>
              <TouchableOpacity
                onPress={nextMonth}
                style={s.navBtn}
                activeOpacity={0.7}
              >
                <ChevronRight color="#FFF" size={18} />
              </TouchableOpacity>
            </View>

            {/* day labels */}
            <View style={s.dayHeaderRow}>
              {DAY_LABELS.map((d) => (
                <Text key={d} style={s.dayHeaderTxt}>
                  {d}
                </Text>
              ))}
            </View>

            {/* grid */}
            <View style={s.grid}>
              {cells.map((cell, idx) => {
                const isSelected =
                  cell.currentMonth && cell.date === selectedDate;
                const hasWorkout =
                  cell.currentMonth && workoutDays.has(cell.date);
                const isToday =
                  cell.currentMonth &&
                  cell.date === today.getDate() &&
                  calMonth === today.getMonth() &&
                  calYear === today.getFullYear();

                return (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      s.cell,
                      isSelected && s.cellSelected,
                      !isSelected && isToday && s.cellToday,
                    ]}
                    onPress={() =>
                      cell.currentMonth && handleDatePress(cell.date)
                    }
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        s.cellTxt,
                        !cell.currentMonth && s.cellFaded,
                        isSelected && s.cellTxtSel,
                        !isSelected && isToday && s.cellTxtToday,
                      ]}
                    >
                      {cell.date}
                    </Text>
                    {hasWorkout && !isSelected && <View style={s.dot} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ── Selected Day Detail ── */}
          <View style={s.selectedCard}>
            <View style={s.selectedHeader}>
              <Text style={s.selectedTitle}>
                {DAY_SHORT[new Date(calYear, calMonth, selectedDate).getDay()]},{" "}
                {MONTH_NAMES[calMonth].slice(0, 3)} {selectedDate}
              </Text>
              {!selectedWorkout && (
                <TouchableOpacity
                  style={s.addDayBtn}
                  onPress={() => openAddModal(selectedKey)}
                  activeOpacity={0.8}
                >
                  <Plus color="#000" size={16} />
                  <Text style={s.addDayTxt}>Add Workout</Text>
                </TouchableOpacity>
              )}
            </View>

            {selectedWorkout ? (
              <View style={s.selectedWorkout}>
                <View style={s.selectedWorkoutLeft}>
                  <View style={s.greenBar} />
                  <View>
                    <Text style={s.selectedWorkoutTitle}>
                      {selectedWorkout.title}
                    </Text>
                    <Text style={s.selectedWorkoutTime}>
                      {selectedWorkout.time}
                    </Text>
                  </View>
                </View>
                <View style={s.selectedActions}>
                  <TouchableOpacity
                    style={s.startBtn}
                    onPress={() => handleStartWorkout(selectedWorkout.title)}
                    activeOpacity={0.8}
                  >
                    <Text style={s.startBtnTxt}>Start</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={s.deleteBtn}
                    onPress={() => handleDelete(selectedKey)}
                    activeOpacity={0.8}
                  >
                    <Trash2 color="#FF4B4B" size={16} />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={s.restDayBox}>
                <Text style={s.restDayEmoji}>😴</Text>
                <Text style={s.restDayTxt}>Rest Day</Text>
                <Text style={s.restDaySub}>
                  Tap "Add Workout" to schedule one
                </Text>
              </View>
            )}
          </View>

          {/* ── Full Month Schedule List ── */}
          <View style={s.scheduleSection}>
            <Text style={s.scheduleSectionTitle}>
              {MONTH_NAMES[calMonth]} Schedule
            </Text>

            {monthRows.filter((r) => r.workout).length === 0 ? (
              <View style={s.emptySchedule}>
                <Text style={s.emptyTxt}>No workouts scheduled this month</Text>
                <Text style={s.emptySub}>
                  Tap any date on the calendar to add one
                </Text>
              </View>
            ) : (
              monthRows
                .filter((r) => r.workout)
                .map((r) => (
                  <TouchableOpacity
                    key={r.key}
                    style={[
                      s.scheduleRow,
                      r.date === selectedDate && s.scheduleRowActive,
                    ]}
                    onPress={() => handleDatePress(r.date)}
                    activeOpacity={0.8}
                  >
                    {/* day column */}
                    <View style={s.scheduleDayCol}>
                      <Text style={s.scheduleDayName}>{r.dayName}</Text>
                      <Text style={s.scheduleDayNum}>{r.date}</Text>
                    </View>

                    {/* workout card */}
                    <View
                      style={[
                        s.scheduleTask,
                        r.date === selectedDate && s.scheduleTaskActive,
                      ]}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={s.scheduleTaskTitle}>
                          {r.workout!.title}
                        </Text>
                        <Text style={s.scheduleTaskTime}>
                          {r.workout!.time}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleDelete(r.key)}
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                        activeOpacity={0.7}
                      >
                        <Trash2 color="#333" size={15} />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))
            )}

            {/* show rest days too so user can add */}
            {monthRows
              .filter((r) => !r.workout)
              .map((r) => (
                <TouchableOpacity
                  key={r.key}
                  style={[
                    s.scheduleRow,
                    r.date === selectedDate && s.scheduleRowActive,
                  ]}
                  onPress={() => {
                    handleDatePress(r.date);
                    openAddModal(r.key);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={s.scheduleDayCol}>
                    <Text style={s.scheduleDayName}>{r.dayName}</Text>
                    <Text style={[s.scheduleDayNum, { color: "#333" }]}>
                      {r.date}
                    </Text>
                  </View>
                  <View style={s.scheduleTaskRest}>
                    <Text style={s.scheduleRestTxt}>Rest Day</Text>
                    <Plus color="#222" size={16} />
                  </View>
                </TouchableOpacity>
              ))}
          </View>
        </ScrollView>
      </View>

      {/* ── Add Workout Modal ── */}
      <Modal
        visible={addModal}
        transparent
        animationType="slide"
        onRequestClose={() => setAddModal(false)}
      >
        <TouchableOpacity
          style={s.overlay}
          activeOpacity={1}
          onPress={() => setAddModal(false)}
        >
          <View style={s.sheet}>
            <View style={s.sheetHandle} />
            <View style={s.sheetHeaderRow}>
              <View>
                <Text style={s.sheetTitle}>Add Workout</Text>
                <Text style={s.sheetSub}>
                  {pendingKey
                    ? (() => {
                        const [y, m, d] = pendingKey.split("-").map(Number);
                        return `${MONTH_NAMES[m - 1]} ${d}, ${y}`;
                      })()
                    : ""}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setAddModal(false)}
                activeOpacity={0.7}
              >
                <X color="#555" size={22} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {WORKOUT_TEMPLATES.map((t, i) => (
                <TouchableOpacity
                  key={i}
                  style={s.templateRow}
                  onPress={() => handleSelectTemplate(t)}
                  activeOpacity={0.75}
                >
                  <View>
                    <Text style={s.templateTitle}>{t.title}</Text>
                    <Text style={s.templateTime}>{t.time}</Text>
                  </View>
                  <View style={s.templateAdd}>
                    <Plus color="#000" size={16} />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },

  // header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 58,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#111",
  },
  backBtn: { backgroundColor: "#1A1A1A", padding: 8, borderRadius: 10 },
  headerTitle: { color: "#FFF", fontSize: 18, fontWeight: "700" },
  saveBtn: {
    backgroundColor: "#4ADE80",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 12,
  },
  saveTxt: { color: "#000", fontSize: 14, fontWeight: "700" },

  // stats
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#111",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 18,
    paddingVertical: 16,
  },
  statBadge: { alignItems: "center" },
  statVal: { color: "#FFF", fontSize: 17, fontWeight: "700" },
  statLbl: { color: "#555", fontSize: 11, marginTop: 3 },

  // calendar card
  calCard: {
    backgroundColor: "#111",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  monthNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  navBtn: { backgroundColor: "#1A1A1A", padding: 6, borderRadius: 8 },
  monthTitle: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  dayHeaderRow: { flexDirection: "row", marginBottom: 8 },
  dayHeaderTxt: {
    flex: 1,
    textAlign: "center",
    color: "#444",
    fontSize: 10,
    fontWeight: "700",
  },
  grid: { flexDirection: "row", flexWrap: "wrap" },

  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },
  cellSelected: { backgroundColor: "#4ADE80" },
  cellToday: { borderWidth: 1.5, borderColor: "#4ADE80" },
  cellTxt: { color: "#CCC", fontSize: 13, fontWeight: "500" },
  cellFaded: { color: "#2A2A2A" },
  cellTxtSel: { color: "#000", fontWeight: "800" },
  cellTxtToday: { color: "#4ADE80", fontWeight: "700" },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#4ADE80",
    position: "absolute",
    bottom: 3,
  },

  // selected day card
  selectedCard: {
    backgroundColor: "#111",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },
  selectedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  selectedTitle: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  addDayBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#4ADE80",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addDayTxt: { color: "#000", fontSize: 13, fontWeight: "700" },

  selectedWorkout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    padding: 16,
  },
  selectedWorkoutLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  greenBar: {
    width: 4,
    height: 40,
    backgroundColor: "#4ADE80",
    borderRadius: 2,
  },
  selectedWorkoutTitle: { color: "#FFF", fontWeight: "700", fontSize: 15 },
  selectedWorkoutTime: { color: "#4ADE80", fontSize: 12, marginTop: 3 },
  selectedActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  startBtn: {
    backgroundColor: "#4ADE80",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  startBtnTxt: { color: "#000", fontWeight: "700", fontSize: 13 },
  deleteBtn: {
    backgroundColor: "#2A1A1A",
    padding: 8,
    borderRadius: 10,
  },

  restDayBox: { alignItems: "center", paddingVertical: 20 },
  restDayEmoji: { fontSize: 36, marginBottom: 8 },
  restDayTxt: { color: "#444", fontSize: 16, fontWeight: "600" },
  restDaySub: { color: "#2A2A2A", fontSize: 12, marginTop: 4 },

  // schedule list
  scheduleSection: { paddingHorizontal: 20 },
  scheduleSectionTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  emptySchedule: { alignItems: "center", paddingVertical: 30 },
  emptyTxt: { color: "#444", fontSize: 15, fontWeight: "600" },
  emptySub: { color: "#2A2A2A", fontSize: 12, marginTop: 6 },

  scheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  scheduleRowActive: {},
  scheduleDayCol: { width: 50, alignItems: "center" },
  scheduleDayName: { color: "#555", fontSize: 11, fontWeight: "600" },
  scheduleDayNum: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 2,
  },

  scheduleTask: {
    flex: 1,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#1A1A1A",
    borderLeftWidth: 3,
    borderLeftColor: "#2A2A2A",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginLeft: 10,
  },
  scheduleTaskActive: {
    borderLeftColor: "#4ADE80",
    backgroundColor: "#1A2A1A",
  },
  scheduleTaskTitle: { color: "#FFF", fontWeight: "700", fontSize: 14 },
  scheduleTaskTime: { color: "#4ADE80", fontSize: 12, marginTop: 3 },

  scheduleTaskRest: {
    flex: 1,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#0A0A0A",
    borderWidth: 1,
    borderColor: "#1A1A1A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginLeft: 10,
  },
  scheduleRestTxt: { color: "#222", fontSize: 13 },

  // modal
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
    paddingBottom: 50,
    maxHeight: "72%",
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#2A2A2A",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  sheetHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  sheetTitle: { color: "#FFF", fontSize: 20, fontWeight: "700" },
  sheetSub: { color: "#555", fontSize: 13, marginTop: 4 },

  templateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  templateTitle: { color: "#FFF", fontSize: 15, fontWeight: "600" },
  templateTime: { color: "#4ADE80", fontSize: 12, marginTop: 3 },
  templateAdd: {
    backgroundColor: "#4ADE80",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});
