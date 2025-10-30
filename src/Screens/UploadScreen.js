import {
  View,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
  Text,
  SectionList,
} from 'react-native';
import { pick, types } from '@react-native-documents/picker';
import moment from 'moment';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import RNFS from 'react-native-fs';
import FileCard from '../Components/FileCard';
import CommonHeader from '../Components/CommonHeader';
import Icon from 'react-native-vector-icons/Feather';
import { useAppContext } from '../context/AppContext';
import colors from '../theme/colors';

export default function UploadScreen() {
  const { files, setFiles } = useAppContext();

  const askPermission = async () => {
    if (Platform.OS === 'android') {
      let permission;
      if (Platform.Version >= 33) {
        const results = await Promise.all([
          request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES),
          request(PERMISSIONS.ANDROID.READ_MEDIA_VIDEO),
          request(PERMISSIONS.ANDROID.READ_MEDIA_AUDIO),
        ]);
        permission = results.every(r => r === RESULTS.GRANTED)
          ? RESULTS.GRANTED
          : RESULTS.DENIED;
      } else {
        permission = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
      }
      return permission === RESULTS.GRANTED;
    }
    return true;
  };

  const handleUpload = async () => {
    const granted = await askPermission();
    if (!granted) {
      Alert.alert('Permission Denied', 'Cannot access files.');
      return;
    }

    try {
      const result = await pick({
        allowMultiSelection: false,
        type: [types.images, types.pdf, types.doc, types.ppt],
      });

      if (result?.length > 0) {
        const file = result[0];
        const appDir = `${RNFS.CachesDirectoryPath}/uploads`;

        try {
          // Create uploads directory if it doesn't exist
          const dirExists = await RNFS.exists(appDir);
          if (!dirExists) {
            await RNFS.mkdir(appDir);
          }

          const localPath = `${appDir}/${file.name}`;

          // Copy file from source to app directory
          if (file.uri.startsWith('content://')) {
            await RNFS.copyFile(file.uri, localPath);
          } else {
            const cleanedUri = file.uri.replace('file://', '');
            await RNFS.copyFile(cleanedUri, localPath);
          }

          const fileExists = await RNFS.exists(localPath);
          if (!fileExists) {
            Alert.alert('Error', 'File was not saved properly.');
            return;
          }

          const newFile = {
            id: Date.now().toString(),
            name: file.name,
            uri: localPath,
            type: file.mimeType || 'application/octet-stream',
            date: moment().format('YYYY-MM-DD'),
            time: moment().format('hh:mm A'),
          };

          setFiles(prev => [...prev, newFile]);
          Alert.alert('Success', 'File uploaded successfully!');
        } catch (copyErr) {
          console.error('[v0] File Copy Error:', copyErr);
          Alert.alert('Error', 'Failed to copy file. Please try again.');
        }
      }
    } catch (err) {
      if (!err.message.includes('canceled')) {
        console.error('[v0] Picker Error:', err);
        Alert.alert('Error', 'Failed to pick file');
      }
    }
  };

  const groupedFiles = files.reduce((acc, f) => {
    (acc[f.date] = acc[f.date] || []).push(f);
    return acc;
  }, {});

  const sections = Object.keys(groupedFiles)
    .sort((a, b) => new Date(b) - new Date(a))
    .map(date => ({
      title: moment(date).format('dddd, MMMM D, YYYY'),
      data: groupedFiles[date],
    }));

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <CommonHeader title="Upload Files" />
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.id + index}
        renderItem={({ item }) => (
          <FileCard
            file={item}
            onDelete={() =>
              setFiles(prev => prev.filter(x => x.id !== item.id))
            }
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="inbox" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No files uploaded yet</Text>
          </View>
        }
        contentContainerStyle={files.length === 0 ? { flex: 1 } : {}}
      />
      <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload}>
        <Icon name="upload" color="#fff" size={20} style={{ marginRight: 8 }} />
        <Text style={styles.uploadText}>Upload File</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.background,
  },
  uploadBtn: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 14,
    borderRadius: 12,
    margin: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  uploadText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
});
