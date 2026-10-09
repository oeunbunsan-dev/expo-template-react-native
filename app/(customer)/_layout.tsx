import { Stack } from 'expo-router';
import React from 'react';

export default function CustomerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="product/[slug]" />
      <Stack.Screen name="wishlist" />
      <Stack.Screen name="store/[slug]" />
    </Stack>
  );
}
