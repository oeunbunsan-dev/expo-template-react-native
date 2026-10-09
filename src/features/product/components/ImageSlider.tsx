import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export interface ImageItem {
  id: string;
  productId?: string;
  url: string;
  altText?: string | null;
  isCover?: boolean;
  sortOrder?: number;
  createdAt?: string;
}

interface ImageSliderProps {
  imageArrObj: ImageItem[];
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ImageSlider: React.FC<ImageSliderProps> = ({ imageArrObj }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Sort images according to sortOrder if provided
  const images = useMemo(() => {
    if (!Array.isArray(imageArrObj)) return [];
    return [...imageArrObj].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [imageArrObj]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(scrollOffset / SCREEN_WIDTH);
    setActiveIndex(currentIndex);
  };

  if (!images || images.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Text style={styles.emptyText}>No Image Available</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: ImageItem }) => (
    <View style={styles.slide}>
      <Image
        source={{ uri: item.url }}
        style={styles.image}
        resizeMode="cover"
      />
      {item.isCover && (
        <View style={styles.coverBadge}>
          <Text style={styles.coverBadgeText}>Cover</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Horizontal Slider */}
      <FlatList
        data={images}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
      />

      {/* Floating Indicator Dots */}
      {images.length > 1 && (
        <View style={styles.indicatorContainer}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                activeIndex === index ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#F3F4F6',
  },
  emptyContainer: {
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  slide: {
    width: SCREEN_WIDTH,
    height: 320,
    position: 'relative',
    backgroundColor: '#E5E7EB',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  coverBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(17, 24, 39, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  coverBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 14,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    width: 22,
    backgroundColor: '#111827',
  },
  inactiveDot: {
    width: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});

export default ImageSlider;
