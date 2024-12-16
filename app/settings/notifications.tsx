import { View, Text, StyleSheet, ScrollView, Switch } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Header from "../../components/Header";

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState({
    parking: true,
    payment: true,
    promotions: false,
    system: true,
    call: false,
    sms: true,
    email: true,
    push: true,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
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
        <Text style={styles.title}>{t('settings.notifications')}</Text>
        
        <View style={styles.section}>
          <View style={styles.notificationItem}>
            <View>
              <Text style={styles.notificationTitle}>{t('notifications.parking')}</Text>
              <Text style={styles.notificationDescription}>
                {t('notifications.parkingDesc')}
              </Text>
            </View>
            <Switch
              value={notifications.parking}
              onValueChange={() => toggleNotification('parking')}
              trackColor={{ false: "#767577", true: "#1C0CCE" }}
              thumbColor="#FFF"
            />
          </View>

          <View style={styles.notificationItem}>
            <View>
              <Text style={styles.notificationTitle}>{t('notifications.payment')}</Text>
              <Text style={styles.notificationDescription}>
                {t('notifications.paymentDesc')}
              </Text>
            </View>
            <Switch
              value={notifications.payment}
              onValueChange={() => toggleNotification('payment')}
              trackColor={{ false: "#767577", true: "#1C0CCE" }}
              thumbColor="#FFF"
            />
          </View>

          <View style={styles.notificationItem}>
            <View>
              <Text style={styles.notificationTitle}>{t('notifications.promotions')}</Text>
              <Text style={styles.notificationDescription}>
                {t('notifications.promotionsDesc')}
              </Text>
            </View>
            <Switch
              value={notifications.promotions}
              onValueChange={() => toggleNotification('promotions')}
              trackColor={{ false: "#767577", true: "#1C0CCE" }}
              thumbColor="#FFF"
            />
          </View>

          <View style={styles.notificationItem}>
            <View>
              <Text style={styles.notificationTitle}>{t('notifications.system')}</Text>
              <Text style={styles.notificationDescription}>
                {t('notifications.systemDesc')}
              </Text>
            </View>
            <Switch
              value={notifications.system}
              onValueChange={() => toggleNotification('system')}
              trackColor={{ false: "#767577", true: "#1C0CCE" }}
              thumbColor="#FFF"
            />
          </View>
        </View>

        <Text style={[styles.title, styles.sectionTitle]}>
          {t('settings.communicationPreferences')}
        </Text>
        
        <View style={styles.section}>
          <View style={styles.notificationItem}>
            <View>
              <Text style={styles.notificationTitle}>{t('communications.call')}</Text>
              <Text style={styles.notificationDescription}>
                {t('communications.callDesc')}
              </Text>
            </View>
            <Switch
              value={notifications.call}
              onValueChange={() => toggleNotification('call')}
              trackColor={{ false: "#767577", true: "#1C0CCE" }}
              thumbColor="#FFF"
            />
          </View>

          <View style={styles.notificationItem}>
            <View>
              <Text style={styles.notificationTitle}>{t('communications.sms')}</Text>
              <Text style={styles.notificationDescription}>
                {t('communications.smsDesc')}
              </Text>
            </View>
            <Switch
              value={notifications.sms}
              onValueChange={() => toggleNotification('sms')}
              trackColor={{ false: "#767577", true: "#1C0CCE" }}
              thumbColor="#FFF"
            />
          </View>

          <View style={styles.notificationItem}>
            <View>
              <Text style={styles.notificationTitle}>{t('communications.email')}</Text>
              <Text style={styles.notificationDescription}>
                {t('communications.emailDesc')}
              </Text>
            </View>
            <Switch
              value={notifications.email}
              onValueChange={() => toggleNotification('email')}
              trackColor={{ false: "#767577", true: "#1C0CCE" }}
              thumbColor="#FFF"
            />
          </View>

          <View style={styles.notificationItem}>
            <View>
              <Text style={styles.notificationTitle}>{t('communications.push')}</Text>
              <Text style={styles.notificationDescription}>
                {t('communications.pushDesc')}
              </Text>
            </View>
            <Switch
              value={notifications.push}
              onValueChange={() => toggleNotification('push')}
              trackColor={{ false: "#767577", true: "#1C0CCE" }}
              thumbColor="#FFF"
            />
          </View>
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
    marginBottom: 24,
  },
  section: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  notificationTitle: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    color: "#666",
    maxWidth: '80%',
  },
  sectionTitle: {
    marginTop: 24,
  },
}); 