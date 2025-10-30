import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import colors from '../theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommonHeader from '../Components/CommonHeader';
export default function AddressForm({ navigation }) {
  const [form, setForm] = useState({
    flat: '',
    apartment: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
  });

  const [errors, setErrors] = useState({});
  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const handleSubmit = () => {
    const newErrors = {};

    Object.entries(form).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = `${key.replace(/^\w/, c =>
          c.toUpperCase(),
        )} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    navigation.navigate('AddressDisplay', { form });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <CommonHeader title="Form Screen" />
        {Object.keys(form).map(key => (
          <View key={key} style={{ marginBottom: 15 }}>
            <TextInput
              placeholder={key.replace(/^\w/, c => c.toUpperCase())}
              value={form[key]}
              onChangeText={t => handleChange(key, t)}
              style={[
                styles.input,
                errors[key] && { borderColor: 'red', borderWidth: 1.5 },
              ]}
              placeholderTextColor="#888"
            />
            {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
          </View>
        ))}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, gap: 10 },
  input: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,

    marginLeft: 20,
    marginRight: 20,
    borderColor: colors.border,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 4,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 10,
    marginLeft: 20,
    marginRight: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});
