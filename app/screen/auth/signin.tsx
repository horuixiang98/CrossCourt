import { supabase } from "@/src/utils/supabase";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  AppState,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

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

  async function performGoogleSignIn() {
    if (isExpoGo) {
      Alert.alert(
        "Google Sign-In Unavailable",
        "Google Sign-In requires a development build. Please use email/password login in Expo Go.",
        [{ text: "OK" }]
      );
      return;
    }
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.topGlow} />
      <View style={styles.bottomGlow} />

      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={100}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <View style={styles.imageWrapper}>
            <Image
              style={styles.headerImage}
              source={require("@/assets/images/login-screen.png")}
              resizeMode="cover"
            />
            <View style={styles.imageOverlay} />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>
              {isSignUp ? "创建账号" : "欢迎回来"}
            </Text>
            <Text style={styles.headerSubtitle}>
              {isSignUp ? "开启你的羽球竞技之旅" : "继续你的卓越之路"}
            </Text>
          </View>
        </View>

        <View style={styles.formContainer}>
          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>邮箱地址</Text>
            <View style={styles.inputWrapper}>
              <Mail size={18} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                onChangeText={setEmail}
                value={email}
                placeholder="name@example.com"
                autoCapitalize="none"
                placeholderTextColor="#475569"
                keyboardType="email-address"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>登录密码</Text>
            <View style={styles.inputWrapper}>
              <Lock size={18} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                secureTextEntry={hidePass}
                placeholder="请输入密码"
                autoCapitalize="none"
                placeholderTextColor="#475569"
              />
              <TouchableOpacity onPress={() => setHidePass(!hidePass)}>
                {hidePass ? (
                  <EyeOff size={18} color="#64748b" />
                ) : (
                  <Eye size={18} color="#64748b" />
                )}
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
                <ActivityIndicator color="#000" />
              ) : (
                <>
                  <Text style={styles.primaryButtonText}>
                    {isSignUp ? "确认注册" : "立即登录"}
                  </Text>
                  <ArrowRight
                    size={18}
                    color="#000"
                    style={{ marginLeft: 8 }}
                  />
                </>
              )}
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>或通过以下方式</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={[styles.button, styles.googleButton]}
              onPress={performGoogleSignIn}
              disabled={loading}
            >
              <MaterialCommunityIcons
                name="google"
                size={20}
                color="#f8fafc"
                style={styles.googleIcon}
              />
              <Text style={styles.googleButtonText}>使用 Google 账号</Text>
            </TouchableOpacity>
          </View>

          {/* Toggle Sign In / Sign Up */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              {isSignUp ? "已有账号?" : "还没有账号?"}
            </Text>
            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
              <Text style={styles.footerLink}>
                {isSignUp ? " 返回登录" : " 立即注册"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#050505",
  },
  container: {
    flex: 1,
  },
  topGlow: {
    position: "absolute",
    top: -SCREEN_HEIGHT * 0.1,
    right: -SCREEN_WIDTH * 0.2,
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.3,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    borderRadius: 80,
  },
  bottomGlow: {
    position: "absolute",
    bottom: -SCREEN_HEIGHT * 0.1,
    left: -SCREEN_WIDTH * 0.2,
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.3,
    backgroundColor: "rgba(59, 130, 246, 0.05)",
    borderRadius: 80,
  },
  headerContainer: {
    alignItems: "center",
  },
  imageWrapper: {
    width: "100%",
    height: SCREEN_HEIGHT * 0.35,
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(5, 5, 5, 0.4)",
  },
  headerTextContainer: {
    width: "100%",
    paddingHorizontal: 24,
    marginTop: -40,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#f8fafc",
    marginBottom: 8,
    letterSpacing: -1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  formContainer: {
    paddingHorizontal: 24,
    gap: 20,
    paddingTop: 32,
    paddingBottom: 40,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#94a3b8",
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: "rgba(30, 41, 59, 0.5)",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#f8fafc",
    fontWeight: "500",
  },
  buttonContainer: {
    gap: 16,
    marginTop: 10,
  },
  button: {
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primaryButton: {
    backgroundColor: "#10b981",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  primaryButtonText: {
    color: "#050505",
    fontSize: 17,
    fontWeight: "900",
  },
  googleButton: {
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(30, 41, 59, 0.8)",
  },
  googleIcon: {
    marginRight: 12,
  },
  googleButtonText: {
    color: "#f8fafc",
    fontSize: 15,
    fontWeight: "bold",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(30, 41, 59, 0.5)",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#475569",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "500",
  },
  footerLink: {
    color: "#10b981",
    fontSize: 14,
    fontWeight: "900",
  },
});
