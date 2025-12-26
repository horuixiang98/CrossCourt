import { Colors } from "@/constants/theme";
import { supabase } from "@/src/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
// Google Sign-In - Commented out for Expo Go compatibility
// Uncomment when using a development build
// import {
//   GoogleSignin,
//   isSuccessResponse,
//   statusCodes,
// } from "@react-native-google-signin/google-signin";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  AppState,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground.
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function SignIn() {
  const [hidePass, setHidePass] = useState(true);
  const { height } = useWindowDimensions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // Check if running in Expo Go
  const isExpoGo = Constants.appOwnership === "expo";

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    if (!session && !error)
      Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  // Google Sign-In - Commented out for Expo Go compatibility
  // React.useEffect(() => {
  //   GoogleSignin.configure({
  //     webClientId:
  //       process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
  //       "YOUR_CLIENT_ID_FROM_GOOGLE_CONSOLE",
  //   });
  // }, []);

  async function performGoogleSignIn() {
    // Temporarily disabled for Expo Go
    if (isExpoGo) {
      Alert.alert(
        "Google Sign-In Unavailable",
        "Google Sign-In requires a development build. Please use email/password login in Expo Go, or create a development build to use Google Sign-In.",
        [{ text: "OK" }]
      );
      return;
    }

    // Native Google Sign-In code (uncomment when using development build)
    // try {
    //   setLoading(true);
    //   await GoogleSignin.hasPlayServices();
    //   const response = await GoogleSignin.signIn();
    //   if (isSuccessResponse(response)) {
    //     if (response.data.idToken) {
    //       const { data, error } = await supabase.auth.signInWithIdToken({
    //         provider: "google",
    //         token: response.data.idToken,
    //       });
    //       if (error) throw error;
    //     } else {
    //       throw new Error("No ID token present in response");
    //     }
    //   }
    // } catch (error: any) {
    //   if (error.code === statusCodes.IN_PROGRESS) {
    //     // operation in progress
    //   } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    //     Alert.alert("Google Play Services not available or outdated");
    //   } else {
    //     Alert.alert("Google Sign-In Error", error.message);
    //   }
    // } finally {
    //   setLoading(false);
    // }
  }

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={100}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerContainer}>
        <Image
          style={{ width: "100%", height: height * 0.35 }}
          source={require("@/assets/images/login-screen.png")}
          resizeMode="cover"
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>
            {isSignUp ? "Create Account" : "Welcome Back"}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isSignUp
              ? "Sign up to get started"
              : "Sign in to continue your journey"}
          </Text>
        </View>
      </View>

      <View style={styles.formContainer}>
        {/* Email Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={Colors.light.icon}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              onChangeText={setEmail}
              value={email}
              placeholder="name@example.com"
              autoCapitalize="none"
              placeholderTextColor="#A0A0A0"
              keyboardType="email-address"
            />
          </View>
        </View>

        {/* Password Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={Colors.light.icon}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              onChangeText={setPassword}
              value={password}
              secureTextEntry={hidePass}
              placeholder="Enter your password"
              autoCapitalize="none"
              placeholderTextColor="#A0A0A0"
            />
            <TouchableOpacity onPress={() => setHidePass(!hidePass)}>
              <Ionicons
                name={hidePass ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={Colors.light.icon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.primaryButton,
              loading && styles.buttonDisabled,
            ]}
            onPress={isSignUp ? signUpWithEmail : signInWithEmail}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>
                {isSignUp ? "Sign Up" : "Sign In"}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={[styles.button, styles.googleButton]}
            onPress={performGoogleSignIn}
            disabled={loading}
          >
            <Ionicons
              name="logo-google"
              size={20}
              color="#000"
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>Google</Text>
          </TouchableOpacity>
        </View>

        {/* Toggle Sign In / Sign Up */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
          </Text>
          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
            <Text style={styles.footerLink}>
              {isSignUp ? " Sign In" : " Sign Up"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  headerTextContainer: {
    width: "100%",
    paddingHorizontal: 24,
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.light.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.light.icon,
    fontWeight: "500",
  },
  formContainer: {
    paddingHorizontal: 24,
    gap: 16,
    paddingBottom: 40,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.light.text,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: "transparent",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: "500",
  },
  buttonContainer: {
    gap: 12,
    marginTop: 10,
  },
  button: {
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primaryButton: {
    backgroundColor: Colors.light.primary,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  googleButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  googleIcon: {
    marginRight: 10,
  },
  googleButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#999",
    fontSize: 12,
    fontWeight: "500",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  footerText: {
    color: "#666",
    fontSize: 14,
  },
  footerLink: {
    color: Colors.light.primary,
    fontSize: 14,
    fontWeight: "bold",
  },
});
