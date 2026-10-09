import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../src/context/ThemeContext';

export default function TabLayout() {
  const { colors, t } = useAppTheme();
  const insets = useSafeAreaInsets();

  const getFirstTabTitleOld = () => {
    switch (role) {
      case 'vendor':
        return t('navManage');
      case 'admin':
        return t('navAdmin');
      case 'customer':
      default:
        return t('navHome');
    }
  };

  const getFirstTabIconOld = (focused: boolean) => {
    switch (role) {
      case 'vendor':
        return focused ? 'storefront' : 'storefront-outline';
      case 'admin':
        return focused ? 'shield-checkmark' : 'shield-checkmark-outline';
      case 'customer':
      default:
        return focused ? 'grid' : 'grid-outline';
    }
  };

  const getSecondTabTitleOld = () => {
    switch (role) {
      case 'vendor':
        return 'Orders & Stock';
      case 'admin':
        return 'Governance';
      case 'customer':
      default:
        return t('navOrders');
    }
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          height: 60 + (insets.bottom > 0 ? insets.bottom : 10),
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "getFirstTabTitle()",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          tabBarBadgeStyle: {
            backgroundColor: '#EF4444',
            fontSize: 10,
            lineHeight: 14,
          },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="showcase"
        options={{
          title: t('navShowcase'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'sparkles' : 'sparkles-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('navSettings'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'settings' : 'settings-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
