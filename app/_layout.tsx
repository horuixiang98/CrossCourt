import { useColorScheme } from "@/hooks/use-color-scheme";
import { SessionProvider, useSession } from "@/providers/SessionProvider";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

export const unstable_settings = {
  anchor: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <SessionProvider>
      <InitialAppLayout />
    </SessionProvider>
  );
}

function InitialAppLayout() {
  const { session, isLoading } = useSession();
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "auth";

    if (session && inAuthGroup) {
      router.replace("/(tabs)");
    } else if (!session && segments[0] !== "auth") {
      router.replace("/auth/signin");
    }
  }, [session, isLoading, segments]);

  useEffect(() => {
    if (colorScheme && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [colorScheme, isLoading]);

  return (
    <ThemeProvider value={colorScheme === "light" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="auth/signin"
          options={{ title: "Sign In", headerShown: false }}
        />
        {/* <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} /> */}
      </Stack>

      {/* <StatusBar style="auto" /> */}
    </ThemeProvider>
  );
}
