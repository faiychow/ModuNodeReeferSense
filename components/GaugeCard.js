import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { colors, fonts, radii } from "../constants/theme";
import { describeDomeArc, valueToSweep, thresholdColor } from "../constants/gaugeMath";

const W = 104;
const H = 78;
const R = 37;
const CX = W / 2;
const CY = 58;

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function GaugeCard({ title, value, max, unit, decimals = 0 }) {
  const anim = useRef(new Animated.Value(0)).current;
  const [displaySweep, setDisplaySweep] = React.useState(0);
  const targetSweep = valueToSweep(value, max);
  const color = thresholdColor(value, max, colors);

  useEffect(() => {
    anim.setValue(0);
    const id = anim.addListener(({ value: v }) => setDisplaySweep(v * targetSweep));
    Animated.timing(anim, {
      toValue: 1,
      duration: 900,
      useNativeDriver: false,
    }).start();
    return () => anim.removeListener(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, max]);

  const trackD = describeDomeArc(CX, CY, R, 180, 0);
  const progressD = describeDomeArc(CX, CY, R, 180, 180 - displaySweep);
  const needle = 180 - displaySweep;
  const tip = {
    x: CX + R * Math.cos((needle * Math.PI) / 180),
    y: CY - R * Math.sin((needle * Math.PI) / 180),
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={{ width: W, height: H, alignSelf: "center" }}>
        <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <Path d={trackD} stroke={colors.border} strokeWidth={10} strokeLinecap="round" fill="none" />
          <AnimatedPath
            d={progressD}
            stroke={color}
            strokeWidth={10}
            strokeLinecap="round"
            fill="none"
          />
          <Circle cx={tip.x} cy={tip.y} r={5.5} fill={color} />
        </Svg>
        <View style={styles.valueWrap} pointerEvents="none">
          <Text style={[styles.value, { color }]}>
            {value.toFixed(decimals)}
            <Text style={styles.unit}>{unit}</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: W + 16,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  title: {
    color: colors.textMuted,
    fontFamily: fonts.label,
    fontSize: 9,
    letterSpacing: 1,
    textAlign: "center",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  valueWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 32,
    alignItems: "center",
  },
  value: {
    fontFamily: fonts.mono,
    fontSize: 16,
    fontWeight: "700",
  },
  unit: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.textMuted,
  },
});
