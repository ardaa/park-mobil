import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Header from "../components/Header";
import { router } from 'expo-router';

export default function SettingsScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1C0CCE", "#1d3461"]}
        style={StyleSheet.absoluteFill}
      />
      <Header title={t('settings.title')} showBackButton={true} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/settings/language")}>
            <Ionicons name="language-outline" size={24} color="white" />
            <Text style={styles.menuText}>{t('settings.language')}</Text>
            <Ionicons name="chevron-forward" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/settings/notifications")}>
            <Ionicons name="notifications-outline" size={24} color="white" />
            <Text style={styles.menuText}>{t('settings.notifications')}</Text>
            <Ionicons name="chevron-forward" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/settings/privacy")}>
            <Ionicons name="lock-closed-outline" size={24} color="white" />
            <Text style={styles.menuText}>{t('settings.privacy')}</Text>
            <Ionicons name="chevron-forward" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/settings/about")}>
            <Ionicons name="information-circle-outline" size={24} color="white" />
            <Text style={styles.menuText}>{t('settings.about')}</Text>
            <Ionicons name="chevron-forward" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  section: {
    padding: 20,
    paddingTop: 30,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  menuText: {
    color: "#FFF",
    fontSize: 16,
    flex: 1,
    marginLeft: 15,
    fontFamily: 'Roboto-Regular',
  },
}); 