import { View, Text, Pressable, StyleSheet, Animated, Image } from 'react-native';
import { useEffect, useRef } from 'react';
import { router } from 'expo-router';
import { ParketLogo } from '../../components/icons/ParketLogo';

export default function WelcomeScreen() {
  const starAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(starAnimation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, []);

  const words = [
    'Convenient',
    'Instant',
    'Nearby',
    'Seamless',
    'Cashless',
    'Reliable',
    'Effortless',
    'Secure',
    'Simple',
    
  ];

  const getTextStyle = (index: number) => {
    const position = index / (words.length - 1);
    return {
      opacity: starAnimation.interpolate({
        inputRange: [
          Math.max(0, position - 0.2),
          position,
          Math.min(position + 0.2, 0.9),
        ].sort((a, b) => a - b),
        outputRange: [0.3, 1, 0.3],
        extrapolate: 'clamp'
      }),
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <ParketLogo />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.wordContainer}>
          {words.map((word, index) => (
            <Animated.Text
              key={word}
              style={[
                styles.text,
                getTextStyle(index),
                word === 'PARKET.' && styles.appName,
              ]}
            >
              {word}
            </Animated.Text>
          ))}
          <Text style={styles.appName}>PARKET.</Text>
        </View>

        <Animated.View
          style={[
            styles.starContainer,
            {
              transform: [
                {
                  translateY: starAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 490],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.star} />
        </Animated.View>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push("/auth/login")}
        >
          <Text style={styles.primaryButtonText}>Login</Text>
          <Text style={styles.arrowIcon}>›</Text>
        </Pressable>
   
        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push("/auth/signup")}
        >
          <Text style={styles.primaryButtonText}>Sign Up</Text>
          <Text style={styles.arrowIcon}>›</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C0CCE", // Fallback color
  },
  contentContainer: {
    flex: 1,
    paddingTop: '15%',
    paddingHorizontal: 30,
    position: 'relative',
  },
   wordContainer: {
    alignItems: 'flex-start',
    position: 'relative',
    zIndex: 1,
  },
  text: {
    fontSize: 46,
    color: '#ffffff',
    marginVertical: 2,
    fontWeight: '500',
    lineHeight: 56,
  },
  appName: {
    fontSize: 60,
    color: '#fcfcfc',
    marginVertical: 2,
    fontWeight: '800',
    lineHeight: 56,
    marginTop: 20,
  },
  starContainer: {
    position: 'absolute',
    left: '90%',
    top: '18%',
    width: 50,
    height: 50,
    zIndex: 0,
  },
  star: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffe4b5',
    transform: [{ rotate: '45deg' }],
    borderRadius: 10,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 10,
  },
  primaryButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#fcfcfc'

  },
  primaryButtonText: {
    color: '#fcfcfc',
    fontSize: 18,
    fontWeight: '500',
  },
  arrowIcon: {
    color: '#fcfcfc',
    fontSize: 24,
    fontWeight: '300',
  },
  logoContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 2,
  },
  logo: {
    width: 40,
    height: 40,
  },
}); 