import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';
import { apiServices, PaymentMethod, WalletTransaction, WalletInfo } from '../lib/api-services';
import Header from '../components/Header';

export default function PaymentScreen() {
  const { t, i18n } = useTranslation();
  const [isAutopayEnabled, setIsAutopayEnabled] = useState(true);
  const [walletBalance, setWalletBalance] = useState(125);
  const [autoTopupThreshold, setAutoTopupThreshold] = useState(50);
  const [autoTopupAmount, setAutoTopupAmount] = useState(100);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [walletInfo, setWalletInfo] = useState<WalletInfo>({
    balance: 0,
    autoTopup: {
      enabled: false,
      threshold: 50,
      amount: 100
    }
  });
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const data = await apiServices.getPaymentMethods();
        setPaymentMethods(data);
      } catch (error) {
        console.error('Error fetching payment methods:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const [info, txns] = await Promise.all([
          apiServices.getWalletInfo(),
          apiServices.getWalletTransactions()
        ]);
        setWalletInfo(info);
        setTransactions(txns);
        setIsAutopayEnabled(info.autoTopup.enabled);
        setAutoTopupThreshold(info.autoTopup.threshold);
        setAutoTopupAmount(info.autoTopup.amount);
        setWalletBalance(info.balance);
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      }
    };

    fetchWalletData();
  }, []);

  const getCardIcon = (type: string) => {
    return type === "mastercard" ? "card" : "card-outline";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === 'tr' ? 'tr-TR' : 'en-US');
  };

  const AUTO_TOPUP_OPTIONS = [
    { threshold: 100, amount: 200 },
    { threshold: 200, amount: 500 },
    { threshold: 200, amount: 750 },
    { threshold: 300, amount: 1000 },
  ];

  const handleAddCard = () => {
    router.push("/payment/add-card");
  };

  const handleTopUp = () => {
    router.push("/payment/top-up");
  };

  const handleAutopayChange = async (value: boolean) => {
    try {
      await apiServices.updateAutoTopup({
        enabled: value,
        threshold: autoTopupThreshold,
        amount: autoTopupAmount
      });
      setIsAutopayEnabled(value);
    } catch (error) {
      console.error('Error updating auto-topup:', error);
      // Revert the switch if the API call fails
      setIsAutopayEnabled(!value);
    }
  };

  const handleAutoTopupOptionChange = async (threshold: number, amount: number) => {
    try {
      await apiServices.updateAutoTopup({
        enabled: isAutopayEnabled,
        threshold,
        amount
      });
      setAutoTopupThreshold(threshold);
      setAutoTopupAmount(amount);
    } catch (error) {
      console.error('Error updating auto-topup settings:', error);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1C0CCE", "#1d3461"]}
        style={StyleSheet.absoluteFill}
      />
      <Header showBackButton={true} />
      <ScrollView style={[styles.content, { marginTop: 20 }]}>
        <Text style={styles.title}>{t("payment.title")}</Text>

        {/* Wallet Section */}
        <View style={styles.walletCard}>
          <Text style={styles.walletTitle}>{t("payment.wallet.balance")}</Text>
          <Text style={styles.walletBalance}>₺{walletBalance.toFixed(2)}</Text>
          <Pressable 
            style={styles.topupButton}
            onPress={handleTopUp}
          >
            <Text style={styles.topupButtonText}>{t("payment.wallet.topup")}</Text>
          </Pressable>
        </View>

        {/* Payment Methods Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("payment.methods.title")}</Text>
          {paymentMethods.map((method) => (
            <Pressable 
              key={method.id} 
              style={styles.paymentMethod}
              onPress={() => {
                router.push({
                  pathname: "/payment/card-details",
                  params: {
                    cardId: method.id,
                    last4: method.last4,
                    expiry: method.expiryDate,
                    isDefault: method.id === "1",
                    type: method.type
                  }
                });
              }}
            >
              <Ionicons 
                name={getCardIcon(method.type)} 
                size={24} 
                color="#1C0CCE" 
              />
              <View style={styles.cardInfo}>
                <Text style={styles.cardNumber}>
                  •••• {method.last4}
                </Text>
                <Text style={styles.cardExpiry}>
                  {t("payment.methods.expires")}: {method.expiryDate}
                </Text>
              </View>
              {method.id === "1" && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultText}>
                    {t("payment.methods.default")}
                  </Text>
                </View>
              )}
            </Pressable>
          ))}
          <Pressable 
            style={styles.addCardButton}
            onPress={handleAddCard}
          >
            <Ionicons name="add" size={24} color="#1C0CCE" />
            <Text style={styles.addCardText}>{t("payment.methods.addNew")}</Text>
          </Pressable>
        </View>

        {/* Updated Autopay Section */}
        <View style={styles.section}>
          <View style={styles.autopayHeader}>
            <Text style={styles.sectionTitle}>{t("payment.autopay.title")}</Text>
            <Switch
              value={isAutopayEnabled}
              onValueChange={handleAutopayChange}
              trackColor={{ false: "#767577", true: "#1C0CCE" }}
              thumbColor="#FFF"
            />
          </View>
          
          {isAutopayEnabled && (
            <View style={styles.autopaySettings}>
              <Text style={styles.autopayLabel}>
                {t("payment.autopay.topupWhen")}
              </Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.thresholdOptions}
              >
                {AUTO_TOPUP_OPTIONS.map((option, index) => (
                  <Pressable
                    key={index}
                    style={[
                      styles.thresholdOption,
                      autoTopupThreshold === option.threshold && styles.selectedOption
                    ]}
                    onPress={() => {
                      handleAutoTopupOptionChange(option.threshold, option.amount);
                    }}
                  >
                    <Text style={[
                      styles.thresholdText,
                      autoTopupThreshold === option.threshold && styles.selectedText
                    ]}>
                      {t("payment.autopay.belowAmount", { amount: option.threshold })}
                    </Text>
                    <Text style={[
                      styles.topupText,
                      autoTopupThreshold === option.threshold && styles.selectedText
                    ]}>
                      {t("payment.autopay.topupAmount", { amount: option.amount })}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
              
              <Text style={styles.autopayDescription}>
                {t("payment.autopay.description")}
              </Text>
              
              <View style={styles.autopayInfo}>
                <Ionicons name="information-circle" size={20} color="#666" />
                <Text style={styles.autopayInfoText}>
                  {t("payment.autopay.currentSetting", {
                    threshold: `₺${autoTopupThreshold}`,
                    amount: `₺${autoTopupAmount}`
                  })}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("payment.transactions.title")}</Text>
          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transaction}>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionType}>
                  {t(`payment.transactions.${transaction.type}`)}
                </Text>
                {transaction.location && (
                  <Text style={styles.transactionLocation}>
                    {transaction.location}
                  </Text>
                )}
                <Text style={styles.transactionDate}>
                  {formatDate(transaction.date)}
                </Text>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  { color: transaction.amount > 0 ? "#4CAF50" : "#1C0CCE" },
                ]}
              >
                {transaction.amount > 0 ? "+" : ""}₺{Math.abs(transaction.amount).toFixed(2)}
              </Text>
            </View>
          ))}
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
    marginTop: 100,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C0CCE",
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  walletCard: {
    backgroundColor: "#1C0CCE",
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
  },
  walletTitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    marginBottom: 8,
  },
  walletBalance: {
    color: "#FFF",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
  },
  topupButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  topupButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
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
  cardInfo: {
    marginLeft: 12,
    flex: 1,
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
  addCardButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(28, 12, 206, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  addCardText: {
    color: "#1C0CCE",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  autopayHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  autopayDescription: {
    color: "#666",
    fontSize: 14,
    lineHeight: 20,
  },
  transaction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  transactionLocation: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  autopaySettings: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  autopayLabel: {
    fontSize: 14,
    color: "#333",
    marginBottom: 12,
  },
  thresholdOptions: {
    marginBottom: 16,
  },
  thresholdOption: {
    backgroundColor: "rgba(28, 12, 206, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 160,
  },
  selectedOption: {
    backgroundColor: "#1C0CCE",
  },
  thresholdText: {
    fontSize: 14,
    color: "#1C0CCE",
    marginBottom: 4,
  },
  topupText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C0CCE",
  },
  selectedText: {
    color: "#FFF",
  },
  autopayInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(28, 12, 206, 0.1)",
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  autopayInfoText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
}); 