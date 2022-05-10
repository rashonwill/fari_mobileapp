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
  StatusBar
} from 'react-native';
import {
  BottomSheet,
  Button,
  ButtonGroup,
  withTheme,
} from 'react-native-elements';
import { Searchbar } from 'react-native-paper';
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

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

import {
  Teko_300Light,
  Teko_400Regular,
  Teko_500Medium,
  Teko_600SemiBold,
  Teko_700Bold,
} from '@expo-google-fonts/teko';

import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';


import Talk from './Talk'

function Conversations({ navigation }) {
  const [userconversations, setUserConversations] = useState([]);
  const [user, setUser] = useState();

  async function deleteConvo() {
    let id = JSON.parse(await AsyncStorage.getItem('conversationID'));
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));
    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/chat/delete-conversation/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      const data = await response.json();
      fetchConversations();
      return data.conversation;
    } catch (error) {
      console.log(
        'Oops Something Went Wrong! Could not delete conversation.',
        error
      );
    }
  }

  const getUser = async () => {
    const loggedInUser = await AsyncStorage.getItem('fariToken');
    if (!loggedInUser) {
      Alert.alert('Sign in to view your messages');
    }
    if (loggedInUser) {
      let myInitiations = JSON.parse(await AsyncStorage.getItem('userID'));
      setUser(myInitiations);
    }
  };

  const fetchConversations = async () => {
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));
    let userid = await AsyncStorage.getItem('userID');

    try {
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
    } catch (error) {
      console.log('oops, could not get conversations', error);
    }
  };

  useEffect(() => {
    getUser().then(fetchConversations);
  }, []);

  const rightSwipe = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity activeOpacity={0.6}>
                <Pressable
            onPress={() => {
              deleteConvo();
            }}>
        <View style={styles.deleteBox}>

            <FontAwesome name="trash-o" size={24} color="black" />
                    </View>
          </Pressable>

      </TouchableOpacity>
    );
  };

  return (
    <>
    <StatusBar barStyle="light-content" />
      <View style={styles.chats}>
        <ScrollView>
          {userconversations && userconversations.length === 0 && (
            <Text style={styles.message}>No chat conversations started.</Text>
          )}

          {userconversations && userconversations.length > 0 ? (
            userconversations.map((conversation) => {
              return conversation.user1 == user ? (
                <Swipeable
                  onSwipeableOpen={() =>
                    AsyncStorage.setItem(
                      'conversationID',
                      JSON.stringify(conversation.conversationid)
                    )
                  }
                  renderRightActions={rightSwipe}>
                  <Pressable
                    style={{ width: '100%' }}
                    onPress={() => {
                      AsyncStorage.setItem(
                        'conversationID',
                        JSON.stringify(conversation.conversationid)
                      );
                      navigation.navigate('Talk', {
                        chatID: conversation.conversationid,
                        receiverID: conversation.user2,
                        receiverName: conversation.user2_username,
                        receiverEmail: conversation.user2_email,
                        receiverAvi: conversation.user2_pic,
                      });
                    }}>
                    <View style={styles.userConvos} key={conversation.id}>
                      <View style={styles.convoImage}>
                        <Image
                          source={{
                            uri: conversation.user2_pic ? conversation.user2_pic : "https://drotje36jteo8.cloudfront.net/noAvi.png"
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
              ) : (
                <Swipeable renderRightActions={rightSwipe}>
                  <Pressable
                    style={{ width: '100%' }}
                    onPress={() => {
                      AsyncStorage.setItem(
                        'conversationID',
                        JSON.stringify(conversation.conversationid)
                      );
                      navigation.navigate('Talk', {
                        chatID: conversation.conversationid,
                        receiverID: conversation.user1,
                        receiverName: conversation.user1_username,
                        receiverEmail: conversation.user1_email,
                        receiverAvi: conversation.user1_pic,
                      });
                    }}>
                    <View style={styles.userConvos} key={conversation.id}>
                      <View style={styles.convoImage}>
                        <Image
                          source={{
                            uri: conversation.user1_pic ? conversation.user1_pic : 'https://drotje36jteo8.cloudfront.net/noAvi.png'
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
          ) : (
            <Text style={styles.message}></Text>
          )}
        </ScrollView>
      </View>
    </>
  );
}

function Search({ navigation }) {
  const [allUsers, setAllUsers] = useState();
  const [userSearch, setUserSearch] = useState('');
  const onChangeSearch = (query) => setUserSearch(query);
  const [searchResults, setSearchResults] = useState();

  const fetchUserSearchResults = async () => {
    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/users/usernames/${userSearch}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      setSearchResults(data.users);
      return data.users;
    } catch (error) {
      console.log(
        'Oops Something Went Wrong! Could not get the search results list.',
        error
      );
    }
  };

  async function renderUserSearch() {
    return (
      <>
      <StatusBar barStyle="light-content" />
        <View style={styles.container}>
          <ScrollView>
            {searchResults && searchResults.length > 0
              ? searchResults.map((users) => {
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

                          navigation.navigate('Talk', {
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
                                source={{ uri: users.profile_avatar ? users.profile_avatar : 'https://drotje36jteo8.cloudfront.net/noAvi.png' }}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  borderRadius: '50%',
                                }}
                              />
                            </View>
                            <Text style={styles.userName}>
                              {users.username}
                            </Text>
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
        </View>
      </>
    );
  }

  async function newConversationStart() {
    await AsyncStorage.setItem('conversationID', '0')
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));

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
       let setConvo = await AsyncStorage.setItem(
        'conversationID',
        JSON.stringify(data.conversation.id)
      )
      let newc = JSON.parse(await AsyncStorage.getItem('conversationID'))
      return data.conversation;
    } catch (error) {
      console.log(error);
    }
  }

  async function duplicateConvoCheck() {
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));
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
      if (data.conversationCheck.length === 0) {
        newConversationStart();
      }
      return data.conversationCheck;
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
    <StatusBar barStyle="light-content" />
      <Searchbar
        placeholder="Search users"
        placeholderTextColor="#a9a9b0"
        keyboardAppearance="dark"
        onChangeText={onChangeSearch}
        value={userSearch}
        returnKeyType="search"
        inputStyle={{ color: '#fdfbf9', caretColor: '#0c1559' }}
        onSubmitEditing={() => {
          fetchUserSearchResults().then(renderUserSearch);
        }}
        style={{
          backgroundColor: '#333',
          opacity: 0.8,
          borderBottomColor: '#333',
          borderBottomWidth: 1,
          borderWidth: 0,
          borderRadius: 0,
          fontFamily: 'Teko_700Bold',
        }}
      />
      <View style={styles.container}>
        <ScrollView>
          {searchResults && searchResults.length > 0
            ? searchResults.map((users) => {
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

                        navigation.navigate('Talk',{
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
                              source={{ uri: users.profile_avatar ? users.profile_avatar : 'https://drotje36jteo8.cloudfront.net/noAvi.png' }}
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
      </View>
    </>
  );
}

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();


function MyStack(){
  return (
      <Stack.Navigator
    screenOptions={{
            headerStyle: {
            backgroundColor: '#0c1559',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: '#fdfbf9',
          headerTitleStyle: {
          fontFamily: 'Teko_700Bold',
          fontSize: 18,
          }
    }}>

      <Stack.Screen
        name="Chats"
        component={Conversations}
        options={({navigation})  => ({
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
          headerRight: () => (
            <>
            <Pressable style={{width: 50, height: 30}} onPress={() => navigation.navigate('Search')}>
            <MaterialIcons name="person-search" size={30} color="#fdfbf9" />
            </Pressable>
            </>
    )  
        })}
      />


            <Stack.Screen name="Search" component={Search}
                options={{
                headertitle: 'Search',
                headerShadowVisible: false,
                headerBackTitle:'Chats',
                headerBackTitleVisible: true,
                headerBackTitleStyle: {
                  fontFamily: 'Teko_700Bold',
                  fontSize: 18,
                },
      }}
       />

       
            <Stack.Screen name="Talk" component={Talk}
                options={({navigation, route}) => ({
                title: '',
                headerShadowVisible: false,
                headerBackTitle:'Chats',
                headerBackTitleVisible: true,
                headerBackTitleStyle: {
                  fontFamily: 'Teko_700Bold',
                  fontSize: 18,
                },
            headerRight: () => (
            <>
            <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 100,
              width: '100%',
            }}>
            <View
              style={{ display: 'flex', flexDirection: 'row'}}>
              <Image
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  margin: 10,
                  backgroundColor: '#fdfbf9',
                }}
                source={{
                  uri: route.params.receiverAvi
                    ? route.params.receiverAvi
                    : 'https://cdn.onlinewebfonts.com/svg/img_258083.png',
                }}
              />
              <Text
                style={{
                  color: '#fdfbf9',
                  fontSize: 18,
                  fontFamily: 'Teko_700Bold',
                  marginTop: 15,
                }}>
                {route.params.receiverName}
              </Text>
            </View>
          </View>
            </>
    )  
                
      })}
       />

    </Stack.Navigator>

  )
}

const styles = StyleSheet.create({
  chats: {
    backgroundColor: '#171717',
    width: '100%',
    height: '100%',
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
    marginBottom: 10,
    backgroundColor: 'black',
    opacity: '.8',
    width: WIDTH,
  },

  convoImage: {
    width: 60,
    height: 60,
    borderRadius: '50%',
  },

  titleText: {
    paddingLeft: 10,
    fontSize: 18,
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
    backgroundColor: 'black',
    opacity: '.8',
    padding: 5,
    fontFamily: 'Teko_700Bold',
    letterSpacing: '.03rem',
    width: WIDTH,
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
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#171717',
  },
});

export default function App() {
  return <MyStack />;
}
