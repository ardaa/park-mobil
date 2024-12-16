import { Stack } from "expo-router";
import '../i18n/config';
import { AuthProvider } from './contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>

        <Stack.Screen name="auth/login" />
       
      </Stack>
      </AuthProvider>
  );
}
