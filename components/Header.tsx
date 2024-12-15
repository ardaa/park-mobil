import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  showBackButton?: boolean;
}

export default function Header({ showBackButton = true }: HeaderProps) {
  return (
    <View style={styles.header}>
      {showBackButton && (
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
      )}
      <Image 
        source={require('../assets/images/logo-notext.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    position: 'relative',
    marginTop: 60,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    padding: 8,
  },
  logo: {
    height: 32,
    width: 32,
  },
}); 