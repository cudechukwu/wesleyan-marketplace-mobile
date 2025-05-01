// app/(tabs)/FavoritesScreen.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback } from 'react';
import api from '../../utils/api';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchFavorites = async () => {
        try {
          const res = await api.get('/get_favorites.php', { withCredentials: true });
          setFavorites(res.data.data || []);
        } catch (err) {
          console.error('❌ Failed to fetch favorites:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchFavorites();
    }, [])
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.itemName}>{item.item_name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.price}>${parseFloat(item.price).toFixed(2)}</Text>
    </View>
  );

  return (
    <LinearGradient colors={['#ffd3a5', '#fd6585']} style={styles.container}>
      <Text style={styles.header}>Your Favorites</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : favorites.length === 0 ? (
        <Text style={styles.empty}>No favorites yet</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 16 },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  itemName: {
    fontSize: 20,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    marginVertical: 6,
    color: '#555',
  },
  price: {
    fontWeight: 'bold',
    color: '#e5485d',
  },
  empty: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 40,
    fontStyle: 'italic',
  },
});
