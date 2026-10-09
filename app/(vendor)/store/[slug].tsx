import StoreDetailsView from '@/src/features/store/views/StoreDetailsView';
import { useLocalSearchParams } from 'expo-router';

const StoreDetails = () => {
  const { slug } = useLocalSearchParams();
  return <StoreDetailsView slug={slug} />
}

export default StoreDetails
