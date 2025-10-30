import { View, Text, StyleSheet, StatusBar, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import BottomTabs from './src/Navigation/BottomTabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppLogo from './src/assets/images/hitasoft_logo.png';
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <StatusBar backgroundColor="#1E88E5" barStyle="light-content" />
        <Image source={AppLogo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.appName}>My Awesome App</Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PaperProvider>
        <BottomTabs />
      </PaperProvider>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#1E88E5', // your splash background color
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  appName: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
});
