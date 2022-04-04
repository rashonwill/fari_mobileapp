import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  TouchableHighlight,
  Dimensions,
  Animated,
  TouchableOpacity,
  Pressable,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import {
  BottomSheet,
  Button,
  ButtonGroup,
  withTheme,
} from 'react-native-elements';
import {
  NavigationContainer,
  DefaultTheme,
  useRoute,
  useNavigation,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import GestureRecognizer from 'react-native-swipe-gestures';

import {
  Teko_300Light,
  Teko_400Regular,
  Teko_500Medium,
  Teko_600SemiBold,
  Teko_700Bold,
} from '@expo-google-fonts/teko';

import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

import Chat from './ChatMessages';

function Conversations({ navigation }) {
  const [userconversations, setUserConversations] = useState({});
  const [myInits, setMyInits] = useState([]);
  const [otherInits, setOtherInits] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      const loggedInUser = await AsyncStorage.getItem('fariToken');
      if (!loggedInUser) {
        Alert.alert('Sign in to view your messages');
      }
      if (loggedInUser) {
        return;
      }
    };

    const fetchConversations = async () => {
      let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));
      let userid = await AsyncStorage.getItem('userID');
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/chat/myconversations/${userid}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      let data = await response.json();
      setUserConversations(data.conversation);
      return data.conversation;
    };

    async function splitConversations(conversation) {
      let myInitiations = await AsyncStorage.getItem('userID');
      let myID = JSON.parse(myInitiations);

      let meFirst = [];
      let meSecond = [];

      for (let index = 0; index < conversation.length; index++) {
        if (conversation[index].user1 === myID) {
          meFirst.push(conversation[index]);
          setMyInits(meFirst);
        } else {
          meSecond.push(conversation[index]);
          setOtherInits(meSecond);
        }
      }
    }

    getUser().then(fetchConversations).then(splitConversations);
  }, []);

  const rightSwipe = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    return (
      <TouchableOpacity activeOpacity={0.6}>
        <View style={styles.deleteBox}>
          <Pressable>
            <FontAwesome name="trash-o" size={24} color="black" />
          </Pressable>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View style={styles.chats}>
        <ScrollView>
          {userconversations && userconversations.length === 0 && (
            <Text style={styles.message}>No Chat Messages.</Text>
          )}

          {myInits && myInits.length > 0
            ? myInits.map((conversation) => {
                return (
                  <Swipeable renderRightActions={rightSwipe}>
                    <Pressable
                      style={{ width: '100%' }}
                      onPress={() => {
                        AsyncStorage.setItem(
                          'conversationID',
                          JSON.stringify(conversation.conversationid)
                        );
                        navigation.navigate('Chat', {
                          chatID: conversation.conversationid,
                          receiverID: conversation.user2,
                          receiverName: conversation.user2_username,
                          receiverEmail: conversation.user2_email
                        });
                      }}>
                      <View style={styles.userConvos} key={conversation.id}>
                        <View style={styles.convoImage}>
                          <Image
                            source={{
                              uri: conversation.user2_pic,
                            }}
                            style={{
                              width: '100%',
                              height: '100%',
                              borderRadius: '50%',
                            }}
                          />
                        </View>
                        <View className="title-text">
                          <Text style={styles.titleText}>
                            {conversation.user2_username}
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  </Swipeable>
                );
              })
            : null}

          {otherInits && otherInits.length > 0
            ? otherInits.map((conversation) => {
                return (
                  <Swipeable renderRightActions={rightSwipe}>
                    <Pressable
                      style={{ width: '100%' }}
                      onPress={() => {
                        AsyncStorage.setItem(
                          'conversationID',
                          JSON.stringify(conversation.conversationid)
                        );
                        navigation.navigate('Chat', {
                          chatID: conversation.conversationid,
                          receiverID: conversation.user1,
                          receiverName: conversation.user1_username,
                          receiverEmail: conversation.user1_email
                        });
                      }}>
                      <View style={styles.userConvos} key={conversation.id}>
                        <View style={styles.convoImage}>
                          <Image
                            source={{
                              uri: conversation.user1_pic,
                            }}
                            style={{
                              width: '100%',
                              height: '100%',
                              borderRadius: '50%',
                            }}
                          />
                        </View>
                        <View className="title-text">
                          <Text style={styles.titleText}>
                            {conversation.user1_username}
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  </Swipeable>
                );
              })
            : null}
        </ScrollView>
      </View>
    </>
  );
}

