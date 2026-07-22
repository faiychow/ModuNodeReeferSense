import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import SelectorNode from "../components/SelectorNode";
import { colors, fonts, radii, spacing } from "../constants/theme";

export default function Home() {
  const [label, setLabel] = useState("");
  const [selected, setSelected] = useState(null); // 'sensors' | 'reefer'

  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(buttonAnim, {
      toValue: selected ? 1 : 0,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [selected]);

  const handleContinue = () => {
    if (selected === "sensors") router.push("/sensors");
    if (selected === "reefer") router.push("/reefer");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>SESSION LABEL</Text>
          <TextInput
            value={label}
            onChangeText={setLabel}
            placeholder="Untitled monitoring session"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />
          <View style={styles.rule} />
        </View>

        <View style={styles.body}>
          <Text style={styles.prompt}>Choose what you want to monitor</Text>

          <View style={styles.row}>
            <SelectorNode
              label="Primary Node"
              sublabel="Single-site sensor array"
              icon="thermometer-outline"
              selected={selected === "sensors"}
              dimmed={selected !== null && selected !== "sensors"}
              onPress={() => setSelected("sensors")}
            />
            <SelectorNode
              label="Reefer Fleet"
              sublabel="40ft container unit"
              icon="cube-outline"
              selected={selected === "reefer"}
              dimmed={selected !== null && selected !== "reefer"}
              onPress={() => setSelected("reefer")}
            />
          </View>
        </View>

        <Animated.View
          pointerEvents={selected ? "auto" : "none"}
          style={[
            styles.buttonWrap,
            {
              opacity: buttonAnim,
              transform: [
                {
                  translateY: buttonAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [40, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Pressable style={styles.button} onPress={handleContinue}>
            <Text style={styles.buttonText}>CONTINUE</Text>
          </Pressable>
        </Animated.View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  header: { paddingTop: spacing.lg },
  eyebrow: {
    color: colors.textMuted,
    fontFamily: fonts.label,
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: 8,
  },
  input: {
    color: colors.textPrimary,
    fontFamily: fonts.label,
    fontSize: 20,
    fontWeight: "600",
    paddingVertical: 4,
  },
  rule: {
    height: 1,
    backgroundColor: colors.border,
    marginTop: 12,
  },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  prompt: {
    color: colors.textSecondary,
    fontFamily: fonts.label,
    fontSize: 14,
    marginBottom: spacing.xl,
    letterSpacing: 0.3,
  },
  row: {
    flexDirection: "row",
    gap: 18,
  },
  buttonWrap: {
    paddingBottom: spacing.lg,
    alignItems: "center",
  },
  button: {
    backgroundColor: colors.frost,
    paddingVertical: 16,
    paddingHorizontal: 64,
    borderRadius: radii.pill,
  },
  buttonText: {
    color: colors.bg,
    fontFamily: fonts.label,
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 2,
  },
});
