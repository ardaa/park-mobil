import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: string;
  email: string;
  name: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface LoginCredentials {
  email: string;
  password: string;
}

const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

export const loginWithEmailAndPassword = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  // Mock login - replace with real API call later
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      // Mock validation
      if (credentials.email === 'test' && credentials.password === 'test') {
        const response = {
          token: 'mock-jwt-token',
          user: {
            id: '1',
            email: credentials.email,
            name: 'Test User'
          }
        };

          await SecureStore.setItemAsync(AUTH_TOKEN_KEY, response.token);
          await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(response.user));
        

        resolve(response);
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 1000); // Simulate network delay
  });
};

export const checkSavedAuth = async (): Promise<LoginResponse | null> => {
  try {
    const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
    const userData = await SecureStore.getItemAsync(USER_DATA_KEY);
    
    if (token && userData) {
      return {
        token,
        user: JSON.parse(userData)
      };
    }
    return null;
  } catch (error) {
    console.error('Error checking saved auth:', error);
    return null;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_DATA_KEY);
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

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
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, credential.identityToken);
    await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(credential));
    // Navigate to the main app
    router.replace('/(tabs)');
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code === 'ERR_CANCELED') {
      // Handle user cancellation
      console.log('User canceled Apple Sign in');
    } else {
      // Handle other errors
      console.error('Apple Sign in error:', error);
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