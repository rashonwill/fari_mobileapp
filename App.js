import React, { useState, useEffect } from 'react';
import { BottomSheet, Button, ListItem } from 'react-native-elements';
import {
  StyleSheet,
  View,
  Text,
  SectionList,
  Image,
  TextInput,
  Linking,
  ScrollView,
  FlatList,
  Alert,
  Pressable,
  Modal,
} from 'react-native';

import Explorer from './components/Explorer';
import Messages from './components/Messages';
import Profile from './components/Profile';
import Shop from './components/Shop';
import Theater from './components/Theater';
import Chat from './components/ChatMessages';
import Access from './components/Access';
import Login from './components/Login';
import Register from './components/Register';
import Reset from './components/ResetPassword';
import Logo from './components/Logo';
import Untitled from './components/Untitled';


import axios from 'axios';

import { Card } from 'react-native-paper';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import Constants from 'expo-constants';

import { Video } from 'expo-av';

import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  faCheckSquare,
  faCoffee,
  faBars,
} from '@fortawesome/fontawesome-free-solid';

import {
  NavigationContainer,
  DefaultTheme,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';

import {
  createBottomTabNavigator,
  BottomTabBar,
} from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Entypo } from '@expo/vector-icons';

import { MaterialIcons } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';

import { SimpleLineIcons } from '@expo/vector-icons';

import { Feather as Icon } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

import { AppLoading } from 'expo';

import { useFonts, OpenSans_400Regular } from '@expo-google-fonts/dev';

import { PermanentMarker_400Regular } from '@expo-google-fonts/permanent-marker';

import GestureRecognizer from 'react-native-swipe-gestures';

import { Searchbar } from 'react-native-paper';
import VideoPlayer from 'expo-video-player'
import Slider from '@react-native-community/slider';

import {
  Teko_300Light,
  Teko_400Regular,
  Teko_500Medium,
  Teko_600SemiBold,
  Teko_700Bold,
} from '@expo-google-fonts/teko';

