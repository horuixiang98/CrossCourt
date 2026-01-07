import { TabBar } from "@/src/components/TabBar";
import { Tabs } from "expo-router";
import React from "react";

const TabLayout = () => {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen
        name="index"
        options={{ title: "首页", headerShown: false }}
      />
      <Tabs.Screen
        name="club"
        options={{ title: "公会", headerShown: false }}
      />
      <Tabs.Screen
        name="match"
        options={{ title: "比赛", headerShown: false }}
      />
      <Tabs.Screen
        name="stats"
        options={{ title: "排行", headerShown: false }}
      />
    </Tabs>
  );
};

export default TabLayout;
