import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  Alert,
  Dimensions,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import colors from '../theme/colors';

const { width, height } = Dimensions.get('window');

export default function FileCard({ file, onDelete }) {
  const [visible, setVisible] = useState(false);

  const handleDownload = async () => {
    try {
      if (Platform.OS === 'android' && Platform.Version < 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Permission Denied',
            'Cannot save files without permission.',
          );
          return;
        }
      }
      const downloadDir = `${RNFS.ExternalStorageDirectoryPath}/Download`;
      const destPath = `${downloadDir}/${file.name}`;

      const dirExists = await RNFS.exists(downloadDir);
      if (!dirExists) {
        await RNFS.mkdir(downloadDir);
      }

      await RNFS.copyFile(file.uri, destPath);

      const exists = await RNFS.exists(destPath);
      if (exists) {
        Alert.alert('Downloaded Successfully', `Saved to:\n${destPath}`);
      } else {
        Alert.alert('Error', 'File copy failed.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to download file.');
    }
  };
  const openFileExternally = async () => {
    try {
      let filePath = file.uri;

      if (Platform.OS === 'android' && file.uri.startsWith('content://')) {
        const destPath = `${RNFS.CachesDirectoryPath}/${file.name}`;
        const base64Data = await RNFS.readFile(file.uri, 'base64');
        await RNFS.writeFile(destPath, base64Data, 'base64');
        filePath = destPath;
      }

      if (!filePath.startsWith('file://')) {
        filePath = `file://${filePath}`;
      }
      await FileViewer.open(filePath, {
        showOpenWithDialog: true,
        showAppsSuggestions: true,
      });
    } catch (err) {
      if (err.message.includes('No app associated')) {
        Alert.alert(
          'Cannot Open File',
          'No compatible app found to open this file type.',
        );
      } else {
        Alert.alert('Error', 'Failed to open file.');
      }
    }
  };

  const handlePreviewPress = () => {
    const lowerName = file.name.toLowerCase();
    if (/\.(png|jpg|jpeg|gif|bmp|webp)$/i.test(lowerName)) {
      setVisible(true);
    } else {
      openFileExternally();
    }
  };

  const renderPreview = () => {
    if (!file?.name) return null;
    const lowerName = file.name.toLowerCase();

    if (/\.(png|jpg|jpeg|gif|bmp|webp)$/i.test(lowerName)) {
      return (
        <Image
          source={{
            uri: file.uri.startsWith('file://')
              ? file.uri
              : `file://${file.uri}`,
          }}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 12,
            backgroundColor: '#f2f2f2',
          }}
          resizeMode="contain"
        />
      );
    }

    return (
      <View style={styles.previewFallback}>
        <Text style={styles.fallbackText}>Preview not available</Text>
      </View>
    );
  };
  return (
    <>
      <View style={styles.card}>
        <Icon
          name={
            file.name.toLowerCase().endsWith('.pdf')
              ? 'file-text'
              : file.name.toLowerCase().match(/\.(png|jpg|jpeg|gif)$/)
              ? 'image'
              : 'file'
          }
          size={24}
          color={colors.primary}
        />

        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.name}>{file.name}</Text>
          <Text style={styles.time}>{file.time}</Text>
        </View>

        <TouchableOpacity
          onPress={handlePreviewPress}
          style={{ marginRight: 10 }}
        >
          <Icon name="eye" size={20} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDownload}>
          <Icon name="download" size={20} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity onPress={onDelete} style={{ marginLeft: 10 }}>
          <Icon name="trash" size={20} color={colors.danger} />
        </TouchableOpacity>
      </View>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {renderPreview()}
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setVisible(false)}
            >
              <Icon name="x" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginVertical: 5,
  },
  name: { fontWeight: '600', color: colors.text },
  time: { color: '#6B7280', fontSize: 12 },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    height: height * 0.75,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: colors.primary,
    borderRadius: 50,
    padding: 8,
  },
  previewFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fallbackText: { color: '#6B7280', textAlign: 'center', marginBottom: 10 },
});
