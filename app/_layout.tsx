import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  KantumruyPro_300Light,
  KantumruyPro_400Regular,
  KantumruyPro_500Medium,
  KantumruyPro_600SemiBold,
  KantumruyPro_700Bold,
} from '@expo-google-fonts/kantumruy-pro';
import {
  Battambang_400Regular,
  Battambang_700Bold,
} from '@expo-google-fonts/battambang';
import {
  Moul_400Regular,
} from '@expo-google-fonts/moul';
import {
  KdamThmorPro_400Regular,
} from '@expo-google-fonts/kdam-thmor-pro';
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { ThemeProvider, useAppTheme } from '../src/context/ThemeContext';
import { EcommerceProvider } from '../src/context/EcommerceContext';

SplashScreen.preventAutoHideAsync().catch(() => {});

function RootNavigation() {
  const { isDark } = useAppTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
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
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider>
      <EcommerceProvider>
        <RootNavigation />
      </EcommerceProvider>
    </ThemeProvider>
  );
}
