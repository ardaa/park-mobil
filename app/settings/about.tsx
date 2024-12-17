import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import Constants from "expo-constants";
import { ParketLogo } from "@/components/icons/ParketLogo";

export default function AboutScreen() {
  const { t } = useTranslation();
  const version = Constants.expoConfig?.version || "1.0.0";

  const openWebsite = () => {
    Linking.openURL('https://parket.com');
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://parket.com/privacy');
  };

  const openTerms = () => {
    Linking.openURL('https://parket.com/terms');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1C0CCE", "#1d3461"]}
        style={StyleSheet.absoluteFill}
      />
      <Header showBackButton={true} />
      <ScrollView style={styles.content}>
        <View style={styles.logoContainer}>
          <ParketLogo width={80} height={80} />
          <Text style={styles.appName}>Parket</Text>
          <Text style={styles.version}>Version {version}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('about.company')}</Text>
          <Text style={styles.description}>
            {t('about.description')}
          </Text>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.link} onPress={openWebsite}>
            <Ionicons name="globe-outline" size={24} color="white" />
            <Text style={styles.linkText}>{t('about.website')}</Text>
            <Ionicons name="chevron-forward" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.link} onPress={openPrivacyPolicy}>
            <Ionicons name="shield-checkmark-outline" size={24} color="white" />
            <Text style={styles.linkText}>{t('about.privacyPolicy')}</Text>
            <Ionicons name="chevron-forward" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.link} onPress={openTerms}>
            <Ionicons name="document-text-outline" size={24} color="white" />
            <Text style={styles.linkText}>{t('about.terms')}</Text>
            <Ionicons name="chevron-forward" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('about.contact')}</Text>
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Ionicons name="mail-outline" size={20} color="white" />
              <Text style={styles.contactText}>support@parket.com</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="call-outline" size={20} color="white" />
              <Text style={styles.contactText}>0850 123 45 67</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="location-outline" size={20} color="white" />
              <Text style={styles.contactText}>
                Maslak, Büyükdere Cad. No:123{'\n'}
                Sarıyer/İstanbul
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.copyright}>
          © {new Date().getFullYear()} Parket. {t('about.allRightsReserved')}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 16,
  },
  version: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },
  linkText: {
    color: '#FFF',
    fontSize: 16,
    flex: 1,
    marginLeft: 15,
  },
  contactInfo: {
    gap: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  contactText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    flex: 1,
  },
  copyright: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    paddingVertical: 24,
  },
}); 