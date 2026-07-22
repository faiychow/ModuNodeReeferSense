import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ReeferGraphic from "../components/ReeferGraphic";
import SensorDashboard from "../components/SensorDashboard";
import SideDrawer from "../components/SideDrawer";
import { colors, fonts, spacing } from "../constants/theme";

export default function ReeferScreen() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable onPress={() => setDrawerOpen(true)} hitSlop={12} style={styles.menuBtn}>
          <Ionicons name="menu" size={22} color={colors.textPrimary} />
        </Pressable>
        <View>
          <Text style={styles.eyebrow}>REEFER FLEET · UNIT 07</Text>
          <Text style={styles.title}>40ft Container</Text>
        </View>
        <View style={styles.liveDot} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.graphicWrap}>
          <ReeferGraphic selectedZone={selectedZone} onSelectZone={setSelectedZone} />
        </View>

        <Text style={styles.zoneHint}>
          {selectedZone === null
            ? "Tap a zone on the container to select it"
            : `Zone ${String.fromCharCode(65 + selectedZone)} selected`}
        </Text>

        <View style={styles.divider} />

        <SensorDashboard />
      </ScrollView>

      <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
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
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  menuBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
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
  graphicWrap: { marginTop: spacing.sm, alignSelf: "center" },
  zoneHint: {
    color: colors.textMuted,
    fontFamily: fonts.label,
    fontSize: 12,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    letterSpacing: 0.3,
    alignSelf: "center",
  },
  divider: {
    height: 1,
    width: "88%",
    backgroundColor: colors.border,
    marginBottom: spacing.lg,
    alignSelf: "center",
  },
});
