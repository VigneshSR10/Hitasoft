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
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="AddressForm"
        component={AddressForm}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddressDisplay"
        component={AddressDisplay}
        options={{ headerShown: false }}
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
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            height: 70,
            paddingBottom: 8,
            paddingTop: 8,
            backgroundColor: '#fff',
            borderTopColor: colors.border,
            borderTopWidth: 1,
            elevation: 8,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: 4,
          },
        }}
      >
        <Tab.Screen
          name="Upload"
          component={UploadScreen}
          options={{
            tabBarLabel: 'Upload',
            tabBarIcon: ({ color }) => (
              <Icon name="upload" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Meet"
          component={MeetScreen}
          options={{
            tabBarLabel: 'Meet',
            tabBarIcon: ({ color }) => (
              <Icon name="video" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Address"
          component={AddressStack}
          options={{
            tabBarLabel: 'Address',
            tabBarIcon: ({ color }) => (
              <Icon name="home" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="More"
          component={MoreScreen}
          options={{
            tabBarLabel: 'More',
            tabBarIcon: ({ color }) => (
              <Icon name="menu" size={24} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
