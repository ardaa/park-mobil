import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Link, router, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSignup = () => {
    router.replace("/tabs");
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

        <Text style={styles.title}>Get your free account</Text>

        <View style={styles.form}>
          <Pressable style={styles.socialButton}>
            <Text style={styles.socialButtonText}>Continue with Apple</Text>
          </Pressable>

          <Pressable style={styles.socialButton}>
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </Pressable>

          <Text style={styles.orText}>OR</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Work Email</Text>
            <TextInput
              style={styles.input}
              placeholder="hello@company.com"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <Pressable style={styles.signupButton} onPress={handleSignup}>
            <Text style={styles.signupButtonText}>Continue with Email</Text>
          </Pressable>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Link href="/auth/login" style={styles.loginLink}>
              Login
            </Link>
          </View>
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
  signupButton: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  signupButtonText: {
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
    borderWidth: 1,
    borderColor: "#FFF",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  socialButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  loginText: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  loginLink: {
    color: "#FFF",
    fontWeight: "600",
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 1,
  },
}); 