// app/screens/EditListingScreen.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  useColorScheme,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../../utils/api';
import { LinearGradient } from 'expo-linear-gradient';

const EditListingScreen = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const navigation = useNavigation();
  const route = useRoute();
  const { id, item_name, description, price } = route.params; // passed in from previous screen

  const [name, setName] = useState(item_name);
  const [desc, setDesc] = useState(description);
  const [cost, setCost] = useState(price.toString());
  const [message, setMessage] = useState('');

  const handleUpdate = async () => {
    try {
      const response = await api.post('/update.php', {
        id,
        item_name: name,
        description: desc,
        price: cost,
      });

      if (response.data.status === 'success') {
        Alert.alert('Success', 'Listing updated!');
        navigation.goBack(); // or navigate('ListingsScreen');
      } else {
        setMessage(response.data.message || 'Update failed.');
      }
    } catch (err) {
      setMessage('Error updating listing');
    }
  };

  return (
    <LinearGradient colors={['#ffd3a5', '#fd6585']} style={styles.container}>
      <Text style={styles.title}>Edit Listing</Text>

      <TextInput
        placeholder="Item Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={desc}
        onChangeText={setDesc}
        style={styles.input}
        multiline
      />
      <TextInput
        placeholder="Price"
        value={cost}
        onChangeText={setCost}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Update Listing" onPress={handleUpdate} color="#4a90e2" />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
  },
  input: {
    backgroundColor: '#ffffffcc',
    padding: 12,
    borderRadius: 6,
    marginBottom: 14,
    fontSize: 16,
  },
  message: {
    marginTop: 10,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
});

export default EditListingScreen;
