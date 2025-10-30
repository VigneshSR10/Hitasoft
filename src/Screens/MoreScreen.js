import { View, Text } from 'react-native';
import React from 'react';
import CommonHeader from '../Components/CommonHeader';
const MoreScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <CommonHeader title="More" />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>MoreScreenn</Text>
      </View>
    </View>
  );
};

export default MoreScreen;