function Search({ navigation }) {
  const [allUsers, setAllUsers] = useState();

  async function newConversationStart() {
    let USER_TOKEN = await AsyncStorage.getItem('fariToken');
    let TOKEN = JSON.parse(USER_TOKEN);

    let user1 = JSON.parse(await AsyncStorage.getItem('userID'));
    let user1_username = JSON.parse(await AsyncStorage.getItem('userName'));
    let user1_pic = JSON.parse(await AsyncStorage.getItem('userAvi'));
    let user1_email = JSON.parse(await AsyncStorage.getItem('userEmail'));

    let user2 = JSON.parse(await AsyncStorage.getItem('receiverID'));
    let user2_username = JSON.parse(await AsyncStorage.getItem('receiverName'));
    let user2_pic = JSON.parse(await AsyncStorage.getItem('receiverAvi'));
    let user2_email = JSON.parse(await AsyncStorage.getItem('receiverEmail'));

    const newConversation = {
      user1: user1,
      user1_username: user1_username,
      user1_pic: user1_pic,
      user1_email: user1_email,
      user2: user2,
      user2_username: user2_username,
      user2_pic: user2_pic,
      user2_email: user2_email,
    };
    console.log(newConversation);
    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/chat/new-conversation`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify(newConversation),
        }
      );
      let data = await response.json();
      console.log('new convo start', data);
      AsyncStorage.setItem(
        'conversationID',
        JSON.stringify(data.conversation.id)
      );
      return data.conversation;
    } catch (error) {
      console.log(error);
    }
  }

  async function duplicateConvoCheck() {
    let USER_TOKEN = await AsyncStorage.getItem('fariToken');
    let TOKEN = JSON.parse(USER_TOKEN);
    let user1 = JSON.parse(await AsyncStorage.getItem('receiverID'));
    let user2 = JSON.parse(await AsyncStorage.getItem('userID'));

    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/chat/dup-conversations/${user1}/${user2}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      let data = await response.json();
      console.log('dupcheck', data);
      if (data.conversationCheck.length === 0) {
        newConversationStart();
      }
      return data.conversationCheck;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const fetchUsers = async () => {
      let USER_TOKEN = await AsyncStorage.getItem('fariToken');
      let TOKEN = JSON.parse(USER_TOKEN);
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/users/usernames`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      let data = await response.json();
      setAllUsers(data.users);
      return data.users;
    };

    fetchUsers();
  }, []);

  return (
    <ScrollView>
      {allUsers && allUsers.length > 0
        ? allUsers.map((users) => {
            return (
              <View style={styles.userSearch}>
                <Pressable
                  onPress={() => {
                    AsyncStorage.setItem(
                      'receiverID',
                      JSON.stringify(users.userid)
                    ),
                      AsyncStorage.setItem(
                        'receiverName',
                        JSON.stringify(users.username)
                      ),
                      AsyncStorage.setItem(
                        'receiverEmail',
                        JSON.stringify(users.email)
                      ),
                      AsyncStorage.setItem(
                        'receiverAvi',
                        JSON.stringify(users.profile_avatar)
                      ),
                      duplicateConvoCheck();

                    navigation.navigate('Chat', {
                      receiverID: users.userid,
                      receiverName: users.username,
                      receiverEmail: users.email,
                      receiverAvi: users.profile_avatar,
                    });
                  }}>
                  <View style={styles.userlist}>
                    <View style={styles.userSearched}>
                      <View style={styles.userPic}>
                        <Image
                          source={{ uri: users.profile_avatar }}
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                          }}
                        />
                      </View>
                      <Text style={styles.userName}>{users.username}</Text>
                      <Button
                        buttonStyle={styles.messageMe}
                        title="Message"></Button>
                    </View>
                  </View>
                </Pressable>
              </View>
            );
          })
        : null}
    </ScrollView>
  );
}

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function MyDrawer() {
  return (
    <>
      <Drawer.Navigator
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#0c1559',
            width: 250,
            fontFamily: 'Teko_700Bold',
          },
          headerStyle: {
            backgroundColor: '#0c1559',
            color: '#fdfbf9',
            elevation: 0,
            shadowOpacity: 0,
          },
          drawerLabelStyle: {
            color: '#fdfbf9',
            fontFamily: 'Teko_700Bold',
            fontSize: 18,
          },
        }}>
        <Drawer.Screen
          name="Conversations"
          component={Conversations}
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
          }}
        />
        <Drawer.Screen
          name="Search"
          component={Search}
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
          }}
        />
      </Drawer.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  chats: {
    backgroundColor: '#171717',
    width: '100%',
    height: '100%',
    padding: 10,
  },

  userConvos: {
    display: 'flex',
    flexDirection: 'row',
    color: '#FDFBF9',
    fontSize: 18,
    borderColor: 'none',
    borderWidth: 0,
    borderBottomColor: '#0C1559',
    borderBottomWidth: 2,
    padding: 10,
    borderRadius: 10,
    margin: 5,
    backgroundColor: 'black',
    opacity: '.8',
  },

  convoImage: {
    width: 60,
    height: 60,
    borderRadius: '50%',
  },

  titleText: {
    paddingLeft: 10,
    fontSize: 23,
    letteSpacing: '.03rem',
    color: '#fdfbf9',
    fontFamily: 'Teko_700Bold',
    margin: 10,
    marginTop: 20,
  },

  userSearch: {
    margin: 10,
    width: '100%',
  },

  userlist: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: ' rgba(19, 19, 19, 0.8)',
    padding: 5,
    fontFamily: 'Teko_700Bold',
    letterSpacing: '.03rem',
    width: 370,
  },

  userPic: {
    width: 60,
    height: 60,
    borderRadius: '50%',
  },

  userName: {
    fontSize: 18,
    color: '#fdfbf9',
    fontFamily: 'Teko_700Bold',
    marginLeft: 5,
    marginTop: 10,
  },

  messageMe: {
    backgroundColor: '#0C1559',
    color: '#fdfbf9',
    fontSize: 16,
    fontFamily: 'Teko_700Bold',
    letterSpacing: '.03rem',
    position: 'absolute',
    right: 0,
    marginLeft: 30,
    display: 'block',
  },

  userSearched: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  message: {
    fontSize: 21,
    textAlign: 'center',
    margin: '1rem auto',
    marginTop: 250,
    color: '#a9a9b0',
    fontFamily: 'Teko_700Bold',
  },
  deleteBox: {
    backgroundColor: '#B2022F',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 85,
  },
});

export default function App() {
  return <MyDrawer />;
}