function App() {
  let [fontsLoaded, error] = useFonts({
    PermanentMarker_400Regular,
    Teko_700Bold,
  });

  function LogoScreen({ navigation }) {
    return <Logo />;
  }
  function AccessScreen({ navigation }) {
    return <Access />;
  }

  function LoginScreen({ navigation }) {
    return <Login />;
  }
  function RegisterScreen({ navigation }) {
    return <Register />;
  }

  function ResetScreen({ navigation }) {
    return <Reset />;
  }

  function ExplorerScreen({ navigation }) {
    return <Explorer />;
  }

  function ShoppingScreen({ navigation }) {
    return <Shop />;
  }

  function MessagesScreen({ navigation }) {
    return <Messages />;
  }

  function MyProfileScreen({ navigation }) {
    return <Profile />;
  }

  function TheaterScreen({ route, navigation }) {
    return <Theater />;
  }

  function ChatScreen({ route, navigation }) {
    return <Chat />;
  }

  function UntitledScreen({navigation}){
    return <Untitled />
  }

  const Tab = createBottomTabNavigator();

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      backgroundColor: '#171717',
      color: '#fdfbf9',
    },
  };

  return (
    <>
      <SafeAreaProvider style={styles.page}>
        <NavigationContainer theme={MyTheme}>
          <Tab.Navigator
            screenOptions={{
              tabBarActiveTintColor: '#F2F3F4',
              tabBarInactiveTintColor: '#808088',

              tabBarStyle: {
                backgroundColor: '#0c1559',
                fontFamily: 'Teko_700Bold',
                elevation: 0,
                shadowOpacity: 0,
                borderTopWidth: 0,
              },

              tabBarLabelStyle: {
                fontFamily: 'Teko_700Bold',
                fontSize: 12,
                letterSpacing: '0.2rem',
              },
            }}>
            <Tab.Screen
              name="Logo"
              component={LogoScreen}
              options={{
                headertitle: '',
                headerShown: false,
                headerShadowVisible: false,
                tabBarLabel: 'Welcome',
                tabBarStyle: { display: 'none' },
                tabBarIcon: ({ color, size }) => (
                  <Entypo name="login" size={24} color={color} />
                ),
                unmountOnBlur: true,
                tabBarButton: () => null,
                tabBarVisible: false,
              }}
            />
            <Tab.Screen
              name="Access"
              component={AccessScreen}
              options={{
                headertitle: '',
                headerShown: false,
                headerShadowVisible: false,
                tabBarLabel: 'Access',
                tabBarStyle: { display: 'none' },
                tabBarIcon: ({ color, size }) => (
                  <Entypo name="login" size={24} color={color} />
                ),
                unmountOnBlur: true,
                tabBarButton: () => null,
                tabBarVisible: false,
              }}
            />
            <Tab.Screen
              name="Login"
              component={LoginScreen}
              options={{
                headertitle: '',
                headerShown: false,
                headerShadowVisible: false,
                tabBarLabel: 'Access',
                tabBarStyle: { display: 'none' },
                tabBarIcon: ({ color, size }) => (
                  <Entypo name="login" size={24} color={color} />
                ),
                unmountOnBlur: true,
                tabBarButton: () => null,
                tabBarVisible: false,
              }}
            />
            <Tab.Screen
              name="Register"
              component={RegisterScreen}
              options={{
                headertitle: '',
                headerShown: false,
                headerShadowVisible: false,
                tabBarLabel: 'Register',
                tabBarStyle: { display: 'none' },
                tabBarIcon: ({ color, size }) => (
                  <Entypo name="login" size={24} color={color} />
                ),
                unmountOnBlur: true,
                tabBarButton: () => null,
                tabBarVisible: false,
              }}
            />

            <Tab.Screen
              name="ResetPassword"
              component={ResetScreen}
              options={{
                headertitle: '',
                headerShown: false,
                headerShadowVisible: false,
                tabBarLabel: 'Reset',
                tabBarStyle: { display: 'none' },
                tabBarIcon: ({ color, size }) => (
                  <Entypo name="login" size={24} color={color} />
                ),
                unmountOnBlur: true,
                tabBarButton: () => null,
                tabBarVisible: false,
              }}
            />
            <Tab.Screen
              name="Explorer"
              component={ExplorerScreen}
              options={{
                headertitle: '',
                headerShown: false,
                headerShadowVisible: false,
                tabBarLabel: 'Explorer',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="md-film" size={24} color={color} />
                ),
                unmountOnBlur: true,
              }}
            />
            <Tab.Screen
              name="Shop"
              component={ShoppingScreen}
              options={{
                title: '',
                headerShown: false,
                tabBarLabel: 'Shop',
                tabBarIcon: ({ color, size }) => (
                  <AntDesign name="tags" size={24} color={color} />
                ),
                unmountOnBlur: true,
              }}
            />
            <Tab.Screen
              name="Messages"
              component={MessagesScreen}
              options={{
                title: '',
                headerShown: false,
                tabBarLabel: 'Messages',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons
                    name="chatbubble-ellipses"
                    size={24}
                    color={color}
                  />
                ),
                unmountOnBlur: true,
              }}
            />
            <Tab.Screen
              name="My Profile"
              component={MyProfileScreen}
              options={{
                title: '',
                headerShown: false,
                tabBarLabel: 'Profile',
                tabBarIcon: ({ color, size }) => (
                  <FontAwesome name="user" size={24} color={color} />
                ),
                unmountOnBlur: true,
              }}
            />
            <Tab.Screen
              name="Theater"
              component={TheaterScreen}
              options={{
                title: '',
                headerShown: false,
                tabBarLabel: 'Theater',

                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons
                    name="theater"
                    size={24}
                    color={color}
                  />
                ),
                unmountOnBlur: true,
                tabBarButton: () => null,
                tabBarVisible: false,
              }}
            />


            <Tab.Screen
              name="Chat"
              component={ChatScreen}
              options={{
                title: '',
                headerShown: false,
                tabBarLabel: 'Chat',
                tabBarIcon: ({ color, size }) => (
                  <Entypo name="chat" size={24} color={color} />
                ),
                unmountOnBlur: true,
                tabBarButton: () => null,
                tabBarVisible: false,
              }}
            />

            <Tab.Screen
              name="Untitled"
              component={UntitledScreen}
              options={{
                title: '',
                headerShown: false,
                tabBarLabel: 'Profile',
                tabBarIcon: ({ color, size }) => (
                  <FontAwesome name="user" size={24} color={color} />
                ),
                unmountOnBlur: true,
                tabBarButton: () => null,
                tabBarVisible: false,
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#171717',
    fontFamily: 'Teko_700Bold',
  },
});

export default App;
