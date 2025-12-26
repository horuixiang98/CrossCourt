import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function EnableNotification() {
  const router = useRouter();

  // Animation values
  const bellRotate = useSharedValue(0);
  const bubble1Y = useSharedValue(0);
  const bubble2Y = useSharedValue(0);

  useEffect(() => {
    // Bell swing animation
    bellRotate.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: 150 }),
        withTiming(15, { duration: 300 }),
        withTiming(0, { duration: 150 }),
        withDelay(2000, withTiming(0, { duration: 0 }))
      ),
      -1,
      true
    );

    // Floating bubbles
    bubble1Y.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 1500 }),
        withTiming(0, { duration: 1500 })
      ),
      -1,
      true
    );

    bubble2Y.value = withDelay(
      500,
      withRepeat(
        withSequence(
          withTiming(-15, { duration: 2000 }),
          withTiming(0, { duration: 2000 })
        ),
        -1,
        true
      )
    );
  }, []);

  const bellStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${bellRotate.value}deg` }],
  }));

  const bubble1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: bubble1Y.value }],
  }));

  const bubble2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: bubble2Y.value }],
  }));

  const handleEnableNotifications = async () => {
    const isExpoGo = Constants.appOwnership === "expo";

    if (isExpoGo) {
      Alert.alert(
        "Expo Go Limitation",
        "Push notifications are not supported in Expo Go (SDK 53+). Please use a development build to test this feature.",
        [{ text: "Continue", onPress: () => router.replace("/(tabs)") }]
      );
      return;
    }

    try {
      // Only call this if not in Expo Go
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === "granted") {
        router.replace("/(tabs)");
      } else {
        Alert.alert(
          "Stay Updated",
          "We'll only send you important updates about your matches and court bookings.",
          [
            { text: "Maybe Later", onPress: () => router.replace("/(tabs)") },
            { text: "Try Again", onPress: handleEnableNotifications },
          ]
        );
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      router.replace("/(tabs)");
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#ffffff", "#f8fafc", "#f1f5f9"]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.content}>
        <View style={styles.illustrationContainer}>
          <View style={styles.mainCircle}>
            {/* Background Decorative Rings */}
            <View
              style={[
                styles.decoRing,
                { width: 280, height: 280, opacity: 0.1 },
              ]}
            />
            <View
              style={[
                styles.decoRing,
                { width: 220, height: 220, opacity: 0.2 },
              ]}
            />

            {/* Bell Icon */}
            <Animated.View style={[styles.bellContainer, bellStyle]}>
              <LinearGradient
                colors={[
                  Colors.light.primary || "#136700",
                  Colors.light.darkgreen || "#0c3f00",
                ]}
                style={styles.bellGradient}
              >
                <Ionicons name="notifications" size={60} color="#fff" />
                <View style={styles.notificationDot} />
              </LinearGradient>
            </Animated.View>

            {/* Floating Notification Bubbles */}
            <Animated.View
              style={[styles.bubble, styles.bubbleLeft, bubble1Style]}
            >
              <View style={styles.bubbleIcon}>
                <Ionicons
                  name="tennisball"
                  size={14}
                  color={Colors.light.primary}
                />
              </View>
              <View>
                <Text style={styles.bubbleTitle}>Match Invite</Text>
                <Text style={styles.bubbleText}>Ryan invited you...</Text>
              </View>
            </Animated.View>

            <Animated.View
              style={[styles.bubble, styles.bubbleRight, bubble2Style]}
            >
              <View style={[styles.bubbleIcon, { backgroundColor: "#dcfce7" }]}>
                <Ionicons name="calendar" size={14} color="#16a34a" />
              </View>
              <View>
                <Text style={styles.bubbleTitle}>Court Booked</Text>
                <Text style={styles.bubbleText}>KL Sports Center...</Text>
              </View>
            </Animated.View>
          </View>
        </View>

        <View style={styles.textContainer}>
          <Animated.Text
            entering={FadeInDown.delay(300).duration(800)}
            style={styles.title}
          >
            Never Miss a Match
          </Animated.Text>

          <Animated.Text
            entering={FadeInDown.delay(500).duration(800)}
            style={styles.description}
          >
            Get notified instantly when someone invites you to play or when your
            court booking is confirmed.
          </Animated.Text>

          <Animated.View
            entering={FadeInDown.delay(700).duration(800)}
            style={styles.buttonContainer}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={handleEnableNotifications}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[
                  Colors.light.primary || "#136700",
                  Colors.light.darkgreen || "#0c3f00",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Enable Notifications</Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#fff"
                  style={{ marginLeft: 8 }}
                />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.replace("/(tabs)")}
              style={styles.skipButton}
            >
              <Text style={styles.skipText}>I&apos;ll do it later</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  mainCircle: {
    width: 300,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  decoRing: {
    position: "absolute",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  bellContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    elevation: 15,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    zIndex: 2,
  },
  bellGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationDot: {
    position: "absolute",
    top: 30,
    right: 30,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#ff4444",
    borderWidth: 3,
    borderColor: "#fff",
  },
  bubble: {
    position: "absolute",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 3,
    width: 160,
  },
  bubbleLeft: {
    top: 40,
    left: -20,
  },
  bubbleRight: {
    bottom: 40,
    right: -20,
  },
  bubbleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0fdf4",
    justifyContent: "center",
    alignItems: "center",
  },
  bubbleTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1e293b",
  },
  bubbleText: {
    fontSize: 10,
    color: "#64748b",
  },
  textContainer: {
    paddingBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: -1,
  },
  description: {
    fontSize: 16,
    color: "#475569",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  button: {
    width: "100%",
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
  },
  buttonGradient: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
  skipButton: {
    padding: 12,
    alignItems: "center",
  },
  skipText: {
    color: "#94a3b8",
    fontSize: 16,
    fontWeight: "600",
  },
});
