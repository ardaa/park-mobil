import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { apiServices, ParkingHistory } from '../lib/api-services';
import Header from '../components/Header';

export default function HistoryScreen() {
  const { t } = useTranslation();
  const [history, setHistory] = useState<ParkingHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParkingHistory = async () => {
      try {
        const data = await apiServices.getParkingHistory();
        setHistory(data);
      } catch (error) {
        console.error('Error fetching parking history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchParkingHistory();
  }, []);

  const renderHistoryItem = ({ item }: { item: ParkingHistory }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyHeader}>
        <Text style={styles.date}>
          {new Date(item.date).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Text>
        <Text style={styles.cost}>{item.cost.toFixed(2)} ₺</Text>
      </View>
      <Text style={styles.location}>{item.location}</Text>
      <Text style={styles.duration}>{item.duration}</Text>
      <View style={[styles.statusBadge, item.status === 'ongoing' && styles.ongoingBadge]}>
        <Text style={[
          styles.statusText, 
          item.status === 'ongoing' && { color: '#ED6C02' }
        ]}>
          {t(`history.status.${item.status}`)}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1C0CCE", "#1d3461"]}
        style={StyleSheet.absoluteFill}
      />
      <Header />
      <View style={styles.content}>
        <Text style={styles.title}>{t("history.title")}</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#1C0CCE" style={styles.loader} />
        ) : (
          <FlatList
            data={history}
            renderItem={renderHistoryItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
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
    backgroundColor: "#F8F9FA",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 20,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C0CCE",
    marginBottom: 16,
  },
  list: {
    paddingBottom: 24,
  },
  historyItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1d3461',
  },
  cost: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C0CCE',
  },
  location: {
    fontSize: 15,
    color: '#333',
    marginBottom: 4,
  },
  duration: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statusBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  ongoingBadge: {
    backgroundColor: '#FFF3E0',
  },
  statusText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '500',
  },
  loader: {
    flex: 1,
  },
}); 