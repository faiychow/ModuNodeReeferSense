import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import Svg, { G, Rect, Circle, Line, Text as SvgText } from "react-native-svg";
import { colors, fonts } from "../constants/theme";

const AnimatedG = Animated.createAnimatedComponent(G);

const ZONE_LABELS = ["ZONE A", "ZONE B", "ZONE C"];
const ZONE_X = [42, 129, 216];
const ZONE_W = 87;
const ZONE_Y = 62;
const ZONE_H = 72;

export default function ReeferGraphic({ selectedZone, onSelectZone }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 950,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  // NOTE: react-native-svg's animated transform props don't interpolate a
  // combined matrix directly, so we drive scale + rotation via a wrapping
  // Animated.View and keep the internal <G> transform static (angle).
  const scale = progress.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] });
  const spin = progress.interpolate({ inputRange: [0, 1], outputRange: ["-70deg", "0deg"] });
  const opacity = progress;

  return (
    <Animated.View style={{ opacity, transform: [{ scale }, { rotate: spin }] }}>
      <Svg width={340} height={210} viewBox="0 0 340 210">
        <G transform="rotate(-7 170 105) skewX(-4)">
          {/* chassis / frame rail */}
          <Rect x={20} y={148} width={296} height={9} rx={3} fill={colors.bgAlt} stroke={colors.border} />
          <Circle cx={55} cy={165} r={9} fill={colors.surfaceAlt} stroke={colors.border} strokeWidth={2} />
          <Circle cx={90} cy={165} r={9} fill={colors.surfaceAlt} stroke={colors.border} strokeWidth={2} />
          <Circle cx={250} cy={165} r={9} fill={colors.surfaceAlt} stroke={colors.border} strokeWidth={2} />
          <Circle cx={285} cy={165} r={9} fill={colors.surfaceAlt} stroke={colors.border} strokeWidth={2} />

          {/* refrigeration unit block, left end */}
          <Rect
            x={8}
            y={54}
            width={34}
            height={88}
            rx={6}
            fill={colors.bgAlt}
            stroke={colors.borderBright}
            strokeWidth={1.5}
          />
          {[64, 76, 88, 100, 112, 124].map((y) => (
            <Line key={y} x1={14} y1={y} x2={36} y2={y} stroke={colors.frostDim} strokeWidth={1.5} />
          ))}
          <Circle cx={25} cy={140} r={6} fill="none" stroke={colors.frost} strokeWidth={1.5} />

          {/* body shell outline */}
          <Rect
            x={ZONE_X[0]}
            y={ZONE_Y}
            width={ZONE_W * 3}
            height={ZONE_H}
            rx={8}
            fill="none"
            stroke={colors.borderBright}
            strokeWidth={2}
          />

          {/* 3 pressable zones */}
          {ZONE_X.map((x, i) => {
            const isSelected = selectedZone === i;
            return (
              <React.Fragment key={i}>
                <Rect
                  x={x}
                  y={ZONE_Y}
                  width={ZONE_W}
                  height={ZONE_H}
                  fill={isSelected ? colors.frostSoft : "rgba(255,255,255,0.02)"}
                  stroke={colors.border}
                  strokeWidth={1}
                  onPress={() => onSelectZone(i)}
                />
                {/* corrugation texture */}
                {[0.2, 0.4, 0.6, 0.8].map((f) => (
                  <Line
                    key={f}
                    x1={x + ZONE_W * f}
                    y1={ZONE_Y + 4}
                    x2={x + ZONE_W * f}
                    y2={ZONE_Y + ZONE_H - 4}
                    stroke={colors.border}
                    strokeWidth={1}
                    onPress={() => onSelectZone(i)}
                  />
                ))}
                <SvgText
                  x={x + ZONE_W / 2}
                  y={ZONE_Y + ZONE_H / 2 + 4}
                  fontSize={11}
                  fontWeight="700"
                  letterSpacing={1}
                  fill={isSelected ? colors.frost : colors.textMuted}
                  textAnchor="middle"
                  onPress={() => onSelectZone(i)}
                >
                  {ZONE_LABELS[i]}
                </SvgText>
              </React.Fragment>
            );
          })}

          {/* door lines, right end */}
          <Line x1={316} y1={ZONE_Y} x2={316} y2={ZONE_Y + ZONE_H} stroke={colors.borderBright} strokeWidth={2} />
          <Rect x={318} y={ZONE_Y + 10} width={5} height={14} rx={2} fill={colors.surfaceAlt} />
          <Rect x={318} y={ZONE_Y + ZONE_H - 24} width={5} height={14} rx={2} fill={colors.surfaceAlt} />
        </G>
      </Svg>
    </Animated.View>
  );
}
