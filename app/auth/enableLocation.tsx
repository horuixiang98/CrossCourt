import { Colors } from "@/constants/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { requestForegroundPermissionsAsync } from "expo-location";
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
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function EnableLocation() {
  const router = useRouter();

  // Animation values
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.3);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: 2000 }),
        withTiming(1, { duration: 0 })
      ),
      -1,
      false
    );
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 2000 }),
        withTiming(0.3, { duration: 0 })
      ),
      -1,
      false
    );
  }, []);

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const handleEnableLocation = async () => {
    try {
      const { status } = await requestForegroundPermissionsAsync();
      if (status === "granted") {
        router.replace("/(tabs)");
      } else {
        Alert.alert(
          "Permission Denied",
          "We need your location to show you nearby courts and players. Please enable it in your settings."
        );
      }
    } catch (error) {
      console.error("Error requesting location permission:", error);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#ffffff", "#f0fdf4", "#dcfce7"]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.content}>
        <Animated.View
          entering={FadeInUp.delay(200).duration(1000)}
          style={styles.headerContainer}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.closeButton}
          >
            {/* <Ionicons name="close" size={24} color={Colors.light.icon} /> */}
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.illustrationContainer}>
          <View style={styles.mapCircle}>
            {/* Pulse Rings */}
            <Animated.View style={[styles.pulseRing, animatedPulseStyle]} />
            <Animated.View
              style={[
                styles.pulseRing,
                animatedPulseStyle,
                {
                  width: 200,
                  height: 200,
                  borderRadius: 100,
                  animationDelay: "500ms",
                },
              ]}
            />

            {/* Main Icon */}
            <View style={styles.iconCircle}>
              <LinearGradient
                colors={[
                  Colors.light.primary || "#136700",
                  Colors.light.darkgreen || "#0c3f00",
                ]}
                style={styles.iconGradient}
              >
                <MaterialCommunityIcons
                  name="map-marker"
                  size={48}
                  color="#fff"
                />
              </LinearGradient>
            </View>

            {/* Floating Elements for decoration */}
            <Animated.View
              entering={FadeInDown.delay(400).springify()}
              style={[styles.floatingCard, { top: 40, right: 20 }]}
            >
              <Ionicons
                name="tennisball"
                size={16}
                color={Colors.light.primary}
              />
              <Text style={styles.floatingText}>Clubs</Text>
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(600).springify()}
              style={[styles.floatingCard, { bottom: 40, left: 20 }]}
            >
              <Ionicons name="people" size={16} color={Colors.light.primary} />
              <Text style={styles.floatingText}>Players</Text>
            </Animated.View>
          </View>
        </View>

        <View style={styles.textContainer}>
          <Animated.Text
            entering={FadeInDown.delay(300).duration(800)}
            style={styles.title}
          >
            Find Nearby Action
          </Animated.Text>

          <Animated.Text
            entering={FadeInDown.delay(500).duration(800)}
            style={styles.description}
          >
            Enable location services to discover badminton courts and connect
            with players in your area instantly.
          </Animated.Text>

          <Animated.View
            entering={FadeInDown.delay(700).duration(800)}
            style={styles.buttonContainer}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={handleEnableLocation}
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
                <Text style={styles.buttonText}>Enable Location</Text>
                <Ionicons
                  name="arrow-forward"
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
              <Text style={styles.skipText}>Maybe Later</Text>
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
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    alignItems: "flex-end",
  },
  closeButton: {
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 20,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mapCircle: {
    width: 300,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  pulseRing: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: Colors.light.primary,
    zIndex: 0,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    elevation: 10,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    zIndex: 2,
  },
  iconGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  floatingCard: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    gap: 6,
    zIndex: 3,
  },
  floatingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  textContainer: {
    padding: 30,
    paddingBottom: 50,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  button: {
    width: "100%",
    height: 56,
    padding: 0,
    overflow: "hidden",
    borderRadius: 28,
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
    fontWeight: "700",
  },
  skipButton: {
    padding: 12,
    alignItems: "center",
  },
  skipText: {
    color: "#888",
    fontSize: 16,
    fontWeight: "500",
  },
});
