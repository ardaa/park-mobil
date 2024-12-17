import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import { useState } from "react";

export default function PrivacyScreen() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState({
    locationTracking: true,
    shareData: false,
    biometric: true,
    parkingHistory: true,
    analytics: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1C0CCE", "#1d3461"]}
        style={StyleSheet.absoluteFill}
      />
      <Header showBackButton={true} />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('privacy.location')}</Text>
          <View style={styles.setting}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{t('privacy.locationTracking')}</Text>
              <Text style={styles.settingDescription}>{t('privacy.locationTrackingDesc')}</Text>
            </View>
            <Switch
              value={settings.locationTracking}
              onValueChange={() => toggleSetting('locationTracking')}
              trackColor={{ false: '#767577', true: '#1C0CCE' }}
              thumbColor="#FFF"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('privacy.security')}</Text>
          <View style={styles.setting}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{t('privacy.biometric')}</Text>
              <Text style={styles.settingDescription}>{t('privacy.biometricDesc')}</Text>
            </View>
            <Switch
              value={settings.biometric}
              onValueChange={() => toggleSetting('biometric')}
              trackColor={{ false: '#767577', true: '#1C0CCE' }}
              thumbColor="#FFF"
            />
          </View>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Ionicons name="key-outline" size={24} color="white" />
              <Text style={styles.menuText}>{t('privacy.changePassword')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Ionicons name="shield-checkmark-outline" size={24} color="white" />
              <Text style={styles.menuText}>{t('privacy.twoFactor')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('privacy.data')}</Text>
          <View style={styles.setting}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{t('privacy.parkingHistory')}</Text>
              <Text style={styles.settingDescription}>{t('privacy.parkingHistoryDesc')}</Text>
            </View>
            <Switch
              value={settings.parkingHistory}
              onValueChange={() => toggleSetting('parkingHistory')}
              trackColor={{ false: '#767577', true: '#1C0CCE' }}
              thumbColor="#FFF"
            />
          </View>

          <View style={styles.setting}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{t('privacy.shareData')}</Text>
              <Text style={styles.settingDescription}>{t('privacy.shareDataDesc')}</Text>
            </View>
            <Switch
              value={settings.shareData}
              onValueChange={() => toggleSetting('shareData')}
              trackColor={{ false: '#767577', true: '#1C0CCE' }}
              thumbColor="#FFF"
            />
          </View>

          <View style={styles.setting}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{t('privacy.analytics')}</Text>
              <Text style={styles.settingDescription}>{t('privacy.analyticsDesc')}</Text>
            </View>
            <Switch
              value={settings.analytics}
              onValueChange={() => toggleSetting('analytics')}
              trackColor={{ false: '#767577', true: '#1C0CCE' }}
              thumbColor="#FFF"
            />
          </View>

          <TouchableOpacity style={styles.dangerButton}>
            <Ionicons name="trash-outline" size={24} color="#FF3B30" />
            <Text style={styles.dangerButtonText}>{t('privacy.deleteAccount')}</Text>
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
  content: {
    flex: 1,
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
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    gap: 8,
  },
  dangerButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
}); 