import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { apiServices, FavoriteLocation } from '../lib/api-services';

export default function Favorites() {
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await apiServices.getFavoriteLocations();
        setFavorites(data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  // Rest of the component code...
} 