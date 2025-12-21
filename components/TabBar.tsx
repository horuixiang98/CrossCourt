import { Colors } from "@/constants/theme";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useState } from "react";
import { LayoutChangeEvent, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import TabBarButton from "./TabBarButton";

import { useTabBar } from "@/providers/TabBarProvider";

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { tabBarTranslateY } = useTabBar();
  const [diamensions, setDiamensions] = useState({ height: 20, width: 100 });
  const buttonWidth = diamensions.width / state.routes.length;
  const onTabbarLayout = (e: LayoutChangeEvent) => {
    setDiamensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  };

  const tabPositionX = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: tabBarTranslateY.value }],
    };
  });

  return (
    <Animated.View
      onLayout={onTabbarLayout}
      style={[styles.tabbar, containerAnimatedStyle]}
    >
      <Animated.View
        style={[
          animatedStyle,
          {
            position: "absolute",
            backgroundColor: Colors.light.lightgreen,
            borderRadius: 30,
            marginHorizontal: 12,
            height: diamensions.height - 5,
            width: buttonWidth - 25,
          },
        ]}
      />
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
            duration: 800,
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 70,
    paddingVertical: 8,
    borderRadius: 50,
    shadowColor: "#00000088",
    elevation: 10,
  },
});
