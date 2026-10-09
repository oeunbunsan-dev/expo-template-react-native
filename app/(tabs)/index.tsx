import { cartService } from '@/src/apis/services/cart';
import { useAppTheme } from '@/src/context/ThemeContext';
import ProductView from '@/src/features/product/views/ProductView';
import { useEffect } from 'react';
import { View } from 'react-native';

const Index = () => {
  const { t, colors } = useAppTheme();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const res = await cartService.getCart();
    console.log("Cart : " + res);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ProductView />
    </View>
  )
}

export default Index
