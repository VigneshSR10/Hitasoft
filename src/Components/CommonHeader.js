import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppLogo from '../assets/images/hitasoft_logo.png';
export default function CommonHeader({ title }) {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.iconContainer}
      >
        <Image
          source={AppLogo}
          style={styles.logo}
          resizeMode="contain"
          height={30}
          width={30}
        />
      </TouchableOpacity>

      <Text style={styles.title}>{title || route.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#EAF3FF',
    elevation: 3,
  },
  iconContainer: {
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#012C72',
  },
});
