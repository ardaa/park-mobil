import { View, Text, StyleSheet, ScrollView, Pressable, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { router } from 'expo-router';
import { ParketLogo } from "@/components/icons/ParketLogo";
type Route = Parameters<typeof router.push>[0];

type CarParkingInfo = {
  plateNo: string;
  duration: string;
  price: string;
  floor: string;
  spot: string;
};

const MENU_ITEMS: Array<{
  icon: string;
  title: string;
  description: string;
  route: Route;
}> = [
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
    icon: "gift",
    title: "home.menu.campaigns",
    description: "home.menu.campaignsDesc",
    route: "/campaigns",
  },
  {
    icon: "help-circle",
    title: "home.menu.help",
    description: "home.menu.helpDesc",
    route: "/help",
  },
];

const CURRENT_PARKING: CarParkingInfo = {
  plateNo: "34 ABC 123",
  duration: "2:30",
  price: "₺45",
  floor: "2",
  spot: "A-15",
};

export default function HomeScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1C0CCE", "#1d3461"]}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.header}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>{t("home.greeting")}</Text>
          <Text style={styles.name}>Baha Akdemir</Text>
        </View>
        <ParketLogo size={60} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.carInfoContainer}>
          <View style={styles.carInfoHeader}>
            <View style={styles.carInfoTitleContainer}>
              <View style={styles.activeIndicator}>
                <View style={styles.activeDot} />
                <Text style={styles.activeText}>{t("home.active")}</Text>
              </View>
              <Text style={styles.plateNo}>{CURRENT_PARKING.plateNo}</Text>
            </View>
            <Pressable 
              style={styles.viewDetailsButton}
              onPress={() => router.push('/active-parking')}
            >
              <Text style={styles.viewDetailsText}>{t("home.viewDetails")}</Text>
              <Ionicons name="chevron-forward" size={16} color="#1C0CCE" />
            </Pressable>
          </View>
          
          <View style={styles.carInfoGrid}>
            <View style={styles.carInfoItem}>
              <Text style={styles.carInfoLabel}>{t("home.duration")}</Text>
              <Text style={styles.carInfoValue}>{CURRENT_PARKING.duration}</Text>
            </View>
            <View style={styles.carInfoItem}>
              <Text style={styles.carInfoLabel}>{t("home.price")}</Text>
              <Text style={styles.carInfoValue}>{CURRENT_PARKING.price}</Text>
            </View>
            <View style={styles.carInfoItem}>
              <Text style={styles.carInfoLabel}>{t("home.floor")}</Text>
              <Text style={styles.carInfoValue}>{CURRENT_PARKING.floor}</Text>
            </View>
            <View style={styles.carInfoItem}>
              <Text style={styles.carInfoLabel}>{t("home.spot")}</Text>
              <Text style={styles.carInfoValue}>{CURRENT_PARKING.spot}</Text>
            </View>
          </View>
          
          <Pressable 
            style={styles.takeMeButton}
            onPress={() => router.push({
              pathname: '/mapshow',
              params: { isCarParked: true }
            })}
          >
            <Ionicons name="navigate" size={20} color="#FFF" />
            <Text style={styles.takeMeButtonText}>{t("home.takeMeToCar")}</Text>
          </Pressable>
        </View>

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
    paddingTop: 30,
    paddingBottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greetingContainer: {
    marginTop: 30,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
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
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  carInfoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  carInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  carInfoTitleContainer: {
    flexDirection: 'column',
    gap: 6,
  },
  activeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34C759',
  },
  activeText: {
    fontSize: 13,
    color: '#34C759',
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  plateNo: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    letterSpacing: -0.5,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  viewDetailsText: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  carInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 20,
    marginTop: 4,
  },
  carInfoItem: {
    width: '45%',
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    padding: 12,
    borderRadius: 12,
  },
  carInfoLabel: {
    fontSize: 13,
    color: '#8E8E93',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  carInfoValue: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
    letterSpacing: -0.4,
  },
  takeMeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1C0CCE',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    marginTop: 20,
  },
  takeMeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
}); 