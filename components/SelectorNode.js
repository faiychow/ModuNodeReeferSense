import React, { useEffect, useRef } from "react";
import { Pressable, View, Text, StyleSheet, Animated } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts } from "../constants/theme";

const SIZE = 126;

export default function SelectorNode({ label, sublabel, icon, selected, dimmed, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const ringProgress = useRef(new Animated.Value(0)).current;
  const dim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: selected ? 1.14 : 1,
      friction: 6,
      tension: 80,
      useNativeDriver: true,
    }).start();

    Animated.timing(ringProgress, {
      toValue: selected ? 1 : 0,
      duration: 420,
      useNativeDriver: false,
    }).start();

    Animated.timing(dim, {
      toValue: dimmed ? 0.4 : 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [selected, dimmed]);

  const r = SIZE / 2 - 6;
  const circumference = 2 * Math.PI * r;
  const strokeDashoffset = ringProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <Pressable onPress={onPress} hitSlop={12} style={styles.wrap}>
      <Animated.View style={{ transform: [{ scale }], opacity: dim }}>
        <View style={{ width: SIZE, height: SIZE }}>
          <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={r}
              fill={selected ? colors.frostSoft : colors.surface}
              stroke={colors.border}
              strokeWidth={2}
            />
            <AnimatedCircle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={r}
              fill="none"
              stroke={colors.frost}
              strokeWidth={4}
              strokeLinecap="round"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              rotation={-90}
              originX={SIZE / 2}
              originY={SIZE / 2}
            />
          </Svg>
          <View style={StyleSheet.absoluteFillObject}>
            <View style={styles.center}>
              <Ionicons
                name={icon}
                size={30}
                color={selected ? colors.frost : colors.textSecondary}
              />
            </View>
          </View>
        </View>
      </Animated.View>
      <Text style={[styles.label, selected && { color: colors.frost }]}>{label}</Text>
      <Text style={styles.sublabel}>{sublabel}</Text>
    </Pressable>
  );
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  wrap: { alignItems: "center", width: SIZE + 14 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  label: {
    marginTop: 16,
    color: colors.textPrimary,
    fontFamily: fonts.label,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 1,
  },
  sublabel: {
    marginTop: 4,
    color: colors.textMuted,
    fontFamily: fonts.label,
    fontSize: 11,
    letterSpacing: 0.5,
    textAlign: "center",
    maxWidth: SIZE + 10,
  },
});
