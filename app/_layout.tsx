import CusLoading from '@/src/components/custom/CusLoading';
import CusModal from '@/src/components/custom/CusModal';
import {
  Battambang_400Regular,
  Battambang_700Bold,
} from '@expo-google-fonts/battambang';
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  KantumruyPro_300Light,
  KantumruyPro_400Regular,
  KantumruyPro_500Medium,
  KantumruyPro_600SemiBold,
  KantumruyPro_700Bold,
  useFonts,
} from '@expo-google-fonts/kantumruy-pro';
import {
  KdamThmorPro_400Regular,
} from '@expo-google-fonts/kdam-thmor-pro';
import {
  Moul_400Regular,
} from '@expo-google-fonts/moul';
import { NavigationBar } from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider, useAppTheme } from '../src/context/ThemeContext';
import { AuthProvider, useAuth } from '../src/providers/auth-provider';


SplashScreen.preventAutoHideAsync().catch(() => { });

function App() {
  const { isDark } = useAppTheme();
  const { isAuthenticated, isLoading, user } = useAuth();
  const currentRole = user?.data?.role;


  console.log("CUrrent role : " + currentRole)

  if (isLoading) {
    return <ActivityIndicator />
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Public Routes */}
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="(auth)/login" />
          <Stack.Screen name="(auth)/register" />
        </Stack.Protected>

        {/* Protected Routes for Customer role only */}
        <Stack.Protected guard={isAuthenticated && (currentRole === "CUSTOMER")}>
          <Stack.Screen name="(tabs)/index" />
          <Stack.Screen name="(tabs)/profile" />
          <Stack.Screen name="(tabs)/settings" />
          <Stack.Screen name="(tabs)/showcase" />
        </Stack.Protected>

        {/* Protected Routes for Vendor role only */}
        <Stack.Protected guard={isAuthenticated && (currentRole === "VENDOR")}>
          <Stack.Screen name="(vendor)/home" />
          <Stack.Screen name="(vendor)/store" />
        </Stack.Protected>
      </Stack>
    </>
  );
}


export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'KantumruyPro-Light': KantumruyPro_300Light,
    'KantumruyPro-Regular': KantumruyPro_400Regular,
    'KantumruyPro-Medium': KantumruyPro_500Medium,
    'KantumruyPro-SemiBold': KantumruyPro_600SemiBold,
    'KantumruyPro-Bold': KantumruyPro_700Bold,
    'Battambang-Regular': Battambang_400Regular,
    'Battambang-Bold': Battambang_700Bold,
    'Moul-Regular': Moul_400Regular,
    'KdamThmorPro-Regular': KdamThmorPro_400Regular,
    'Inter-Light': Inter_300Light,
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => { });
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      {/* Set the navigation bar style */}
      <NavigationBar style="dark" />
      <ThemeProvider>
        <AuthProvider>
          <App />
          <CusModal />
          <CusLoading />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaView>
  );
}
