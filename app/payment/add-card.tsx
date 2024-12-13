import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Modal, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { router } from 'expo-router';
import { apiServices } from '../../lib/api-services';

export default function AddCardScreen() {
  const { t } = useTranslation();
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [showMasterpass, setShowMasterpass] = useState(false);
  const [masterpassLoading, setMasterpassLoading] = useState(false);
  const [masterpassPhase, setMasterpassPhase] = useState<'otp' | 'loading' | 'cards'>('otp');
  const [masterpassOtp, setMasterpassOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || '';
    return formatted.slice(0, 19); // 16 digits + 3 spaces
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleAddCard = async (cardDetails: any) => {
    setIsLoading(true);
    try {
      await apiServices.addPaymentMethod(cardDetails);
      setTimeout(() => {
        setIsLoading(false);
        setShowOtp(true);
      }, 1500);
    } catch (error) {
      console.error('Error adding payment method:', error);
      setErrorMessage(error instanceof Error ? error.message : t("payment.addCard.genericError"));
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = () => {
    setIsLoading(true);
    // Simulate verification
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccessModal(true);
    }, 1500);
  };

  const handleMasterpass = () => {
    setShowMasterpass(true);
    setMasterpassPhase('otp');
  };

  const handleMasterpassOtp = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setMasterpassPhase('loading');
      setTimeout(() => {
        setMasterpassPhase('cards');
      }, 2000);
    }, 1500);
  };

  const handleMasterpassSuccess = () => {
    setShowMasterpass(false);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowOtp(true);
    }, 1500);
  };

  const handleSuccessOk = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1C0CCE", "#1d3461"]}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView style={styles.content}>
        <Text style={styles.title}>{t("payment.addCard.title")}</Text>

        {/* Masterpass Option */}
        <Pressable 
          style={styles.masterpassButton}
          onPress={handleMasterpass}
        >
          <Ionicons name="logo-electron" size={24} color="#FFF" />
          <Text style={styles.masterpassText}>
            {t("payment.addCard.useMasterpass")}
          </Text>
        </Pressable>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>{t("payment.addCard.or")}</Text>
          <View style={styles.dividerLine} />
        </View>

        {!showOtp ? (
          <View style={styles.cardForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t("payment.addCard.cardNumber")}</Text>
              <TextInput
                style={styles.input}
                value={cardNumber}
                onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                placeholder="4242 4242 4242 4242"
                keyboardType="numeric"
                maxLength={19}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                <Text style={styles.label}>{t("payment.addCard.expiry")}</Text>
                <TextInput
                  style={styles.input}
                  value={expiryDate}
                  onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                  placeholder="MM/YY"
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>{t("payment.addCard.cvv")}</Text>
                <TextInput
                  style={styles.input}
                  value={cvv}
                  onChangeText={setCvv}
                  placeholder="123"
                  keyboardType="numeric"
                  maxLength={3}
                  secureTextEntry
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t("payment.addCard.cardholderName")}</Text>
              <TextInput
                style={styles.input}
                value={cardholderName}
                onChangeText={setCardholderName}
                placeholder={t("payment.addCard.cardholderNamePlaceholder")}
                autoCapitalize="words"
              />
            </View>

            <Pressable 
              style={styles.addButton}
              onPress={() => handleAddCard({
                cardNumber: cardNumber.replace(/\s/g, ''),
                expiryDate,
                cvv,
                cardholderName
              })}
            >
              <Text style={styles.addButtonText}>
                {t("payment.addCard.addCard")}
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.otpContainer}>
            <Text style={styles.otpTitle}>
              {t("payment.addCard.enterOtp")}
            </Text>
            <Text style={styles.otpDescription}>
              {t("payment.addCard.otpDescription")}
            </Text>
            
            <TextInput
              style={styles.otpInput}
              value={otp}
              onChangeText={setOtp}
              placeholder="000000"
              keyboardType="numeric"
              maxLength={6}
            />

            <Pressable 
              style={styles.verifyButton}
              onPress={handleVerifyOtp}
            >
              <Text style={styles.verifyButtonText}>
                {t("payment.addCard.verify")}
              </Text>
            </Pressable>

            <Pressable 
              style={styles.resendButton}
              onPress={() => setOtp('')}
            >
              <Text style={styles.resendButtonText}>
                {t("payment.addCard.resendOtp")}
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* Updated Masterpass Modal with KeyboardAvoidingView */}
      <Modal
        visible={showMasterpass}
        animationType="slide"
        transparent={true}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {t("payment.addCard.masterpass.title")}
              </Text>
              <Pressable 
                onPress={() => {
                  setShowMasterpass(false);
                  setMasterpassPhase('otp');
                }}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#333" />
              </Pressable>
            </View>

            <ScrollView>
              {masterpassPhase === 'otp' && (
                <View style={styles.otpContainer}>
                  <Text style={styles.otpTitle}>
                    {t("payment.addCard.masterpass.enterOtp")}
                  </Text>
                  <Text style={styles.otpDescription}>
                    {t("payment.addCard.masterpass.otpDescription")}
                  </Text>
                  
                  <TextInput
                    style={styles.otpInput}
                    value={masterpassOtp}
                    onChangeText={setMasterpassOtp}
                    placeholder="000000"
                    keyboardType="numeric"
                    maxLength={6}
                  />

                  <Pressable 
                    style={styles.verifyButton}
                    onPress={handleMasterpassOtp}
                  >
                    <Text style={styles.verifyButtonText}>
                      {t("payment.addCard.masterpass.verifyOtp")}
                    </Text>
                  </Pressable>

                  <Pressable 
                    style={styles.resendButton}
                    onPress={() => setMasterpassOtp('')}
                  >
                    <Text style={styles.resendButtonText}>
                      {t("payment.addCard.masterpass.resendOtp")}
                    </Text>
                  </Pressable>
                </View>
              )}

              {masterpassPhase === 'loading' && (
                <View style={styles.loadingContainer}>
                  <Ionicons name="card" size={48} color="#1C0CCE" />
                  <Text style={styles.loadingText}>
                    {t("payment.addCard.masterpass.connecting")}
                  </Text>
                </View>
              )}

              {masterpassPhase === 'cards' && (
                <View style={styles.cardList}>
                  <Text style={styles.cardListTitle}>
                    {t("payment.addCard.masterpass.selectCard")}
                  </Text>
                  {[
                    { last4: "4242", bank: "Garanti BBVA" },
                    { last4: "8765", bank: "Yapı Kredi" },
                  ].map((card, index) => (
                    <Pressable
                      key={index}
                      style={styles.masterpassCard}
                      onPress={handleMasterpassSuccess}
                    >
                      <Ionicons name="card" size={24} color="#1C0CCE" />
                      <View style={styles.masterpassCardInfo}>
                        <Text style={styles.bankName}>{card.bank}</Text>
                        <Text style={styles.cardLast4}>•••• {card.last4}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={24} color="#1C0CCE" />
                    </Pressable>
                  ))}
                </View>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#1C0CCE" />
          <Text style={styles.loadingText}>
            {t("payment.addCard.processing")}
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
              {t("payment.addCard.success")}
            </Text>
            <Text style={styles.successMessage}>
              {t("payment.addCard.successMessage")}
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

      {/* Error Modal */}
      <Modal
        visible={showErrorModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.successModalContainer}>
          <View style={styles.successModal}>
            <View style={[styles.successIconContainer, styles.errorIconContainer]}>
              <Ionicons name="alert-circle" size={48} color="#DC3545" />
            </View>
            <Text style={styles.successTitle}>
              {t("payment.addCard.error")}
            </Text>
            <Text style={styles.successMessage}>
              {errorMessage}
            </Text>
            <Pressable 
              style={[styles.okButton, styles.errorButton]}
              onPress={() => setShowErrorModal(false)}
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
  masterpassButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1C0CCE",
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  masterpassText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#DDD",
  },
  dividerText: {
    color: "#666",
    marginHorizontal: 16,
  },
  cardForm: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  label: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  addButton: {
    backgroundColor: "#1C0CCE",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  otpContainer: {
    alignItems: "center",
    padding: 16,
  },
  otpTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  otpDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  otpInput: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    borderWidth: 1,
    borderColor: "#DDD",
    width: "100%",
    textAlign: "center",
    letterSpacing: 8,
    marginBottom: 24,
  },
  verifyButton: {
    backgroundColor: "#1C0CCE",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    width: "100%",
    marginBottom: 12,
  },
  verifyButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  resendButton: {
    padding: 16,
  },
  resendButtonText: {
    color: "#1C0CCE",
    fontSize: 14,
    fontWeight: "500",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#F8F9FA",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: "50%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    padding: 8,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 48,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  cardList: {
    gap: 16,
  },
  cardListTitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  masterpassCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  masterpassCardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  bankName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  cardLast4: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
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
  errorIconContainer: {
    backgroundColor: "rgba(220, 53, 69, 0.1)",
  },
  errorButton: {
    backgroundColor: "#DC3545",
  },
}); 