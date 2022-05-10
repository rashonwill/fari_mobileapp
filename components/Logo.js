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
  StatusBar
} from 'react-native';

import Login from './Login';
import Register from './Register';
import Expolorer from './Explorer';
import { AppLoading } from 'expo';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  NavigationContainer,
  DefaultTheme,
  useNavigation,
  useRoute,
} from '@react-navigation/native';


const Logo = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState();
  
      function goToHome(){
      setTimeout(() => {
       navigation.navigate('Login')
    }, 3500);
  }

  useEffect(() => {
    goToHome();
  },);

  return (
    <>
    <StatusBar barStyle="light-content" />
      <View style={styles.container}>
      <View style={{marginTop: 300, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={styles.logo}>FARI.</Text>
      </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
container: {
  width: '100%',
  height: '100%',
  backgroundColor: '#171717' 
},
logo:{
  color: '#0c1559',
  fontSize: 85,
  fontFamily: 'PermanentMarker_400Regular',

}
});
export default Logo;
