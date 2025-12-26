import { useColorScheme } from "@/src/hooks/use-color-scheme";
import { SessionProvider, useSession } from "@/src/providers/SessionProvider";
import { TabBarProvider } from "@/src/providers/TabBarProvider";
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
  const segments = useSegments() as string[];
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
      const inAuthGroup = segments[0] === "screen" && segments[1] === "auth";

      if (!session) {
        if (!inAuthGroup) {
          router.replace("/screen/auth/signin");
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
            inAuthGroup && segments[2] === "enableLocation";
          if (!isLocationPage) {
            router.replace("/screen/auth/enableLocation");
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
                inAuthGroup && segments[2] === "enableNotification";
              if (!isNotificationPage) {
                router.replace("/screen/auth/enableNotification");
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
          const isCameraPage = inAuthGroup && segments[2] === "enableCamera";
          if (!isCameraPage) {
            router.replace("/screen/auth/enableCamera");
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
          name="screen/auth/signin"
          options={{ title: "Sign In", headerShown: false }}
        />
        <Stack.Screen
          name="screen/auth/enableLocation"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="screen/auth/enableNotification"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="screen/auth/enableCamera"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="screen/profile/profile_Information"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Setting" }}
        />
        {/* <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} /> */}
      </Stack>

      {/* <StatusBar style="auto" /> */}
    </ThemeProvider>
  );
}
