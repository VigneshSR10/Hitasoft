import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
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
    if (key.includes('apartment')) return 'building';
    if (key.includes('state')) return 'layers';
    if (key.includes('country')) return 'globe';
    return 'info';
  };

  const handleEditAddress = () => {
    navigation.goBack();
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to clear all address and file data?',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Clear',
          onPress: () => {
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
          },
          style: 'destructive',
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CommonHeader title="Details Screen" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <Icon name="check-circle" size={32} color={colors.primary} />
          <Text style={styles.successText}>Address Submitted Successfully</Text>
        </View>

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
              Uploaded Files ({files.length})
            </Text>
            <View style={styles.filesContainer}>
              {files.map(f => (
                <FileCard
                  key={f.id}
                  file={f}
                  onDelete={() => {
                    setFiles(prev => prev.filter(x => x.id !== f.id));
                    Alert.alert('Success', 'File deleted successfully');
                  }}
                />
              ))}
            </View>
          </>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.editBtn]}
            onPress={handleEditAddress}
          >
            <Icon
              name="edit-2"
              size={18}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.buttonText}>Edit Address</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.clearBtn]}
            onPress={handleClearAll}
          >
            <Icon
              name="trash-2"
              size={18}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.buttonText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: 16, paddingBottom: 40 },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
  },
  successText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 8,
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
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
    paddingVertical: 12,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  iconBox: { width: 40, alignItems: 'center' },
  textBox: { flex: 1, marginLeft: 12 },
  keyText: { fontSize: 13, color: colors.textSecondary, marginBottom: 4 },
  valueText: { fontSize: 16, fontWeight: '600', color: colors.text },
  filesContainer: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 14,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  editBtn: {
    backgroundColor: colors.primary,
  },
  clearBtn: {
    backgroundColor: colors.danger,
  },
  buttonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
