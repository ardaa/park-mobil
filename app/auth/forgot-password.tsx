import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function ForgotPassword() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    try {
      setIsLoading(true);
      
      if (!email) {
        Alert.alert(
          t('auth.forgotPassword.error'),
          t('auth.forgotPassword.provideEmail')
        );
        return;
      }

      // TODO: Implement password reset functionality
      // await resetPassword(email);

      Alert.alert(
        t('auth.forgotPassword.success'),
        t('auth.forgotPassword.checkEmail')
      );
      
      router.back();
    } catch (error) {
      Alert.alert(
        t('auth.forgotPassword.error'),
        t('auth.forgotPassword.failed')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient
        colors={["#1C0CCE", "#1d3461"]}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.content}>
        <Pressable 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>

        <Text style={styles.title}>{t('auth.forgotPassword.title')}</Text>
        
        <Text style={styles.description}>
          {t('auth.forgotPassword.description')}
        </Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('auth.forgotPassword.email')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('auth.forgotPassword.emailPlaceholder')}
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <Pressable 
            style={[styles.resetButton, isLoading && {backgroundColor: 'rgba(255, 255, 255, 0.5)'}]}
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            <Text style={styles.resetButtonText}>
              {isLoading ? t('auth.forgotPassword.sending') : t('auth.forgotPassword.resetButton')}
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 16,
    marginTop: 48,
  },
  description: {
    fontSize: 16,
    color: "#FFF",
    marginBottom: 32,
    opacity: 0.8,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    color: "#FFF",
    fontSize: 16,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: "#FFF",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  resetButton: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
  },
  resetButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 1,
  },
}); 