import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Easing, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Svg, { Polygon, Circle, Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');
const SNOWFLAKE_COUNT = 14;
const SWIPE_THRESHOLD = -60; // px of upward drag needed to trigger nav
const PING_CYCLE = 1300; // ms per ripple
const PING_OUTER_DELAY = 420; // ms — outer hex pings slightly after inner

// Theme accents — pull these straight from constants/theme.js if the values differ
const CYAN = '#4FD6E8';
const GREEN = '#34D399';
const BG = ['#040B10', '#081C26', '#0A2530'];

// Hexagon points, center (36,36)
const hexPoints = (r) => {
  const pts = [30, 90, 150, 210, 270, 330].map((deg) => {
    const rad = (Math.PI / 180) * deg;
    const x = 36 + r * Math.cos(rad);
    const y = 36 + r * Math.sin(rad);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return pts.join(' ');
};

export default function LoadingScreen({ canSwipe }) {
  const router = useRouter();
  const navigatedRef = useRef(false);

  const containerScale = useRef(new Animated.Value(0.8)).current;
  const containerOpacity = useRef(new Animated.Value(0)).current;
  const ringRotate = useRef(new Animated.Value(0)).current;

  // Tracks the whole-screen drag-to-dismiss gesture
  const dragY = useRef(new Animated.Value(0)).current;

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(20)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;

  // Ping ripples — dot flashes, then inner hex, then outer hex ripple outward and fade
  const dotPulse = useRef(new Animated.Value(1)).current;
  const innerPing = useRef(new Animated.Value(0)).current;
  const outerPing = useRef(new Animated.Value(0)).current;

  // Swipe-up hint at the bottom of the screen
  const hintOpacity = useRef(new Animated.Value(0)).current;
  const bounceY = useRef(new Animated.Value(0)).current;
  const hintPulse = useRef(new Animated.Value(1)).current;

  // PanResponder below is created once via useRef, so its callbacks would
  // otherwise close over the *initial* value of canSwipe (false) forever.
  // Mirroring it into a ref lets the gesture handlers read the live value.
  const canSwipeRef = useRef(canSwipe);
  useEffect(() => {
    canSwipeRef.current = canSwipe;
  }, [canSwipe]);

  const snowflakes = useRef(
    Array.from({ length: SNOWFLAKE_COUNT }).map(() => ({
      translateY: new Animated.Value(0),
      opacity: new Animated.Value(0),
      x: Math.random() * width,
      delay: Math.random() * 3000,
      duration: 4500 + Math.random() * 3000,
      size: 2 + Math.random() * 3,
    }))
  ).current;

  useEffect(() => {
    // Entrance
    Animated.parallel([
      Animated.timing(containerOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(containerScale, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();

    Animated.timing(logoOpacity, { toValue: 1, duration: 700, delay: 300, useNativeDriver: true }).start();
    Animated.timing(logoTranslateY, {
      toValue: 0,
      duration: 700,
      delay: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    Animated.timing(subtitleOpacity, { toValue: 1, duration: 700, delay: 600, useNativeDriver: true }).start();

    // Outer decorative scan ring, just keeps slowly rotating
    Animated.loop(
      Animated.timing(ringRotate, { toValue: 1, duration: 3000, easing: Easing.linear, useNativeDriver: true })
    ).start();

    // Center dot: quick flash at the start of every ping cycle
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotPulse, { toValue: 1.35, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(dotPulse, { toValue: 1, duration: 220, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        Animated.delay(PING_CYCLE - 400),
      ])
    ).start();

    // Inner hex ripples out from the dot
    Animated.loop(
      Animated.timing(innerPing, { toValue: 1, duration: PING_CYCLE, easing: Easing.out(Easing.cubic), useNativeDriver: true })
    ).start();

    // Outer hex ripples out shortly after — the "ping" cascades outward
    const outerTimer = setTimeout(() => {
      Animated.loop(
        Animated.timing(outerPing, { toValue: 1, duration: PING_CYCLE, easing: Easing.out(Easing.cubic), useNativeDriver: true })
      ).start();
    }, PING_OUTER_DELAY);

    // Chevron bounce, runs continuously
    const bounceLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceY, { toValue: -8, duration: 550, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(bounceY, { toValue: 0, duration: 550, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    bounceLoop.start();

    // Drifting frost particles
    snowflakes.forEach((flake) => {
      const run = () => {
        flake.translateY.setValue(0);
        flake.opacity.setValue(0);
        Animated.sequence([
          Animated.delay(flake.delay),
          Animated.parallel([
            Animated.timing(flake.translateY, {
              toValue: -height * 0.6,
              duration: flake.duration,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(flake.opacity, { toValue: 0.8, duration: flake.duration * 0.2, useNativeDriver: true }),
              Animated.timing(flake.opacity, { toValue: 0.8, duration: flake.duration * 0.6, useNativeDriver: true }),
              Animated.timing(flake.opacity, { toValue: 0, duration: flake.duration * 0.2, useNativeDriver: true }),
            ]),
          ]),
        ]).start(() => run());
      };
      run();
    });

    return () => clearTimeout(outerTimer);
  }, []);

  // Once swiping becomes available: fade in the hint and start it gently pulsing
  useEffect(() => {
    if (canSwipe) {
      Animated.timing(hintOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(hintPulse, { toValue: 0.45, duration: 800, useNativeDriver: true }),
          Animated.timing(hintPulse, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [canSwipe]);

  const goHome = () => {
    if (navigatedRef.current) return;
    navigatedRef.current = true;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace('/home');
  };

  // Whole screen follows the finger while dragging up; springs back or slides
  // fully off-screen (then navigates) depending on how far/fast the release was
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => canSwipeRef.current,
      onMoveShouldSetPanResponder: (_, gesture) => canSwipeRef.current && Math.abs(gesture.dy) > 8,

      onPanResponderMove: (_, gesture) => {
        // Only allow dragging upward
        if (gesture.dy < 0) {
          dragY.setValue(gesture.dy);
        }
      },

      onPanResponderRelease: (_, gesture) => {
        if (!canSwipeRef.current) return;

        if (gesture.dy < SWIPE_THRESHOLD || gesture.vy < -0.5) {
          Animated.timing(dragY, {
            toValue: -800,
            duration: 250,
            useNativeDriver: true,
          }).start(() => goHome());
        } else {
          Animated.spring(dragY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const ringRotateInterpolate = ringRotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const innerScale = innerPing.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1.25] });
  const innerOpacity = innerPing.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 0.9, 0] });
  const outerScale = outerPing.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1.25] });
  const outerOpacity = outerPing.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 0.9, 0] });

  return (
    <Animated.View
      style={{
        flex: 1,
        transform: [{ translateY: dragY }],
      }}
      {...panResponder.panHandlers}
    >
      <LinearGradient colors={BG} style={styles.container}>
        {snowflakes.map((flake, i) => (
          <Animated.View
            key={i}
            style={[
              styles.snowflake,
              {
                left: flake.x,
                width: flake.size,
                height: flake.size,
                borderRadius: flake.size / 2,
                opacity: flake.opacity,
                transform: [{ translateY: flake.translateY }],
              },
            ]}
          />
        ))}

        <View style={styles.centerContent}>
          <Animated.View style={{ opacity: containerOpacity, transform: [{ scale: containerScale }] }}>
            <View style={styles.iconWrap}>
              {/* Decorative rotating scan ring */}
              <Animated.View style={[styles.ring, { transform: [{ rotate: ringRotateInterpolate }] }]}>
                <Svg width={140} height={140} viewBox="0 0 140 140">
                  <Circle cx="70" cy="70" r="64" stroke={CYAN} strokeWidth="2" strokeOpacity="0.2" fill="none" />
                  <Path d="M70 6 A64 64 0 0 1 134 70" stroke={CYAN} strokeWidth="3" strokeLinecap="round" fill="none" />
                  <Circle cx="134" cy="70" r="4" fill={CYAN} />
                </Svg>
              </Animated.View>

              {/* Outer hex — pings out second */}
              <Animated.View style={[styles.ring, { opacity: outerOpacity, transform: [{ scale: outerScale }] }]}>
                <Svg width={72} height={72} viewBox="0 0 72 72">
                  <Polygon points={hexPoints(32)} fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinejoin="round" />
                </Svg>
              </Animated.View>

              {/* Inner hex — pings out first */}
              <Animated.View style={[styles.ring, { opacity: innerOpacity, transform: [{ scale: innerScale }] }]}>
                <Svg width={72} height={72} viewBox="0 0 72 72">
                  <Polygon points={hexPoints(16)} fill="none" stroke={CYAN} strokeWidth="2.5" strokeLinejoin="round" />
                </Svg>
              </Animated.View>

              {/* Center dot — the ping origin */}
              <Animated.View style={[styles.ring, { transform: [{ scale: dotPulse }] }]}>
                <Svg width={72} height={72} viewBox="0 0 72 72">
                  <Circle cx="36" cy="36" r="4" fill={CYAN} />
                </Svg>
              </Animated.View>
            </View>
          </Animated.View>

          <Animated.View
            style={{
              opacity: logoOpacity,
              transform: [{ translateY: logoTranslateY }],
              alignItems: 'center',
              marginTop: 28,
            }}
          >
            <Text style={styles.logoLine}>
              <Text style={styles.reeferText}>REEFER</Text>
              <Text style={styles.senseText}>SENSE</Text>
            </Text>
            <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
              CONTAINER DIAGNOSTICS APP
            </Animated.Text>
          </Animated.View>
        </View>

        {/* Swipe-up hint, pinned to the bottom */}
        <Animated.View style={[styles.swipeHint, { opacity: hintOpacity }]} pointerEvents="none">
          <Animated.View style={{ transform: [{ translateY: bounceY }] }}>
            <Svg width={22} height={14} viewBox="0 0 22 14">
              <Path d="M2 12 L11 3 L20 12" stroke={CYAN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </Svg>
          </Animated.View>
          <Animated.Text style={[styles.swipeText, { opacity: hintPulse }]}>SWIPE UP</Animated.Text>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  snowflake: { position: 'absolute', bottom: 0, backgroundColor: '#BFF7FF' },
  centerContent: { alignItems: 'center', justifyContent: 'center' },
  iconWrap: { width: 140, height: 140, alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', width: 140, height: 140, alignItems: 'center', justifyContent: 'center' },
  logoLine: { fontSize: 28, letterSpacing: 3 },
  reeferText: { fontWeight: '300', color: '#D7E4E7' },
  senseText: { fontWeight: '800', color: GREEN },
  subtitle: { fontSize: 11, color: '#6FA9B4', letterSpacing: 4, marginTop: 8, fontWeight: '600' },
  swipeHint: { position: 'absolute', bottom: 56, left: 0, right: 0, alignItems: 'center' },
  swipeText: { fontSize: 10, color: '#6FA9B4', letterSpacing: 3, marginTop: 6, fontWeight: '600' },
});