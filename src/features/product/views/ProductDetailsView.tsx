import { productService } from '@/src/apis/services/product';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import ProductDetails from '../components/ProductDetails';

const ProductDetailsView = ({ slug }: any) => {
  const [productDetails, setProductDetails] = useState(null);

  useEffect(() => {
    fetchProductDetails(slug);
  }, []);

  const fetchProductDetails = async (slug: any) => {
    try {
      const res = await productService.getProductBySlug(slug);
      setProductDetails(res.data);
    } catch (error: any) {
      alert(error);
    }
  };

  return (
    <View>
      {productDetails && <ProductDetails productDetailsObj={productDetails} />}
    </View>
  )
}

export default ProductDetailsView
