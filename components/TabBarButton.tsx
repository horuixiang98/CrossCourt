import { icon } from "@/constants/icon";
import { Colors } from "@/constants/theme";
import React, { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const TabBarButton = ({ onPress, onLongPress, isFocused, routerName, label }: {
    onPress: () => void;
    onLongPress: () => void;
    isFocused: boolean;
    routerName: string;
    label: string;
}) => {
    const scale = useSharedValue(1);

    useEffect(() => {
        scale.value = withSpring(typeof isFocused === 'boolean' ? (isFocused ? 1 : 0) : isFocused, { duration: 350});
    }, [scale, isFocused]);

    
    const animatedIconStyle = useAnimatedStyle(() => {
        const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
        const top = interpolate(scale.value, [0, 1], [0, 9]);

        return {
            transform: [{ scale: scaleValue }],
            top: top,
        };
    });

    const animatedTextStyle = useAnimatedStyle(() => {
        const opacity = interpolate(scale.value, [0, 1], [1, 0]);
        return {
            opacity,
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
                color: isFocused ? Colors.light.darkgreen : '#222' ,
            })}
            </Animated.View>
            
            <Animated.Text style={[{ color: isFocused ? Colors.light.darkgreen : '#222' }, animatedTextStyle]}>
              {label}
            </Animated.Text>
          </Pressable>
    );
}

export default TabBarButton;

const styles = StyleSheet.create({
    tabbarItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
    },
});