import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import api from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateListingScreen = () => {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const stored = await AsyncStorage.getItem('username');
        if (stored) {
          setUsername(stored);
          console.log('✅ Username fetched from AsyncStorage:', stored);
        } else {
          console.warn('⚠️ No username found in AsyncStorage');
        }
      } catch (e) {
        console.error('Error fetching username from AsyncStorage:', e);
      }
    };
    fetchUsername();
  }, []);

  const handleSubmit = async () => {
    if (!username) {
      Alert.alert('User not identified', 'Please log in again.');
      return;
    }

    if (!itemName || !description || !price) {
      Alert.alert('Missing Fields', 'Please fill out all fields.');
      return;
    }

    try {
      const response = await api.post('/create.php', {
        username,
        item_name: itemName,
        description,
        price,
      });

      console.log('📨 API response:', response.data);
      setMessage(response.data.message);

      if (response.data.status === 'success') {
        Alert.alert('Success', 'Listing created!');
        router.replace('/ListingsScreen');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to create listing.');
      }
    } catch (error) {
      console.error('❌ Create listing error:', error?.response?.data || error.message);
      Alert.alert('Error', error?.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <LinearGradient colors={['#ffd3a5', '#fd6585']} style={styles.gradient}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.inner}>
          {/* 🔙 Back Button */}
          <TouchableOpacity onPress={() => router.replace('/ListingsScreen')} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back to Listings</Text>
          </TouchableOpacity>


          <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>Create New Listing</Text>

          <TextInput
            placeholder="Item Name"
            placeholderTextColor={isDark ? '#aaa' : '#444'}
            style={styles.input}
            value={itemName}
            onChangeText={setItemName}
          />

          <TextInput
            placeholder="Description"
            placeholderTextColor={isDark ? '#aaa' : '#444'}
            style={[styles.input, styles.multilineInput]}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <TextInput
            placeholder="Price"
            placeholderTextColor={isDark ? '#aaa' : '#444'}
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />

          <Button title="Submit Listing" onPress={handleSubmit} color="#fff" />
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
    flex: 1,
    justifyContent: 'center',
  },
  inner: {
    padding: 24,
    paddingTop: 48,
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'serif',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  message: {
    marginTop: 10,
    textAlign: 'center',
    color: '#fff',
  },
});

export default CreateListingScreen;
