import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router'; // ✅ useRouter instead of useNavigation
import api from '../../utils/api';

const LoginScreen = () => {
  const router = useRouter(); // ✅ for expo-router navigation
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleLogin = async () => {
    try {
      const response = await api.post(
        '/login.php',
        { username, password },
        { withCredentials: true } // ✅ send cookies to establish session
      );
  
      setMessage(response.data.message);
  
      if (response.data.status === 'success') {
        await AsyncStorage.setItem('username', username);
  
        // ✅ Navigate into tab layout
        router.replace('/ListingsScreen');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Error logging in');
    }
  };
  

  return (
    <LinearGradient colors={['#ffd3a5', '#fd6585']} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor={isDark ? '#aaa' : '#666'}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={isDark ? '#aaa' : '#666'}
          secureTextEntry
          onChangeText={setPassword}
        />
        <View style={styles.buttonContainer}>
          <Button title="Login" onPress={handleLogin} />
        </View>
        {message ? <Text style={styles.message}>{message}</Text> : null}

        <TouchableOpacity onPress={() => router.push('/screens/RegisterScreen')}>
          <Text style={styles.link}>Don’t have an account? Register</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#ffffffcc',
    color: '#000',
    padding: 12,
    borderRadius: 5,
    marginBottom: 12,
  },
  buttonContainer: {
    marginTop: 10,
  },
  message: {
    marginTop: 10,
    color: '#fff',
    textAlign: 'center',
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#fff',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
