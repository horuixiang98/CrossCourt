import React, { createContext, useContext } from "react";
import {
  SharedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface TabBarContextType {
  tabBarTranslateY: SharedValue<number>;
  hideTabBar: () => void;
  showTabBar: () => void;
}

const TabBarContext = createContext<TabBarContextType | undefined>(undefined);

export function TabBarProvider({ children }: { children: React.ReactNode }) {
  const tabBarTranslateY = useSharedValue(0);

  const hideTabBar = () => {
    // Assuming the tab bar height + bottom margin is around 100
    tabBarTranslateY.value = withTiming(150, { duration: 500 });
  };

  const showTabBar = () => {
    tabBarTranslateY.value = withTiming(0, { duration: 300 });
  };

  return (
    <TabBarContext.Provider
      value={{ tabBarTranslateY, hideTabBar, showTabBar }}
    >
      {children}
    </TabBarContext.Provider>
  );
}

export function useTabBar() {
  const context = useContext(TabBarContext);
  if (!context) {
    throw new Error("useTabBar must be used within a TabBarProvider");
  }
  return context;
}
