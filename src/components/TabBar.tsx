import { Colors } from "@/constants/theme";
import { useTabBar } from "@/src/providers/TabBarProvider";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Plus } from "lucide-react-native";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TabBarButton from "./TabBarButton";

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { tabBarTranslateY } = useTabBar();

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: tabBarTranslateY.value }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.tabBarContainer,
        containerAnimatedStyle,
        {
          paddingBottom: Platform.OS === "ios" && insets.bottom > 0 ? 0 : 0, // Snippet handles height explicitly, but we need to respect safe area somewhat or just float above it.
          // The snippet says bottom: 30px.
          bottom: insets.bottom + 10,
        },
      ]}
    >
      <View style={styles.contentContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            typeof options.tabBarLabel === "string"
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <React.Fragment key={route.name}>
              <View style={styles.tabItem}>
                <TabBarButton
                  onPress={onPress}
                  onLongPress={onLongPress}
                  isFocused={isFocused}
                  routerName={route.name}
                  label={label}
                />
              </View>
              {/* Add spacer after the second item (index 1) for the FAB */}
              {index === 1 && <View style={styles.spacer} />}
            </React.Fragment>
          );
        })}
      </View>

      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.8}
          onPress={() => {
            console.log("Create Pressed");
          }}
        >
          <Plus size={28} color="#e0e0e0ff" strokeWidth={3} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    left: 20,
    right: 20,
    backgroundColor: "rgba(15, 15, 15, 0.95)",
    borderRadius: 35,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
    justifyContent: "center",
    height: 70, // Fixed height from snippet
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
    paddingHorizontal: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  spacer: {
    width: 65, // Match FAB container width
  },
  fabContainer: {
    position: "absolute",
    top: -35, // Move vertically up to float
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  fab: {
    width: 55,
    height: 55,
    borderRadius: 18,
    backgroundColor: Colors.light.primaryGreen,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.light.primaryGreen, // Green shadow
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    borderWidth: 2,
    borderColor: "rgba(15, 15, 15, 0.95)", // White border
  },
});
