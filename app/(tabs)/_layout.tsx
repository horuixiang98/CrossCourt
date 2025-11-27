import { TabBar } from '@/components/TabBar';
import { Tabs } from 'expo-router';
import React from 'react';

const TabLayout = () => {
  return (
    <Tabs tabBar={props => <TabBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: 'Home', headerShown: false}} />
      <Tabs.Screen name="training" options={{ title: 'Training', headerShown: false}} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', headerShown: false}} />
    </Tabs>
  );
}

export default TabLayout;