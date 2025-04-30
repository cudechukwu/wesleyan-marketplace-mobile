import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router'; // ✅ useRouter instead of useNavigation
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utils/api';

const ListingsScreen = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const screen = Dimensions.get('window');
  const router = useRouter(); // ✅ Correct way

  useEffect(() => {
    const fetchUsername = async () => {
      const storedUser = await AsyncStorage.getItem('username');
      if (storedUser) setCurrentUser(storedUser);
    };
    fetchUsername();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchListings = async () => {
        try {
          const response = await api.get('/listings.php');
          setListings(response.data.data);
        } catch (err) {
          setError('Failed to load listings.');
        } finally {
          setLoading(false);
        }
      };
      fetchListings();
    }, [])
  );

  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: '#ffffffcc' }]}>
      <Text style={[styles.itemName, { color: isDark ? '#3d3d3d' : '#000' }]}>{item.item_name}</Text>
      <Text style={[styles.description, { color: isDark ? '#ccc' : '#444' }]}>{item.description}</Text>
      <Text style={styles.price}>${parseFloat(item.price).toFixed(2)}</Text>
      <Text style={styles.seller}>Listed by: {item.username}</Text>

      {/* ✅ Show Edit only if current user is the owner */}
      {item.username === currentUser && (
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            router.push(`/EditListingScreen?id=${item.id}&item_name=${item.item_name}&description=${item.description}&price=${item.price}`)
          }
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} color="#fd6585" />;
  }

  return (
    <LinearGradient
      colors={['#ffd3a5', '#fd6585']}
      style={{ flex: 1, paddingHorizontal: 16, paddingTop: 30 }}
    >
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/CreateListingScreen')}
      >
        <Text style={styles.addButtonText}>+ Add New Listing</Text>
      </TouchableOpacity>

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    padding: 18,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#ffffffcc',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  itemName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e5485d',
  },
  seller: {
    fontSize: 13,
    marginTop: 6,
    color: '#555',
    fontStyle: 'italic',
  },
  editButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
    backgroundColor: '#4a90e2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ListingsScreen;
