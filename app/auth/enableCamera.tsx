import { Colors } from "@/constants/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
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

export default function EnableCamera() {
  const router = useRouter();

  // Animation values
  const scanLineY = useSharedValue(0);
  const qrScale = useSharedValue(1);

  useEffect(() => {
    // Scanning line animation
    scanLineY.value = withRepeat(
      withSequence(
        withTiming(140, { duration: 2000 }),
        withTiming(0, { duration: 2000 })
      ),
      -1,
      false
    );

    // QR pulse
    qrScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLineY.value }],
  }));

  const qrStyle = useAnimatedStyle(() => ({
    transform: [{ scale: qrScale.value }],
  }));

  const handleEnableCamera = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === "granted") {
        router.replace("/(tabs)");
      } else {
        Alert.alert(
          "Camera Access",
          "We need camera access to scan court QR codes and update your profile picture.",
          [
            { text: "Not Now", onPress: () => router.replace("/(tabs)") },
            {
              text: "Settings",
              onPress: () =>
                Alert.alert("Please enable camera in your device settings."),
            },
          ]
        );
      }
    } catch (error) {
      console.error("Error requesting camera permission:", error);
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
          <View style={styles.scannerFrame}>
            {/* Corner Borders */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />

            {/* QR Code Illustration */}
            <Animated.View style={[styles.qrContainer, qrStyle]}>
              <MaterialCommunityIcons
                name="qrcode-scan"
                size={100}
                color={Colors.light.primary}
              />
            </Animated.View>

            {/* Scanning Line */}
            <Animated.View style={[styles.scanLine, scanLineStyle]}>
              <LinearGradient
                colors={["transparent", Colors.light.primary, "transparent"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.scanLineGradient}
              />
            </Animated.View>
          </View>

          {/* Floating Info Cards */}
          <Animated.View
            entering={FadeInUp.delay(400)}
            style={[styles.infoCard, { top: 60, right: -20 }]}
          >
            <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
            <Text style={styles.infoText}>Quick Check-in</Text>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(600)}
            style={[styles.infoCard, { bottom: 60, left: -20 }]}
          >
            <Ionicons name="camera" size={16} color={Colors.light.primary} />
            <Text style={styles.infoText}>Profile Photo</Text>
          </Animated.View>
        </View>

        <View style={styles.textContainer}>
          <Animated.Text
            entering={FadeInDown.delay(300).duration(800)}
            style={styles.title}
          >
            Scan & Play
          </Animated.Text>

          <Animated.Text
            entering={FadeInDown.delay(500).duration(800)}
            style={styles.description}
          >
            Enable camera access to scan court QR codes for instant check-ins
            and to personalize your profile.
          </Animated.Text>

          <Animated.View
            entering={FadeInDown.delay(700).duration(800)}
            style={styles.buttonContainer}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={handleEnableCamera}
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
                <Text style={styles.buttonText}>Enable Camera</Text>
                <Ionicons
                  name="camera"
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
    paddingHorizontal: 24,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scannerFrame: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: Colors.light.primary,
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 12,
  },
  qrContainer: {
    opacity: 0.8,
  },
  scanLine: {
    position: "absolute",
    top: 30,
    left: 10,
    right: 10,
    height: 2,
    zIndex: 5,
  },
  scanLineGradient: {
    width: "100%",
    height: "100%",
  },
  infoCard: {
    position: "absolute",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  infoText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1e293b",
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
