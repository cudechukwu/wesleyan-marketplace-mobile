import React, { useEffect, useState } from 'react';
import { Tabs, Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabsLayout() {
  const [initialRoute, setInitialRoute] = useState('index'); // default
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const user = await AsyncStorage.getItem('username');
      if (user) {
        setInitialRoute('ListingsScreen');
      }
      setReady(true); // ✅ don't render Tabs until this is done
    };
    checkLogin();
  }, []);

  if (!ready) return null;

  return (
    <>
      {/* ✅ Redirect after checking login */}
      {initialRoute !== 'index' && <Redirect href={initialRoute} />}

      <Tabs>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <IconSymbol name="house.fill" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="MessagesTab"
          options={{
            title: 'Messages',
            tabBarIcon: ({ color }) => (
              <IconSymbol name="message.fill" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="Profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => (
              <IconSymbol name="person.circle" size={28} color={color} />
            ),
          }}
        />
        {/* Hidden but usable screens */}
        <Tabs.Screen name="ChatScreen" options={{ href: null }} />
        <Tabs.Screen name="ListingsScreen" options={{ href: null }} />
        <Tabs.Screen name="CreateListingScreen" options={{ href: null }} />
        <Tabs.Screen name="EditListingScreen" options={{ href: null }} />
        <Tabs.Screen name="FavoritesScreen" options={{ href: null }} />
      </Tabs>
    </>
  );
}
