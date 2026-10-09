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
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider, useAppTheme } from '../src/context/ThemeContext';
import { AuthProvider, useAuth } from '../src/providers/auth-provider';

SplashScreen.preventAutoHideAsync().catch(() => { });

function App() {
  const { colors } = useAppTheme();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Normalize role from authenticated profile: CUSTOMER | VENDOR | ADMIN
  const currentRole = user?.data?.role ? String(user.data.role).toUpperCase() : null;

  if (isLoading || (isAuthenticated && !currentRole)) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const isVendor = isAuthenticated && currentRole === 'VENDOR';
  const isAdmin = isAuthenticated && currentRole === 'ADMIN';
  const isCustomer = isAuthenticated && !isVendor && !isAdmin;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Public Routes for Unauthenticated */}
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>

      {/* Protected Routes for Customer role */}
      <Stack.Protected guard={isCustomer}>
        <Stack.Screen name="(customer)" />
      </Stack.Protected>

      {/* Protected Routes for Vendor role */}
      <Stack.Protected guard={isVendor}>
        <Stack.Screen name="(vendor)" />
      </Stack.Protected>

      {/* Protected Routes for Admin role */}
      <Stack.Protected guard={isAdmin}>
        <Stack.Screen name="(admin)" />
      </Stack.Protected>

      <Stack.Screen name="+not-found" />
    </Stack>
  );
};

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
  };

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
};
