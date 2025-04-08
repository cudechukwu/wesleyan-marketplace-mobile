import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <LinearGradient
      colors={['#ffd3a5', '#fd6585']}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Wesleyan Marketplace</Text>
        <Text style={styles.subtitle}>
          Buy and sell items easily within your college community.
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            title="Get Started / Login"
            onPress={() => navigation.navigate('screens/LoginScreen')}
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
