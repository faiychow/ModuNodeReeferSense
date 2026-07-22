import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, fonts, radii } from "../constants/theme";
import { thresholdColor } from "../constants/gaugeMath";

const BAR_HEIGHT = 260;
const BAR_WIDTH = 40;

export default function TemperatureBar({ value, min = -10, max = 40, unit = "°F" }) {
  const anim = useRef(new Animated.Value(0)).current;
  const pct = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const color = thresholdColor(value - min, max - min, colors);

  useEffect(() => {
    Animated.timing(anim, {
      toValue: pct,
      duration: 900,
      useNativeDriver: false,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const fillHeight = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, BAR_HEIGHT],
  });

  const ticks = [max, max * 0.75 + min * 0.25, (max + min) / 2, max * 0.25 + min * 0.75, min];

  return (
    <View style={styles.wrap}>
      <Text style={styles.eyebrow}>TEMP</Text>
      <Text style={[styles.readout, { color }]}>{value.toFixed(1)}</Text>
      <Text style={styles.unit}>{unit}</Text>

      <View style={styles.barRow}>
        <View style={styles.tickCol}>
          {ticks.map((t, i) => (
            <Text key={i} style={styles.tickLabel}>
              {Math.round(t)}°
            </Text>
          ))}
        </View>

        <View style={styles.track}>
          <Animated.View style={[styles.fillClip, { height: fillHeight }]}>
            <LinearGradient
              colors={[color, colors.frostDim]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
          </Animated.View>
          {[0.2, 0.4, 0.6, 0.8].map((t) => (
            <View key={t} style={[styles.gridLine, { bottom: BAR_HEIGHT * t }]} />
          ))}
        </View>
      </View>
      <Text style={styles.label}>TEMPERATURE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center" },
  eyebrow: {
    color: colors.textMuted,
    fontFamily: fonts.label,
    fontSize: 10,
    letterSpacing: 2,
  },
  readout: {
    fontFamily: fonts.mono,
    fontSize: 24,
    fontWeight: "700",
    marginTop: 2,
  },
  unit: {
    color: colors.textMuted,
    fontFamily: fonts.mono,
    fontSize: 11,
    marginBottom: 14,
  },
  barRow: { flexDirection: "row", alignItems: "flex-end" },
  tickCol: {
    height: BAR_HEIGHT,
    justifyContent: "space-between",
    marginRight: 6,
    paddingVertical: 2,
  },
  tickLabel: {
    color: colors.textMuted,
    fontFamily: fonts.mono,
    fontSize: 9,
    textAlign: "right",
  },
  track: {
    width: BAR_WIDTH,
    height: BAR_HEIGHT,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  fillClip: {
    width: "100%",
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    overflow: "hidden",
  },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.border,
  },
  label: {
    marginTop: 14,
    color: colors.textSecondary,
    fontFamily: fonts.label,
    fontSize: 11,
    letterSpacing: 2,
  },
});
