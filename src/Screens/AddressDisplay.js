import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import colors from '../theme/colors';
import CommonHeader from '../Components/CommonHeader';
import { useAppContext } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';
import FileCard from '../Components/FileCard';

export default function AddressDisplay() {
  const { form, setForm, files, setFiles } = useAppContext();
  const navigation = useNavigation();

  const formatLabel = key =>
    key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const getIconName = key => {
    if (key.includes('city')) return 'map-pin';
    if (key.includes('pincode')) return 'map';
    if (key.includes('flat')) return 'home';
    return 'info';
  };

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
                  color={colors.primary}
                />
              </View>
              <View style={styles.textBox}>
                <Text style={styles.keyText}>{formatLabel(key)}</Text>
                <Text style={styles.valueText}>{value}</Text>
              </View>
            </View>
          ))}
        </View>
        {files?.length > 0 && (
          <>
            <Text style={[styles.header, { marginTop: 25 }]}>
              Uploaded Files
            </Text>
            {files.map(f => (
              <FileCard
                key={f.id}
                file={f}
                onDelete={() =>
                  setFiles(prev => prev.filter(x => x.id !== f.id))
                }
              />
            ))}
          </>
        )}
        <TouchableOpacity
          style={styles.uploadBtn}
          onPress={() => {
            setForm({
              flat: '',
              apartment: '',
              city: '',
              state: '',
              country: '',
              pincode: '',
            });
            setFiles([]);
            navigation.goBack();
          }}
        >
          <Text style={styles.uploadText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background || '#F4F6FA' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary || '#1E88E5',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
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
  iconBox: { width: 40, alignItems: 'center' },
  textBox: { flex: 1 },
  keyText: { fontSize: 14, color: '#666' },
  valueText: { fontSize: 16, fontWeight: '600', color: '#222' },
  uploadBtn: {
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
  },
  uploadText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
