import { Colors } from "@/constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
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
    logoScale.value = withSpring(1, { damping: 8, stiffness: 100 });
    logoOpacity.value = withTiming(1, { duration: 800 });

    // Main shuttlecock animation - falling and rotating
    shuttlecockY.value = withSequence(
      withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) }),
      withRepeat(
        withSequence(
          withTiming(-15, { duration: 500, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 500, easing: Easing.in(Easing.quad) })
        ),
        -1,
        true
      )
    );

    shuttlecockRotate.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 500 }),
        withTiming(5, { duration: 1000 }),
        withTiming(0, { duration: 500 })
      ),
      -1,
      true
    );

    // Text entrance
    textOpacity.value = withDelay(400, withTiming(1, { duration: 1000 }));

    // Progress bar animation
    progressWidth.value = withTiming(100, {
      duration: 4800,
      easing: Easing.linear,
    });

    // Floating shuttlecocks
    shuttle1Y.value = withRepeat(
      withSequence(
        withTiming(-20, { duration: 2000 }),
        withTiming(0, { duration: 2000 })
      ),
      -1,
      true
    );

    shuttle2Y.value = withDelay(
      700,
      withRepeat(
        withSequence(
          withTiming(-25, { duration: 2500 }),
          withTiming(0, { duration: 2500 })
        ),
        -1,
        true
      )
    );

    shuttle3Y.value = withDelay(
      1400,
      withRepeat(
        withSequence(
          withTiming(-18, { duration: 1800 }),
          withTiming(0, { duration: 1800 })
        ),
        -1,
        true
      )
    );

    const timer = setTimeout(() => {
      // No-op, _layout.tsx will switch from WelcomeScreen to Stack
    }, 5000);

    return () => clearTimeout(timer);
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
        colors={[
          "#0a4d00",
          Colors.light.primary || "#136700",
          Colors.light.darkgreen || "#0c3f00",
        ]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative background elements - Court lines inspired */}
      <View style={styles.courtLine1} />
      <View style={styles.courtLine2} />
      <View style={styles.decoCircle1} />
      <View style={styles.decoCircle2} />

      {/* Floating shuttlecocks */}
      <Animated.View style={[styles.floatingShuttle1, shuttle1Style]}>
        <MaterialCommunityIcons
          name="badminton"
          size={24}
          color="rgba(255, 255, 255, 0.15)"
        />
      </Animated.View>
      <Animated.View style={[styles.floatingShuttle2, shuttle2Style]}>
        <MaterialCommunityIcons
          name="badminton"
          size={32}
          color="rgba(255, 255, 255, 0.1)"
        />
      </Animated.View>
      <Animated.View style={[styles.floatingShuttle3, shuttle3Style]}>
        <MaterialCommunityIcons
          name="badminton"
          size={20}
          color="rgba(255, 255, 255, 0.12)"
        />
      </Animated.View>

      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          {/* Glowing circle background */}
          <View style={styles.glowOuter} />
          <View style={styles.glowMiddle} />

          <View style={styles.iconCircle}>
            <Animated.View style={shuttlecockStyle}>
              <MaterialCommunityIcons name="badminton" size={90} color="#fff" />
            </Animated.View>
          </View>

          <Animated.View style={[styles.textContainer, textStyle]}>
            <Text style={styles.appName}>CrossCourt</Text>
            <View style={styles.taglineContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.tagline}>羽毛球卓越</Text>
              <View style={styles.dividerLine} />
            </View>
            <Text style={styles.subtitle}>扣杀 · 连接 · 竞技</Text>
          </Animated.View>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(1200)} style={styles.footer}>
          <View style={styles.loaderBar}>
            <Animated.View style={[styles.loaderProgress, progressStyle]} />
          </View>
          <Text style={styles.loadingText}>正在准备您的数据...</Text>
        </Animated.View>

        {/* Feature highlights */}
        <Animated.View
          entering={FadeInUp.delay(800).springify()}
          style={styles.featureRow}
        >
          <View style={styles.featureItem}>
            <MaterialCommunityIcons
              name="map-marker"
              size={16}
              color="rgba(255, 255, 255, 0.7)"
            />
            <Text style={styles.featureText}>寻找球场</Text>
          </View>
          <View style={styles.featureDivider} />
          <View style={styles.featureItem}>
            <MaterialCommunityIcons
              name="account-group"
              size={16}
              color="rgba(255, 255, 255, 0.7)"
            />
            <Text style={styles.featureText}>加入球友</Text>
          </View>
          <View style={styles.featureDivider} />
          <View style={styles.featureItem}>
            <MaterialCommunityIcons
              name="trophy"
              size={16}
              color="rgba(255, 255, 255, 0.7)"
            />
            <Text style={styles.featureText}>追踪数据</Text>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#136700",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  logoContainer: {
    alignItems: "center",
  },
  glowOuter: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    top: -40,
  },
  glowMiddle: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    top: -20,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  textContainer: {
    alignItems: "center",
  },
  appName: {
    fontSize: 52,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -2,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  taglineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  dividerLine: {
    width: 30,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 12,
  },
  tagline: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "800",
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "500",
    marginTop: 4,
    letterSpacing: 0.5,
  },
  footer: {
    position: "absolute",
    bottom: -height * 0.22,
    alignItems: "center",
    width: width * 0.7,
  },
  loaderBar: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 16,
  },
  loaderProgress: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 2,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  loadingText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 2.5,
  },
  featureRow: {
    position: "absolute",
    bottom: -height * 0.32,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  featureText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 11,
    fontWeight: "600",
  },
  featureDivider: {
    width: 1,
    height: 16,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginHorizontal: 12,
  },
  courtLine1: {
    position: "absolute",
    top: height * 0.2,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  courtLine2: {
    position: "absolute",
    bottom: height * 0.2,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  decoCircle1: {
    position: "absolute",
    top: -120,
    right: -120,
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  decoCircle2: {
    position: "absolute",
    bottom: -180,
    left: -180,
    width: 450,
    height: 450,
    borderRadius: 225,
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  floatingShuttle1: {
    position: "absolute",
    top: height * 0.15,
    right: width * 0.1,
    opacity: 0.6,
  },
  floatingShuttle2: {
    position: "absolute",
    top: height * 0.25,
    left: width * 0.08,
    opacity: 0.5,
  },
  floatingShuttle3: {
    position: "absolute",
    bottom: height * 0.15,
    right: width * 0.15,
    opacity: 0.4,
  },
});
