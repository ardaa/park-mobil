import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Button } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
  };

  const navigateToVehicles = () => {
    router.push('/vehicles');
  };

  const navigateToParkingHistory = () => {
    router.push('/history');
  };

  const navigateToPaymentMethods = () => {
    router.push('/payment');
  };

  const navigateToSettings = () => {
    router.push('/settings');
  };

  const navigateToSupport = () => {
    router.push('/help');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1C0CCE", "#1d3461"]}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://placekitten.com/200/200' }}
            style={styles.profileImage}
          />
          <Text style={styles.name}>Baha Akdemir</Text>
          <Text style={styles.email}>baha.akdemir@gmail.com</Text>
        </View>

        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={navigateToVehicles}
          >
            <Ionicons name="car-outline" size={24} color="white" />
            <Text style={styles.menuText}>{t('profile.myVehicles')}</Text>
            <Ionicons name="chevron-forward" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={navigateToParkingHistory}
          >
            <Ionicons name="time-outline" size={24} color="white" />
            <Text style={styles.menuText}>{t('profile.parkingHistory')}</Text>
            <Ionicons name="chevron-forward" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={navigateToPaymentMethods}
          >
            <Ionicons name="card-outline" size={24} color="white" />
            <Text style={styles.menuText}>{t('profile.paymentMethods')}</Text>
            <Ionicons name="chevron-forward" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={navigateToSettings}
          >
            <Ionicons name="settings-outline" size={24} color="white" />
            <Text style={styles.menuText}>{t('profile.settings')}</Text>
            <Ionicons name="chevron-forward" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={navigateToSupport}
          >
            <Ionicons name="help-circle-outline" size={24} color="white" />
            <Text style={styles.menuText}>{t('profile.helpSupport')}</Text>
            <Ionicons name="chevron-forward" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>{t('profile.logout')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    color: "#FFF",
    fontSize: 16,
    opacity: 0.8,
  },
  section: {
    padding: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  menuText: {
    color: "#FFF",
    fontSize: 16,
    flex: 1,
    marginLeft: 15,
  },
  logoutButton: {
    margin: 20,
    padding: 15,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
}); 