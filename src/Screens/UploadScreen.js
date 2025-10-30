import React, { useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
  Text,
} from 'react-native';
import { pick, types } from '@react-native-documents/picker';
import moment from 'moment';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import RNFS from 'react-native-fs';
import FileCard from '../Components/FileCard';
import CommonHeader from '../Components/CommonHeader';
import Icon from 'react-native-vector-icons/Feather';
export default function UploadScreen() {
  const [files, setFiles] = useState([]);

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
        const localPath = `${RNFS.DocumentDirectoryPath}/${file.name}`;
        try {
          if (file.uri.startsWith('content://')) {
            await RNFS.copyFile(file.uri, localPath);
          } else {
            const cleanedUri = file.uri.replace('file://', '');
            await RNFS.copyFile(cleanedUri, localPath);
          }
          const newFile = {
            id: Date.now().toString(),
            name: file.name,
            uri: localPath,
            type: file.mimeType,
            date: moment().format('YYYY-MM-DD'),
            time: moment().format('hh:mm A'),
          };

          setFiles(prev => [...prev, newFile]);
          console.log(newFile, '---------------------');
        } catch (copyErr) {
          console.error('File Copy Error:', copyErr);
          Alert.alert('Error', 'Failed to copy or open file.');
        }
      }
    } catch (err) {
      if (!err.message.includes('canceled')) {
        console.error('Picker Error:', err);
        Alert.alert('Error', 'Failed to pick file');
      }
    }
  };

  const handleDownload = async file => {
    try {
      if (Platform.OS === 'android' && Platform.Version < 33) {
        const granted = await request(
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        );
        if (granted !== RESULTS.GRANTED) {
          Alert.alert(
            'Permission Denied',
            'Cannot save files without permission.',
          );
          return;
        }
      }

      let dest = `${RNFS.DocumentDirectoryPath}/${file.name}`;

      if (file.uri.startsWith('content://')) {
        const base64Data = await RNFS.readFile(file.uri, 'base64');
        await RNFS.writeFile(dest, base64Data, 'base64');
      } else {
        await RNFS.copyFile(file.uri, dest);
      }

      Alert.alert(
        'Download Complete',
        `${file.name} saved to app Documents folder`,
      );
    } catch (err) {
      Alert.alert('Error', 'Unable to download file.');
    }
  };

  const groupedFiles = files.reduce((acc, f) => {
    (acc[f.date] = acc[f.date] || []).push(f);
    return acc;
  }, {});

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <CommonHeader title="Upload Files" />
      <FlatList
        data={Object.keys(groupedFiles)}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <View style={styles.section}>
            {groupedFiles[item].map(f => (
              <FileCard
                key={f.id}
                file={f}
                onDelete={() =>
                  setFiles(prev => prev.filter(x => x.id !== f.id))
                }
                onDownload={() => handleDownload(f)}
              />
            ))}
          </View>
        )}
      />
      <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload}>
        <Icon name="upload" color="#fff" size={20} style={{ marginRight: 8 }} />
        <Text style={styles.uploadText}>Upload</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { padding: 20 },
  uploadBtn: {
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 14,
    borderRadius: 12,
    margin: 20,
  },
  uploadText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
