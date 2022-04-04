import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Linking,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { BottomSheet, Button, ListItem, Icon } from 'react-native-elements';
import Constants from 'expo-constants';
import { createStackNavigator } from '@react-navigation/stack';
import { AppLoading } from 'expo';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { PermanentMarker_400Regular } from '@expo-google-fonts/permanent-marker';
import { useFonts, OpenSans_400Regular } from '@expo-google-fonts/dev';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  NavigationContainer,
  DefaultTheme,
  useRoute,
  useNavigation,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Entypo } from '@expo/vector-icons';

import GestureRecognizer from 'react-native-swipe-gestures';

import {
  Teko_300Light,
  Teko_400Regular,
  Teko_500Medium,
  Teko_600SemiBold,
  Teko_700Bold,
} from '@expo-google-fonts/teko';

import { Ionicons } from '@expo/vector-icons';

import {
  faCheckSquare,
  faCoffee,
  faBars,
} from '@fortawesome/fontawesome-free-solid';

import { FontAwesome } from '@expo/vector-icons';

function Chat({ navigation }) {
  let [fontsLoaded, error] = useFonts({
    PermanentMarker_400Regular,
    Teko_700Bold,
  });

  const route = useRoute();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [messageTime, setMessageTime] = useState('');
  const [id, setID] = useState();

  async function newMessageTime() {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec',
    ];

    var Getdate = new Date();

    var time = Getdate.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

    var month = monthNames[Getdate.getMonth()];

    var date = ' ' + Getdate.getDate() + ' ';

    let timeStamp = month + date + time
    setMessageTime(timeStamp)
    let timePeriod = await AsyncStorage.setItem('timestamp', JSON.stringify('timeStamp'))
    let whenThisHappen = JSON.parse(await AsyncStorage.getItem('timestamp'))
    console.log(whenThisHappen)

    
  }

  async function newConversationMessage() {
    let USER_TOKEN = await AsyncStorage.getItem('fariToken');
    let TOKEN = JSON.parse(USER_TOKEN);
    console.log(newMessage, messageTime)

    const conversationid = JSON.parse(
      await AsyncStorage.getItem('conversationID')
    );
    const senderid = JSON.parse(await AsyncStorage.getItem('userID'));
    const sendername = JSON.parse(await AsyncStorage.getItem('userName'));
    const receiverid = route.params.receiverID
    const receivername = route.params.receiverName
    const chat_message = newMessage;
    const messagedate = messageTime;

    const newMessageResponse = {
      conversationid: conversationid,
      senderid: senderid,
      sendername: sendername,
      receiverid: receiverid,
      receivername: receivername,
      chat_message: chat_message,
      message_date: messagedate,
    };

    console.log(newMessageResponse)
    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/chat/new-conversation-message`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify(newMessageResponse),
        }
      );
      const data = await response.json();
      // newMessageEmailNotification();
      setNewMessage('')
      return data.conversation;
    } catch (error) {
      console.log(
        'Oops Something Went Wrong! Could not create new message.',
        error
      );
    }
  }

  useEffect(() => {
    async function isMe() {
      const myId = await AsyncStorage.getItem('userID');
      setID(myId);
    }

    async function conversationMessages() {
      let conversationid = route.params.chatID;
      let USER_TOKEN = await AsyncStorage.getItem('fariToken');
      let TOKEN = JSON.parse(USER_TOKEN);
      try {
        const response = await fetch(
          `https://fari-testapi.herokuapp.com/api/chat/myconversations/messages/${conversationid}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );
        const data = await response.json();
        setMessages(data.conversation);
        return data.conversation;
      } catch (error) {
        console.log(
          'Oops Something Went Wrong! Could not get conversation messages.',
          error
        );
      }
    }

    isMe().then(conversationMessages);
  }, [messages, route]);


  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View
          style={{
            backgroundColor: '#171717',
            width: '100%',
            height: '100%',
            padding: 10,
          }}>
          <ScrollView
          ref={ref => (this.scrollRef = ref)}
    onContentSizeChange={() => {
    this.scrollRef.scrollToEnd();
    }}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: 80,
                marginBottom: 60,
              }}>
              {messages && messages.length > 0 ? (
                messages.map((conversation) => {
                  return conversation.senderid == id ? (
                    <View style={styles.myMessages}>
                      <Text
                        className="message-text"
                        style={styles.myMessageText}>
                        {conversation.chat_message}
                      </Text>
                      <Text
                        className="message-time"
                        style={{
                          color: '#a9a9b0',
                          fontSize: 12,
                          fontFamily: 'Teko_700Bold',
                        }}>
                        {conversation.message_date}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.otherMessages}>
                      <Text
                        className="message-text"
                        style={styles.otherMessageText}>
                        {conversation.chat_message}
                      </Text>
                      <Text
                        className="message-time"
                        style={{
                          color: '#a9a9b0',
                          fontSize: 12,
                          fontFamily: 'Teko_700Bold',
                        }}>
                        {conversation.message_date}
                      </Text>
                    </View>
                  );
                })
              ) : (
                <Text style={styles.message}>Start Conversation</Text>
              )}
            </View>
          </ScrollView>
          <View
            style={{
              margin: 10,
              padding: 10,
              position: 'absolute',
              bottom: 0,
              width: '100%',
              height: 70,
              display: 'flex',
              flexDirection: 'row',
              backgroundColor: '#171717',
              borderRadius: 10
            }}>
            <TextInput
              placeholder="Message"
              style={{
                height: 45,
                width: 325,
                fontSize: 18,
                padding: 10,
                backgroundColor: '#ececec',
                borderRadius: 30,
                color: '#171717',
                fontFamily: 'Teko_700Bold',
              }}
              value={newMessage}
              onChangeText={(newMessage) => setNewMessage(newMessage)}
            />
            <Pressable
              onPress={() => {
                newMessageTime().then(newConversationMessage);
              }}
              style={{
                margin: 5,
                marginTop: 10,
              }}>
              <MaterialCommunityIcons name="send" size={30} color="white" />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  myMessages: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: 5,
  },

  myMessageText: {
    color: '#fdfbf9',
    backgroundColor: '#0c1559',
    fontSize: 18,
    borderRadius: 10,
    fontFamily: 'Teko_700Bold',
    padding: 5,

  },
  otherMessages: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  otherMessageText: {
    color: '#fdfbf9',
    backgroundColor: 'black',
    opacity: '.8',
    fontSize: 18,
    borderRadius: 10,
    fontFamily: 'Teko_700Bold',
    padding: 5,
  },

  message: {
    fontSize: 21,
    textAlign: 'center',
    margin: '1rem auto',
    marginTop: 250,
    color: '#a9a9b0',
    fontFamily: 'Teko_700Bold',
  },
});

export default Chat;
