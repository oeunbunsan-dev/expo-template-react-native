import { useRouter } from 'expo-router';
import { View } from 'react-native';
import ImageSlider from './ImageSlider';
import Review from './Review';
import Store from './Store';

const ProductDetails = ({ productDetailsObj }: any) => {
  const router = useRouter();
  const { id, tags, store, category, images, reviews } = productDetailsObj;

  const handleRedirectToVendorStoreDetailsPage = async (storeObj : any) => {
    const { slug } = storeObj;
    router.push(`/store/${slug}`)
  };
  return (
    <View>
        <ImageSlider imageArrObj={images} />

        <Store storeObj={store} onPressStore={handleRedirectToVendorStoreDetailsPage} />

        <Review reviewObj={reviews}/>
    </View>
  )
}

export default ProductDetails
