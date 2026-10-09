import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export interface UserReview {
  id: string;
  userName?: string;
  userAvatar?: string | null;
  rating: number; // e.g. 1 - 5
  comment?: string;
  createdAt?: string;
  isVerifiedPurchase?: boolean;
}

interface ReviewProps {
  reviewObj: UserReview | UserReview[];
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Text
          key={star}
          style={[styles.star, star <= Math.round(rating) ? styles.starFilled : styles.starEmpty]}
        >
          ★
        </Text>
      ))}
    </View>
  );
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const SingleReviewItem: React.FC<{ review: UserReview }> = ({ review }) => {
  const { userName = 'Anonymous', userAvatar, rating = 5, comment, createdAt, isVerifiedPurchase } = review;
  const initial = userName.charAt(0).toUpperCase();

  return (
    <View style={styles.reviewCard}>
      {/* User Header */}
      <View style={styles.headerRow}>
        {userAvatar ? (
          <Image source={{ uri: userAvatar }} style={styles.avatar} />
        ) : (
          <View style={styles.placeholderAvatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
        )}

        <View style={styles.userMeta}>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>{userName}</Text>
            {isVerifiedPurchase && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>
          {createdAt ? <Text style={styles.dateText}>{formatDate(createdAt)}</Text> : null}
        </View>

        <StarRating rating={rating} />
      </View>

      {/* Review Comment */}
      {comment ? <Text style={styles.commentText}>{comment}</Text> : null}
    </View>
  );
};

const Review: React.FC<ReviewProps> = ({ reviewObj }) => {
  // Normalize reviewObj to handle both a single review object or an array of reviews
  const reviews: UserReview[] = Array.isArray(reviewObj)
    ? reviewObj
    : reviewObj
    ? [reviewObj]
    : [];

  if (reviews.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Reviews Yet</Text>
        <Text style={styles.emptySubtitle}>Be the first to share your thoughts on this product!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>Customer Reviews ({reviews.length})</Text>
      {reviews.map((item) => (
        <SingleReviewItem key={item.id} review={item} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  reviewCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E5E7EB',
  },
  placeholderAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#4B5563',
    fontWeight: '700',
    fontSize: 15,
  },
  userMeta: {
    flex: 1,
    marginLeft: 10,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  verifiedBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#059669',
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  starRow: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    fontSize: 14,
  },
  starFilled: {
    color: '#F59E0B',
  },
  starEmpty: {
    color: '#E5E7EB',
  },
  commentText: {
    marginTop: 10,
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  emptyContainer: {
    padding: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default Review;
