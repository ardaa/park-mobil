import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, ActivityIndicator, Platform, ActionSheetIOS, Linking, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header";
import { useRouter } from "expo-router";
import { getNearbyParking, type ParkingSpot, apiServices, type CurrentParking } from "@/lib/api-services";
import { useEffect, useState } from "react";

interface NavigationApp {
  name: string;
  urlScheme: string;
  fallbackUrl: string;
  iosStoreUrl?: string;
}

const NAVIGATION_APPS: NavigationApp[] = [
  {
    name: 'Apple Maps',
    urlScheme: 'maps://',
    fallbackUrl: 'maps://', // Apple Maps is always installed on iOS
  },
  {
    name: 'Google Maps',
    urlScheme: 'comgooglemaps://',
    fallbackUrl: 'https://www.google.com/maps/dir/?api=1',
    iosStoreUrl: 'https://apps.apple.com/app/google-maps/id585027354',
  },
  {
    name: 'Waze',
    urlScheme: 'waze://',
    fallbackUrl: 'https://www.waze.com/ul',
    iosStoreUrl: 'https://apps.apple.com/app/waze-navigation-live-traffic/id323229106',
  },
];

export default function FindParkingScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentParking, setCurrentParking] = useState<CurrentParking | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSpots, setFilteredSpots] = useState<ParkingSpot[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [spots, current] = await Promise.all([
          getNearbyParking(),
          apiServices.getCurrentParking()
        ]);
        setParkingSpots(spots);
        setFilteredSpots(spots);
        setCurrentParking(current);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getParkingName = (spot: ParkingSpot) => {
    return i18n.language === 'tr' ? spot.name : spot.name.replace('Otoparkı', 'Parking').replace('AVM', 'Mall');
  };

  const checkInstalledApps = async () => {
    const installedApps = await Promise.all(
      NAVIGATION_APPS.map(async (app) => {
        try {
          const isInstalled = await Linking.canOpenURL(app.urlScheme);
          return isInstalled ? app : null;
        } catch {
          return null;
        }
      })
    );

    return installedApps.filter((app): app is NavigationApp => app !== null);
  };

  const openNavigation = async (spot: ParkingSpot) => {
    if (Platform.OS === 'ios') {
      const installedApps = await checkInstalledApps();
      
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', ...installedApps.map(app => app.name)],
          cancelButtonIndex: 0,
        },
        async (buttonIndex) => {
          if (buttonIndex === 0) return; // Cancel was pressed
          
          const selectedApp = installedApps[buttonIndex - 1];
          const { latitude, longitude } = spot.coordinates;
          
          try {
            let url = '';
            switch (selectedApp.name) {
              case 'Apple Maps':
                url = `maps://?daddr=${latitude},${longitude}`;
                break;
              
              case 'Google Maps':
                url = `comgooglemaps://?daddr=${latitude},${longitude}&directionsmode=driving`;
                break;
              
              case 'Waze':
                url = `waze://?ll=${latitude},${longitude}&navigate=yes`;
                break;
            }
            
            const canOpen = await Linking.canOpenURL(url);
            if (canOpen) {
              await Linking.openURL(url);
            } else if (selectedApp.iosStoreUrl) {
              // If app is not installed (somehow missed in our check), open App Store
              await Linking.openURL(selectedApp.iosStoreUrl);
            } else {
              // Use fallback URL (web version)
              await Linking.openURL(`${selectedApp.fallbackUrl}&destination=${latitude},${longitude}`);
            }
          } catch (error) {
            console.error('Error opening navigation:', error);
          }
        }
      );
    } else {
      // For Android, directly open Google Maps in browser as fallback
      const { latitude, longitude } = spot.coordinates;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      await Linking.openURL(url);
    }
  };

  const formatDuration = (startTime: string) => {
    const start = new Date(startTime);
    const now = new Date();
    const diff = Math.floor((now.getTime() - start.getTime()) / 1000 / 60); // minutes
    
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    
    if (hours === 0) {
      return `${minutes}dk`;
    }
    return `${hours}s ${minutes}dk`;
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    
    if (!text.trim()) {
      setFilteredSpots(parkingSpots);
      return;
    }

    const query = text.toLowerCase();
    
    // Filter parking spots
    const filtered = parkingSpots.filter(spot => {
      return (
        spot.name.toLowerCase().includes(query) ||
        spot.distance.toLowerCase().includes(query) ||
        spot.price.toLowerCase().includes(query) ||
        spot.available.toString().includes(query)
      );
    });

    setFilteredSpots(filtered);
  };

  const shouldShowCurrentParking = () => {
    if (!currentParking || !searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      currentParking.location.toLowerCase().includes(query) ||
      currentParking.floor.toString().includes(query) ||
      currentParking.spot.toLowerCase().includes(query) ||
      formatDuration(currentParking.startTime).toLowerCase().includes(query) ||
      currentParking.cost.toString().includes(query)
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1C0CCE", "#1d3461"]}
        style={StyleSheet.absoluteFill}
      />
      <Header showBackButton={true} />
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t("findParking.title")}</Text>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder={t("findParking.searchPlaceholder")}
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => handleSearch('')}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        {currentParking && shouldShowCurrentParking() && (
          <View style={styles.currentParkingContainer}>
            <View style={styles.currentParkingHeader}>
              <Ionicons name="car" size={20} color="#1C0CCE" />
              <Text style={styles.currentParkingTitle}>
                {t("findParking.currentParking")}
              </Text>
            </View>
            
            <View style={styles.currentParkingContent}>
              <View style={styles.currentParkingInfo}>
                <Text style={styles.currentParkingLocation}>
                  {currentParking.location}
                </Text>
                <Text style={styles.currentParkingDetails}>
                  {t("findParking.floor")} {currentParking.floor} • {t("findParking.spot")} {currentParking.spot}
                </Text>
                <View style={styles.currentParkingStats}>
                  <View style={styles.currentParkingStat}>
                    <Text style={styles.currentParkingStatLabel}>
                      {t("findParking.duration")}
                    </Text>
                    <Text style={styles.currentParkingStatValue}>
                      {formatDuration(currentParking.startTime)}
                    </Text>
                  </View>
                  <View style={styles.currentParkingStatDivider} />
                  <View style={styles.currentParkingStat}>
                    <Text style={styles.currentParkingStatLabel}>
                      {t("findParking.cost")}
                    </Text>
                    <Text style={styles.currentParkingStatValue}>
                      ₺{currentParking.cost.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.currentParkingButtons}>
                <TouchableOpacity 
                  style={styles.viewDetailsButton}
                  onPress={() => router.push('/active-parking')}
                >
                  <Text style={styles.viewDetailsText}>
                    {t("findParking.viewDetails")}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.floorPlanButton}
                  onPress={() => router.push({
                    pathname: '/mapshow',
                    params: { id: currentParking.id, isCarParked: true }
                  })}
                >
                  <Ionicons name="map-outline" size={16} color="#1C0CCE" />
                  <Text style={styles.floorPlanText}>
                    {t("findParking.goToCar")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>{t("findParking.nearbySpots")}</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#1C0CCE" style={styles.loader} />
        ) : filteredSpots.length > 0 ? (
          filteredSpots.map((spot) => (
            <Pressable key={spot.id} style={styles.parkingSpot}>
              <View style={styles.spotInfo}>
                <Text style={styles.spotName}>{getParkingName(spot)}</Text>
                <Text style={styles.spotDistance}>{spot.distance}</Text>
                <Text style={styles.spotPrice}>
                  {spot.price.replace('saat', i18n.language === 'tr' ? 'saat' : 'hour')}
                </Text>
              </View>
              <View style={styles.availabilityContainer}>
                <Text style={styles.availabilityText}>
                  {spot.available} {t("findParking.spotsAvailable")}
                </Text>
              </View>
              <View style={styles.buttonContainer}>
                <Pressable 
                  style={[styles.button, styles.navigationButton]}
                  onPress={() => openNavigation(spot)}
                >
                  <Ionicons name="navigate" size={16} color="#FFF" />
                  <Text style={styles.buttonText}>{t("findParking.navigation")}</Text>
                </Pressable>
                <Pressable 
                  style={[styles.button, styles.floorMapButton]}
                  onPress={() => router.push({
                    pathname: '/mapshow',
                    params: { id: spot.id, isCarParked: false }
                  })}
                >
                  <Ionicons name="map" size={16} color="#FFF" />
                  <Text style={styles.buttonText}>{t("findParking.floorMap")}</Text>
                </Pressable>
              </View>
            </Pressable>
          ))
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>
              {t("findParking.noResults")}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
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
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C0CCE",
    marginBottom: 16,
    marginTop: 24,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  parkingSpot: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  spotInfo: {
    marginBottom: 8,
  },
  spotName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C0CCE",
  },
  spotDistance: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  spotPrice: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  availabilityContainer: {
    backgroundColor: "rgba(28, 12, 206, 0.1)",
    borderRadius: 8,
    padding: 8,
    alignSelf: "flex-start",
  },
  availabilityText: {
    color: "#1C0CCE",
    fontSize: 14,
    fontWeight: "500",
  },
  loader: {
    marginTop: 32,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 8,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    gap: 6,
  },
  navigationButton: {
    backgroundColor: '#1C0CCE',
  },
  floorMapButton: {
    backgroundColor: '#2E3A59',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  currentParkingContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  currentParkingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  currentParkingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C0CCE',
  },
  currentParkingContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentParkingInfo: {
    flex: 1,
  },
  currentParkingLocation: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  currentParkingDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  currentParkingStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentParkingStat: {
    flex: 1,
  },
  currentParkingStatLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  currentParkingStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  currentParkingStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#eee',
    marginHorizontal: 12,
  },
  currentParkingButtons: {
    gap: 12,
    width: 100,
    marginLeft: 12,
  },
  viewDetailsButton: {
    backgroundColor: '#1C0CCE15',
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  viewDetailsText: {
    color: '#1C0CCE',
    fontSize: 13,
    fontWeight: '500',
  },
  floorPlanButton: {
    backgroundColor: '#1C0CCE08',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    width: '100%',
  },
  floorPlanText: {
    color: '#1C0CCE',
    fontSize: 13,
    fontWeight: '500',
  },
  clearButton: {
    padding: 4,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 