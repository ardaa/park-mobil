import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { router, useLocalSearchParams } from 'expo-router';
import Header from "@/components/Header";
export default function CardDetailsScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const { cardId, last4, expiry, isDefault, type } = params;
  
  const [isDefaultCard, setIsDefaultCard] = useState(isDefault === 'true');

  const handleMakeDefault = () => {
    setIsDefaultCard(true);
    // Mock API call
    setTimeout(() => {
      router.replace("/payment");
    }, 500);
  };

  const handleRemoveCard = () => {
    Alert.alert(
      t("payment.cardDetails.removeTitle"),
      t("payment.cardDetails.removeMessage"),
      [
        {
          text: t("payment.cardDetails.cancel"),
          style: "cancel"
        },
        {
          text: t("payment.cardDetails.remove"),
          onPress: () => {
            // Mock API call
            setTimeout(() => {
              router.replace("/payment");
            }, 500);
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1C0CCE", "#1d3461"]}
        style={StyleSheet.absoluteFill}
      />
      <Header showBackButton={true} />

      <View style={styles.content}>
        <Text style={styles.title}>{t("payment.cardDetails.title")}</Text>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons 
              name={type === 'mastercard' ? "card" : "card-outline"} 
              size={32} 
              color="#1C0CCE" 
            />
            {isDefaultCard && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultText}>
                  {t("payment.methods.default")}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.cardBody}>
            <Text style={styles.cardNumber}>•••• •••• •••• {last4}</Text>
            <Text style={styles.cardExpiry}>
              {t("payment.methods.expires")}: {expiry}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          {!isDefaultCard && (
            <Pressable 
              style={styles.defaultButton}
              onPress={handleMakeDefault}
            >
              <Ionicons name="star-outline" size={20} color="#1C0CCE" />
              <Text style={styles.defaultButtonText}>
                {t("payment.cardDetails.makeDefault")}
              </Text>
            </Pressable>
          )}

          <Pressable 
            style={styles.removeButton}
            onPress={handleRemoveCard}
          >
            <Ionicons name="trash-outline" size={20} color="#DC3545" />
            <Text style={styles.removeButtonText}>
              {t("payment.cardDetails.removeCard")}
            </Text>
          </Pressable>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color="#666" />
          <Text style={styles.infoText}>
            {t("payment.cardDetails.info")}
          </Text>
        </View>
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
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  defaultBadge: {
    backgroundColor: "rgba(28, 12, 206, 0.1)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  defaultText: {
    color: "#1C0CCE",
    fontSize: 12,
    fontWeight: "500",
  },
  cardBody: {
    gap: 8,
  },
  cardNumber: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  cardExpiry: {
    fontSize: 14,
    color: "#666",
  },
  actions: {
    marginTop: 24,
    gap: 12,
  },
  defaultButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(28, 12, 206, 0.1)",
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  defaultButtonText: {
    color: "#1C0CCE",
    fontSize: 16,
    fontWeight: "600",
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(220, 53, 69, 0.1)",
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  removeButtonText: {
    color: "#DC3545",
    fontSize: 16,
    fontWeight: "600",
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "rgba(28, 12, 206, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    gap: 12,
  },
  infoText: {
    flex: 1,
    color: "#666",
    fontSize: 14,
    lineHeight: 20,
  },
}); 