import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import CommonHeader from '../Components/CommonHeader';
import colors from '../theme/colors';

export default function AddressDisplay({ route }) {
  const { form } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <CommonHeader title="Details Screen" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Address Details</Text>

        <View style={styles.card}>
          {Object.entries(form).map(([key, value]) => (
            <View key={key} style={styles.row}>
              <View style={styles.iconBox}>
                <Icon
                  name={getIconName(key)}
                  size={20}
                  color={colors.primary || '#1E88E5'}
                />
              </View>
              <View style={styles.textBox}>
                <Text style={styles.keyText}>{formatLabel(key)}</Text>
                <Text style={styles.valueText}>{value}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const formatLabel = key =>
  key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
const getIconName = key => {
  if (key.toLowerCase().includes('name')) return 'user';
  if (key.toLowerCase().includes('email')) return 'mail';
  if (key.toLowerCase().includes('phone')) return 'phone';
  if (key.toLowerCase().includes('city')) return 'map-pin';
  if (key.toLowerCase().includes('address')) return 'home';
  if (key.toLowerCase().includes('pincode')) return 'map';
  return 'info';
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background || '#F4F6FA',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary || '#1E88E5',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  iconBox: {
    width: 40,
    alignItems: 'center',
  },
  textBox: {
    flex: 1,
  },
  keyText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  valueText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginTop: 2,
  },
});
