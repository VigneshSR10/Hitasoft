import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import CommonHeader from '../Components/CommonHeader';
import colors from '../theme/colors';

export default function MeetScreen() {
  const openMeet = async () => {
    const url = 'https://meet.google.com/amg-uhyt-uqp';
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open(url, { toolbarColor: colors.primary });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <CommonHeader title="Google Meet" />
      <View style={styles.container}>
        <View style={styles.card}>
          <Icon
            name="video"
            size={48}
            color={colors.primary}
            style={{ marginBottom: 16 }}
          />
          <Text style={styles.title}>Join Meeting</Text>
          <Text style={styles.subtitle}>
            Connect to your Google Meet session
          </Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  meetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  text: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
