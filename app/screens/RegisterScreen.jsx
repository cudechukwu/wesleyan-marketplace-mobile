import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  useColorScheme,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import api from '../../utils/api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  const handleRegister = async () => {
    if (!username || !password || !confirmPassword) {
      setMessage("All fields are required.");
      return;
    }
  
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }
  
    if (password !== confirmPassword) {
      setMessage("Passwords don't match.");
      return;
    }
  
    try {
      const response = await api.post('/register.php', {
        username,
        password,
        confirm_password: confirmPassword,
      });
  
      console.log("Response from server:", response.data);
      setMessage(response.data.message);
  
      if (response.data.status === 'success') {
        await AsyncStorage.setItem('username', username); // ✅ Save it!
        Alert.alert("Success", "Account created! Redirecting to login...");
        setTimeout(() => {
          router.replace('screens/LoginScreen');
        }, 1000);
      } else {
        setMessage(response.data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error?.response?.data || error.message);
      setMessage(error?.response?.data?.message || 'Registration failed. Please try again.');
    }
  };
  

  return (
    <LinearGradient colors={['#ffd3a5', '#fd6585']} style={styles.gradient}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Register</Text>

          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#666"
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            secureTextEntry
            onChangeText={setPassword}
            textContentType="oneTimeCode"
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#666"
            secureTextEntry
            onChangeText={setConfirmPassword}
            textContentType="oneTimeCode"
          />

          <View style={styles.buttonContainer}>
            <Button title="Register" onPress={handleRegister} color="#fff" />
          </View>

          {message ? <Text style={styles.message}>{message}</Text> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'serif',
    textAlign: 'center',
    marginBottom: 24,
    color: '#fff',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    color: '#000',
  },
  buttonContainer: {
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 8,
  },
  message: {
    marginTop: 12,
    textAlign: 'center',
    color: '#fff',
  },
});

export default Register;
