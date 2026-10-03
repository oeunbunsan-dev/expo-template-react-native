export type UserRole = 'customer' | 'vendor' | 'admin';

export type ProductCategory = 'all' | 'electronics' | 'fashion' | 'artisan' | 'food' | 'home';

export interface Product {
  id: string;
  titleEn: string;
  titleKm: string;
  descEn: string;
  descKm: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  category: ProductCategory;
  vendorId: string;
  vendorName: string;
  stock: number;
  iconName: string;
  accentBg: string;
  badge?: string;
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  date: string;
  paymentMethod: string;
  vendorId?: string;
}

export interface Vendor {
  id: string;
  name: string;
  nameKm: string;
  ownerName: string;
  rating: number;
  salesCount: number;
  revenue: number;
  productsCount: number;
  status: 'active' | 'pending' | 'suspended';
  commissionRate: number;
  joinedDate: string;
}

export interface PlatformMetrics {
  totalGmv: number;
  totalOrders: number;
  activeVendors: number;
  totalCustomers: number;
  commissionEarned: number;
}
