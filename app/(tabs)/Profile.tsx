import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  useColorScheme,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const [username, setUsername] = useState('');
  const [imageUri, setImageUri] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      const storedImage = await AsyncStorage.getItem('profileImage');
      if (storedUsername) setUsername(storedUsername);
      if (storedImage) setImageUri(storedImage);
    };
    loadProfile();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return Alert.alert('Permission denied', 'We need access to your gallery.');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      await AsyncStorage.setItem('profileImage', uri);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('username');
    Alert.alert('Logged out', 'You have been logged out.');
    router.replace('screens/LoginScreen');
  };

  return (
    <LinearGradient colors={['#ffd3a5', '#fd6585']} style={styles.gradient}>
      <TouchableOpacity onPress={() => router.replace('(tabs)')} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      <View style={styles.container}>
        <TouchableOpacity onPress={pickImage}>
          <View style={styles.avatar}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>
                {username ? username.charAt(0).toUpperCase() : '?'}
              </Text>
            )}
          </View>
        </TouchableOpacity>

        <Text style={styles.welcome}>Hello, {username} 👋</Text>

        <TouchableOpacity
          onPress={() => router.push('/FavoritesScreen')}
          style={styles.favoritesButton}
        >
          <Text style={styles.favoritesText}>❤️ View Favorites</Text>
        </TouchableOpacity>

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
    overflow: 'hidden',
    elevation: 4,
  },
  avatarText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#fd6585',
  },
  avatarImage: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
  },
  welcome: {
    fontSize: 24,
    color: '#fff',
    fontFamily: 'serif',
    marginBottom: 40,
  },
  favoritesButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 20,
  },
  favoritesText: {
    color: '#fd6585',
    fontWeight: 'bold',
    fontSize: 16,
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
