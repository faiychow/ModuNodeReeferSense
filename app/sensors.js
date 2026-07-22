import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import SensorDashboard from "../components/SensorDashboard";
import { colors, fonts, spacing } from "../constants/theme";

export default function SensorsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.textSecondary} />
        </Pressable>
        <View>
          <Text style={styles.eyebrow}>PRIMARY NODE</Text>
          <Text style={styles.title}>Live Readings</Text>
        </View>
        <View style={styles.liveDot} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SensorDashboard />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  eyebrow: {
    color: colors.textMuted,
    fontFamily: fonts.label,
    fontSize: 10,
    letterSpacing: 2,
  },
  title: {
    color: colors.textPrimary,
    fontFamily: fonts.label,
    fontSize: 20,
    fontWeight: "700",
    marginTop: 2,
  },
  liveDot: {
    marginLeft: "auto",
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.success,
  },
  scrollContent: { paddingBottom: spacing.xxl },
});
