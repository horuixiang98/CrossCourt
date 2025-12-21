import { useColorScheme } from "@/hooks/use-color-scheme";
import { SessionProvider, useSession } from "@/providers/SessionProvider";
import { TabBarProvider } from "@/providers/TabBarProvider";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Camera } from "expo-camera";
import Constants from "expo-constants";
import * as ExpoLocation from "expo-location";
import * as Notifications from "expo-notifications";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import WelcomeScreen from "./welcome";

export const unstable_settings = {
  anchor: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SessionProvider>
        <TabBarProvider>
          <InitialAppLayout />
        </TabBarProvider>
      </SessionProvider>
    </GestureHandlerRootView>
  );
}

function InitialAppLayout() {
  const { session, isLoading } = useSession();
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [isWelcomeFinished, setIsWelcomeFinished] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsWelcomeFinished(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (colorScheme && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [colorScheme, isLoading]);

  useEffect(() => {
    if (isLoading || !isWelcomeFinished) return;

    const checkStatus = async () => {
      const inAuthGroup = segments[0] === "auth";

      if (!session) {
        if (segments[0] !== "auth") {
          router.replace("/auth/signin");
        }
        return;
      }

      // User is logged in, check permissions sequentially
      try {
        // 1. Check Location
        const { status: locationStatus } =
          await ExpoLocation.getForegroundPermissionsAsync();
        if (locationStatus !== "granted") {
          const isLocationPage =
            segments[0] === "auth" && segments[1] === "enableLocation";
          if (!isLocationPage) {
            router.replace("/auth/enableLocation");
          }
          return;
        }

        // 2. Check Notifications (Skip in Expo Go due to SDK 53 limitations)
        const isExpoGo = Constants.appOwnership === "expo";
        if (!isExpoGo) {
          try {
            // Only import/use notifications if not in Expo Go to avoid the SDK 53 error
            const { status: notificationStatus } =
              await Notifications.getPermissionsAsync();
            if (notificationStatus !== "granted") {
              const isNotificationPage =
                segments[0] === "auth" && segments[1] === "enableNotification";
              if (!isNotificationPage) {
                router.replace("/auth/enableNotification");
              }
              return;
            }
          } catch (nError) {
            console.warn("Notification permission check failed:", nError);
          }
        }

        // 3. Check Camera
        const { status: cameraStatus } =
          await Camera.getCameraPermissionsAsync();
        if (cameraStatus !== "granted") {
          const isCameraPage =
            segments[0] === "auth" && segments[1] === "enableCamera";
          if (!isCameraPage) {
            router.replace("/auth/enableCamera");
          }
          return;
        }

        // All permissions granted
        if (inAuthGroup) {
          router.replace("/(tabs)");
        }
      } catch (error) {
        console.error("Error checking permissions status:", error);
      }
    };

    checkStatus();
  }, [session, isLoading, segments, isWelcomeFinished]);

  if (!isWelcomeFinished) {
    return <WelcomeScreen />;
  }

  return (
    <ThemeProvider value={colorScheme === "light" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="auth/signin"
          options={{ title: "Sign In", headerShown: false }}
        />
        <Stack.Screen
          name="auth/enableLocation"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="auth/enableNotification"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="auth/enableCamera"
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} /> */}
      </Stack>

      {/* <StatusBar style="auto" /> */}
    </ThemeProvider>
  );
}
