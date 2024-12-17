import React, { useEffect, useState } from 'react';
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
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { AirbnbRating } from 'react-native-ratings';
import { apiServices } from '../../lib/api-services';

interface ParkingHistory {
  id: string;
  location: string;
  date: string;
  status?: string;
  amount?: number;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
  image?: string;
  options?: {
    text: string;
    value: string;
    data?: ParkingHistory;
  }[];
}

// Add props interface for ChatHeader
interface ChatHeaderProps {
  onEndChat: () => void;
}

// Update ChatHeader component to accept props
function ChatHeader({ onEndChat }: ChatHeaderProps) {
  const { t } = useTranslation();
  
  const handleEndChat = () => {
    Alert.alert(
      t('help.chat.endChatTitle'),
      t('help.chat.endChatMessage'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel'
        },
        {
          text: t('common.confirm'),
          style: 'destructive',
          onPress: onEndChat // Use the passed prop instead of direct state setter
        }
      ]
    );
  };

  return (
    <View style={chatHeaderStyles.header}>
      <TouchableOpacity 
        onPress={() => router.back()} 
        style={chatHeaderStyles.backButton}
      >
        <Ionicons name="chevron-back" size={24} color="white" />
      </TouchableOpacity>
      
      <View style={chatHeaderStyles.titleContainer}>
        <Text style={chatHeaderStyles.title}>{t('help.chat.title')}</Text>
        <Text style={chatHeaderStyles.subtitle}>{t('help.chat.supportAgent')}</Text>
      </View>

      <TouchableOpacity 
        onPress={handleEndChat}
        style={chatHeaderStyles.endButton}
      >
        <Ionicons name="close-circle-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const chatHeaderStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    marginTop: 60,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  endButton: {
    padding: 8,
  },
});

export default function ChatScreen() {
  const { t } = useTranslation();
  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [parkingHistory, setParkingHistory] = React.useState<ParkingHistory[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [clickedOptions, setClickedOptions] = React.useState<Set<string>>(new Set());
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);

  // Initialize chat with welcome message and first question
  useEffect(() => {
    const initializeChat = async () => {
      setMessages([
        {
          id: '1',
          text: t('help.chat.welcome'),
          sender: 'support',
          timestamp: new Date(),
        },
        {
          id: '2',
          text: t('help.chat.askTransaction'),
          sender: 'support',
          timestamp: new Date(),
          options: [
            { text: t('common.yes'), value: 'yes' },
            { text: t('common.no'), value: 'no' },
          ],
        },
      ]);

      try {
        const history = await apiServices.getParkingHistory();
        setParkingHistory(history);
      } catch (error) {
        console.error('Error fetching parking history:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, [t]);

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

  const handleOptionSelect = async (option: string, data?: ParkingHistory) => {
    // Add the clicked option to the set
    setClickedOptions(prev => new Set([...prev, option]));
    
    // Add user's selection as a message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: data ? `${data.location} - ${data.date}` : option,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);

    // Handle different conversation stages
    if (option === 'yes') {
      // Show parking history
      const historyMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: t('help.chat.selectTransaction'),
        sender: 'support',
        timestamp: new Date(),
        options: parkingHistory.map(parking => ({
          text: `${parking.location} - ${new Date(parking.date).toLocaleDateString()}`,
          value: parking.id,
          data: parking,
        })),
      };
      setMessages(prev => [...prev, historyMessage]);
    } else if (option === 'no' || data) {
      // Show support topics
      const topicsMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: t('help.chat.selectTopic'),
        sender: 'support',
        timestamp: new Date(),
        options: [
          { text: t('help.chat.topics.payment'), value: 'payment' },
          { text: t('help.chat.topics.technical'), value: 'technical' },
          { text: t('help.chat.topics.general'), value: 'general' },
          { text: t('help.chat.topics.other'), value: 'other' },
        ],
      };
      setMessages(prev => [...prev, topicsMessage]);
    } else if (['payment', 'technical', 'general', 'other'].includes(option)) {
      // Ask for issue description
      const descriptionMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: t('help.chat.describeIssue'),
        sender: 'support',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, descriptionMessage]);
    }
  };

  const handleSend = () => {
    if (message.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: message,
        sender: 'user',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      setMessage('');

      // Final support response
      setTimeout(() => {
        const supportMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: t('help.chat.agentResponse'),
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
        <TouchableOpacity onPress={() => {/* Add image preview */}}>
          <Image 
            source={{ uri: item.image }} 
            style={styles.messageImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      ) : (
        <>
          <Text style={[
            styles.messageText,
            item.sender === 'user' && styles.userMessageText
          ]}>
            {item.text}
          </Text>
          {item.options && (
            <View style={styles.optionsContainer}>
              {item.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    clickedOptions.has(option.value) && styles.optionButtonDisabled
                  ]}
                  onPress={() => handleOptionSelect(option.value, option.data)}
                  disabled={clickedOptions.has(option.value)}
                >
                  <Text style={[
                    styles.optionText,
                    clickedOptions.has(option.value) && styles.optionTextDisabled
                  ]}>
                    {option.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </>
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
      <ChatHeader onEndChat={() => setShowRatingModal(true)} />
      
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
      
      <Modal
        visible={showRatingModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRatingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('help.chat.rateTitle')}</Text>
            <Text style={styles.modalSubtitle}>{t('help.chat.rateDescription')}</Text>
            
            <AirbnbRating
              count={5}
              defaultRating={0}
              size={30}
              showRating={false}
              onFinishRating={setRating}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => {
                  setShowRatingModal(false);
                  router.back();
                }}
              >
                <Text style={styles.modalButtonTextSecondary}>
                  {t('help.chat.skipRating')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={() => {
                  // Here you would typically send the rating to your backend
                  console.log('Chat rated:', rating);
                  setShowRatingModal(false);
                  router.back();
                }}
              >
                <Text style={styles.modalButtonTextPrimary}>
                  {t('help.chat.submitRating')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  optionsContainer: {
    marginTop: 8,
    gap: 8,
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  optionText: {
    color: '#1C0CCE',
    fontSize: 14,
    fontWeight: '500',
  },
  optionButtonDisabled: {
    backgroundColor: '#e0e0e0',
    opacity: 0.7,
  },
  optionTextDisabled: {
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: '#1C0CCE',
  },
  modalButtonSecondary: {
    backgroundColor: '#f5f5f5',
  },
  modalButtonTextPrimary: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  modalButtonTextSecondary: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
}); 