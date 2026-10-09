import StoreDetailsView from '@/src/features/store/views/StoreDetailsView';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function CustomerStoreDetails() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  return <StoreDetailsView slug={slug} />;
}
