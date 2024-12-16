import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header';

interface FavoriteLocation {
  id: string;
  name: string;
  address: string;
  distance: number;
  availableSpots: number;
  pricePerHour: number;
  imageUrl?: string;
}

const FavoritesScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [favorites, setFavorites] = React.useState<FavoriteLocation[]>([
    {
      id: '1',
      name: 'Central Station Parking',
      address: '123 Main Street, City Center',
      distance: 0.5,
      availableSpots: 45,
      pricePerHour: 10,
    },
    {
      id: '2',
      name: 'Shopping Mall Garage',
      address: '456 Market Ave, Downtown',
      distance: 1.2,
      availableSpots: 120,
      pricePerHour: 8,
    },
  ]);

  const handleRemoveFavorite = (id: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
  };

  const renderFavoriteCard = (favorite: FavoriteLocation) => (
    <TouchableOpacity
      key={favorite.id}
      style={styles.favoriteCard}
      onPress={() => router.push(`/parking/${favorite.id}`)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardInfo}>
          <Text style={styles.locationName}>{favorite.name}</Text>
          <Text style={styles.address}>{favorite.address}</Text>
        </View>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => handleRemoveFavorite(favorite.id)}
        >
          <Ionicons name="heart" size={24} color="#1C0CCE" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="location" size={16} color="#666" />
          <Text style={styles.detailText}>{favorite.distance} km</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="car" size={16} color="#666" />
          <Text style={styles.detailText}>{favorite.availableSpots} spots</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="cash" size={16} color="#666" />
          <Text style={styles.detailText}>₺{favorite.pricePerHour}/hour</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1C0CCE", "#1d3461"]}
        style={StyleSheet.absoluteFill}
      />
      <Header showBackButton={true} />
      <ScrollView style={styles.content}>
        <Text style={styles.title}>{t('favorites.title')}</Text>

        {favorites.length > 0 ? (
          <View style={styles.favoritesContainer}>
            {favorites.map(renderFavoriteCard)}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="heart-outline" size={64} color="#666" />
            <Text style={styles.emptyStateText}>{t('favorites.noFavorites')}</Text>
            <TouchableOpacity
              style={styles.findParkingButton}
              onPress={() => router.push('/map')}
            >
              <Text style={styles.findParkingText}>{t('favorites.findParking')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C0CCE",
    marginBottom: 24,
  },
  favoritesContainer: {
    gap: 16,
  },
  favoriteCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardInfo: {
    flex: 1,
    marginRight: 12,
  },
  locationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#666',
  },
  favoriteButton: {
    padding: 4,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  findParkingButton: {
    backgroundColor: '#1C0CCE',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  findParkingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FavoritesScreen; 