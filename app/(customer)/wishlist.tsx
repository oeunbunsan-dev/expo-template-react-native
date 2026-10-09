import { wishListService } from '@/src/apis/services/wishlist';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState(null);

  useEffect(() => {
    fetchWishList();
  }, []);

  const fetchWishList = async () => {
    try {
      const result = await wishListService.getWishList();
      setWishlist(result);
    } catch (error: any) {
      alert(JSON.stringify(error))
    }
  };


  return (
    <View>
      <Text>{JSON.stringify(wishlist)}</Text>
    </View>
  )
}

export default Wishlist
