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

import Explorer from './Explorer';
import Register from './Register'
import Reset from './ResetPassword';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  NavigationContainer,
  DefaultTheme,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

const Login = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState([]);


    

  async function getLoggedInUser() {
    let USER_TOKEN = await AsyncStorage.getItem('fariToken');
    let TOKEN = JSON.parse(USER_TOKEN);
    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/users/me`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      const data = await response.json();
      let setuser = await AsyncStorage.setItem(
        'userID',
        JSON.stringify(data.user.userid)
      );
      return data.user;
    } catch (error) {
      console.log(
        'Oops Something Went Wrong! Could not get logged in user.',
        error
      );
    }
  }

  async function getUserProfile() {
    let USER_TOKEN = await AsyncStorage.getItem('fariToken');
    let TOKEN = JSON.parse(USER_TOKEN);

    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/users/myprofile`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      const data = await response.json();
      let setChannel = await AsyncStorage.setItem(
        'channelID',
        JSON.stringify(data.profile[0].channelid)
      );
      let setUsername = await AsyncStorage.setItem(
        'userName',
        JSON.stringify(data.profile[0].username)
      );
      let setVendor = await AsyncStorage.setItem(
        'vendorID',
        JSON.stringify(data.profile[0].vendorid)
      );

      let setEmail = await AsyncStorage.setItem(
        'userEmail',
        JSON.stringify(data.profile[0].email)
      );

      let setAvatar = await AsyncStorage.setItem(
        'userAvi',
        JSON.stringify(data.profile[0].profile_avatar)
      );

      return data.profile;
    } catch (error) {
      console.log('Oops Something Went Wrong!', error);
    }
  }

  const loginUser = async () => {
    try {
      const response = await fetch(
        'https://fari-testapi.herokuapp.com/api/users/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        }
      );
      const data = await response.json();
      if (data.success) {
        await AsyncStorage.setItem('fariToken', JSON.stringify(data.token));
        setMessage(JSON.stringify(data.message));
        getLoggedInUser().then(getUserProfile);
        setUser(data);
        setError('');
        navigation.navigate('Explorer')
        return data;
      } else if (data.error) {
        setError(JSON.stringify(data.message));
      }
    } catch (error) {
      console.log(error);
      setMessage(error);
    }
  };

  const onLogSubmit = () => {
    loginUser();
  };


  useEffect(() => {
     const getUser = async () => {
      try {
        const loggedInUser = await AsyncStorage.getItem('fariToken');
        if (loggedInUser) {
          navigation.navigate('Explorer');
        }
      } catch (error) {
        console.log(error);
      }
    }
getUser();
  }, [navigation]);

  return (
    <>
    <StatusBar barStyle="light-content" />
      <View className="login" style={styles.login}>
        <TextInput
          selectionColor={'#0C1559'}
          style={styles.input}
          placeholder="Username"
          keyboardAppearance="dark"
          autoCapitalize='none'
          placeholderTextColor="#a9a9b0"
          onChangeText={(value) => setUsername(value)}
        />

        <TextInput
          selectionColor={'#0C1559'}
          style={styles.input}
          placeholder="Password"
          returnKeyType="go"
          keyboardAppearance="dark"
          placeholderTextColor="#a9a9b0"
          autoCapitalize='none'
          secureTextEntry={true}
          onSubmitEditing={() => onLogSubmit()}
          onChangeText={(value) => setPassword(value)}
        />
        <View style={styles.box2}>
          <Button
            title="Login"
            color="#fdfbf9"
            backgroundColor="#0C1559"
            buttonStyle={styles.button}
            onPress={() => onLogSubmit()}></Button>
          <Text
            numberOfLines={2}
            style={{ color: '#fdfbf9', fontFamily: 'Teko_700Bold' }}>
            {message}
          </Text>

          <Text
            numberOfLines={2}
            style={{ color: '#B2022F', fontFamily: 'Teko_700Bold' }}>
            {error}
          </Text>
          <Pressable
            onPress={() => {
             navigation.navigate('ResetPassword')
            }}
            style={[styles.button, styles.buttonOpen]}>
            <Text
              style={{
                color: '#fdfbf9',
                fontFamily: 'Teko_700Bold',
                fontSize: 20,
              }}>
              {' '}
              Forgot Password{' '}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
           navigation.navigate('Register')
            }}
            style={[styles.button, styles.buttonOpen]}>
            <Text
              style={{
                color: '#fdfbf9',
                fontFamily: 'Teko_700Bold',
                fontSize: 20,
              }}>
              Dont have an account? Register here.{' '}
            </Text>
          </Pressable>
        </View>
      </View>

    </>
  );
};

