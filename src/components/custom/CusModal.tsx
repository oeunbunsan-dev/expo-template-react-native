import { useModalStore } from '@/src/stores/use-modal-store';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedCard } from '../ThemedCard';

const CusModal = () => {
  const { visible, children, closeModal } = useModalStore();

  if(!visible) return;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent={true}
      navigationBarTranslucent={true}
      onRequestClose={closeModal}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={closeModal}
      >
        {/* ប្រើ TouchableOpacity activeOpacity={1} ដើម្បីកុំឱ្យបិទនៅពេលចុចចំប្រអប់កណ្តាល */}
        <TouchableOpacity activeOpacity={1}>
          <ThemedCard style={styles.cardContainer}>
            {children}
          </ThemedCard>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  cardContainer: {
    width: 320,
    maxWidth: 380,
    gap: 16,
    padding: 16,
  }
});

export default CusModal;
