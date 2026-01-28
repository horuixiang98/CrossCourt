import { useColorScheme } from "@/src/hooks/use-color-scheme";
import { SessionProvider, useSession } from "@/src/providers/SessionProvider";
import { TabBarProvider } from "@/src/providers/TabBarProvider";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Camera } from "expo-camera";
import * as ExpoLocation from "expo-location";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
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
      const segmentsArray = segments || [];
      const inAuthGroup =
        segmentsArray[0] === "screen" && segmentsArray[1] === "auth";

      try {
        // 1. Check Location
        const { status: locationStatus } =
          await ExpoLocation.getForegroundPermissionsAsync();
        if (locationStatus !== "granted") {
          const isLocationPage =
            inAuthGroup && segmentsArray[2] === "enableLocation";
          if (!isLocationPage) {
            router.replace("/screen/auth/enableLocation");
          }
          return;
        }

        // 2. Check Notifications (Skip in Expo Go due to SDK 53 limitations)
        // const isExpoGo = Constants.appOwnership === "expo";
        // if (!isExpoGo) {
        //   try {
        //     const { status: notificationStatus } =
        //       await Notifications.getPermissionsAsync();
        //     if (notificationStatus !== "granted") {
        //       const isNotificationPage =
        //         inAuthGroup && segmentsArray[2] === "enableNotification";
        //       if (!isNotificationPage) {
        //         router.replace("/screen/auth/enableNotification");
        //       }
        //       return;
        //     }
        //   } catch (nError) {
        //     console.warn("Notification permission check failed:", nError);
        //   }
        // }

        // 3. Check Camera
        const { status: cameraStatus } =
          await Camera.getCameraPermissionsAsync();
        if (cameraStatus !== "granted") {
          const isCameraPage =
            inAuthGroup && segmentsArray[2] === "enableCamera";
          if (!isCameraPage) {
            router.replace("/screen/auth/enableCamera");
          }
          return;
        }

        // 4. Check Login session after permissions
        if (!session) {
          const isSignInPage = inAuthGroup && segmentsArray[2] === "signin";
          if (!isSignInPage) {
            router.replace("/screen/auth/signin");
          }
          return;
        }

        // All permissions granted and logged in
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
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          // This hides the header for ALL screens in this stack
          headerShown: false,
        }}
      >
        {/* <Stack.Screen name="(tabs)" />
        <Stack.Screen name="screen/auth/signin" />
        <Stack.Screen name="screen/auth/enableLocation" />
        <Stack.Screen name="screen/auth/enableNotification" />
        <Stack.Screen name="screen/auth/enableCamera" />
        <Stack.Screen name="screen/profile/profile_Information" />
        <Stack.Screen name="screen/profile/setting" /> */}
      </Stack>
    </ThemeProvider>
  );
}
