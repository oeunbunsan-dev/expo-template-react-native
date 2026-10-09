import { categoryService } from '@/src/apis/services/category';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
export interface CategoryItem {
  id: string | number;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  level?: number;
  isActive?: boolean;
  parent?: {
    name: string;
  } | null;
  createdAt?: string;
}

interface CategoryFormData {
  name: string;
  description: string;
  image: string;
  isActive: boolean;
}

const initialForm: CategoryFormData = {
  name: '',
  description: '',
  image: '',
  isActive: true,
};

const CategoryView: React.FC = () => {
  const { width } = useWindowDimensions();
  const isTabletOrDesktop = width >= 700;

  // Data states
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  // Modal / Form states
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>(initialForm);
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);

  // 1. READ: Fetch all categories
  const fetchCategories = useCallback(async () => {
    try {
      const res = await categoryService.getAllCategories();
      const data = Array.isArray(res) ? res : res?.data || [];
      setCategories(data);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to fetch categories.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCategories();
  };

  // Open modal for Create
  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setFormData(initialForm);
    setIsModalVisible(true);
  };

  // Open modal for Update
  const handleOpenEditModal = (category: CategoryItem) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      description: category.description || '',
      image: category.image || '',
      isActive: category.isActive !== false,
    });
    setIsModalVisible(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingCategory(null);
    setFormData(initialForm);
  };

  // 2 & 3. CREATE and UPDATE: Save category form
  const handleSaveCategory = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Validation Error', 'Category name is required.');
      return;
    }

    try {
      setFormSubmitting(true);

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        image: formData.image.trim() || undefined,
        isActive: formData.isActive,
      };

      if (editingCategory) {
        // UPDATE operation
        const updated = await categoryService.updateCategory(editingCategory.id, payload);
        const updatedItem = updated?.data || updated;

        setCategories((prev) =>
          prev.map((c) =>
            c.id === editingCategory.id ? { ...c, ...updatedItem, ...payload } : c
          )
        );
        Alert.alert('Success', 'Category updated successfully.');
      } else {
        // CREATE operation
        const created = await categoryService.createCategory(payload);
        const newItem = created?.data || created;

        setCategories((prev) => [newItem, ...prev]);
        Alert.alert('Success', 'Category created successfully.');
      }

      handleCloseModal();
    } catch (err: any) {
      Alert.alert('Operation Failed', err?.message || 'Could not save category.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // 4. DELETE: Remove category
  const handleDeleteCategory = (category: CategoryItem) => {
    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${category.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeletingId(category.id);
              await categoryService.deleteCategory(category.id);
              setCategories((prev) => prev.filter((item) => item.id !== category.id));
            } catch (err: any) {
              Alert.alert('Error', err?.message || 'Could not delete category.');
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Top Header / Search / Add Button */}
      <View style={styles.topBar}>
        <View style={styles.searchWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search categories..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearSearch}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.createButton}
          activeOpacity={0.8}
          onPress={handleOpenCreateModal}
        >
          <Text style={styles.createButtonText}>+ Add Category</Text>
        </TouchableOpacity>
      </View>

      {/* Main List / Table */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#111827" />
          <Text style={styles.loadingText}>Loading categories...</Text>
        </View>
      ) : filteredCategories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📁</Text>
          <Text style={styles.emptyTitle}>No categories found</Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery
              ? `No matches for "${searchQuery}"`
              : 'Add your first category to get started.'}
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {isTabletOrDesktop ? (
            /* Tablet & Desktop: Tabular Grid */
            <View style={styles.tableCard}>
              <View style={styles.tableHeader}>
                <Text style={[styles.colHeader, styles.colImage]}>Image</Text>
                <Text style={[styles.colHeader, styles.colName]}>Name & Slug</Text>
                <Text style={[styles.colHeader, styles.colDesc]}>Description</Text>
                <Text style={[styles.colHeader, styles.colParent]}>Parent</Text>
                <Text style={[styles.colHeader, styles.colStatus]}>Status</Text>
                <Text style={[styles.colHeader, styles.colActions]}>Actions</Text>
              </View>

              {filteredCategories.map((item, index) => {
                const isDeleting = deletingId === item.id;
                return (
                  <View
                    key={item.id}
                    style={[
                      styles.tableRow,
                      index % 2 === 1 && styles.tableRowAlt,
                    ]}
                  >
                    <View style={styles.colImage}>
                      {item.image ? (
                        <Image source={{ uri: item.image }} style={styles.thumbImage} />
                      ) : (
                        <View style={styles.thumbPlaceholder}>
                          <Text style={styles.thumbInitial}>{item.name.charAt(0)}</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.colName}>
                      <Text style={styles.primaryText} numberOfLines={1}>{item.name}</Text>
                      <Text style={styles.slugText} numberOfLines={1}>/{item.slug}</Text>
                    </View>

                    <View style={styles.colDesc}>
                      <Text style={styles.bodyText} numberOfLines={2}>
                        {item.description || '—'}
                      </Text>
                    </View>

                    <View style={styles.colParent}>
                      <Text style={styles.bodyText}>{item.parent?.name || 'Root'}</Text>
                    </View>

                    <View style={styles.colStatus}>
                      <View
                        style={[
                          styles.statusBadge,
                          item.isActive !== false ? styles.statusActive : styles.statusInactive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
                            item.isActive !== false ? styles.statusTextActive : styles.statusTextInactive,
                          ]}
                        >
                          {item.isActive !== false ? 'Active' : 'Draft'}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.colActions, styles.actionsRow]}>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => handleOpenEditModal(item)}
                      >
                        <Text style={styles.editBtnText}>Edit</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionBtn, styles.deleteBtn]}
                        disabled={isDeleting}
                        onPress={() => handleDeleteCategory(item)}
                      >
                        {isDeleting ? (
                          <ActivityIndicator size="small" color="#DC2626" />
                        ) : (
                          <Text style={styles.deleteBtnText}>Delete</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            /* Mobile: Responsive Cards */
            <View style={styles.cardsGrid}>
              {filteredCategories.map((item) => {
                const isDeleting = deletingId === item.id;
                return (
                  <View key={item.id} style={styles.mobileCard}>
                    <View style={styles.cardHeader}>
                      {item.image ? (
                        <Image source={{ uri: item.image }} style={styles.mobileThumb} />
                      ) : (
                        <View style={styles.mobilePlaceholder}>
                          <Text style={styles.thumbInitial}>{item.name.charAt(0)}</Text>
                        </View>
                      )}

                      <View style={styles.cardMainInfo}>
                        <View style={styles.cardTitleRow}>
                          <Text style={styles.primaryText} numberOfLines={1}>{item.name}</Text>
                          <View
                            style={[
                              styles.statusBadge,
                              item.isActive !== false ? styles.statusActive : styles.statusInactive,
                            ]}
                          >
                            <Text
                              style={[
                                styles.statusBadgeText,
                                item.isActive !== false ? styles.statusTextActive : styles.statusTextInactive,
                              ]}
                            >
                              {item.isActive !== false ? 'Active' : 'Draft'}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.slugText}>/{item.slug}</Text>
                        {item.parent?.name && (
                          <Text style={styles.parentPill}>Parent: {item.parent.name}</Text>
                        )}
                      </View>
                    </View>

                    {item.description ? (
                      <Text style={styles.mobileDesc} numberOfLines={2}>
                        {item.description}
                      </Text>
                    ) : null}

                    <View style={styles.mobileActionsRow}>
                      <TouchableOpacity
                        style={[styles.mobileActionBtn, styles.mobileEditBtn]}
                        onPress={() => handleOpenEditModal(item)}
                      >
                        <Text style={styles.editBtnText}>Edit</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.mobileActionBtn, styles.mobileDeleteBtn]}
                        disabled={isDeleting}
                        onPress={() => handleDeleteCategory(item)}
                      >
                        {isDeleting ? (
                          <ActivityIndicator size="small" color="#DC2626" />
                        ) : (
                          <Text style={styles.deleteBtnText}>Delete</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      )}

      {/* CREATE & EDIT MODAL */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Category Name <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Laptops & Computers"
                  value={formData.name}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, name: text }))}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Image URL</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, image: text }))}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Short description of this category..."
                  multiline
                  numberOfLines={3}
                  value={formData.description}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, description: text }))}
                />
              </View>

              <View style={styles.switchGroup}>
                <View>
                  <Text style={styles.switchLabel}>Active Status</Text>
                  <Text style={styles.switchSublabel}>Visible in product catalogs</Text>
                </View>
                <Switch
                  value={formData.isActive}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, isActive: val }))}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCloseModal}
                disabled={formSubmitting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSaveCategory}
                disabled={formSubmitting}
              >
                {formSubmitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {editingCategory ? 'Update' : 'Create'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 12,
  },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  clearSearch: {
    fontSize: 14,
    color: '#9CA3AF',
    padding: 4,
  },
  createButton: {
    backgroundColor: '#111827',
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  scrollList: {
    padding: 16,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 6,
    textAlign: 'center',
  },

  /* Tablet / Desktop Table Styles */
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  colHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tableRowAlt: {
    backgroundColor: '#FCFCFD',
  },
  colImage: { width: 70 },
  colName: { flex: 2, paddingRight: 12 },
  colDesc: { flex: 3, paddingRight: 12 },
  colParent: { flex: 1.2, paddingRight: 8 },
  colStatus: { flex: 1 },
  colActions: { width: 140, justifyContent: 'flex-end' },

  thumbImage: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  thumbPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbInitial: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4B5563',
  },
  primaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  slugText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  bodyText: {
    fontSize: 13,
    color: '#4B5563',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusActive: { backgroundColor: '#ECFDF5' },
  statusInactive: { backgroundColor: '#F3F4F6' },
  statusBadgeText: { fontSize: 11, fontWeight: '700' },
  statusTextActive: { color: '#059669' },
  statusTextInactive: { color: '#6B7280' },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  deleteBtn: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FEE2E2',
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  deleteBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
  },

  /* Mobile Card Styles */
  cardsGrid: {
    gap: 12,
  },
  mobileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  mobileThumb: {
    width: 52,
    height: 52,
    borderRadius: 10,
  },
  mobilePlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardMainInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  parentPill: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
  },
  mobileDesc: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginTop: 10,
  },
  mobileActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 10,
  },
  mobileActionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  mobileEditBtn: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  mobileDeleteBtn: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },

  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  modalCloseText: {
    fontSize: 18,
    color: '#9CA3AF',
    padding: 4,
  },
  modalBody: {
    padding: 18,
    gap: 14,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  required: {
    color: '#DC2626',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  switchSublabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  submitButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#111827',
    minWidth: 90,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default CategoryView;
