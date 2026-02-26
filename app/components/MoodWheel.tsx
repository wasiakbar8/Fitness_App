import React, { useCallback, useRef, useState } from "react";
import { PanResponder, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";

interface MoodWheelProps {
  onMoodChange: (mood: string) => void;
}

const MOODS = [
  { label: "Calm", emoji: "😌", color: "#A1C4FD", angle: 0 },
  { label: "Peaceful", emoji: "😇", color: "#C2E9FB", angle: 72 },
  { label: "Happy", emoji: "😊", color: "#FFD180", angle: 144 },
  { label: "Content", emoji: "😄", color: "#FAD0C4", angle: 216 },
  { label: "Energetic", emoji: "🤩", color: "#FF9A9E", angle: 288 },
];

const SIZE = 280;
const CENTER = SIZE / 2;
const RADIUS = 110;
const HANDLE_RADIUS = 12;

function getHandlePosition(angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CENTER + RADIUS * Math.cos(rad),
    y: CENTER + RADIUS * Math.sin(rad),
  };
}

function angleFromPosition(x: number, y: number) {
  const dx = x - CENTER;
  const dy = y - CENTER;
  let angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
  if (angle < 0) angle += 360;
  return angle;
}

function getNearestMood(angle: number) {
  let minDist = Infinity;
  let nearest = MOODS[0];
  for (const mood of MOODS) {
    let dist = Math.abs(mood.angle - angle);
    if (dist > 180) dist = 360 - dist;
    if (dist < minDist) {
      minDist = dist;
      nearest = mood;
    }
  }
  return nearest;
}

export default function MoodWheel({ onMoodChange }: MoodWheelProps) {
  const [angle, setAngle] = useState(216); // Default: Content
  const containerRef = useRef<View>(null);
  const layoutRef = useRef({ x: 0, y: 0 });

  const currentMood = getNearestMood(angle);
  const handle = getHandlePosition(angle);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { pageX, pageY } = evt.nativeEvent;
        const localX = pageX - layoutRef.current.x;
        const localY = pageY - layoutRef.current.y;
        const newAngle = angleFromPosition(localX, localY);
        setAngle(newAngle);
        onMoodChange(getNearestMood(newAngle).label);
      },
      onPanResponderMove: (evt) => {
        const { pageX, pageY } = evt.nativeEvent;
        const localX = pageX - layoutRef.current.x;
        const localY = pageY - layoutRef.current.y;
        const newAngle = angleFromPosition(localX, localY);
        setAngle(newAngle);
        onMoodChange(getNearestMood(newAngle).label);
      },
    }),
  ).current;

  const onLayout = useCallback(() => {
    containerRef.current?.measure((_x, _y, _w, _h, pageX, pageY) => {
      layoutRef.current = { x: pageX, y: pageY };
    });
  }, []);

  return (
    <View
      ref={containerRef}
      style={styles.container}
      onLayout={onLayout}
      {...panResponder.panHandlers}
    >
      <Svg height={SIZE} width={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <Defs>
          <LinearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#FF9A9E" />
            <Stop offset="25%" stopColor="#FAD0C4" />
            <Stop offset="50%" stopColor="#FFD180" />
            <Stop offset="75%" stopColor="#A1C4FD" />
            <Stop offset="100%" stopColor="#C2E9FB" />
          </LinearGradient>
          <LinearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#C2E9FB" />
            <Stop offset="50%" stopColor="#A1C4FD" />
            <Stop offset="100%" stopColor="#FF9A9E" />
          </LinearGradient>
        </Defs>
        {/* Outer gradient ring */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          stroke="url(#grad1)"
          strokeWidth={18}
          fill="none"
          strokeLinecap="round"
        />
        {/* Second pass for full coverage */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          stroke="url(#grad2)"
          strokeWidth={18}
          fill="none"
          strokeLinecap="round"
          opacity={0.5}
        />
        {/* Handle */}
        <Circle
          cx={handle.x}
          cy={handle.y}
          r={HANDLE_RADIUS + 4}
          fill="rgba(255,255,255,0.2)"
        />
        <Circle cx={handle.x} cy={handle.y} r={HANDLE_RADIUS} fill="white" />
      </Svg>
      {/* Emoji face in center */}
      <View style={[styles.innerFace, { backgroundColor: currentMood.color }]}>
        <Text style={styles.emoji}>{currentMood.emoji}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: SIZE,
    height: SIZE,
  },
  innerFace: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: {
    fontSize: 44,
  },
});
