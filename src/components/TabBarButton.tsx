import { icon } from "@/constants/icon";
import { Colors } from "@/constants/theme";
import React, { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const TabBarButton = ({
  onPress,
  onLongPress,
  isFocused,
  routerName,
  label,
}: {
  onPress: () => void;
  onLongPress: () => void;
  isFocused: boolean;
  routerName: string;
  label: string;
}) => {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0, { duration: 350 });
  }, [isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.1]);
    return {
      transform: [{ scale: scaleValue }],
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [0.9, 1]);
    return {
      transform: [{ scale: scaleValue }],
    };
  });

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabbarItem}
    >
      <Animated.View style={animatedIconStyle}>
        {icon[routerName as keyof typeof icon]({
          color: isFocused ? Colors.light.primaryGreen : "#475569",
          fill: isFocused ? Colors.light.primaryGreen : "transparent",
          size: 22,
        })}
      </Animated.View>

      <Animated.Text
        style={[
          styles.label,
          { color: isFocused ? Colors.light.primaryGreen : "#475569" },
          animatedTextStyle,
        ]}
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
};

export default TabBarButton;

const styles = StyleSheet.create({
  tabbarItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  label: {
    fontSize: 9,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 2,
  },
});
