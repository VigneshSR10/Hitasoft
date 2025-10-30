'use client';

import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import colors from '../theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommonHeader from '../Components/CommonHeader';
import { useAppContext } from '../context/AppContext';
import Icon from 'react-native-vector-icons/Feather';

export default function AddressForm({ navigation }) {
  const { form, setForm } = useAppContext();
  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.entries(form).forEach(([key, value]) => {
      if (!value.trim()) {
        const labels = {
          flat: 'Flat No.',
          apartment: 'Apartment Name',
          city: 'City',
          state: 'State',
          country: 'Country',
          pincode: 'Pincode',
        };
        newErrors[key] = `${labels[key]} is required`;
      }
    });

    if (form.pincode && !/^\d{5,6}$/.test(form.pincode.trim())) {
      newErrors.pincode = 'Pincode must be 5-6 digits';
    }

    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Alert.alert(
        'Validation Error',
        'Please fill all required fields correctly',
      );
      return;
    }

    setForm(form);
    navigation.navigate('AddressDisplay');
  };

  const fields = [
    { key: 'flat', label: 'Flat No.', icon: 'home' },
    { key: 'apartment', label: 'Apartment Name', icon: 'building' },
    { key: 'city', label: 'City', icon: 'map-pin' },
    { key: 'state', label: 'State', icon: 'map' },
    { key: 'country', label: 'Country', icon: 'globe' },
    { key: 'pincode', label: 'Pincode', icon: 'mail', keyboardType: 'numeric' },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <CommonHeader title="Address Form" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {fields.map(field => (
              <View key={field.key} style={{ marginBottom: 20 }}>
                <View style={styles.inputWrapper}>
                  <Icon
                    name={field.icon}
                    size={18}
                    color={colors.primary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder={field.label}
                    value={form[field.key]}
                    onChangeText={t => handleChange(field.key, t)}
                    keyboardType={field.keyboardType || 'default'}
                    style={[
                      styles.input,
                      errors[field.key] && styles.inputError,
                    ]}
                    placeholderTextColor="#999"
                  />
                </View>
                {errors[field.key] && (
                  <Text style={styles.errorText}>{errors[field.key]}</Text>
                )}
              </View>
            ))}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Icon
                name="check"
                size={20}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.buttonText}>Submit Address</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContainer: { padding: 20, paddingBottom: 40 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    fontSize: 16,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 6,
    marginLeft: 12,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
