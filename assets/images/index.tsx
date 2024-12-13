import { Text, View, StyleSheet, Pressable, Animated, Image } from "react-native";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';

const WORDS = [
  "welcome.features.smartParking",
  "welcome.features.realTimeInfo",
  "welcome.features.navigation",
  "welcome.features.availability",
  "welcome.features.easyPayment",
  "welcome.features.timeSaving",
  "welcome.features.convenient",
  "welcome.features.secure",
  "welcome.features.nearbySpots",
].map(key => ({
  key,
  brightness: 0.4 + Math.random() * 0.7,
}));

export default function Welcome() {
  const { t } = useTranslation();
  const fadeAnims = useRef(
    WORDS.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const animations = fadeAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 50, // Reduced from 500ms to 200ms
        delay: index * 10, // Reduced from 200ms to 50ms
        useNativeDriver: true,
      })
    );

    Animated.sequence(animations).start();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1C0CCE", "#1d3461"]}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.content}>
        <View style={styles.topSection}>
          <View style={styles.wordCloud}>
            {WORDS.map((word, index) => (
              <Animated.Text
                key={index}
                style={[
                  styles.cloudText,
                  {
                    opacity: fadeAnims[index],
                    color: `rgba(255, 255, 255, ${word.brightness})`,
                    transform: [{
                      translateY: fadeAnims[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [10, 0],
                      })
                    }]
                  }
                ]}
              >
                {t(word.key)}
              </Animated.Text>
            ))}
          </View>
          
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/logo-notext.png")}
              style={styles.logo}
            />
          </View>
        </View>

        <View style={styles.focusContainer}>
          <Text style={styles.focusText}>{t('welcome.brand')} <View style={styles.sparkle} /></Text>
         
        </View>

        <View style={styles.bottomContent}>
          <Link href="/auth/login" asChild>
            <Pressable style={styles.loginButton}>
              <Text style={styles.loginButtonText}>{t('welcome.login')}</Text>
            </Pressable>
          </Link>
          
          <Link href="/auth/signup" asChild>
            <Pressable style={styles.signupButton}>
              <Text style={styles.signupButtonText}>{t('welcome.signup')}</Text>
            </Pressable>
          </Link>
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
    padding: 24,
    paddingTop: 60,
    justifyContent: 'space-between',
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  wordCloud: {
    flex: 1,
    paddingTop: 20,
  },
  cloudText: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 8,
  },
  logoContainer: {
    marginLeft: 20,
  },
  logo: {
    width: 80,
    height: 80,
    tintColor: 'white',
  },
  focusContainer: {
    alignSelf: 'flex-start',
    position: 'relative',
  },
  focusText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: -1,
  },
  sparkle: {

    width: 40,
    height: 40,
    backgroundColor: '#FFE066',
    borderRadius: 4,
    transform: [{ rotate: '45deg' }],
  },
  bottomContent: {
    gap: 16,
  },
  loginButton: {
    alignItems: 'center',
    borderWidth: 1,
    padding: 20,
    borderColor: '#FFF',
    borderRadius: 16,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  signupButton: {
    alignItems: 'center',
    borderWidth: 1,
    padding: 20,
    borderColor: '#FFF',
    borderRadius: 16,
  },
  signupButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
});
