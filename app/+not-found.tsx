import { useRouter } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface NotFoundProps {
  title?: string;
  description?: string;
  onGoBack?: () => void;
  onGoHome?: () => void;
}

const NotFound: React.FC<NotFoundProps> = ({
  title = "Page Not Found",
  description = "The page or product you're looking for doesn't exist, has been removed, or is temporarily unavailable.",
  onGoBack,
  onGoHome,
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onGoBack) {
      onGoBack();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const handleHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      router.replace('/');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Visual Badge / Graphic */}
        <View style={styles.badgeContainer}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>🔍</Text>
          </View>
          <Text style={styles.errorCode}>404</Text>
        </View>

        {/* Informational Copy */}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            activeOpacity={0.8}
            onPress={handleHome}
          >
            <Text style={styles.primaryButtonText}>Back to Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            activeOpacity={0.7}
            onPress={handleBack}
          >
            <Text style={styles.secondaryButtonText}>Previous Page</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconText: {
    fontSize: 34,
  },
  errorCode: {
    fontSize: 54,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: -1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 320,
    marginBottom: 32,
  },
  actionContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#111827',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default NotFound;
