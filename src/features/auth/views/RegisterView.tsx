// src/screens/RegisterView.tsx
import { DynamicForm, FormFieldSchema } from '@/src/components/DynamicForm';
import { ThemedText } from '@/src/components/ThemedText';
import { useAppTheme } from '@/src/context/ThemeContext';
import { useAuth } from '@/src/providers/auth-provider';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, View } from 'react-native';
import { z } from 'zod';

// 1. Define Zod validation schema
const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'សូមបញ្ចូលអ៊ីមែល')
    .email('ទម្រង់អ៊ីមែលមិនត្រឹមត្រូវទេ'),
  firstname: z.string().min(1, 'សូមបញ្ចូលនាមខ្លួន'),
  lastname: z.string().min(1, 'សូមបញ្ចូលនាមត្រកូល'),
  password: z
    .string()
    .min(1, 'សូមបញ្ចូលពាក្យសម្ងាត់')
    .min(6, 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ ៦ តួអក្សរ'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterView() {
  const router = useRouter();
  const { colors, t } = useAppTheme();
  const { signUp } = useAuth();

  const [ isLoading, setIsLoading ] = useState(false);

  // 2. Define field configurations
  const formFields: FormFieldSchema<RegisterFormValues>[] = [
    {
      name: 'email',
      label: t('emailAddress'),
      placeholder: t('emailAddress'),
      type: 'email',
      autoCapitalize: 'none',
      keyboardType: 'email-address',
    },
    {
      name: 'firstname',
      label: "Firstname",
      placeholder: "Firstname",
      type: "text",
      autoCapitalize: 'none',
    },
    {
      name: 'lastname',
      label: "Lastname",
      placeholder: "Lastname",
      type: "text",
      autoCapitalize: 'none',
    },
    {
      name: 'password',
      label: t('password'),
      placeholder: t('password'),
      type: 'password',
      autoCapitalize: 'none',
    },
  ];

  // 3. Form submit handler (runs only when Zod validation passes)
  const handleRegister = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const payload = {
        'email' : data.email,
        'firstName' : data.firstname,
        'lastName' : data.lastname,
        'password' : data.password,
      };

      const res = await signUp(payload);
      router.replace("/(auth)/login")
    } catch (error: any) {
      Alert.alert('បរាជ័យ', error?.message || 'មានបញ្ហាក្នុងការចុះឈ្មោះ');
    } finally {
      setIsLoading(false);
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
      <ThemedText variant="title" style={{ marginBottom: 16 }}>
        បង្កើតគណនីថ្មី
      </ThemedText>

      <DynamicForm<RegisterFormValues>
        fields={formFields}
        schema={registerSchema}
        defaultValues={{ email: '', firstname: '', lastname : '', password: '' }}
        onSubmit={handleRegister}
        submitButtonText="យល់ព្រម"
      />
    </View>
  );
}
