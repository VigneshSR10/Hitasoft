import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import UploadScreen from '../Screens/UploadScreen';
import colors from '../theme/colors';
import MeetScreen from '../Screens/MeetScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddressForm from '../Screens/AddressForm';
import Icon from 'react-native-vector-icons/Feather';
import AddressDisplay from '../Screens/AddressDisplay';
import MoreScreen from '../Screens/MoreScreen';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
function AddressStack() {
  return (
    <Stack.Navigator headerShown={false} screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Address"
        component={AddressForm}
        headerShown={false}
      />
      <Stack.Screen
        name="AddressDisplay"
        component={AddressDisplay}
        headerShown={false}
      />
    </Stack.Navigator>
  );
}
export default function BottomTabs() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarStyle: {
            height: 70,

            alignItems: 'center',

            backgroundColor: '#fff',
          },
        }}
      >
        <Tab.Screen
          name="Upload"
          component={UploadScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="upload" size={22} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Meet"
          component={MeetScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="video" size={22} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Address"
          component={AddressStack}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="home" size={22} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="More"
          component={MoreScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="list" size={22} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
