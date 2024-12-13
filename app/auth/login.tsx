import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { signInWithApple, useGoogleSignIn } from '../../utils/auth';
import { AppleLogo } from "@/components/icons/AppleLogo";
import { GoogleLogo } from "@/components/icons/GoogleLogo";

export default function Login() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleGoogleSignIn, isReady: isGoogleReady } = useGoogleSignIn();

  const handleLogin = () => {
    // Here you would typically handle email/password authentication
    // For now, we'll just navigate to the tabs screen
    router.replace("/(tabs)");
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

        <Text style={styles.title}>{t('auth.login.title')}</Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('auth.login.email')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('auth.login.emailPlaceholder')}
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('auth.login.password')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('auth.login.passwordPlaceholder')}
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          
          <Link href="/auth/forgot-password" style={styles.forgotPassword}>
            {t('auth.login.forgotPassword')}
          </Link>

          <Pressable style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>{t('auth.login.loginButton')}</Text>
          </Pressable>

          <Text style={styles.orText}>{t('auth.login.or')}</Text>

          <Pressable 
            style={styles.socialButton} 
            onPress={signInWithApple}
          >
            <AppleLogo size={24} color="#FFF" />
            <Text style={styles.socialButtonText}>
              {t('auth.login.continueWith', { provider: 'Apple' })}
            </Text>
          </Pressable>

          <Pressable 
            style={styles.socialButton}
            onPress={handleGoogleSignIn}
            disabled={!isGoogleReady}
          >
            <GoogleLogo size={24} color="#FFF" />
            <Text style={styles.socialButtonText}>
              {t('auth.login.continueWith', { provider: 'Google' })}
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
    marginBottom: 32,
    marginTop: 48,
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
  forgotPassword: {
    color: "#4C6EF5",
    textAlign: "right",
    fontSize: 14,
    color: "#FFF",
  },
  loginButton: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
  },
  loginButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
  },
  orText: {
    color: "#FFF",
    textAlign: "center",
    marginVertical: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    gap: 12,
  },
  socialButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  socialIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 1,
  },
}); 