import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import TemperatureBar from "./TemperatureBar";
import GaugeCard from "./GaugeCard";
import { spacing } from "../constants/theme";

const BASE = {
  temp: 28.4,
  humidity: 62,
  co2: 640,
  ph: 6.8,
  placeholderA: 45,
  placeholderB: 72,
};

function jitter(base, amount) {
  return base + (Math.random() * 2 - 1) * amount;
}

export default function SensorDashboard() {
  const [readings, setReadings] = useState(BASE);

  useEffect(() => {
    const id = setInterval(() => {
      setReadings((r) => ({
        temp: clamp(jitter(r.temp, 0.4), -10, 40),
        humidity: clamp(jitter(r.humidity, 1.2), 0, 100),
        co2: clamp(jitter(r.co2, 15), 0, 2000),
        ph: clamp(jitter(r.ph, 0.05), 0, 14),
        placeholderA: clamp(jitter(r.placeholderA, 2), 0, 100),
        placeholderB: clamp(jitter(r.placeholderB, 2), 0, 100),
      }));
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <View style={styles.row}>
      <TemperatureBar value={readings.temp} min={-10} max={40} unit="°F" />

      <View style={styles.grid}>
        <View style={styles.gridRow}>
          <GaugeCard title="Humidity" value={readings.humidity} max={100} unit="%" />
          <GaugeCard title="CO2" value={readings.co2} max={2000} unit="ppm" />
        </View>
        <View style={styles.gridRow}>
          <GaugeCard title="pH" value={readings.ph} max={14} unit="" decimals={1} />
          <GaugeCard title="Sensor E" value={readings.placeholderA} max={100} unit="%" />
        </View>
        <View style={styles.gridRow}>
          <GaugeCard title="Sensor F" value={readings.placeholderB} max={100} unit="%" />
        </View>
      </View>
    </View>
  );
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingHorizontal: spacing.md,
    gap: 12,
  },
  grid: { flex: 1, gap: 6 },
  gridRow: { flexDirection: "row", gap: 6, justifyContent: "flex-start" },
});
