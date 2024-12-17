import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header";
import { format } from "date-fns";
import { tr, enUS } from "date-fns/locale";

export default function AnnouncementDetailsScreen() {
  const { t, i18n } = useTranslation();
  const { title, description, date, type } = useLocalSearchParams();

  const getIconName = (type: string) => {
    switch (type) {
      case 'maintenance':
        return 'construct';
      case 'warning':
        return 'warning';
      default:
        return 'information-circle';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'maintenance':
        return '#FF9500';
      case 'warning':
        return '#FF3B30';
      default:
        return '#007AFF';
    }
  };

  const formattedDate = format(
    new Date(date as string),
    'dd MMMM yyyy',
    { locale: i18n.language === 'tr' ? tr : enUS }
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1C0CCE", "#1d3461"]}
        style={StyleSheet.absoluteFill}
      />
      <Header showBackButton={true} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View 
            style={[
              styles.iconContainer, 
              { backgroundColor: `${getIconColor(type as string)}15` }
            ]}
          >
            <Ionicons 
              name={getIconName(type as string)} 
              size={32} 
              color={getIconColor(type as string)} 
            />
          </View>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>

        <Text style={styles.title}>{title}</Text>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.description}>{description}</Text>
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
    marginTop: 20,
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 16,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
}); 