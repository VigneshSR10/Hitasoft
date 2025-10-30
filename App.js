import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo';
import { AppProvider } from './src/context/AppContext';
import BottomTabs from './src/Navigation/BottomTabs';
import AppLogo from './src/assets/images/hitasoft_logo.png';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected && state.isInternetReachable);
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
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
  if (!isConnected) {
    return (
      <View style={styles.offlineContainer}>
        <StatusBar backgroundColor="#1E88E5" barStyle="light-content" />
        <Image
          source={AppLogo}
          style={styles.offlineLogo}
          resizeMode="contain"
        />
        <Text style={styles.offlineText}>No Internet Connection</Text>
        <Text style={styles.offlineSubText}>Please turn on your network</Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppProvider>
        <PaperProvider>
          <BottomTabs />
        </PaperProvider>
      </AppProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#1E88E5',
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
  offlineContainer: {
    flex: 1,
    backgroundColor: '#1E88E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineLogo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  offlineText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  offlineSubText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
});
