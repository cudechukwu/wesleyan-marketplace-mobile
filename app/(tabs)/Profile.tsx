import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  useColorScheme,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const [username, setUsername] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      } else {
        // Not logged in, redirect to login
        // router.replace('screens/LoginScreen');
      }
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('username');
    Alert.alert('Logged out', 'You have been logged out.');
    router.replace('screens/LoginScreen');
  };

  return (
    <LinearGradient colors={['#ffd3a5', '#fd6585']} style={styles.gradient}>
      {/* ⬅️ Back Arrow */}
      <TouchableOpacity onPress={() => router.replace('(tabs)')} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      <View style={styles.container}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {username ? username.charAt(0).toUpperCase() : '?'}
          </Text>
        </View>
        <Text style={styles.welcome}>Hello, {username} 👋</Text>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 2,
  },
  container: {
    flex: 1,
    marginTop: 60,
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#fff',
    borderRadius: 75,
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
  },
  avatarText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#fd6585',
  },
  welcome: {
    fontSize: 24,
    color: '#fff',
    fontFamily: 'serif',
    marginBottom: 40,
  },
  logoutButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;
