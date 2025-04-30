import { Tabs } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabsLayout() {
  return (
    <Tabs>
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

      {/* Hidden routes — they still render inside the tab layout, so tab bar stays */}
      <Tabs.Screen name="ChatScreen" options={{ href: null }} />
      <Tabs.Screen name="ListingsScreen" options={{ href: null }} />
      <Tabs.Screen name="CreateListingScreen" options={{ href: null }} />
      <Tabs.Screen name="EditListingScreen" options={{ href: null }} />
    </Tabs>
  );
}
