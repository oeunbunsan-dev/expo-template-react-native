export type UserRole = 'CUSTOMER' | 'VENDOR' | 'ADMIN';

export interface UserSummary {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string | null;
  avatar?: string | null;
  status?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  postalCode?: string;
  country: string;
  phone: string;
}

export interface Brand {
  id: string | number;
  name: string;
  slug: string;
  logo?: string | null;
  description?: string;
  website?: string;
  isActive?: boolean;
}

export interface Category {
  id: string | number;
  parentId?: string | null;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  level?: number;
  isActive?: boolean;
  parent?: {
    id?: string;
    name: string;
    slug?: string;
  } | null;
}

export interface ProductImage {
  id?: string;
  productId?: string;
  url: string;
  altText?: string | null;
  isCover?: boolean;
  sortOrder?: number;
}

export interface ProductInventory {
  id?: string;
  productId?: string;
  variantId?: string | null;
  warehouseName?: string;
  quantity: number;
  reservedQuantity?: number;
  reorderThreshold?: number;
  minStockAlert?: number;
  sku?: string;
}

export interface ProductVariant {
  id: string;
  productId?: string;
  sku: string;
  title: string;
  price: string | number;
  comparePrice?: string | number | null;
  attributes?: Record<string, any>;
  barcode?: string | null;
  image?: string | null;
  inventory?: ProductInventory[];
}

export interface StoreSummary {
  id: string;
  name: string;
  slug?: string;
  logo?: string | null;
  description?: string | null;
  phone?: string;
  email?: string;
}

export interface Product {
  id: string;
  storeId?: string;
  brandId?: string;
  categoryId?: string;
  name?: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  sku?: string;
  basePrice?: string | number;
  comparePrice?: string | number | null;
  costPrice?: string | number | null;
  isFeatured?: boolean;
  isActive?: boolean;
  tags?: string[];
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | string;
  viewsCount?: number;
  salesCount?: number;
  ratingAvg?: string | number;
  ratingCount?: number;
  images?: ProductImage[];
  variants?: ProductVariant[];
  inventory?: ProductInventory[];
  store?: StoreSummary;
  brand?: Brand;
  category?: Category | string;
  reviews?: any[];
  createdAt?: string;
  updatedAt?: string;

  // Static mock fields fallback
  titleEn?: string;
  titleKm?: string;
  descEn?: string;
  descKm?: string;
  price?: number;
  originalPrice?: number;
  rating?: number;
  reviewsCount?: number;
  vendorId?: string;
  vendorName?: string;
  stock?: number;
  iconName?: string;
  accentBg?: string;
  badge?: string;
  [key: string]: any;
}

export interface Vendor {
  id: string;
  userId?: string;
  companyName?: string;
  name?: string;
  businessNumber?: string;
  taxId?: string;
  status?: 'PENDING' | 'APPROVED' | 'SUSPENDED' | 'REJECTED' | string;
  commissionRate?: string | number;
  user?: UserSummary;
  stores?: StoreSummary[];
  createdAt?: string;
  updatedAt?: string;

  // Mock fields fallback
  nameEn?: string;
  nameKm?: string;
  rating?: number;
  totalProducts?: number;
  isVerified?: boolean;
  [key: string]: any;
}

export interface OrderItem {
  id?: string;
  orderId?: string;
  productId?: string;
  variantId?: string | null;
  quantity: number;
  unitPrice?: string | number;
  subtotal?: string | number;
  product?: Product;
  [key: string]: any;
}

export interface Order {
  id: string;
  orderNumber?: string;
  customerId?: string;
  storeId?: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | string;
  subtotal?: string | number;
  discountTotal?: string | number;
  shippingTotal?: string | number;
  taxTotal?: string | number;
  totalAmount?: string | number;
  shippingAddress?: ShippingAddress;
  customer?: UserSummary;
  store?: StoreSummary;
  items?: OrderItem[];
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;

  // Mock fields fallback
  customerName?: string;
  total?: number;
  date?: string;
  [key: string]: any;
}

export interface CartItem {
  id: string;
  cartId?: string;
  productId: string;
  variantId?: string | null;
  quantity: number;
  unitPrice?: string | number;
  product?: Product;
}

export interface Cart {
  id?: string;
  customerId?: string;
  items: CartItem[];
  subtotal?: string | number;
  totalAmount?: string | number;
}

export interface WishlistItem {
  id?: string;
  productId: string;
  product?: Product;
  createdAt?: string;
}

export interface Coupon {
  id?: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  expiryDate: string;
  isActive?: boolean;
}
