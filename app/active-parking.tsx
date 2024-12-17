import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { apiServices, ParkingSession } from '../lib/api-services';
import Header from "../components/Header";

export default function ActiveParkingScreen() {
  const { t, i18n } = useTranslation();
  const [sessions, setSessions] = useState<ParkingSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveSessions = async () => {
      try {
        const data = await apiServices.getActiveParkingSessions();
        setSessions(data);
      } catch (error) {
        console.error('Error fetching active sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveSessions();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1C0CCE", "#1d3461"]}
        style={StyleSheet.absoluteFill}
      />
      <Header showBackButton={true} />
      <View style={styles.content}>
        <Text style={styles.title}>{t("activeParking.title")}</Text>
        
        {sessions.length > 0 ? (
          <View style={styles.activeSession}>
            <View style={styles.locationHeader}>
              <Ionicons name="location" size={24} color="#1C0CCE" />
              <Text style={styles.locationName}>
                {i18n.language === 'tr' ? 'Merkez İstasyon Otoparkı' : 'Central Station Parking'}
              </Text>
            </View>
            
            <View style={styles.timeContainer}>
              <Text style={styles.timeLabel}>{t("activeParking.timeElapsed")}</Text>
              <Text style={styles.timeValue}>02:45:30</Text>
            </View>
            
            <View style={styles.costContainer}>
              <Text style={styles.costLabel}>{t("activeParking.currentCost")}</Text>
              <Text style={styles.costValue}>₺37.50</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.emptyState}>{t("activeParking.noActiveParking")}</Text>
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
  emptyState: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginTop: 32,
  },
  activeSession: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  locationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  locationName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C0CCE",
    marginLeft: 8,
  },
  timeContainer: {
    marginBottom: 16,
  },
  timeLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1C0CCE",
  },
  costContainer: {
    marginBottom: 24,
  },
  costLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  costValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C0CCE",
  },
  extendButton: {
    backgroundColor: "#1C0CCE",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  extendButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  endButton: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1C0CCE",
  },
  endButtonText: {
    color: "#1C0CCE",
    fontSize: 16,
    fontWeight: "600",
  },
}); 