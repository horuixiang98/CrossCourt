import { Colors } from "@/constants/theme";
import { useTabBar } from "@/src/providers/TabBarProvider";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TabBarButton from "./TabBarButton";

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { tabBarTranslateY } = useTabBar();
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });

  const buttonWidth = dimensions.width / state.routes.length;

  const onTabbarLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  };

  const tabPositionX = useSharedValue(0);

  useEffect(() => {
    if (dimensions.width > 0) {
      tabPositionX.value = withSpring(state.index * buttonWidth, {
        damping: 20,
        stiffness: 90,
      });
    }
  }, [state.index, dimensions.width, buttonWidth]);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: tabBarTranslateY.value }],
    };
  });

  // Indicator style - a subtle line at the top or a small dot?
  // Let's go with a small indicator bar at the top of the tab bar.
  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value + (buttonWidth - 40) / 2 }],
    };
  });

  return (
    <Animated.View
      onLayout={onTabbarLayout}
      style={[
        styles.tabbar,
        containerAnimatedStyle,
        {
          paddingBottom: insets.bottom + 10,
          height: 60 + insets.bottom,
        },
      ]}
    >
      {/* Animated Indicator line at the top */}
      <Animated.View
        style={[
          styles.indicator,
          indicatorStyle,
          {
            width: 40,
            backgroundColor: Colors.light.primary,
          },
        ]}
      />

      <View style={styles.tabItemsContainer}>
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
            tabPositionX.value = withSpring(index * buttonWidth, {
              damping: 20,
              stiffness: 90,
            });
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
            <TabBarButton
              key={route.name}
              onPress={onPress}
              onLongPress={onLongPress}
              isFocused={isFocused}
              routerName={route.name}
              label={label}
            />
          );
        })}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  tabItemsContainer: {
    flexDirection: "row",
    height: 60,
    width: "100%",
  },
  indicator: {
    position: "absolute",
    top: 0,
    height: 3,
    borderRadius: 2,
  },
});
