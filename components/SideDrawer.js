import React, { useEffect, useRef } from "react";
import { View, Text, Pressable, StyleSheet, Animated, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing } from "../constants/theme";

const DRAWER_WIDTH = Math.min(280, Dimensions.get("window").width * 0.78);

const MENU_ITEMS = [
  { label: "Dashboard", icon: "grid-outline" },
  { label: "Container Zones", icon: "cube-outline" },
  { label: "Alerts", icon: "notifications-outline" },
  { label: "Maintenance Log", icon: "construct-outline" },
  { label: "Fleet Map", icon: "map-outline" },
  { label: "Settings", icon: "settings-outline" },
];

export default function SideDrawer({ open, onClose }) {
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: open ? 0 : -DRAWER_WIDTH,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: open ? 1 : 0,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start();
  }, [open]);

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents={open ? "auto" : "none"}>
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
      </Animated.View>

      <Animated.View style={[styles.drawer, { width: DRAWER_WIDTH, transform: [{ translateX }] }]}>
        <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1 }}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>MENU</Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </Pressable>
          </View>

          {MENU_ITEMS.map((item) => (
            <Pressable key={item.label} style={styles.item} onPress={onClose}>
              <Ionicons name={item.icon} size={18} color={colors.frost} style={{ width: 26 }} />
              <Text style={styles.itemText}>{item.label}</Text>
            </Pressable>
          ))}

          <View style={styles.footer}>
            <Text style={styles.footerText}>ReeferSense · placeholder menu</Text>
          </View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(4, 8, 16, 0.65)",
  },
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.surface,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.sm,
  },
  headerTitle: {
    color: colors.textMuted,
    fontFamily: fonts.label,
    fontSize: 11,
    letterSpacing: 2,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  itemText: {
    color: colors.textPrimary,
    fontFamily: fonts.label,
    fontSize: 15,
  },
  footer: {
    marginTop: "auto",
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    color: colors.textMuted,
    fontFamily: fonts.label,
    fontSize: 10,
    letterSpacing: 0.5,
  },
});
