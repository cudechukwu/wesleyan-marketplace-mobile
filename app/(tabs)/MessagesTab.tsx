import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function MessagesTab() {
  const navigation = useNavigation();
  const [conversations, setConversations] = useState<
    { username: string; last_message: { text: string; timestamp: string } }[]
  >([]);

  useEffect(() => {
    fetch('http://localhost:8000/get_conversations.php', {
      credentials: 'include', // Very important to keep session
    })
      .then(res => res.json())
      .then(data => setConversations(data))
      .catch(error => console.error('Error fetching conversations:', error));
  }, []);

  const goToChat = (username: string) => {
    (navigation as any).navigate('ChatScreen', { recipient: username });
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffMs = now.getTime() - messageTime.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours >= 24) {
      return `${Math.floor(hours / 24)}d ago`;
    } else if (hours >= 1) {
      return `${hours}h ago`;
    } else if (minutes >= 1) {
      return `${minutes}m ago`;
    } else {
      return `Just now`;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Messages</Text>
  
      <FlatList
        data={conversations}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.conversation} onPress={() => goToChat(item.username)}>
            <View style={styles.textArea}>
              <Text style={styles.username}>{item.username}</Text>
              <Text numberOfLines={1} style={styles.lastMessage}>
                {item.last_message?.text ?? 'No messages yet'}
              </Text>
            </View>
            <Text style={styles.time}>
              {item.last_message?.timestamp ? formatTimeAgo(item.last_message.timestamp) : ''}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fd6585', // 🩷 Tie into your gradient softly
    marginBottom: 20,
  },
  conversation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  textArea: { flex: 1 },
  username: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333', // Dark gray instead of black
  },
  lastMessage: {
    color: '#777777', // Medium gray
    marginTop: 4,
  },
  time: {
    fontSize: 12,
    color: '#999999', // Lighter gray for timestamps
    marginLeft: 10,
  },
});


