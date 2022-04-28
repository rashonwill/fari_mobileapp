import React, { useState, useEffect } from 'react';
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
  Keyboard,
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { BottomSheet, Button, ListItem, Icon } from 'react-native-elements';
import Constants from 'expo-constants';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  NavigationContainer,
  DefaultTheme,
  useRoute,
  useNavigation,
} from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import GestureRecognizer from 'react-native-swipe-gestures';

import { AppLoading } from 'expo';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFonts, OpenSans_400Regular } from '@expo-google-fonts/dev';

import { Video, Audio, AVPlaybackStatus } from 'expo-av';

import { FontAwesome } from '@expo/vector-icons';

import {
  Teko_300Light,
  Teko_400Regular,
  Teko_500Medium,
  Teko_600SemiBold,
  Teko_700Bold,
} from '@expo-google-fonts/teko';

function Comments() {
  const video = React.useRef(null);
  const route = useRoute();
  const [height, setHeight] = useState(45);
  const [updatecomRemark, setUpdatedRemark] = useState('');
  const [newcomment, setNewComment] = useState('');
  const [vidcomments, setVidComments] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [user, setUser] = useState();
  const [isEditing, setIsEditing] = useState(false);

  async function reduceCommentCount() {
    let id = JSON.parse(await AsyncStorage.getItem('videoID'));
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));

    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/content/reducecommentcount/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.log('Ooops, could not reduce that video comment count!', error);
    }
  }

  async function deleteComment() {
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));
    let id = JSON.parse(await AsyncStorage.getItem('commentID'));
    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/content/comment/delete/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      reduceCommentCount();
      setIsVisible(false);
      videoComments();
    } catch (error) {
      console.log('Ooops, could not delete that comment!', error);
    }
  }

  async function editComment() {
    let id = JSON.parse(await AsyncStorage.getItem('commentID'));
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));
    try {
      const updateRemark = {
        user_comment: newcomment,
      };

      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/content/comment/edit/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify(updateRemark),
        }
      );
      const data = await response.json();
      setIsEditing(false);
      setNewComment('');
      videoComments();
      return data;
    } catch (error) {
      console.log('Ooops, could not edit that comment!', error);
    }
  }

  async function editing(val) {
    let editingRemark = JSON.parse(await AsyncStorage.getItem('userComment'));
    setNewComment(editingRemark);
    setIsVisible(false);
    setIsEditing(true);
  }

  async function newComment() {
    let comRemark = newcomment;
    var username = JSON.parse(await AsyncStorage.getItem('userName'));
    var userid = JSON.parse(await AsyncStorage.getItem('userID'));
    var userPic = JSON.parse(await AsyncStorage.getItem('userAvi'));
    var postId = JSON.parse(await AsyncStorage.getItem('videoID'));
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));

    const userRemark = {
      videoid: postId,
      commentorid: userid,
      commentorname: username,
      commentorpic: userPic,
      user_comment: newcomment,
    };
    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/content/comment/new`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify(userRemark),
        }
      );
      const data = await response.json();
      setNewComment('');
      setIsVisible(false);
      videoComments();
      return data.comment;
    } catch (error) {
      console.error('Oops could not create comment', error);
    }
  }

  function neverMind() {
    setIsVisible(false);
    setIsEditing(false);
  }

  const list = [
    {
      title: 'Edit Comment',
      containerStyle: { backgroundColor: '#0C1559' },
      titleStyle: { color: '#FDFBF9', fontFamily: 'Teko_700Bold' },
      onPress: editing,
    },
    {
      title: 'Delete Comment',
      containerStyle: { backgroundColor: '#0C1559' },
      titleStyle: { color: '#FDFBF9', fontFamily: 'Teko_700Bold' },
      onPress: deleteComment,
    },
    {
      title: 'Cancel',
      containerStyle: { backgroundColor: '#0C1559' },
      titleStyle: { color: '#FDFBF9', fontFamily: 'Teko_700Bold' },
      onPress: neverMind,
    },
  ];

  async function setUserID() {
    let userIn = JSON.parse(await AsyncStorage.getItem('userID'));
    if (userIn) {
      setUser(userIn);
    }
  }
  async function videoComments() {
    let videoid = route.params.videoid;
    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/content/comments/${videoid}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      setVidComments(data.comments);
      return data.comments;
    } catch (error) {
      console.error('Oops could not get that video comments', error);
    }
  }

  useEffect(() => {
    setUserID().then(videoComments);
  },);

  return (
    <>
      <View
        style={{
          width: '100%',
          height: 100,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'black',
        }}>
        {isEditing ? (
          <>
            <TextInput
              style={styles.input}
              multiline={true}
              placeholder="Edit comment"
              placeholderTextColor="#a9a9b0"
              keyboardAppearance="dark"
              returnKeyType="send"
              value={newcomment}
              onChangeText={(value) => setNewComment(value)}
              onSubmitEditing={() => {
                editComment(), Keyboard.dismiss();
              }}
            />
            <Pressable
              onPress={() => {
                editComment(), Keyboard.dismiss();
              }}
              style={{
                width: '20%',
                height: 40,
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                position: 'absolute',
                right: 0,
                bottom: 0,
                marginRight: 10,
              }}>
              <Text
                style={{
                  color: '#fdfbf9',
                  fontFamily: 'Teko_700Bold',
                  fontSize: 18,
                }}>
                UPDATE
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              multiline={true}
              placeholder="Add a comment"
              placeholderTextColor="#a9a9b0"
              keyboardAppearance="dark"
              returnKeyType="send"
              value={newcomment}
              onChangeText={(value) => setNewComment(value)}
              onSubmitEditing={() => {
                newComment(), Keyboard.dismiss();
              }}
            />
            <Pressable
              onPress={() => {
                newComment(), Keyboard.dismiss();
              }}
              style={{
                width: '20%',
                height: 40,
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                position: 'absolute',
                right: 0,
                bottom: 0,
                marginRight: 10,
              }}>
              <Text
                style={{
                  color: '#fdfbf9',
                  fontFamily: 'Teko_700Bold',
                  fontSize: 18,
                }}>
                SEND
              </Text>
            </Pressable>
          </>
        )}
      </View>

      <View style={styles.commentsSection}>
        <ScrollView>
          {vidcomments && vidcomments.length == 0 && (
            <Text style={styles.message}>No comment(s)</Text>
          )}
          {vidcomments && vidcomments.length > 0
            ? vidcomments.map((comments) => {
                return comments.commentorid == user ? (
                  <View style={styles.commentCard}>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                      }}>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          width: 340,
                        }}>
                        <Image
                          source={{
                            uri: comments.commentorpic ? comments.commentorpic : 'https://drotje36jteo8.cloudfront.net/noAvi.png'
                          }}
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                          }}
                        />
                        <Text
                          style={{
                            fontSize: '16px',
                            color: '#a9a9b0',
                            fontFamily: 'Teko_700Bold',
                            letterSpacing: '0.01rem',
                            marginTop: 15,
                            margin: 5,
                            opacity: 1,
                          }}>
                          {comments.commentorname}
                        </Text>
                      </View>
                      <View className="edits" style={styles.edits}>
                        <Pressable
                          style={styles.editOptions}
                          onPress={() => {
                            AsyncStorage.setItem(
                              'commentID',
                              JSON.stringify(comments.commentid)
                            ),
                              AsyncStorage.setItem(
                                'userComment',
                                JSON.stringify(comments.user_comment)
                              );
                            setIsVisible(true);
                          }}>
                          <FontAwesome
                            name="ellipsis-v"
                            size={24}
                            color="#fdfbf9"
                            style={styles.editsBtn}
                          />
                        </Pressable>
                      </View>
                    </View>
                    <Text
                      numberOfLines={5}
                      ellipsizeMode="tail"
                      style={{
                        fontSize: '18px',
                        color: '#a9a9b0',
                        fontFamily: 'Teko_700Bold',
                        letterSpacing: '0.01rem',
                        opacity: 1,
                        marginTop: 10,
                      }}>
                      {comments.user_comment}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.commentCard}>
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                      <Image
                        source={{
                          uri: comments.commentorpic,
                        }}
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                        }}
                      />
                      <Text
                        style={{
                          fontSize: '16px',
                          color: '#a9a9b0',
                          fontFamily: 'Teko_700Bold',
                          letterSpacing: '0.01rem',
                          marginTop: 15,
                          margin: 5,
                          opacity: 1,
                        }}>
                        {' '}
                        {comments.commentorname}
                      </Text>
                    </View>
                    <Text
                      numberOfLines={10}
                      style={{
                        fontSize: '18px',
                        color: '#a9a9b0',
                        fontFamily: 'Teko_700Bold',
                        letterSpacing: '0.01rem',
                        opacity: 1,
                        marginTop: 10,
                      }}>
                      {comments.user_comment}
                    </Text>
                  </View>
                );
              })
            : null}
        </ScrollView>
      </View>

      <BottomSheet
        isVisible={isVisible}
        containerStyle={{ backgroundColor: 'transparent' }}>
        {list.map((l, i) => (
          <ListItem
            key={i}
            containerStyle={l.containerStyle}
            onPress={l.onPress}>
            <ListItem.Content>
              <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  mainEvent: {
    backgroundColor: '#171717',
    height: '100%',
    width: '100%',
  },

  featureInfo: {
    backgroundColor: '#0c1559',
    width: '100%',
    minHeight: 375,
    fontSize: '20px',
    padding: 5,
    flex: 1,
    borderBottomColor: '#fdfbf9',
    borderWidth: 1,
  },

  commentsSection: {
    backgroundColor: '#171717',
    width: '100%',
    height: 350,
    fontSize: '20px',
    padding: 5,
    flex: 1,
  },

  recommendedSection: {
    backgroundColor: '#171717',
    width: '100%',
    height: 350,
    fontSize: '20px',
    padding: 5,
    flex: 1,
  },

  theaterModeOptions2: {
    display: 'flex',
    flexDirection: 'row',
    margin: 10,
    marginBottom: -5,
    marginLeft: -5,
  },

  channelInfo: {
    display: 'flex',
    flexDirection: 'row',
  },

  commentCard: {
    width: '100%',
    minHeight: 130,
    maxHeight: 200,
    backgroundColor: 'black',
    opacity: '.7',
    zIndex: 10,
    borderRadius: 10,
    padding: 5,
    marginBottom: 10,
  },

  recommendCard: {
    width: '100%',
    minHeight: 100,
    backgroundColor: 'black',
    opacity: '.7',
    zIndex: 10,
    borderRadius: 10,
    padding: 5,
    marginBottom: 10,
  },

  videoRecommended: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },

  videoView: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },

  play: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    background: 'transparent',
    width: '30px',
    height: '30px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '60px',
    color: '#001399',
    textAlign: 'center',
  },

  controls: {
    position: 'relative',
    bottom: 0,
    top: -80,
    left: -20,
    width: 140,
    height: 150,
    padding: 5,
    borderRadius: '10px',
  },

  video2: {
    width: '100%',
    height: '100%',
  },

  feature: {
    width: '100%',
    height: 250,
    padding: 2,
  },

  interactiveIcons: {
    display: 'flex',
    flexDirection: 'row',
    margin: 5,
  },
  message: {
    fontSize: 21,
    textAlign: 'center',
    margin: '1rem auto',
    marginTop: 50,
    color: '#a9a9b0',
    fontFamily: 'Teko_700Bold',
  },

  input: {
    outline: 'none',
    width: '98%',
    minheight: 45,
    maxHeight: 250,
    color: '#fdfbf9',
    fontSize: 18,
    borderRadius: 10,
    margin: 5,
    marginTop: 15,
    padding: 5,
    fontFamily: 'Teko_700Bold',
    backgroundColor: 'transparent',
    borderBottomColor: '#a9a9b0',
    borderBottomWidth: 1,
    borderWidth: 0,
    letteSpacing: '0.02rem',
    caretColor: '#0c1559',
  },

  edits: {
    width: 40,
    height: 50,
    position: 'relative',
    right: 0,
    top: 0,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 5,
  },

  editsBtn: {
    width: '40px',
    position: 'relative',
  },

  editOptions: {
    zIndex: 15,
    width: '100%',
    height: '100%',
    padding: 10,
  },
});

export default React.memo(Comments);
