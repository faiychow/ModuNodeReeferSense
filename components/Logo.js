import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle, Line } from "react-native-svg";
import { colors, fonts } from "../constants/theme";

// Placeholder logo — a dial ring with a cold-tick crosshair, matching the
// "dial" motif used everywhere else in the app (selector nodes, gauges).
// Swap this component out for an <Image source={require(...)} /> later.
export default function Logo({ size = 120 }) {
  const r = size / 2 - 6;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle cx={cx} cy={cy} r={r} stroke={colors.border} strokeWidth={3} fill={colors.surface} />
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          stroke={colors.frost}
          strokeWidth={3}
          fill="none"
          strokeDasharray={`${Math.PI * r * 0.62} ${Math.PI * r * 2}`}
          strokeLinecap="round"
          transform={`rotate(-125 ${cx} ${cy})`}
        />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <Line
            key={deg}
            x1={cx}
            y1={cy - r * 0.32}
            x2={cx}
            y2={cy - r * 0.5}
            stroke={colors.frostDim}
            strokeWidth={2}
            transform={`rotate(${deg} ${cx} ${cy})`}
          />
        ))}
      </Svg>
      <View style={StyleSheet.absoluteFillObject}>
        <View style={styles.center}>
          <Text style={styles.mark}>RS</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  mark: {
    color: colors.textPrimary,
    fontFamily: fonts.mono,
    fontSize: 22,
    letterSpacing: 2,
    fontWeight: "700",
  },
});
