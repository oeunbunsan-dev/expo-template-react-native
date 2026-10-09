import { useLoadingStore } from '@/src/stores/use-loading-store';
import { NavigationBar } from 'expo-navigation-bar';
import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';

const CusLoading = () => {
  const { visible, label, variant } = useLoadingStore();

  const getVariantStyles = () => {
    switch (variant) {
      case 'dark':
        return {
          overlayBg: '#121212',
          navBarBg: '#121212',
          spinnerColor: '#bb86fc',
          textColor: '#ffffff',
          showBox: false,
        };
      case 'light':
        return {
          overlayBg: '#ffffff',
          navBarBg: '#ffffff',
          spinnerColor: '#283790',
          textColor: '#000000',
          showBox: false,
        };
      case 'default':
      default:
        return {
          overlayBg: 'rgba(0, 0, 0, 0.4)',
          navBarBg: '#000000a6',
          spinnerColor: '#ffffff',
          textColor: '#ffffff',
          showBox: true,
        };
    }
  };

  const stylesConfig = getVariantStyles();

  if (!visible) return;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
    >
      {/* @ts-ignore */}
      {visible && <NavigationBar backgroundColor={stylesConfig.navBarBg} />}

      <View style={[styles.overlay, { backgroundColor: stylesConfig.overlayBg }]}>
        {stylesConfig.showBox ? (

          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={stylesConfig.spinnerColor} />
            {label && <Text style={[styles.loadingText, { color: stylesConfig.textColor }]}>{label}</Text>}
          </View>
        ) : (

          <View style={styles.fullscreenContent}>
            <ActivityIndicator size="large" color={stylesConfig.spinnerColor} />
            {label && <Text style={[styles.loadingText, { color: stylesConfig.textColor, marginTop: 16 }]}>{label}</Text>}
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    padding: 24,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // ប្រអប់ស្ទីលងងឹតរលោង
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 150,
    maxWidth: 220,
    gap: 12,
    // ស្រមោលប្រអប់
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  fullscreenContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default CusLoading;
