import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
  FlatList,
  Pressable,
  Modal,
  Alert,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
} from 'react-native';
import { BottomSheet, Button, ListItem } from 'react-native-elements';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Searchbar } from 'react-native-paper';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import GestureRecognizer from 'react-native-swipe-gestures';

function Profile({ navigation }) {
  const video = React.useRef(null);
  const [userUploads, setUserUploads] = useState();
  const [user, setUser] = useState();
  const [theater, setTheater] = useState(false);
  const [info, setInfo] = useState(true);
  const [comments, setComments] = useState(false);
  const [recommended, setRecommended] = useState(false);
  const [videoid, setVideoid] = useState();

  useEffect(() => {
    const getUser = async () => {
      const loggedInUser = await AsyncStorage.getItem('fariToken');
      if (!loggedInUser) {
        Alert.alert('Sign in to view your profile');
      }
      if (loggedInUser) {
        setUser(JSON.parse(loggedInUser));
      }
    };

    const fetchchannelUploads = async () => {
      let USER_TOKEN = await AsyncStorage.getItem('fariToken');
      let TOKEN = JSON.parse(USER_TOKEN);
      let channelid = await AsyncStorage.getItem('channelID');

      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/users/myprofile/post/${channelid}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      let data = await response.json();
      setUserUploads(data.channelUploads);
      return data.channelUploads;
    };

    getUser().then(fetchchannelUploads);
  }, []);

  return (
    <>
      <View styles={styles.uploads}>
        <ScrollView>
          {userUploads && userUploads.length === 0 && (
            <Text style={styles.message}>You do not have any uploads yet.</Text>
          )}
          {userUploads && userUploads.length > 0
            ? userUploads.map((channelUploads) => {
                return (
                  <View style={styles.movieCard}>
                    <Video
                      style={styles.video}
                      ref={video}
                      source={{
                        uri: channelUploads.videofile,
                      }}
                      posterSource={{
                        uri: channelUploads.videothumbnail,
                      }}
                      resizeMode={'cover'}
                      usePoster
                      posterStyle={{ width: '100%', height: '100%' }}
                      isMuted></Video>
                    <View className="controls" style={styles.controls}>
                      <View className="controls-two" style={styles.controlsTwo}>
                        <View className="channel" style={styles.channel}>
                          <View
                            className="avi"
                            style={{
                              width: 65,
                              height: 65,
                              marginLeft: 2,
                              backgroundColor: 'black',
                              borderRadius: '50%',
                              shadowColor: 'black',
                              shadowRadius: 10,
                              shadowOpacity: 1,
                              shadowOffset: { width: -2, height: 4 },
                              marginRight: 5,
                            }}>
                            <Image
                              source={{
                                uri: channelUploads.profile_avatar,
                              }}
                              style={{
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                                zIndex: 20,
                              }}
                            />
                          </View>
                          <View
                            style={{
                              width: '90%',
                              display: 'flex',
                              flexDirection: 'column',
                              marginRight: 15,
                            }}>
                            <Text
                              onPress={() =>
                                Linking.openURL(
                                  'https://fari-test.netlify.app/channel'
                                )
                              }
                              style={styles.viewName}>
                              {channelUploads.channel_name}
                            </Text>
                            <Text style={styles.viewText}>
                              Views: {channelUploads.videoviewcount}{' '}
                            </Text>
                          </View>

                          <View className="edits" style={styles.edits}>
                            <FontAwesome
                              name="ellipsis-v"
                              size={24}
                              color="#fdfbf9"
                              style={styles.editsBtn}
                            />
                            <FlatList
                              className="edit-options"
                              style={styles.editOptions}>
                              //{' '}
                              <Button className="edits2-add">
                                <MaterialIcons
                                  name="watch-later"
                                  size={24}
                                  color="#fdfbf9"
                                />
                              </Button>
                              data={[{ key: 'Watchlater' }]}
                              />
                            </FlatList>
                          </View>
                        </View>
                      </View>
                      <Pressable
                        onPress={() =>
                          navigation.navigate('Theater', {
                            videoid: channelUploads.videoid,
                            videotitle: channelUploads.videotitle,
                            videodescription: channelUploads.videodescription,
                            videofile: channelUploads.videofile,
                            videothumbnail: channelUploads.videothumbnail,
                            videocreator: channelUploads.channel_name,
                            creatoravatar: channelUploads.channelpic,
                            videoviewcount: channelUploads.videoviewcount,
                            videolikecount: channelUploads.videolikecount,
                            videodislikecount: channelUploads.videodislikecount,
                            channelid: channelUploads.channelid,
                          })
                        }
                        style={styles.buttonOpen}>
                        <FontAwesome
                          name="play"
                          size={24}
                          color="#0c1559"
                          style={styles.play}
                        />
                      </Pressable>
                      <View className="movie-info">
                        <Text style={styles.cardTextTitle}>
                          {channelUploads.videotitle}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })
            : null}
        </ScrollView>
      </View>
    </>
  );
}


function CustomHeader(channelInfo) {
  const [loginPage, setLoginPage] = useState(false);
  const [regPage, setRegPage] = useState(false);
  const [forgottenPassword, setForgotPassword] = useState(false);
  const [settings, setSettings] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmed, setConfirmed] = useState('');
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState();

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

  const registerUser = async () => {
    if (password != confirmed) {
      setMessage('Your password and confirmed password does not match');
      return false;
    } else if (password.length < 8 || password.length < 8) {
      setMessage('Password not strong enough, minimum 8 characters');
      return false;
    }
    try {
      const response = await fetch(
        'https://fari-testapi.herokuapp.com/api/users/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password, confirmed }),
        }
      );
      const data = await response.json();
      if (data.success) {
        await AsyncStorage.setItem('fariToken', data.token);
        setMessage(JSON.stringify(data.message));
      } else if (data.error) {
        setMessage(JSON.stringify(data.message));
      }
    } catch (error) {
      setMessage(error);
    }
  };

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
      } else if (data.error) {
        setMessage(JSON.stringify(data.message));
      }
    } catch (error) {
      console.log(error);
      setMessage(error);
    }
  };

  const logoutUser = async () => {
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys);
    console.log(keys)
  };

  const onRegSubmit = () => {
    registerUser();
  };

  const onLogSubmit = () => {
    loginUser();
  };

  const onLogOut = () => {
    logoutUser();
  };

  useEffect(() => {
    const fetchchannelInfo = async () => {
      let USER_TOKEN = await AsyncStorage.getItem('fariToken');
      let TOKEN = JSON.parse(USER_TOKEN);
      let username = await AsyncStorage.getItem('userName');
      let usernameParse = JSON.parse(username);

      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/users/myprofile/channel/${usernameParse}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      let data = await response.json();
      setProfile(data.profile);
      return data.profile;
    };

    fetchchannelInfo();
  }, []);
  console.log(profile);
  return (
    <>
      <GestureRecognizer onSwipeDown={(settings) => setSettings(false)}>
        <Modal
          animationType="slide"
          visible={settings}
          transparent={true}
          presentationStyle={'overFullScreen'}
          onRequestClose={() => {
            setSettings(!settings);
          }}
          style={{ backgroundColor: '#171717', flex: 1 }}>
          <View style={styles.container}>
            <View style={styles.box}>
              <View className="login/Register">
                <Button
                  title="Login"
                  color="#fdfbf9"
                  backgroundColor="#0C1559"
                  buttonStyle={styles.button}
                  onPress={() => {
                    setLoginPage(true), setSettings(false);
                  }}></Button>

                <Button
                  buttonStyle={styles.button}
                  title="Register"
                  color="#fdfbf9"
                  backgroundColor="#0C1559"
                  onPress={() => {
                    setRegPage(true), setSettings(false);
                  }}></Button>
              </View>
            </View>
          </View>
        </Modal>
      </GestureRecognizer>

      <GestureRecognizer onSwipeDown={(loginPage) => setLoginPage(false)}>
        <Modal
          animationType="slide"
          visible={loginPage}
          transparent={true}
          presentationStyle={'overFullScreen'}
          onRequestClose={() => {
            setLoginPage(!loginPage);
          }}
          style={{ backgroundColor: '#171717', flex: 1 }}>
          <View className="login" style={styles.login}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              onChangeText={(value) => setUsername(value)}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={(value) => setPassword(value)}
            />
            <View style={styles.box2}>
              <Button
                title="Login"
                color="#fdfbf9"
                backgroundColor="#0C1559"
                buttonStyle={styles.button}
                onPress={() => {
                  onLogSubmit();
                }}></Button>
              <Text
                numberOfLines={2}
                style={{ color: '#fdfbf9', fontFamily: 'Teko_700Bold' }}>
                {message}
              </Text>
              <Pressable
                onPress={() => {
                  setLoginPage(false);
                  setForgotPassword(true);
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
                  setLoginPage(false);
                  setRegPage(true);
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
        </Modal>
      </GestureRecognizer>

      <GestureRecognizer onSwipeDown={(regPage) => setRegPage(false)}>
        <Modal
          animationType="slide"
          visible={regPage}
          transparent={true}
          presentationStyle={'overFullScreen'}
          onRequestClose={() => {
            setRegPage(!regPage);
          }}
          style={{ backgroundColor: '#171717', flex: 1 }}>
          <View className="register" style={styles.register}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              onChangeText={(value) => setUsername(value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={(value) => setEmail(value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={(value) => setPassword(value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry={true}
              onChangeText={(value) => setConfirmed(value)}
            />
            <View style={styles.box2}>
              <View>
                <Button
                  buttonStyle={styles.button}
                  title="Register"
                  color="#fdfbf9"
                  backgroundColor="#0C1559"
                  onPress={() => {
                    onRegSubmit(), setRegPage(false);
                  }}></Button>
              </View>

              <Text style={{ color: '#fdfbf9', fontFamily: 'Teko_700Bold' }}>
                {message}
              </Text>
              <Pressable
                onPress={() => {
                  setLoginPage(true);
                  setRegPage(false);
                }}
                style={[styles.button, styles.buttonClose]}>
                <Text
                  style={{
                    color: '#fdfbf9',
                    fontFamily: 'Teko_700Bold',
                    fontSize: 20,
                    marginTop: 10,
                  }}>
                  Have an account? Login here.
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </GestureRecognizer>

      <GestureRecognizer
        onSwipeDown={(forgottenPassword) => setForgotPassword(false)}>
        <Modal
          animationType="slide"
          visible={forgottenPassword}
          transparent={true}
          presentationStyle={'overFullScreen'}
          onRequestClose={() => {
            setForgotPassword(!forgottenPassword);
          }}
          style={{ backgroundColor: '#171717', flex: 1 }}>
          <View style={styles.reset}>
            <TextInput style={styles.input} placeholder="Email" />
            <View className="forgotPassword">
              <View>
                <Button
                  buttonStyle={styles.button}
                  title="Submit"
                  color="#fdfbf9"
                  backgroundColor="#0C1559"></Button>

                <Text
                  numberOfLines={2}
                  style={{
                    color: '#fdfbf9',
                    fontFamily: 'Teko_700Bold',
                    fontSize: 16,
                    marginTop: 10,
                  }}>
                  {message}
                </Text>

                <Pressable
                  onPress={() => {
                    setLoginPage(true);
                    setForgotPassword(false);
                  }}
                  style={[styles.button, styles.buttonClose]}>
                  <Text
                    style={{
                      color: '#fdfbf9',
                      fontFamily: 'Teko_700Bold',
                      fontSize: 20,
                      marginTop: 10,
                    }}>
                    Back to Login
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </GestureRecognizer>

      {profile && profile.length > 0 ? (
        profile.map((profile) => {
          return (
            <>
              <View style={styles.profile}>
                <Image
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    margin: 10,
                    backgroundColor: '#fdfbf9',
                  }}
                  source={{
                    uri: profile.profile_avatar
                      ? profile.profile_avatar
                      : 'https://cdn.onlinewebfonts.com/svg/img_258083.png',
                  }}
                />
                <Text
                  style={{
                    color: '#fdfbf9',
                    fontSize: 18,
                    fontFamily: 'Teko_700Bold',
                  }}>
                  {profile.channelname}
                </Text>
                <Text
                  style={{
                    color: '#fdfbf9',
                    fontSize: 18,
                    fontFamily: 'Teko_700Bold',
                  }}>
                  {profile.subscriber_count} Subscribers
                </Text>
              </View>

              <View>
                <Pressable style={{ height: 30 }} onPress={() => {
                  onLogOut();
                  }}>
                  <Text
                    style={{
                      color: '#fdfbf9',
                      fontSize: 18,
                      fontFamily: 'Teko_700Bold',
                      textDecorationLine: 'underline',
                      textDecorationColor: '#fdfbf9',
                      marginLeft: 90,
                    }}>
                    {' '}
                    Logout{' '}
                  </Text>
                </Pressable>
              </View>
            </>
          );
        })
      ) : (
        <View style={{ marginTop: 250 }}>
          <Pressable style={{ height: 30 }} onPress={() => setSettings(true)}>
            <Text
              style={{
                color: '#fdfbf9',
                fontSize: 18,
                fontFamily: 'Teko_700Bold',
                textDecorationLine: 'underline',
                textDecorationColor: '#fdfbf9',
                marginLeft: 100,
              }}>
              {' '}
              Login{' '}
            </Text>
          </Pressable>
        </View>
      )}
    </>
  );
}

const Drawer = createDrawerNavigator();
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#171717',
    color: '#fdfbf9',
  },
};

function MyDrawer() {
  return (
    <>
      <Drawer.Navigator
        drawerContent={(props) => <CustomHeader />}
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#0c1559',
            width: 250,
            fontFamily: 'Teko_700Bold',
          },
          headerStyle: {
            backgroundColor: '#0c1559',
            color: '#fdfbf9',
          },
          drawerLabelStyle: {
            color: '#fdfbf9',
            fontFamily: 'Teko_700Bold',
            fontSize: 18,
          },
        }}>
        <Drawer.Screen
          name="Profile"
          component={Profile}
          options={{
            headerStyle: {
              backgroundColor: '#0c1559',
              color: '#fdfbf9',
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontFamily: 'Teko_700Bold',
              fontSize: 18,
            },
            unmountOnBlur: true,
          }}
        />
      </Drawer.Navigator>
    </>
  );
}

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
    backgroundColor: '#171717',
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
    borderRightColor: '#0c1559',
    borderWidth: 3,
    width: 300,
    height: 50,
    color: '#171717',
    fontSize: 20,
    borderRadius: 10,
    margin: 10,
    padding: 5,
    fontFamily: 'Teko_700Bold',
    backgroundColor: '#fdfbf9',
    letteSpacing: '0.02rem',
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
});

export default function App() {
  return <MyDrawer />;
}
