import {
  ChevronDown,
  ChevronUp,
  Edit2,
  Plus,
  Trash2,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────
type Meal = {
  id: string;
  name: string;
  calories: number;
  time: string;
  items: string[];
  protein: number;
  carbs: number;
  fat: number;
};

type FormState = {
  name: string;
  calories: string;
  time: string;
  protein: string;
  carbs: string;
  fat: string;
  items: string[]; // food items list
  itemInput: string; // current item being typed
};

const EMPTY_FORM: FormState = {
  name: "",
  calories: "",
  time: "",
  protein: "",
  carbs: "",
  fat: "",
  items: [],
  itemInput: "",
};

// ─── Initial data ─────────────────────────────────────────────────────────────
const INITIAL_MEALS: Meal[] = [
  {
    id: "1",
    name: "Breakfast",
    calories: 450,
    time: "08:00 AM",
    items: ["Oats", "Banana", "Whey Protein"],
    protein: 32,
    carbs: 55,
    fat: 8,
  },
  {
    id: "2",
    name: "Lunch",
    calories: 620,
    time: "01:30 PM",
    items: ["Chicken Rice", "Salad"],
    protein: 48,
    carbs: 65,
    fat: 12,
  },
];

const GOAL_CALORIES = 2000;
const GOAL_PROTEIN = 150;
const GOAL_CARBS = 200;
const GOAL_FAT = 70;

// Quick-fill time presets
const TIME_PRESETS = [
  "07:00 AM",
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "12:00 PM",
  "01:00 PM",
  "03:00 PM",
  "05:00 PM",
  "07:00 PM",
  "08:30 PM",
];

// Common food suggestions
const FOOD_SUGGESTIONS = [
  "Chicken Breast",
  "Brown Rice",
  "Oats",
  "Eggs",
  "Whey Protein",
  "Banana",
  "Apple",
  "Almonds",
  "Greek Yogurt",
  "Sweet Potato",
  "Broccoli",
  "Salmon",
  "Tuna",
  "Avocado",
  "Whole Milk",
  "White Rice",
  "Bread",
  "Pasta",
  "Cheese",
  "Beef",
];

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function NutritionScreen() {
  const [meals, setMeals] = useState<Meal[]>(INITIAL_MEALS);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // modal state
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null); // null = add mode
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [step, setStep] = useState<1 | 2>(1); // step 1 = basics, step 2 = items

  // ── totals ──
  const totalCalories = meals.reduce((s, m) => s + m.calories, 0);
  const totalProtein = meals.reduce((s, m) => s + m.protein, 0);
  const totalCarbs = meals.reduce((s, m) => s + m.carbs, 0);
  const totalFat = meals.reduce((s, m) => s + m.fat, 0);
  const kcalLeft = Math.max(GOAL_CALORIES - totalCalories, 0);
  const progressPct = Math.min((totalCalories / GOAL_CALORIES) * 100, 100);

  // ── open Add modal ──
  function openAdd() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setStep(1);
    setShowModal(true);
  }

  // ── open Edit modal ──
  function openEdit(meal: Meal) {
    setEditId(meal.id);
    setForm({
      name: meal.name,
      calories: String(meal.calories),
      time: meal.time,
      protein: String(meal.protein),
      carbs: String(meal.carbs),
      fat: String(meal.fat),
      items: [...meal.items],
      itemInput: "",
    });
    setStep(1);
    setShowModal(true);
  }

  // ── add food item to list ──
  function addItem() {
    const item = form.itemInput.trim();
    if (!item) return;
    setForm((f) => ({ ...f, items: [...f.items, item], itemInput: "" }));
  }

  function removeItem(idx: number) {
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  }

  function addSuggestion(s: string) {
    if (form.items.includes(s)) return;
    setForm((f) => ({ ...f, items: [...f.items, s] }));
  }

  // ── save meal ──
  function handleSave() {
    if (!form.name.trim()) {
      Alert.alert("Missing Name", "Please enter a meal name.");
      return;
    }
    if (!form.calories.trim()) {
      Alert.alert("Missing Calories", "Please enter calories.");
      return;
    }

    const meal: Meal = {
      id: editId ?? Date.now().toString(),
      name: form.name.trim(),
      calories: parseInt(form.calories) || 0,
      time: form.time.trim() || "12:00 PM",
      protein: parseInt(form.protein) || 0,
      carbs: parseInt(form.carbs) || 0,
      fat: parseInt(form.fat) || 0,
      items: form.items,
    };

    if (editId) {
      setMeals((prev) => prev.map((m) => (m.id === editId ? meal : m)));
    } else {
      setMeals((prev) => [...prev, meal]);
    }

    setShowModal(false);
  }

  // ── delete ──
  function handleDelete(id: string) {
    Alert.alert("Delete Meal", "Remove this meal?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => setMeals((p) => p.filter((m) => m.id !== id)),
      },
    ]);
  }

  // ── auto-calc calories from macros ──
  function autoCalc() {
    const p = parseInt(form.protein) || 0;
    const c = parseInt(form.carbs) || 0;
    const f = parseInt(form.fat) || 0;
    const calc = p * 4 + c * 4 + f * 9;
    if (calc > 0) setForm((prev) => ({ ...prev, calories: String(calc) }));
  }

  return (
    <>
      <ScrollView
        style={st.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Text style={st.title}>Nutrition</Text>

        {/* ── Macro Summary ── */}
        <View style={st.macroCard}>
          <View style={st.circleWrap}>
            <View
              style={[
                st.macroCircle,
                { borderColor: progressPct >= 100 ? "#FF4B4B" : "#4ADE80" },
              ]}
            >
              <Text style={st.circleVal}>{kcalLeft}</Text>
              <Text style={st.circleLbl}>kcal left</Text>
            </View>
          </View>
          <View style={st.macroRow}>
            <MacroBar
              label="Protein"
              val={totalProtein}
              goal={GOAL_PROTEIN}
              color="#FF9A9E"
              unit="g"
            />
            <MacroBar
              label="Carbs"
              val={totalCarbs}
              goal={GOAL_CARBS}
              color="#A1C4FD"
              unit="g"
            />
            <MacroBar
              label="Fat"
              val={totalFat}
              goal={GOAL_FAT}
              color="#FFD180"
              unit="g"
            />
          </View>
        </View>

        {/* ── Daily Progress ── */}
        <View style={st.progressCard}>
          <View style={st.progressHeader}>
            <Text style={st.progressLbl}>Daily Calories</Text>
            <Text style={st.progressVal}>
              {totalCalories} / {GOAL_CALORIES} kcal
            </Text>
          </View>
          <View style={st.progressBg}>
            <View
              style={[
                st.progressFill,
                {
                  width: `${progressPct}%`,
                  backgroundColor: progressPct >= 100 ? "#FF4B4B" : "#4ADE80",
                },
              ]}
            />
          </View>
          {progressPct >= 100 && (
            <Text style={st.overGoal}>⚠️ Daily calorie goal reached!</Text>
          )}
        </View>

        {/* ── Meals ── */}
        <Text style={st.sectionTitle}>Todays Meals</Text>

        {meals.length === 0 ? (
          <View style={st.empty}>
            <Text style={st.emptyEmoji}>🍽️</Text>
            <Text style={st.emptyTxt}>No meals logged yet</Text>
            <Text style={st.emptySub}>Tap + to add your first meal</Text>
          </View>
        ) : (
          meals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              expanded={expandedId === meal.id}
              onToggle={() =>
                setExpandedId(expandedId === meal.id ? null : meal.id)
              }
              onEdit={() => openEdit(meal)}
              onDelete={() => handleDelete(meal.id)}
            />
          ))
        )}
      </ScrollView>

      {/* ── FAB ── */}
      <TouchableOpacity style={st.fab} onPress={openAdd} activeOpacity={0.85}>
        <Plus color="#000" size={28} />
      </TouchableOpacity>

      {/* ── Add / Edit Modal ── */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <TouchableOpacity
            style={st.overlay}
            activeOpacity={1}
            onPress={() => setShowModal(false)}
          >
            <View style={st.sheet}>
              <View style={st.sheetHandle} />

              {/* sheet header */}
              <View style={st.sheetTopRow}>
                <View>
                  <Text style={st.sheetTitle}>
                    {editId ? "Edit Meal" : "Add Meal"}
                  </Text>
                  <Text style={st.sheetSub}>
                    Step {step} of 2 —{" "}
                    {step === 1 ? "Meal Details" : "Food Items"}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setShowModal(false)}
                  activeOpacity={0.7}
                >
                  <X color="#666" size={22} />
                </TouchableOpacity>
              </View>

              {/* step indicator */}
              <View style={st.stepRow}>
                <View style={[st.stepDot, step >= 1 && st.stepDotActive]} />
                <View style={[st.stepLine, step >= 2 && st.stepLineActive]} />
                <View style={[st.stepDot, step >= 2 && st.stepDotActive]} />
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {step === 1 ? (
                  /* ── STEP 1: Basic Info ── */
                  <View style={{ paddingBottom: 20 }}>
                    {/* Meal Name */}
                    <Field
                      label="Meal Name *"
                      hint="e.g. Breakfast, Lunch, Pre-Workout"
                    >
                      <TextInput
                        style={st.input}
                        value={form.name}
                        onChangeText={(v) =>
                          setForm((f) => ({ ...f, name: v }))
                        }
                        placeholder="Enter meal name"
                        placeholderTextColor="#444"
                        selectionColor="#4ADE80"
                      />
                    </Field>

                    {/* Time */}
                    <Field label="Time">
                      <TextInput
                        style={st.input}
                        value={form.time}
                        onChangeText={(v) =>
                          setForm((f) => ({ ...f, time: v }))
                        }
                        placeholder="e.g. 08:00 AM"
                        placeholderTextColor="#444"
                        selectionColor="#4ADE80"
                      />
                      {/* quick time presets */}
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ marginTop: 10 }}
                      >
                        {TIME_PRESETS.map((t) => (
                          <TouchableOpacity
                            key={t}
                            style={[
                              st.preset,
                              form.time === t && st.presetActive,
                            ]}
                            onPress={() => setForm((f) => ({ ...f, time: t }))}
                            activeOpacity={0.75}
                          >
                            <Text
                              style={[
                                st.presetTxt,
                                form.time === t && st.presetTxtActive,
                              ]}
                            >
                              {t}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </Field>

                    {/* Macros */}
                    <Text style={st.fieldLabel}>Macros</Text>
                    <View style={st.macrosGrid}>
                      <View style={{ flex: 1 }}>
                        <Text style={st.macroInputLabel}>Protein (g)</Text>
                        <TextInput
                          style={[st.input, { borderColor: "#FF9A9E33" }]}
                          value={form.protein}
                          onChangeText={(v) =>
                            setForm((f) => ({ ...f, protein: v }))
                          }
                          placeholder="0"
                          placeholderTextColor="#444"
                          keyboardType="numeric"
                          selectionColor="#FF9A9E"
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={st.macroInputLabel}>Carbs (g)</Text>
                        <TextInput
                          style={[st.input, { borderColor: "#A1C4FD33" }]}
                          value={form.carbs}
                          onChangeText={(v) =>
                            setForm((f) => ({ ...f, carbs: v }))
                          }
                          placeholder="0"
                          placeholderTextColor="#444"
                          keyboardType="numeric"
                          selectionColor="#A1C4FD"
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={st.macroInputLabel}>Fat (g)</Text>
                        <TextInput
                          style={[st.input, { borderColor: "#FFD18033" }]}
                          value={form.fat}
                          onChangeText={(v) =>
                            setForm((f) => ({ ...f, fat: v }))
                          }
                          placeholder="0"
                          placeholderTextColor="#444"
                          keyboardType="numeric"
                          selectionColor="#FFD180"
                        />
                      </View>
                    </View>

                    {/* Auto-calc helper */}
                    <TouchableOpacity
                      style={st.autoCalcBtn}
                      onPress={autoCalc}
                      activeOpacity={0.8}
                    >
                      <Text style={st.autoCalcTxt}>
                        ⚡ Auto-calculate calories from macros
                      </Text>
                    </TouchableOpacity>

                    {/* Calories */}
                    <Field
                      label="Total Calories *"
                      hint="Or auto-calculate above"
                    >
                      <TextInput
                        style={st.input}
                        value={form.calories}
                        onChangeText={(v) =>
                          setForm((f) => ({ ...f, calories: v }))
                        }
                        placeholder="e.g. 450"
                        placeholderTextColor="#444"
                        keyboardType="numeric"
                        selectionColor="#4ADE80"
                      />
                    </Field>

                    {/* Next button */}
                    <TouchableOpacity
                      style={st.nextBtn}
                      onPress={() => {
                        if (!form.name.trim()) {
                          Alert.alert("Enter meal name");
                          return;
                        }
                        setStep(2);
                      }}
                      activeOpacity={0.85}
                    >
                      <Text style={st.nextBtnTxt}>Next → Add Food Items</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  /* ── STEP 2: Food Items ── */
                  <View style={{ paddingBottom: 20 }}>
                    {/* Added items list */}
                    <Text style={st.fieldLabel}>
                      Food Items{" "}
                      {form.items.length > 0 ? `(${form.items.length})` : ""}
                    </Text>

                    {form.items.length === 0 ? (
                      <View style={st.noItems}>
                        <Text style={st.noItemsTxt}>No items added yet</Text>
                        <Text style={st.noItemsSub}>
                          Type below or tap a suggestion
                        </Text>
                      </View>
                    ) : (
                      <View style={st.itemsList}>
                        {form.items.map((item, idx) => (
                          <View key={idx} style={st.itemChip}>
                            <Text style={st.itemChipTxt}>{item}</Text>
                            <TouchableOpacity
                              onPress={() => removeItem(idx)}
                              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                              <X color="#888" size={14} />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* Type custom item */}
                    <View style={st.itemInputRow}>
                      <TextInput
                        style={[st.input, { flex: 1 }]}
                        value={form.itemInput}
                        onChangeText={(v) =>
                          setForm((f) => ({ ...f, itemInput: v }))
                        }
                        placeholder="Type food item..."
                        placeholderTextColor="#444"
                        selectionColor="#4ADE80"
                        onSubmitEditing={addItem}
                        returnKeyType="done"
                      />
                      <TouchableOpacity
                        style={st.itemAddBtn}
                        onPress={addItem}
                        activeOpacity={0.8}
                      >
                        <Plus color="#000" size={20} />
                      </TouchableOpacity>
                    </View>

                    {/* Suggestions */}
                    <Text style={st.suggestionsLabel}>Quick Add</Text>
                    <View style={st.suggestionsGrid}>
                      {FOOD_SUGGESTIONS.map((s) => {
                        const added = form.items.includes(s);
                        return (
                          <TouchableOpacity
                            key={s}
                            style={[st.suggestion, added && st.suggestionAdded]}
                            onPress={() =>
                              added
                                ? removeItem(form.items.indexOf(s))
                                : addSuggestion(s)
                            }
                            activeOpacity={0.75}
                          >
                            <Text
                              style={[
                                st.suggestionTxt,
                                added && st.suggestionTxtAdded,
                              ]}
                            >
                              {added ? "✓ " : "+ "}
                              {s}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {/* Back + Save row */}
                    <View style={st.bottomRow}>
                      <TouchableOpacity
                        style={st.backBtn}
                        onPress={() => setStep(1)}
                        activeOpacity={0.8}
                      >
                        <Text style={st.backBtnTxt}>← Back</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={st.saveBtn}
                        onPress={handleSave}
                        activeOpacity={0.85}
                      >
                        <Text style={st.saveBtnTxt}>
                          {editId ? "Save Changes" : "Add Meal ✓"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={st.field}>
      <View style={st.fieldLabelRow}>
        <Text style={st.fieldLabel}>{label}</Text>
        {hint && <Text style={st.fieldHint}>{hint}</Text>}
      </View>
      {children}
    </View>
  );
}

function MacroBar({
  label,
  val,
  goal,
  color,
  unit,
}: {
  label: string;
  val: number;
  goal: number;
  color: string;
  unit: string;
}) {
  const fill = Math.min(val / goal, 1);
  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      <Text style={{ color: "#888", fontSize: 11, marginBottom: 4 }}>
        {label}
      </Text>
      <Text style={{ color: "#FFF", fontWeight: "700", fontSize: 15 }}>
        {val}
        {unit}
      </Text>
      <Text style={{ color: "#333", fontSize: 10, marginBottom: 6 }}>
        / {goal}
        {unit}
      </Text>
      <View
        style={{
          width: "70%",
          height: 4,
          backgroundColor: "#2A2A2A",
          borderRadius: 2,
        }}
      >
        <View
          style={{
            width: `${fill * 100}%`,
            height: 4,
            backgroundColor: color,
            borderRadius: 2,
          }}
        />
      </View>
    </View>
  );
}

function MealCard({
  meal,
  expanded,
  onToggle,
  onEdit,
  onDelete,
}: {
  meal: Meal;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <View style={st.mealCard}>
      <TouchableOpacity
        style={st.mealHeader}
        onPress={onToggle}
        activeOpacity={0.8}
      >
        <View style={st.mealLeft}>
          <View style={st.mealDot} />
          <View>
            <Text style={st.mealName}>{meal.name}</Text>
            <Text style={st.mealTime}>{meal.time}</Text>
          </View>
        </View>
        <View style={st.mealRight}>
          <Text style={st.mealCals}>{meal.calories} kcal</Text>
          {expanded ? (
            <ChevronUp color="#555" size={16} />
          ) : (
            <ChevronDown color="#555" size={16} />
          )}
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={st.mealBody}>
          {/* Macro pills */}
          <View style={st.pillRow}>
            <Pill label="Protein" value={`${meal.protein}g`} color="#FF9A9E" />
            <Pill label="Carbs" value={`${meal.carbs}g`} color="#A1C4FD" />
            <Pill label="Fat" value={`${meal.fat}g`} color="#FFD180" />
          </View>

          {/* Food items */}
          {meal.items.length > 0 && (
            <View style={st.itemsSection}>
              <Text style={st.itemsSectionTitle}>Food Items</Text>
              <View style={st.expandedItemsList}>
                {meal.items.map((item, i) => (
                  <View key={i} style={st.expandedItemChip}>
                    <Text style={st.expandedItemTxt}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Actions */}
          <View style={st.mealActions}>
            <TouchableOpacity
              style={st.editBtn}
              onPress={onEdit}
              activeOpacity={0.8}
            >
              <Edit2 color="#A1C4FD" size={15} />
              <Text style={st.editBtnTxt}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={st.deleteBtn}
              onPress={onDelete}
              activeOpacity={0.8}
            >
              <Trash2 color="#FF4B4B" size={15} />
              <Text style={st.deleteBtnTxt}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

function Pill({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View style={[st.pill, { borderColor: color + "55" }]}>
      <Text style={[st.pillVal, { color }]}>{value}</Text>
      <Text style={st.pillLbl}>{label}</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", paddingHorizontal: 20 },
  title: {
    color: "#FFF",
    fontSize: 34,
    fontWeight: "bold",
    marginTop: 56,
    marginBottom: 24,
    letterSpacing: -0.5,
  },

  // macro summary card
  macroCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 24,
    padding: 22,
    alignItems: "center",
    marginBottom: 14,
  },
  circleWrap: { marginBottom: 20 },
  macroCircle: {
    width: 118,
    height: 118,
    borderRadius: 59,
    borderWidth: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  circleVal: { color: "#FFF", fontSize: 26, fontWeight: "bold" },
  circleLbl: { color: "#888", fontSize: 12, marginTop: 2 },
  macroRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },

  // progress
  progressCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  progressLbl: { color: "#888", fontSize: 13 },
  progressVal: { color: "#FFF", fontSize: 13, fontWeight: "600" },
  progressBg: {
    height: 6,
    backgroundColor: "#2A2A2A",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 3 },
  overGoal: { color: "#FF4B4B", fontSize: 12, marginTop: 8 },

  // section
  sectionTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 14,
  },

  // empty
  empty: { alignItems: "center", paddingVertical: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTxt: { color: "#555", fontSize: 17, fontWeight: "600" },
  emptySub: { color: "#333", fontSize: 13, marginTop: 6 },

  // meal card
  mealCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 18,
    marginBottom: 10,
    overflow: "hidden",
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
  },
  mealLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  mealDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4ADE80",
  },
  mealName: { color: "#FFF", fontWeight: "700", fontSize: 16 },
  mealTime: { color: "#888", fontSize: 12, marginTop: 2 },
  mealRight: { alignItems: "flex-end", gap: 4 },
  mealCals: { color: "#4ADE80", fontWeight: "600", fontSize: 14 },

  // meal body (expanded)
  mealBody: { borderTopWidth: 1, borderTopColor: "#252525", padding: 16 },
  pillRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  pill: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
  },
  pillVal: { fontWeight: "700", fontSize: 14 },
  pillLbl: { color: "#666", fontSize: 11, marginTop: 2 },

  itemsSection: { marginBottom: 14 },
  itemsSectionTitle: {
    color: "#666",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
  },
  expandedItemsList: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  expandedItemChip: {
    backgroundColor: "#252525",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  expandedItemTxt: { color: "#AAA", fontSize: 12 },

  mealActions: { flexDirection: "row", gap: 10 },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#1A2030",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  editBtnTxt: { color: "#A1C4FD", fontSize: 13, fontWeight: "600" },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#2A1A1A",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  deleteBtnTxt: { color: "#FF4B4B", fontSize: 13, fontWeight: "600" },

  // FAB
  fab: {
    position: "absolute",
    bottom: 28,
    right: 20,
    backgroundColor: "#FFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#FFF",
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },

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
    maxHeight: "90%",
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#252525",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  sheetTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  sheetTitle: { color: "#FFF", fontSize: 20, fontWeight: "700" },
  sheetSub: { color: "#555", fontSize: 13, marginTop: 3 },

  // step indicator
  stepRow: { flexDirection: "row", alignItems: "center", marginBottom: 24 },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2A2A2A",
  },
  stepDotActive: { backgroundColor: "#4ADE80" },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#2A2A2A",
    marginHorizontal: 6,
  },
  stepLineActive: { backgroundColor: "#4ADE80" },

  // form fields
  field: { marginBottom: 18 },
  fieldLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  fieldLabel: {
    color: "#888",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  fieldHint: { color: "#333", fontSize: 11 },

  input: {
    backgroundColor: "#1A1A1A",
    color: "#FFF",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#252525",
  },

  // time presets
  preset: {
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#252525",
  },
  presetActive: { backgroundColor: "#4ADE80", borderColor: "#4ADE80" },
  presetTxt: { color: "#888", fontSize: 12 },
  presetTxtActive: { color: "#000", fontWeight: "700" },

  // macros grid
  macrosGrid: { flexDirection: "row", gap: 10, marginBottom: 14 },
  macroInputLabel: {
    color: "#888",
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 6,
  },

  // auto calc
  autoCalcBtn: {
    backgroundColor: "#1A2A1A",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#4ADE8033",
  },
  autoCalcTxt: { color: "#4ADE80", fontSize: 13, fontWeight: "600" },

  // next / back / save
  nextBtn: {
    backgroundColor: "#4ADE80",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  nextBtnTxt: { color: "#000", fontSize: 16, fontWeight: "700" },
  bottomRow: { flexDirection: "row", gap: 12, marginTop: 16 },
  backBtn: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
  },
  backBtnTxt: { color: "#888", fontSize: 15, fontWeight: "600" },
  saveBtn: {
    flex: 2,
    backgroundColor: "#4ADE80",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
  },
  saveBtnTxt: { color: "#000", fontSize: 15, fontWeight: "700" },

  // food items step
  noItems: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    marginBottom: 16,
  },
  noItemsTxt: { color: "#444", fontSize: 15, fontWeight: "600" },
  noItemsSub: { color: "#2A2A2A", fontSize: 12, marginTop: 4 },

  itemsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  itemChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#1E2E1E",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#4ADE8033",
  },
  itemChipTxt: { color: "#4ADE80", fontSize: 13 },

  itemInputRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  itemAddBtn: {
    backgroundColor: "#4ADE80",
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  suggestionsLabel: {
    color: "#666",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 10,
  },
  suggestionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  suggestion: {
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#252525",
  },
  suggestionAdded: { backgroundColor: "#1E2E1E", borderColor: "#4ADE8055" },
  suggestionTxt: { color: "#666", fontSize: 12 },
  suggestionTxtAdded: { color: "#4ADE80" },
});
