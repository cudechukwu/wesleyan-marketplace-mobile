import React, { useState, useCallback, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utils/api';

const ListingsScreen = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const storedUser = await AsyncStorage.getItem('username');
      if (storedUser) setCurrentUser(storedUser);

      try {
        const res = await api.get('http://localhost:8000/get_favorites.php', {
          withCredentials: true,
        });
        const ids = (res.data.data || []).map((fav) => fav.listing_id);
        setFavorites(ids);
      } catch (err) {
        console.error('❌ Failed to fetch favorites:', err);
      }
    };
    init();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchListings = async () => {
        try {
          const response = await api.get('/listings.php');
          setListings(response.data.data);
          setFilteredListings(response.data.data);
        } catch (err) {
          setError('Failed to load listings.');
        } finally {
          setLoading(false);
        }
      };
      fetchListings();
    }, [])
  );

  useEffect(() => {
    if (searchText === '') {
      setFilteredListings(listings);
    } else {
      const filtered = listings.filter((item) =>
        item.item_name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredListings(filtered);
    }
  }, [searchText, listings]);

  const toggleFavorite = async (listingId) => {
    const isFavorite = favorites.includes(listingId);
    const endpoint = isFavorite ? '/remove_favorite.php' : '/add_favorite.php';
    try {
      await api.post(endpoint, { listing_id: listingId }, { withCredentials: true });
      setFavorites((prev) =>
        isFavorite ? prev.filter((id) => id !== listingId) : [...prev, listingId]
      );
    } catch (err) {
      console.error('❌ Favorite toggle error:', err);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: '#ffffffcc' }]}>
      <View style={styles.row}>
      <Image
        source={
          item.image_path
            ? { uri: `http://localhost:8000/uploads/${item.image_path}` }
            : require('../../assets/images/motrana.webp')
        }
        style={styles.image}
      />




        <View style={styles.info}>
          <Text style={[styles.itemName, { color: isDark ? '#3d3d3d' : '#000' }]}>{item.item_name}</Text>
          <Text style={[styles.description, { color: isDark ? '#ccc' : '#444' }]}>{item.description}</Text>
          <Text style={styles.price}>${parseFloat(item.price).toFixed(2)}</Text>
          <Text style={styles.seller}>Listed by: {item.username}</Text>

          {item.username === currentUser ? (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                router.push(
                  `/EditListingScreen?id=${item.id}&item_name=${item.item_name}&description=${item.description}&price=${item.price}`
                )
              }
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.messageButton}
              onPress={() =>
                router.push({ pathname: '/ChatScreen', params: { recipient: item.username } })
              }
            >
              <Text style={styles.messageButtonText}>Message Seller</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => toggleFavorite(item.id)} style={{ marginTop: 10 }}>
            <Ionicons
              name={favorites.includes(item.id) ? 'heart' : 'heart-outline'}
              size={24}
              color="#e5485d"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} color="#fd6585" />;
  }

  return (
    <LinearGradient colors={['#ffd3a5', '#fd6585']} style={{ flex: 1, paddingHorizontal: 16, paddingTop: 30 }}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/CreateListingScreen')}
      >
        <Text style={styles.addButtonText}>+ Add New Listing</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Search listings..."
        placeholderTextColor="#888"
        value={searchText}
        onChangeText={setSearchText}
        style={styles.searchInput}
      />

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={filteredListings}
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
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 16,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  card: {
    borderRadius: 12,
    marginBottom: 16,
    padding: 10,
    shadowColor: '#00000020',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 13,
    marginVertical: 4,
    fontStyle: 'italic',
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#e5485d',
  },
  seller: {
    fontSize: 13,
    color: '#555',
    fontStyle: 'italic',
  },
  editButton: {
    marginTop: 6,
    alignSelf: 'flex-end',
    backgroundColor: '#4a90e2',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  messageButton: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#fd6585',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  messageButtonText: {
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
