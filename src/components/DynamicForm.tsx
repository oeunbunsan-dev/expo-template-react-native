// src/components/DynamicForm.tsx
import { ThemedButton } from '@/src/components/ThemedButton';
import { ThemedText } from '@/src/components/ThemedText';
import { useAppTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import {
  Controller,
  DefaultValues,
  FieldValues,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import {
  KeyboardTypeOptions,
  Pressable,
  StyleProp,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';
import { ZodSchema } from 'zod';

export interface FormFieldSchema<T extends FieldValues> {
  name: keyof T & string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

interface DynamicFormProps<T extends FieldValues> {
  fields: FormFieldSchema<T>[];
  schema: ZodSchema<T>;
  defaultValues?: DefaultValues<T>;
  onSubmit: SubmitHandler<T>;
  submitButtonText?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function DynamicForm<T extends FieldValues>({
  fields,
  schema,
  defaultValues,
  onSubmit,
  submitButtonText = 'Submit',
  containerStyle,
}: DynamicFormProps<T>) {
  const { colors, borderRadius } = useAppTheme();
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});
  const [focusedMap, setFocusedMap] = useState<Record<string, boolean>>({});

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const togglePasswordVisibility = (fieldName: string) => {
    setShowPasswordMap((prev) => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  return (
    <View style={[{ gap: 14 }, containerStyle]}>
      {fields.map((field) => {
        const isPassword = field.type === 'password';
        const showPassword = !!showPasswordMap[field.name];
        const errorMessage = errors[field.name]?.message as string | undefined;

        return (
          <View key={field.name} style={{ gap: 4 }}>
            <ThemedText variant="sm" weight="600">
              {field.label}
            </ThemedText>

            <Controller
              control={control}
              name={field.name as any}
              render={({ field: { onChange, onBlur, value } }) => {
                const isFocused = !!focusedMap[field.name];
                const isEmpty = value === undefined || value === null || String(value) === '';

                return (
                  <View
                    style={{
                      flexDirection: 'row',
                      position: 'relative',
                      alignItems: 'center',
                      backgroundColor: colors.card,
                      borderRadius: Math.min(borderRadius, 12),
                      borderWidth: 1.5,
                      borderColor: errorMessage ? '#ef4444' : colors.cardBorder,
                      paddingHorizontal: 14,
                    }}
                  >
                    {/* Placeholder Overlay */}
                    {isEmpty && !isFocused && (
                      <View
                        style={{
                          position: 'absolute',
                          left: 14,
                          pointerEvents: 'none',
                          zIndex: 1,
                        }}
                      >
                        <ThemedText style={{ fontSize: 13, opacity: 0.5 }}>
                          {field.placeholder || field.label}
                        </ThemedText>
                      </View>
                    )}

                    <TextInput
                      value={value ? String(value) : ''}
                      onChangeText={onChange}
                      onFocus={() =>
                        setFocusedMap((prev) => ({ ...prev, [field.name]: true }))
                      }
                      onBlur={() => {
                        onBlur();
                        setFocusedMap((prev) => ({ ...prev, [field.name]: false }))
                      }}
                      secureTextEntry={isPassword && !showPassword}
                      keyboardType={
                        field.keyboardType ||
                        (field.type === 'email'
                          ? 'email-address'
                          : field.type === 'number'
                          ? 'numeric'
                          : 'default')
                      }
                      autoCapitalize={field.autoCapitalize || (field.type === 'email' ? 'none' : 'sentences')}
                      style={{
                        flex: 1,
                        color: colors.text,
                        paddingVertical: 14,
                        fontSize: 16,
                      }}
                    />

                    {isPassword && (
                      <Pressable
                        onPress={() => togglePasswordVisibility(field.name)}
                        hitSlop={8}
                      >
                        <Ionicons
                          name={showPassword ? 'eye-off' : 'eye'}
                          size={20}
                          color={colors.textSecondary}
                        />
                      </Pressable>
                    )}
                  </View>
                );
              }}
            />

            {/* Error Message */}
            {errorMessage && (
              <ThemedText style={{ color: '#ef4444', fontSize: 12, marginTop: 2 }}>
                {errorMessage}
              </ThemedText>
            )}
          </View>
        );
      })}

      <ThemedButton
        disabled={isSubmitting}
        title={submitButtonText}
        variant="primary"
        size="lg"
        onPress={handleSubmit(onSubmit)}
        style={{ marginTop: 8 }}
      />
    </View>
  );
}
