import { storeService } from '@/src/apis/services/store';
import { useLoadingStore } from '@/src/stores/use-loading-store';
import { useModalStore } from '@/src/stores/use-modal-store';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import StoreDetails from '../components/StoreDetails';

const StoreDetailsView = ({ slug }: any) => {
  const [storeDetails, setStoreDetails] = useState(null);

  const { startLoading, dismissLoading } = useLoadingStore();
  const { openModal } = useModalStore();

  useEffect(() => {
    fetchStoreDetails(slug);
  }, []);

  const fetchStoreDetails = async (slug: string) => {
    startLoading("Fetching store data...");
    try {
      const res = await storeService.getPublicStoreProfile(slug);
      setStoreDetails(res.data);
    } catch (error: any) {
      openModal(<></>);
    } finally {
      dismissLoading();
    }
  };

  return (
    <View>
      {storeDetails && <StoreDetails storeObject={storeDetails} />}
    </View>
  )
}

export default StoreDetailsView
