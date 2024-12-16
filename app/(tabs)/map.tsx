import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getClosestMaps } from '../../lib/api-client';
import { useTranslation } from 'react-i18next';
import Header from "@/components/Header";
interface MapLocation {
  id: string;
  name: string;
  distance: number;
  address: string;
}

export default function MapListScreen() {
  const { t } = useTranslation();
  const [maps, setMaps] = useState<MapLocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMaps = async () => {
      try {
        const nearbyMaps = await getClosestMaps();
        setMaps(nearbyMaps);
      } catch (error) {
        console.error('Error loading maps:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMaps();
  }, []);

  const handleMapSelect = (mapId: string) => {
    router.push({
      pathname: "/mapshow",
      params: { id: mapId }
    });
  };

  const renderMapItem = ({ item }: { item: MapLocation }) => (
    <TouchableOpacity 
      style={styles.mapItem} 
      onPress={() => handleMapSelect(item.id)}
    >
      <View style={styles.mapItemContent}>
        <Ionicons name="location" size={24} color="#1C0CCE" style={styles.icon} />
        <View style={styles.mapItemText}>
          <Text style={styles.mapName}>{item.name}</Text>
          <Text style={styles.mapAddress}>{item.address}</Text>
          <Text style={styles.mapDistance}>{item.distance.toFixed(1)} km away</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#666" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1C0CCE", "#1d3461"]}
        style={StyleSheet.absoluteFill}
      />
      <Header  showBackButton={false} />
      <View style={styles.content}>
        <Text style={styles.title}>{t('maps.nearbyTitle', 'Nearby Parking Maps')}</Text>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>
              {t('maps.loading', 'Loading nearby maps...')}
            </Text>
          </View>
        ) : (
          <FlatList
            data={maps}
            renderItem={renderMapItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 20,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C0CCE',
    marginBottom: 24,
  },
  listContainer: {
    paddingBottom: 16,
  },
  mapItem: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  mapItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  icon: {
    marginRight: 12,
  },
  mapItemText: {
    flex: 1,
  },
  mapName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  mapAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  mapDistance: {
    fontSize: 14,
    color: '#888',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});
