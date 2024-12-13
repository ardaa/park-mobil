import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import { router } from 'expo-router';

export async function signInWithApple() {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    
    // Here you would typically send the credential to your backend
    console.log(credential);
    
    // Navigate to the main app
    router.replace('/(tabs)');
  } catch (e) {
    if (e.code === 'ERR_CANCELED') {
      // Handle user cancellation
      console.log('User canceled Apple Sign in');
    } else {
      // Handle other errors
      console.error('Apple Sign in error:', e);
    }
  }
}

export function useGoogleSignIn() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
  });

  async function handleGoogleSignIn() {
    try {
      const result = await promptAsync();
      if (result?.type === 'success') {
        const { authentication } = result;
        // Here you would typically send the authentication token to your backend
        console.log(authentication);
        
        // Navigate to the main app
        router.replace('/(tabs)');
      }
    } catch (e) {
      console.error('Google Sign in error:', e);
    }
  }

  return {
    handleGoogleSignIn,
    isReady: !!request,
  };
} 