import { Stack } from "expo-router";
import '../i18n/config';

export default function RootLayout() {
  return (
    <Stack screenOptions={{
      headerShown: false,
    }} />
  );
}
