import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import CommonHeader from '../Components/CommonHeader';
export default function App() {
  const openMeet = async () => {
    const url = 'https://meet.google.com/amg-uhyt-uqp';
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open(url, { toolbarColor: '#188038' });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <CommonHeader title="Meeting" />
      <View style={styles.container}>
        <TouchableOpacity style={styles.meetButton} onPress={openMeet}>
          <Icon
            name="video"
            size={22}
            color="#fff"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.text}>Join Google Meet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  meetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#188038',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  text: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
