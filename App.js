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
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  createBottomTabNavigator,
  BottomTabBar,
} from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Entypo } from '@expo/vector-icons';

import { MaterialIcons } from '@expo/vector-icons';

import { SimpleLineIcons } from '@expo/vector-icons';

import { Feather as Icon } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

import { AppLoading } from 'expo';

import { useFonts, OpenSans_400Regular } from '@expo-google-fonts/dev';

import { PermanentMarker_400Regular } from '@expo-google-fonts/permanent-marker';

import GestureRecognizer from 'react-native-swipe-gestures';

import { Searchbar } from 'react-native-paper';

import {
  Teko_300Light,
  Teko_400Regular,
  Teko_500Medium,
  Teko_600SemiBold,
  Teko_700Bold,
} from '@expo-google-fonts/teko';

type BottomSheetComponentProps = {};
const BottomSheetComponent: React.FunctionComponent<BottomSheetComponentProps> =
  () => {
    let [fontsLoaded, error] = useFonts({
      PermanentMarker_400Regular,
      Teko_700Bold,
    });

    const [user, setUser] = useState();

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

    const Tab = createBottomTabNavigator();
    const Stack = createNativeStackNavigator();

    const MyTheme = {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background: '#171717',
        color: '#fdfbf9',
      },
    };

    const [settings, setSettings] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const onChangeSearch = (query) => setSearchQuery(query);

    function CustomHeader() {
      return (
        <>
          <View
            style={{
              backgroundColor: 'transparent',
              width: '100%',
              padding: 5,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            <Pressable style={{ width: 50 }}>
              <FontAwesome5 name="search" size={24} color="white" />
            </Pressable>
            <Pressable style={{ width: 50 }}>
              <FontAwesome
                name="user-circle-o"
                size={24}
                color="white"
                onPress={() => setSettings(true)}
              />
            </Pressable>
          </View>
          <Searchbar
            placeholder="Search"
            onChangeText={onChangeSearch}
            value={searchQuery}
            inputStyle={{ color: '#0c1559' }}
            style={{
              borderBottomColor: '#a9a9b0',
              borderWidth: '2',
              backgroundColor: '#a9a9b0',
            }}
          />
        </>
      );
    }

    return (
      <>


        <SafeAreaProvider style={styles.page}>
          <NavigationContainer theme={MyTheme}>
            <Tab.Navigator
              //  tabBar={(props) => <CustomHeader {...props} />}

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
                  tabBarButton: () => null,
                  tabBarVisible: false,
                }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </>
    );
  };

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#171717',
    fontFamily: 'Teko_700Bold',
  },

  // container: {
  //   backgroundColor: '#171717',
  //   fontFamily: 'Teko_700Bold',
  //   width: '100%',
  //   height: '100%',
  // },

  // box: {
  //   backgroundColor: '#171717',
  //   fontFamily: 'Teko_700Bold',
  //   width: '100%',
  //   height: 250,
  //   padding: 10,
  //   margin: '1rem auto',
  //   marginTop: 300,
  //   shadowColor: '#0c1559',
  //   shadowRadius: 10,
  //   shadowOpacity: 1,
  //   shadowOffset: { width: -2, height: 4 },
  //   alignItems: 'center',
  //   borderRadius: 10,
  // },

  // button: {
  //   width: 200,
  //   backgroundColor: '#0c1559',
  //   margin: 10,
  //   textAlign: 'center',
  //   padding: 5,
  //   alignItems: 'center',
  //   marginBottom: 10,
  //   fontSize: 20,
  //   color: '#fdfbf9',
  //   marginTop: 10,
  //   height: 50,
  //   fontFamily: 'Teko_700Bold',
  // },
  // buttonOpen: {
  //   backgroundColor: 'transparent',
  //   width: '100%',
  // },

  // buttonClose: {
  //   backgroundColor: 'transparent',
  //   width: '100%',
  // },

  // register: {
  //   backgroundColor: '#171717',
  //   fontFamily: 'Teko_700Bold',
  //   width: '100%',
  //   height: '100%',
  //   padding: 10,
  //   margin: '1rem auto',
  //   shadowColor: '#0c1559',
  //   shadowRadius: 10,
  //   shadowOpacity: 1,
  //   shadowOffset: { width: -2, height: 4 },
  //   alignItems: 'center',
  //   borderRadius: 10,
  //   zIndex: 10,
  //   paddingTop: 100,
  // },

  // login: {
  //   backgroundColor: '#171717',
  //   fontFamily: 'Teko_700Bold',
  //   width: '100%',
  //   height: '100%',
  //   padding: 10,
  //   margin: '1rem auto',
  //   shadowColor: '#0c1559',
  //   shadowRadius: 10,
  //   shadowOpacity: 1,
  //   shadowOffset: { width: -2, height: 4 },
  //   display: 'flex',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   borderRadius: 10,
  //   zIndex: 10,
  // },

  // input: {
  //   outline: 'none',
  //   borderBottomColor: '#0c1559',
  //   borderRightColor: '#0c1559',
  //   borderWidth: 3,
  //   width: 300,
  //   height: 50,
  //   color: '#171717',
  //   fontSize: 20,
  //   borderRadius: 10,
  //   margin: 10,
  //   padding: 5,
  //   fontFamily: 'Teko_700Bold',
  //   backgroundColor: '#fdfbf9',
  //   letteSpacing: '0.02rem',
  // },

  // box2: {
  //   width: '100%',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   textAlign: 'center',
  // },

  // reset: {
  //   backgroundColor: '#171717',
  //   fontFamily: 'Teko_700Bold',
  //   width: '100%',
  //   height: '100%',
  //   padding: 10,
  //   margin: '1rem auto',
  //   shadowColor: '#0c1559',
  //   shadowRadius: 10,
  //   shadowOpacity: 1,
  //   shadowOffset: { width: -2, height: 4 },
  //   alignItems: 'center',
  //   borderRadius: 10,
  //   paddingTop: 200,
  // },
});

export default BottomSheetComponent;