const styles = StyleSheet.create({
  profile: {
    height: 200,
    width: '100%',
    backgroundColor: 'transparent',
    shadowColor: 'black',
    shadowRadius: 10,
    shadowOpacity: 1,
    shadowOffset: { width: -2, height: 4 },
    padding: 10,
    marginBottom: 15,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },

  uploads: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    width: '100%',
    height: '100%',
    padding: 10,
  },

  movieCard: {
    height: 250,
    width: 390,
    backgroundColor: '#171717',
    shadowColor: '#0c1559',
    shadowRadius: 10,
    shadowOpacity: 1,
    shadowOffset: { width: -2, height: 4 },
    borderRadius: '10px',
    fontFamily: 'Teko_700Bold',
    marginBottom: 10,
    marginTop: 10,
  },

  play: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '30px',
    background: 'transparent',
    width: '50px',
    height: '50px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '50px',
    color: '#001399',
    textAlign: 'center',
  },

  cardTextTitle: {
    color: '#fdfbf9',
    fontFamily: 'Teko_700Bold',
    letterSpacing: '0.02rem',
    textAlign: 'center',
    fontSize: 16,
  },

  channel: {
    display: 'flex',
    flexDirection: 'row',
    margin: '5px',
    width: 250,
  },

  edits: {
    width: 40,
    height: 80,
    position: 'relative',
    right: 0,
    top: 0,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },

  editsBtn: {
    width: '40px',
    position: 'relative',
  },

  editOptions: {
    position: 'relative',
    zIndex: 15,
    width: 120,
    height: 60,
    backgroundColor: '#0c1559',
    borderRadius: '10px',
    color: '#fdfbf9',
    right: 100,
    transform: [{ scale: 0 }],
  },

  viewText: {
    color: '#fdfbf9',
    fontFamily: 'Teko_700Bold',
    letterSpacing: '0.02rem',
    marginTop: 10,
    marginLeft: 5,
    fontSize: 14,
  },

  viewName: {
    color: '#fdfbf9',
    fontFamily: 'Teko_700Bold',
    letterSpacing: '0.02rem',
    marginLeft: 5,
    fontSize: 18,
  },

  video: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '10px',
  },

  controlsTwo: {
    height: '65px',
    display: 'flex',
    flexDirection: 'row',
    padding: 5,
    marginBottom: 5,
  },

  controls: {
    position: 'relative',
    padding: 5,
    zIndex: 10,
    backgroundColor: 'rgba(19, 19, 19, 0.7)',
    width: '100%',
    height: '100%',
  },

  message: {
    fontSize: 21,
    textAlign: 'center',
    margin: '1rem auto',
    marginTop: 50,
    color: '#a9a9b0',
    fontFamily: 'Teko_700Bold',
  },

  container: {
    backgroundColor: '#171717',
    fontFamily: 'Teko_700Bold',
    width: '100%',
    height: '100%',
  },

  box: {
    backgroundColor: '#171717',
    fontFamily: 'Teko_700Bold',
    width: '100%',
    height: 250,
    padding: 10,
    margin: '1rem auto',
    marginTop: 300,
    shadowColor: '#0c1559',
    shadowRadius: 10,
    shadowOpacity: 1,
    shadowOffset: { width: -2, height: 4 },
    alignItems: 'center',
    borderRadius: 10,
  },

  button: {
    width: 200,
    backgroundColor: '#0c1559',
    margin: 10,
    textAlign: 'center',
    padding: 5,
    alignItems: 'center',
    marginBottom: 10,
    fontSize: 20,
    color: '#fdfbf9',
    marginTop: 10,
    height: 50,
    fontFamily: 'Teko_700Bold',
  },
  buttonOpen: {
    backgroundColor: 'transparent',
    width: '100%',
  },

  buttonClose: {
    backgroundColor: 'transparent',
    width: '100%',
  },

  register: {
    backgroundColor: '#171717',
    fontFamily: 'Teko_700Bold',
    width: '100%',
    height: '100%',
    padding: 10,
    margin: '1rem auto',
    shadowColor: '#0c1559',
    shadowRadius: 10,
    shadowOpacity: 1,
    shadowOffset: { width: -2, height: 4 },
    alignItems: 'center',
    borderRadius: 10,
    zIndex: 10,
    paddingTop: 100,
  },

  login: {
    backgroundColor: '#171717',
    color: '#171717',
    fontFamily: 'Teko_700Bold',
    width: '100%',
    height: '100%',
    padding: 10,
    margin: '1rem auto',
    shadowColor: '#0c1559',
    shadowRadius: 10,
    shadowOpacity: 1,
    shadowOffset: { width: -2, height: 4 },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    zIndex: 10,
  },

  input: {
    outline: 'none',
    borderBottomColor: '#0c1559',
    borderBottomWidth: 3,
    borderRightColor: '#0c1559',
    borderRightWidth: 3,
    borderWidth: 0,
    width: 320,
    height: 50,
    color: '#fdfbf9',
    fontSize: 20,
    borderRadius: 10,
    margin: 10,
    padding: 5,
    fontFamily: 'Teko_700Bold',
    backgroundColor: '#171717',
    letteSpacing: '0.02rem',
    caretColor: '#0c1559',
  },

  box2: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },

  reset: {
    backgroundColor: '#171717',
    fontFamily: 'Teko_700Bold',
    width: '100%',
    height: '100%',
    padding: 10,
    margin: '1rem auto',
    shadowColor: '#0c1559',
    shadowRadius: 10,
    shadowOpacity: 1,
    shadowOffset: { width: -2, height: 4 },
    alignItems: 'center',
    borderRadius: 10,
    paddingTop: 200,
  },

  btn: {
    backgroundColor: '#0c1559',
    color: '#FDFBF9',
    fontWeight: 'bold',
    textAlign: 'center',
    borderRadius: 10,
    padding: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 50,
    fontSize: 14,
  },
});
export default Login;