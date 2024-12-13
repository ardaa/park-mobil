import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { apiServices, ParkingHistory } from '../lib/api-services';

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

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1C0CCE", "#1d3461"]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{t("history.title")}</Text>
        {/* Add parking history list here */}
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
    marginTop: 100,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C0CCE",
    marginBottom: 16,
  },
}); 