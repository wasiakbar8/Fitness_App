export const MOCK_USER = {
  name: "Ali Haider",
  level: "Elite Athlete",
  avatar: null,
  streak: 12,
  badges: 8,
  goal: "Lose Weight",
};

export const MOCK_WORKOUTS = [
  {
    id: "1",
    title: "Upper Body",
    duration: "25m - 30m",
    date: "December 22",
    calories: 320,
    type: "Strength",
  },
  {
    id: "2",
    title: "Leg Day Blitz",
    duration: "40m - 45m",
    date: "December 24",
    calories: 510,
    type: "Hypertrophy",
  },
  {
    id: "3",
    title: "Arm Blaster",
    duration: "25m - 30m",
    date: "December 8",
    calories: 280,
    type: "Strength",
  },
];

export const MOCK_INSIGHTS = {
  calories: {
    consumed: 550,
    goal: 2000,
    label: "Calories",
  },
  weight: {
    current: 75,
    unit: "kg",
    trend: "+1.6kg",
    isPositive: true,
  },
  hydration: {
    percentage: 0,
    unit: "ml",
    added: 500,
  },
};

export const MOCK_MOODS = [
  { id: "1", label: "Calm", emoji: "😌", color: "#A1C4FD" },
  { id: "2", label: "Peaceful", emoji: "😇", color: "#C2E9FB" },
  { id: "3", label: "Happy", emoji: "😊", color: "#FFD180" },
  { id: "4", label: "Content", emoji: "😄", color: "#FAD0C4" },
  { id: "5", label: "Energetic", emoji: "🤩", color: "#FF9A9E" },
];

export const MOCK_CALENDAR_SCHEDULE = [
  {
    day: "Mon",
    date: 8,
    title: "Arm Blaster",
    time: "25m - 30m",
    active: true,
  },
  { day: "Tue", date: 9, title: "", time: "", active: false },
  { day: "Wed", date: 10, title: "", time: "", active: false },
  {
    day: "Thu",
    date: 11,
    title: "Leg Day Blitz",
    time: "25m - 30m",
    active: true,
  },
  { day: "Fri", date: 12, title: "", time: "", active: false },
  {
    day: "Sat",
    date: 13,
    title: "Full Body Yoga",
    time: "20m",
    active: true,
  },
  { day: "Sun", date: 14, title: "", time: "", active: false },
];

export const MOCK_NUTRITION = {
  meals: [
    {
      id: "1",
      name: "Breakfast",
      calories: "450 kcal",
      time: "08:00 AM",
      items: ["Oats", "Banana", "Whey Protein"],
    },
    {
      id: "2",
      name: "Lunch",
      calories: "620 kcal",
      time: "01:30 PM",
      items: ["Chicken Rice", "Salad"],
    },
    {
      id: "3",
      name: "Snack",
      calories: "180 kcal",
      time: "04:00 PM",
      items: ["Almonds", "Apple"],
    },
  ],
  macros: {
    protein: { current: 80, goal: 150 },
    carbs: { current: 120, goal: 200 },
    fat: { current: 45, goal: 70 },
  },
  kcalLeft: 1250,
  goal: 2000,
};
