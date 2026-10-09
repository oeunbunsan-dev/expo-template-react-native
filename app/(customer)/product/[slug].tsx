import ProductDetailsView from '@/src/features/product/views/ProductDetailsView';
import { useLocalSearchParams } from 'expo-router';

const ProductDetails = () => {
  const { slug } = useLocalSearchParams();
  return <ProductDetailsView slug={slug} />
}

export default ProductDetails
