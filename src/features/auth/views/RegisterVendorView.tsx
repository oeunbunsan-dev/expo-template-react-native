import { DynamicForm, FormFieldSchema } from '@/src/components/DynamicForm';
import { ThemedText } from '@/src/components/ThemedText';
import { useAppTheme } from '@/src/context/ThemeContext';
import { useAuth } from '@/src/providers/auth-provider';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, View } from 'react-native';
import { z } from 'zod';

const registerVendorSchema = z.object({
  companyName: z.string().min(2),
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
  businessNumber: z.string().optional(),
  phone: z.string().optional(),
  taxId: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerVendorSchema>;

export default function RegisterVendorView() {
  const router = useRouter();
  const { colors, t } = useAppTheme();
  const { signUpVendor } = useAuth();

  const [_, setIsLoading] = useState(false);

  // 2. Define field configurations
  const formFields: FormFieldSchema<RegisterFormValues>[] = [
    {
      name: 'companyName',
      label: "Company Name",
      placeholder: "company Name",
      type: "text",
      autoCapitalize: 'none',
    },
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
    {
      name: 'businessNumber',
      label: "Business Number",
      placeholder: "Business Number",
      type: "text",
    },
    {
      name: 'phone',
      label: "Phone Number",
      placeholder: "Phone Number",
      type: "number",
      keyboardType: "number-pad"
    },
    {
      name: 'taxId',
      label: "Tax Id",
      placeholder: "taxId",
      type: "text",
    },
  ];

  // Form submit handler (runs only when Zod validation passes)
  const handleRegisterVendor = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const payload = {
        'companyName': data.companyName,
        'email': data.email,
        'firstName': data.firstname,
        'lastName': data.lastname,
        'password': data.password,
        'businessNumber': data.businessNumber,
        'phone': data.phone,
        'taxId': data.taxId
      };

      const res = await signUpVendor(payload);
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
        Create Vendor Account
      </ThemedText>

      <DynamicForm<RegisterFormValues>
        fields={formFields}
        schema={registerVendorSchema}
        defaultValues={{ companyName: '', email: '', firstname: '', lastname: '', password: '', businessNumber: '', phone: '', taxId: '' }}
        onSubmit={handleRegisterVendor}
        submitButtonText="យល់ព្រម"
      />
    </View>
  );
}
