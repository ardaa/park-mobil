import { View, Text, StyleSheet, TextInput, ScrollView, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

const NEARBY_PARKING = [
  { id: 1, name: "Merkez İstasyon Otoparkı", distance: "0.3 km", price: "₺15/saat", available: 45 },
  { id: 2, name: "AVM Otoparkı", distance: "0.7 km", price: "₺12/saat", available: 120 },
  { id: 3, name: "Şehir Meydanı Otoparkı", distance: "1.1 km", price: "₺10/saat", available: 15 },
  { id: 4, name: "Park Caddesi Otoparkı", distance: "1.4 km", price: "₺8/saat", available: 80 },
];

export default function FindParkingScreen() {
  const { t, i18n } = useTranslation();

  const getParkingName = (spot: typeof NEARBY_PARKING[0]) => {
    return i18n.language === 'tr' ? spot.name : spot.name.replace('Otoparkı', 'Parking').replace('AVM', 'Mall');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1C0CCE", "#1d3461"]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{t("findParking.title")}</Text>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder={t("findParking.searchPlaceholder")}
            placeholderTextColor="#666"
          />
        </View>

        <Text style={styles.sectionTitle}>{t("findParking.nearbySpots")}</Text>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          {NEARBY_PARKING.map((spot) => (
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
            </Pressable>
          ))}
        </ScrollView>
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
}); 