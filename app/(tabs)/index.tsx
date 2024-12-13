import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { router } from 'expo-router';

const MENU_ITEMS = [
  {
    icon: "car",
    title: "home.menu.findParking",
    description: "home.menu.findParkingDesc",
    route: "/find-parking",
  },
  {
    icon: "time",
    title: "home.menu.activeParking",
    description: "home.menu.activeParkingDesc",
    route: "/active-parking",
  },
  {
    icon: "card",
    title: "home.menu.payment",
    description: "home.menu.paymentDesc",
    route: "/payment",
  },
  {
    icon: "bookmark",
    title: "home.menu.favorites",
    description: "home.menu.favoritesDesc",
    route: "/favorites",
  },
  {
    icon: "receipt",
    title: "home.menu.history",
    description: "home.menu.historyDesc",
    route: "/history",
  },
  {
    icon: "help-circle",
    title: "home.menu.help",
    description: "home.menu.helpDesc",
    route: "/help",
  },
];

export default function HomeScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1C0CCE", "#1d3461"]}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.header}>
        <Text style={styles.greeting}>{t("home.greeting")}</Text>
        <Text style={styles.name}>Baha Akdemir</Text>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {MENU_ITEMS.map((item, index) => (
          <Pressable
            key={index}
            style={styles.menuItem}
            onPress={() => {
              router.push(item.route);
            }}
          >
            <View style={styles.menuIcon}>
              <Ionicons name={item.icon as any} size={24} color="#1C0CCE" />
            </View>
            <View style={styles.menuText}>
              <Text style={styles.menuTitle}>{t(item.title)}</Text>
              <Text style={styles.menuDescription}>{t(item.description)}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#1C0CCE" />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginTop: 4,
  },
  content: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 24,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFF",
    borderRadius: 16,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(28, 12, 206, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C0CCE",
  },
  menuDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
}); 