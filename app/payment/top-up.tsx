import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, ActivityIndicator, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { router } from 'expo-router';

const QUICK_AMOUNTS = [50, 100, 200, 500];

export default function TopUpScreen() {
  const { t } = useTranslation();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedCard, setSelectedCard] = useState<number | null>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleTopUp = () => {
    const amount = selectedAmount || Number(customAmount);
    if (amount > 0 && selectedCard) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        setShowSuccessModal(true);
      }, 1500);
    }
  };

  const handleSuccessOk = () => {
    router.replace("/payment");
  };

  const formatAmount = (text: string) => {
    // Remove non-numeric characters
    const numericValue = text.replace(/[^0-9]/g, '');
    return numericValue;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1C0CCE", "#1d3461"]}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView style={styles.content}>
        <Text style={styles.title}>{t("payment.topup.title")}</Text>

        {/* Quick Amount Selection */}
        <Text style={styles.sectionTitle}>{t("payment.topup.quickAmount")}</Text>
        <View style={styles.amountGrid}>
          {QUICK_AMOUNTS.map((amount) => (
            <Pressable
              key={amount}
              style={[
                styles.amountOption,
                selectedAmount === amount && styles.selectedAmount,
              ]}
              onPress={() => {
                setSelectedAmount(amount);
                setCustomAmount('');
              }}
            >
              <Text
                style={[
                  styles.amountText,
                  selectedAmount === amount && styles.selectedAmountText,
                ]}
              >
                ₺{amount}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Custom Amount Input */}
        <Text style={styles.sectionTitle}>{t("payment.topup.customAmount")}</Text>
        <View style={styles.customAmountContainer}>
          <Text style={styles.currencySymbol}>₺</Text>
          <TextInput
            style={styles.customAmountInput}
            value={customAmount}
            onChangeText={(text) => {
              setCustomAmount(formatAmount(text));
              setSelectedAmount(null);
            }}
            placeholder="0"
            keyboardType="numeric"
            maxLength={4}
          />
        </View>

        {/* Payment Method Selection */}
        <Text style={styles.sectionTitle}>{t("payment.topup.selectCard")}</Text>
        <View style={styles.cardList}>
          <Pressable
            style={[styles.card, selectedCard === 1 && styles.selectedCard]}
            onPress={() => setSelectedCard(1)}
          >
            <Ionicons name="card" size={24} color="#1C0CCE" />
            <View style={styles.cardInfo}>
              <Text style={styles.cardNumber}>•••• 4242</Text>
              <Text style={styles.cardExpiry}>12/24</Text>
            </View>
            {selectedCard === 1 && (
              <Ionicons name="checkmark-circle" size={24} color="#1C0CCE" />
            )}
          </Pressable>

          <Pressable
            style={[styles.card, selectedCard === 2 && styles.selectedCard]}
            onPress={() => setSelectedCard(2)}
          >
            <Ionicons name="card-outline" size={24} color="#1C0CCE" />
            <View style={styles.cardInfo}>
              <Text style={styles.cardNumber}>•••• 8765</Text>
              <Text style={styles.cardExpiry}>09/25</Text>
            </View>
            {selectedCard === 2 && (
              <Ionicons name="checkmark-circle" size={24} color="#1C0CCE" />
            )}
          </Pressable>
        </View>

        {/* Top Up Button */}
        <Pressable
          style={[
            styles.topUpButton,
            (!selectedAmount && !customAmount) && styles.disabledButton
          ]}
          onPress={handleTopUp}
          disabled={!selectedAmount && !customAmount}
        >
          <Text style={styles.topUpButtonText}>
            {t("payment.topup.confirm", {
              amount: `₺${selectedAmount || customAmount || 0}`
            })}
          </Text>
        </Pressable>
      </ScrollView>

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#1C0CCE" />
          <Text style={styles.loadingText}>
            {t("payment.topup.processing")}
          </Text>
        </View>
      )}

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.successModalContainer}>
          <View style={styles.successModal}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
            </View>
            <Text style={styles.successTitle}>
              {t("payment.topup.success")}
            </Text>
            <Text style={styles.successMessage}>
              {t("payment.topup.successMessage", {
                amount: `₺${selectedAmount || customAmount}`
              })}
            </Text>
            <Pressable 
              style={styles.okButton}
              onPress={handleSuccessOk}
            >
              <Text style={styles.okButtonText}>
                {t("payment.addCard.ok")}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  amountGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  amountOption: {
    width: "48%",
    backgroundColor: "rgba(28, 12, 206, 0.1)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  selectedAmount: {
    backgroundColor: "#1C0CCE",
  },
  amountText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C0CCE",
  },
  selectedAmountText: {
    color: "#FFF",
  },
  customAmountContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  currencySymbol: {
    fontSize: 24,
    color: "#333",
    marginRight: 8,
  },
  customAmountInput: {
    flex: 1,
    fontSize: 24,
    color: "#333",
  },
  cardList: {
    gap: 12,
    marginBottom: 24,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  selectedCard: {
    borderColor: "#1C0CCE",
    backgroundColor: "rgba(28, 12, 206, 0.05)",
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  cardExpiry: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  topUpButton: {
    backgroundColor: "#1C0CCE",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#CCC",
  },
  topUpButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#1C0CCE",
    textAlign: "center",
  },
  successModalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  successModal: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    width: "80%",
    maxWidth: 320,
  },
  successIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  okButton: {
    backgroundColor: "#1C0CCE",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    width: "100%",
    marginTop: 24,
  },
  okButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
}); 