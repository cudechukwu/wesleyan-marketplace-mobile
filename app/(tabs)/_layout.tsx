import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';

export default function TabsLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      {/* Visible tabs */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol name="house.fill" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="MessagesTab"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color }) => <IconSymbol name="message.fill" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol name="person.circle" size={28} color={color} />,
        }}
      />

      {/* Hidden but routable screens */}
      <Tabs.Screen name="ChatScreen" options={{ href: null }} />
      <Tabs.Screen name="ListingsScreen" options={{ href: null }} />
      <Tabs.Screen name="CreateListingScreen" options={{ href: null }} />
      <Tabs.Screen name="EditListingScreen" options={{ href: null }} />
    </Tabs>
  );
}
