import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const user = await AsyncStorage.getItem('username');
      if (user) {
        setUsername(user);
      }
    };
    checkUser();
  }, []);

  if (username) {
    return (
      <LinearGradient colors={['#ffd3a5', '#fd6585']} style={styles.background}>
        <View style={styles.overlay}>
          <Text style={styles.title}>Welcome back, {username}!</Text>
          <Text style={styles.subtitle}>
            Browse listings, message sellers, and manage your posts.
          </Text>
          <View style={styles.buttonContainer}>
            <Button
              title="Go to Listings"
              onPress={() => router.push('/ListingsScreen')}
              color="#fff"
            />
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#ffd3a5', '#fd6585']} style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Wesleyan Marketplace</Text>
        <Text style={styles.subtitle}>
          Buy and sell items easily within your college community.
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            title="Get Started / Login"
            onPress={() => router.push('/screens/LoginScreen')}
            color="#fff"
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 34,
    color: '#fff',
    fontFamily: 'serif',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'serif',
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '70%',
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    overflow: 'hidden',
  },
});
