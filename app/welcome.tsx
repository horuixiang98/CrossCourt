import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Trophy, Users } from "lucide-react-native";
import { useEffect } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

// Create an animated version of LinearGradient to support animated styles
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function WelcomeScreen() {
  const router = useRouter();

  // Animation values
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const shuttlecockY = useSharedValue(-30);
  const shuttlecockRotate = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const progressWidth = useSharedValue(0);

  // Floating shuttlecocks
  const shuttle1Y = useSharedValue(0);
  const shuttle2Y = useSharedValue(0);
  const shuttle3Y = useSharedValue(0);

  useEffect(() => {
    // Logo entrance with bounce
    logoScale.value = withSpring(1, { damping: 10, stiffness: 100 });
    logoOpacity.value = withTiming(1, { duration: 1000 });

    // Main shuttlecock animation
    shuttlecockY.value = withSequence(
      withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) }),
      withRepeat(
        withSequence(
          withTiming(-15, { duration: 800, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 800, easing: Easing.in(Easing.quad) })
        ),
        -1,
        true
      )
    );

    shuttlecockRotate.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 1000 }),
        withTiming(5, { duration: 2000 }),
        withTiming(0, { duration: 1000 })
      ),
      -1,
      true
    );

    // Text entrance
    textOpacity.value = withDelay(600, withTiming(1, { duration: 1200 }));

    // Progress bar animation
    progressWidth.value = withTiming(100, {
      duration: 5000,
      easing: Easing.linear,
    });

    // Floating shuttlecocks
    shuttle1Y.value = withRepeat(
      withSequence(
        withTiming(-20, { duration: 2500 }),
        withTiming(0, { duration: 2500 })
      ),
      -1,
      true
    );

    shuttle2Y.value = withDelay(
      700,
      withRepeat(
        withSequence(
          withTiming(-30, { duration: 3000 }),
          withTiming(0, { duration: 3000 })
        ),
        -1,
        true
      )
    );

    shuttle3Y.value = withDelay(
      1400,
      withRepeat(
        withSequence(
          withTiming(-25, { duration: 2200 }),
          withTiming(0, { duration: 2200 })
        ),
        -1,
        true
      )
    );
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const shuttlecockStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: shuttlecockY.value },
      { rotate: `${shuttlecockRotate.value}deg` },
    ],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const shuttle1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: shuttle1Y.value }],
  }));

  const shuttle2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: shuttle2Y.value }],
  }));

  const shuttle3Style = useAnimatedStyle(() => ({
    transform: [{ translateY: shuttle3Y.value }],
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#050505", "#0a0a0a", "#050505"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative glows */}
      <View style={styles.topGlow} />
      <View style={styles.bottomGlow} />

      {/* Court inspired deco */}
      <View style={styles.courtLine1} />
      <View style={styles.courtLine2} />

      {/* Floating shuttlecocks */}
      <Animated.View style={[styles.floatingShuttle1, shuttle1Style]}>
        <MaterialCommunityIcons
          name="badminton"
          size={24}
          color="#10b981"
          style={{ opacity: 0.1 }}
        />
      </Animated.View>
      <Animated.View style={[styles.floatingShuttle2, shuttle2Style]}>
        <MaterialCommunityIcons
          name="badminton"
          size={32}
          color="#3b82f6"
          style={{ opacity: 0.08 }}
        />
      </Animated.View>
      <Animated.View style={[styles.floatingShuttle3, shuttle3Style]}>
        <MaterialCommunityIcons
          name="badminton"
          size={20}
          color="#10b981"
          style={{ opacity: 0.12 }}
        />
      </Animated.View>

      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <View style={styles.glowOuter} />
          <View style={styles.glowMiddle} />

          <View style={styles.iconCircle}>
            <LinearGradient
              colors={["#10b981", "#059669"]}
              style={styles.iconGradient}
            >
              <Animated.View style={shuttlecockStyle}>
                <MaterialCommunityIcons
                  name="badminton"
                  size={80}
                  color="#050505"
                />
              </Animated.View>
            </LinearGradient>
          </View>

          <Animated.View style={[styles.textContainer, textStyle]}>
            <Text style={styles.appName}>CrossCourt</Text>
            <View style={styles.taglineContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.tagline}>PRECISION & PASSION</Text>
              <View style={styles.dividerLine} />
            </View>
            <Text style={styles.subtitle}>连接球友 · 掌控竞技</Text>
          </Animated.View>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(1200)} style={styles.footer}>
          <View style={styles.loaderBar}>
            <AnimatedLinearGradient
              colors={["#10b981", "#3b82f6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.loaderProgress, progressStyle]}
            />
          </View>
          <Text style={styles.loadingText}>INITIALIZING CHAMPIONSHIP DATA</Text>
        </Animated.View>

        {/* Feature Highlights */}
        <Animated.View
          entering={FadeInUp.delay(1000).springify()}
          style={styles.featureRow}
        >
          <View style={styles.featureItem}>
            <MaterialCommunityIcons
              name="lightning-bolt"
              size={14}
              color="#10b981"
            />
            <Text style={styles.featureText}>极速匹配</Text>
          </View>
          <View style={styles.featureDivider} />
          <View style={styles.featureItem}>
            <Users size={14} color="#10b981" />
            <Text style={styles.featureText}>公会社交</Text>
          </View>
          <View style={styles.featureDivider} />
          <View style={styles.featureItem}>
            <Trophy size={14} color="#10b981" />
            <Text style={styles.featureText}>赛季排行</Text>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  topGlow: {
    position: "absolute",
    top: -height * 0.1,
    right: -width * 0.1,
    width: width * 0.8,
    height: height * 0.3,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    borderRadius: 100,
  },
  bottomGlow: {
    position: "absolute",
    bottom: -height * 0.1,
    left: -width * 0.2,
    width: width * 0.8,
    height: height * 0.3,
    backgroundColor: "rgba(59, 130, 246, 0.05)",
    borderRadius: 100,
  },
  logoContainer: {
    alignItems: "center",
  },
  glowOuter: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(16, 185, 129, 0.03)",
    top: -60,
  },
  glowMiddle: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(16, 185, 129, 0.05)",
    top: -30,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    borderWidth: 2,
    borderColor: "rgba(16, 185, 129, 0.3)",
    elevation: 20,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  iconGradient: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    alignItems: "center",
  },
  appName: {
    fontSize: 48,
    fontWeight: "900",
    color: "#f8fafc",
    letterSpacing: -2,
  },
  taglineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  dividerLine: {
    width: 24,
    height: 1,
    backgroundColor: "rgba(16, 185, 129, 0.5)",
    marginHorizontal: 16,
  },
  tagline: {
    fontSize: 10,
    color: "#10b981",
    fontWeight: "900",
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "600",
    marginTop: 8,
    letterSpacing: 1,
  },
  footer: {
    position: "absolute",
    bottom: -height * 0.2,
    alignItems: "center",
    width: width * 0.7,
  },
  loaderBar: {
    width: "100%",
    height: 3,
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 20,
  },
  loaderProgress: {
    height: "100%",
    borderRadius: 2,
  },
  loadingText: {
    color: "#475569",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 2,
  },
  featureRow: {
    position: "absolute",
    bottom: -height * 0.32,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(30, 41, 59, 0.5)",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  featureText: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "bold",
  },
  featureDivider: {
    width: 1,
    height: 12,
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    marginHorizontal: 16,
  },
  courtLine1: {
    position: "absolute",
    top: height * 0.25,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(16, 185, 129, 0.05)",
  },
  courtLine2: {
    position: "absolute",
    bottom: height * 0.25,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(16, 185, 129, 0.05)",
  },
  floatingShuttle1: {
    position: "absolute",
    top: height * 0.15,
    right: width * 0.12,
  },
  floatingShuttle2: {
    position: "absolute",
    top: height * 0.28,
    left: width * 0.08,
  },
  floatingShuttle3: {
    position: "absolute",
    bottom: height * 0.12,
    right: width * 0.18,
  },
});
