import { DynamicForm, FormFieldSchema } from '@/src/components/DynamicForm';
import { ThemedButton } from '@/src/components/ThemedButton';
import { ThemedText } from '@/src/components/ThemedText';
import { useAppTheme } from '@/src/context/ThemeContext';
import { useAuth } from '@/src/providers/auth-provider';
import { useLoadingStore } from '@/src/stores/use-loading-store';
import { useModalStore } from '@/src/stores/use-modal-store';
import { NavigationBar } from 'expo-navigation-bar';
import { useRouter } from 'expo-router';
import { Alert, View } from 'react-native';
import { z } from 'zod';

// 1. Define Zod validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'សូមបញ្ចូលអ៊ីមែល')
    .email('ទម្រង់អ៊ីមែលមិនត្រឹមត្រូវទេ'),
  password: z
    .string()
    .min(1, 'សូមបញ្ចូលពាក្យសម្ងាត់')
    .min(6, 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ ៦ តួអក្សរ'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function RegisterView() {
  const router = useRouter();
  const { colors, t } = useAppTheme();
  const { openModal, closeModal } = useModalStore();
  const { startLoading, dismissLoading } = useLoadingStore();
  const { signIn } = useAuth();

  // 2. Define field configurations
  const formFields: FormFieldSchema<LoginFormValues>[] = [
    {
      name: 'email',
      label: t('emailAddress'),
      placeholder: t('emailAddress'),
      type: 'email',
      autoCapitalize: 'none',
      keyboardType: 'email-address',
    },
    {
      name: 'password',
      label: t('password'),
      placeholder: t('password'),
      type: 'password',
      autoCapitalize: 'none',
    },
  ];

  // 3. Form submit handler (runs only when Zod validation passes )
  const handleLogin = async (data: LoginFormValues) => {
    const payload = {
      'email': data.email,
      "password": data.password
    };
    try {
      await signIn(payload);
    } catch (error: any) {
      Alert.alert('បរាជ័យ', error?.message || 'មានបញ្ហាក្នុងការចុះឈ្មោះ');
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        paddingHorizontal: 16,
      }}
    >
      <NavigationBar  style="light" />
      <ThemedText variant="title" style={{ marginBottom: 16 }}>
        ចូលប្រពន្ធ
      </ThemedText>

      <DynamicForm<LoginFormValues>
        fields={formFields}
        schema={loginSchema}
        defaultValues={{ email: '', password: '' }}
        onSubmit={handleLogin}
        submitButtonText="ចូល"
      />

      <ThemedButton
        title={t('signUpAction')}
        style={{
          marginBlockStart: 8
        }}
        variant="outline"
        size="md"
        onPress={() => router.push('/register-vendor' as any)}
      />
    </View>
  );
};
