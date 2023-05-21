import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import firebase, { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import 'firebase/auth';
import 'firebase/firestore';

import ChatList from './screens/ChatList';
import Profile from './screens/Profile';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import Chat from './screens/Chat';
import { Provider, DefaultTheme } from 'react-native-paper';

const firebaseConfig = {
  apiKey: 'AI***********************Pg',
  authDomain: 'chat-app-5e6be.firebaseapp.com',
  projectId: 'chat-app-5e6be',
  storageBucket: 'chat-app-5e6be.appspot.com',
  messagingSenderId: '*************',
  appId: '***********************',
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
export { db, auth };

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#ab47bc',
    accent: '#e91e63',
  },
};

export default function App() {
  function TabNavigator() {
    const navigation = useNavigation();
    React.useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const uid = user.uid;
        } else {
          navigation.navigate('SignIn');
        }
      });
    }, []);

    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'ChatList') {
              iconName = focused
                ? 'ios-chatbubbles'
                : 'ios-chatbubbles-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name='ChatList' component={ChatList} />
        <Tab.Screen name='Profile' component={Profile} />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Provider theme={theme}>
        <Stack.Navigator>
          <Stack.Screen
            name='Main'
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='SignIn'
            component={SignIn}
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen
            name='SignUp'
            component={SignUp}
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen name='Chat' component={Chat} />
        </Stack.Navigator>
      </Provider>
    </NavigationContainer>
  );
}
