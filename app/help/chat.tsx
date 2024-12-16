import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Header from '../../components/Header';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
  image?: string;
}

export default function ChatScreen() {
  const { t } = useTranslation();
  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      text: t('help.chat.welcome'),
      sender: 'support',
      timestamp: new Date(),
    },
  ]);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t('help.chat.permissionDenied'),
          t('help.chat.permissionMessage')
        );
        return false;
      }
      return true;
    }
    return true;
  };

  const handleImagePick = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets[0].uri) {
        const newMessage: Message = {
          id: Date.now().toString(),
          text: '',
          sender: 'user',
          timestamp: new Date(),
          image: result.assets[0].uri,
        };
        
        setMessages(prev => [...prev, newMessage]);

        // Simulate support response
        setTimeout(() => {
          const supportMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: t('help.chat.imageReceived'),
            sender: 'support',
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, supportMessage]);
        }, 1000);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(
        t('help.chat.error'),
        t('help.chat.imageError')
      );
    }
  };

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message,
        sender: 'user',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessage('');

      // Simulate support response
      setTimeout(() => {
        const supportMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: t('help.chat.autoResponse'),
          sender: 'support',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, supportMessage]);
      }, 1000);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'user' ? styles.userMessage : styles.supportMessage
    ]}>
      {item.image ? (
        <TouchableOpacity 
          onPress={() => {/* Add image preview functionality */}}
        >
          <Image 
            source={{ uri: item.image }} 
            style={styles.messageImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      ) : (
        <Text style={[
          styles.messageText,
          item.sender === 'user' && styles.userMessageText
        ]}>
          {item.text}
        </Text>
      )}
      <Text style={[
        styles.timestamp,
        item.sender === 'user' && styles.userTimestamp
      ]}>
        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient
        colors={["#1C0CCE", "#1d3461"]}
        style={StyleSheet.absoluteFill}
      />
      <Header showBackButton={true} />
      
      <View style={styles.content}>
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
          inverted={false}
        />

        <View style={styles.inputContainer}>
          <TouchableOpacity 
            style={styles.attachButton}
            onPress={handleImagePick}
          >
            <Ionicons name="image" size={24} color="#666" />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder={t('help.chat.placeholder')}
            placeholderTextColor="#666"
            multiline
          />
          
          <TouchableOpacity 
            style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <Ionicons 
              name="send" 
              size={24} 
              color={message.trim() ? '#1C0CCE' : '#999'} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 20,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userMessage: {
    backgroundColor: '#1C0CCE',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  supportMessage: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 4,
  },
  userMessageText: {
    color: '#fff',
  },
  userTimestamp: {
    color: 'rgba(255,255,255,0.7)',
  },
  attachButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
}); 