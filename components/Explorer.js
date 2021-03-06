import * as React from 'react';
import { useState, useEffect } from 'react';
import { Searchbar } from 'react-native-paper';
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
  RefreshControl,
  SafeAreaProvider,
  Dimensions,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { BottomSheet, Button, ListItem } from 'react-native-elements';
import {
  NavigationContainer,
  DefaultTheme,
  Link,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import axios from 'axios';

import { Video } from 'expo-av';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Teko_300Light,
  Teko_400Regular,
  Teko_500Medium,
  Teko_600SemiBold,
  Teko_700Bold,
} from '@expo-google-fonts/teko';

import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Entypo } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

import { MaterialIcons } from '@expo/vector-icons';

import { SimpleLineIcons } from '@expo/vector-icons';

import { Feather as Icon } from '@expo/vector-icons';

import { AppLoading } from 'expo';

import Theater from './Theater';
import Untitled from './Untitled';
import { viewsConversion } from './Conversion'
import GestureRecognizer from 'react-native-swipe-gestures';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const WIDTH2 = Dimensions.get("window").width/3-150;

function Discover({ navigation }) {
  const [isVisible, setIsVisible] = useState(false);

  async function getVideoData() {
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));
    let id = JSON.parse(await AsyncStorage.getItem('videoID'));
    console.log(id);
    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/content/getVideo/${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      const data = await response.json();
      return data.uploads;
    } catch (error) {
      console.log('Ooops, could not get that video!', error);
    }
  }

  const getUser = async () => {
    const loggedInUser = await AsyncStorage.getItem('fariToken');
    if (!loggedInUser) {
      Alert.alert('Sign in to add videos to your watchlist');
    }
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  };

  async function laterVideo() {
    var user = JSON.parse(await AsyncStorage.getItem('userID'));
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));
    var getFeature = await getVideoData();

    var userListed = user;
    var vidID = getFeature[0].videoid;
    var channelname = getFeature[0].channel_name;
    var channel_avi = getFeature[0].channelpic;
    var video = getFeature[0].videofile;
    var posFile = getFeature[0].videothumbnail;
    var vidTitle = getFeature[0].videotitle;
    var channelID = getFeature[0].channelid;
    var views = getFeature[0].videoviewcount;

    const laterBody = {
      userListed: userListed,
      videoid: vidID,
      channel: channelname,
      channel_avi: channel_avi,
      video: video,
      thumbnail: posFile,
      title: vidTitle,
      channelid: channelID,
      videoviewcount: views,
      paidtoview: false,
    };

    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/content/watchlist`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify(laterBody),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('Oops could not add to watchlist', error);
    }
  }

  function addToWatchlist() {
    getUser().then(getVideoData).then(laterVideo);
    setIsVisible(false);
    Alert.alert('Added to watchlist');
  }

  const list = [
    {
      title: 'Add to Watchlist',
      containerStyle: { backgroundColor: '#0C1559' },
      titleStyle: { color: '#FDFBF9', fontFamily: 'Teko_700Bold' },
      onPress: addToWatchlist,
    },
    {
      title: 'Cancel',
      containerStyle: { backgroundColor: '#0C1559' },
      titleStyle: { color: '#FDFBF9', fontFamily: 'Teko_700Bold' },
      onPress: () => setIsVisible(false),
    },
  ];
  const video = React.useRef(null);

  const [user, setUser] = useState();
  const [freeMedia, setFreeMedia] = useState();

  const [theater, setTheater] = useState(false);
  const [info, setInfo] = useState(true);
  const [comments, setComments] = useState(false);
  const [recommended, setRecommended] = useState(false);
  const [videoid, setVideoid] = useState();

  const [searchQuery, setSearchQuery] = useState('');

  async function playVideo() {
    await AsyncStorage.setItem('videoID', videoid);
    let playMe = await AsyncStorage.getItem('videoID');
  }

  useEffect(() => {
    const fetchFreeContent = async () => {
      const response = await fetch(
        'https://fari-testapi.herokuapp.com/api/content/free'
      );
      let data = await response.json();
      setFreeMedia(data.uploads); 
      return data.uploads;
    }

    
    fetchFreeContent()
  },[]);



  return (
    <>
    <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <ScrollView showsHorizontalScrollIndicator={false} centerContent={true} >
          {freeMedia && freeMedia.length > 0
            ? freeMedia.map((uploads) => {
                return (
                  <View style={styles.movieCard}>
                    <Video
                      style={styles.video}
                      ref={video}
                      source={{
                        uri: uploads.videofile,
                      }}
                      posterSource={{
                        uri: uploads.videothumbnail,
                      }}
                      resizeMode={'cover'}
                      usePoster
                      posterStyle={{ width: '100%', height: '100%' }}
                      isMuted></Video>
                    <View className="controls" style={styles.controls}>
                      <View className="controls-two" style={styles.controlsTwo}>
                        <View className="channel" style={styles.channel}>
                        <Pressable style={{width: 65, height: 65, borderRadius: '50%'}} 
                        onPress={() => {AsyncStorage.setItem(
                                  'userChannelID',
                                  JSON.stringify(uploads.channelid)
                                ), 
                                navigation.navigate('Untitled')}}>
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
                                uri: uploads.channelpic ? uploads.channelpic : 'https://drotje36jteo8.cloudfront.net/noAvi.png'
                              }}
                              style={{
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                                zIndex: 20,
                              }}
                            />
                          </View>
                            </Pressable>
                          <View
                            style={{
                              width: '90%',
                              display: 'flex',
                              flexDirection: 'column',
                              marginRight: 15,
                            }}>
                            <Pressable
                              style={{ width: '100%', height: 30}}
                              onPress={() => {
                                AsyncStorage.setItem(
                                  'userChannelID',
                                  JSON.stringify(uploads.channelid)
                                ),
                                navigation.navigate('Untitled')
                              }}>
                              <Text style={styles.viewName}>
                                {uploads.channel_name}
                              </Text>
                            </Pressable>
                            <Text style={styles.viewText}>
                              Views: {`${viewsConversion(uploads.videoviewcount)}`}
                            </Text>
                          </View>

                          <View className="edits" style={styles.edits}>
                            <Pressable
                              style={styles.editOptions}
                              onPress={() => {
                                AsyncStorage.setItem(
                                  'videoID',
                                  JSON.stringify(uploads.videoid)
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
                      </View>
                      <Pressable
                        onPress={() => {
                          AsyncStorage.setItem(
                            'videoID',
                            JSON.stringify(uploads.videoid)
                          ),
                            navigation.navigate('Theater', {
                              videoid: uploads.videoid,
                              videotitle: uploads.videotitle,
                              videodescription: uploads.videodescription,
                              videofile: uploads.videofile,
                              videothumbnail: uploads.videothumbnail,
                              videocreator: uploads.channel_name,
                              creatoravatar: uploads.channelpic,
                              videoviewcount: uploads.videoviewcount,
                              videolikecount: uploads.videolikecount,
                              videodislikecount: uploads.videodislikecount,
                              channelid: uploads.channelid,
                            });
                        }}
                        style={styles.buttonOpen}>
                        <FontAwesome
                          name="play"
                          size={24}
                          color="#001399"
                          style={styles.play}
                        />
                      </Pressable>

                      <View className="movie-info" style={{width: '100%'}}>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={styles.cardTextTitle}>
                          {uploads.videotitle}
                        </Text>
                      </View>
                    </View>
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

function PaidContent({ navigation }) {
  const video = React.useRef(null);
  const [user, setUser] = useState();
  const [paidMedia, setPaidMedia] = useState();

  useEffect(() => {
    const fetchPaidContent = async () => {
      const response = await fetch(
        'https://fari-testapi.herokuapp.com/api/content/paytoview'
      );
      let data = await response.json();
      setPaidMedia(data.uploads);
      return data.uploads;
    };

    fetchPaidContent();
  }, []);

  return (
    <>
    <StatusBar barStyle="light-content" />
    <View style={styles.container}>
      <ScrollView>
        {paidMedia && paidMedia.length > 0
          ? paidMedia.map((uploads) => {
              return (
                <View style={styles.movieCard}>
                  <Video
                    style={styles.video}
                    ref={video}
                    source={{ uri: uploads.videofile }}
                    posterSource={{
                      uri: uploads.videothumbnail,
                    }}
                    resizeMode={'cover'}
                    usePoster
                    posterStyle={{ width: '100%', height: '100%' }}
                    isMuted></Video>
                  <View className="controls" style={styles.controls}>
                    <View className="controls-two" style={styles.controlsTwo}>
                      <View className="channel" style={styles.channel}>
                            <Pressable 
                        onPress={() => {
                          AsyncStorage.setItem(
                                  'userChannelID',
                                  JSON.stringify(uploads.channelid)
                                ), 
                                navigation.navigate('Untitled')
                                }} style={{width: 65, height: 65, borderRadius: '50%'}}>
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
                              uri: uploads.channelpic ? uploads.channelpic : 'https://drotje36jteo8.cloudfront.net/noAvi.png'
                            }}
                            style={{
                              width: 60,
                              height: 60,
                              borderRadius: '50%',
                              zIndex: 20,
                            }}
                          />
                        </View>
                        </Pressable>
                        <View
                          style={{
                            width: '90%',
                            display: 'flex',
                            flexDirection: 'column',
                            marginRight: 15,
                          }}>
                              <Pressable
                              style={{ width: '100%', height: 30}}
                              onPress={() => {
                                AsyncStorage.setItem(
                                  'userChannelID',
                                  JSON.stringify(uploads.channelid)
                                ),
                                navigation.navigate('Untitled')
                              }}>
                            
                            <Text style={styles.viewName}>
                              {uploads.channel_name}
                            </Text>
                          </Pressable>
                          <Text style={styles.viewText}>
                            Views: {`${viewsConversion(uploads.videoviewcount)}`}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.purchase}>
                      <Button
                        title="Purchase Ticket"
                        buttonStyle={styles.btn}
                        key={uploads.videoid}></Button>
                    </View>
                    <View className="movie-info" style={{width: '100%'}}>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={styles.cardTextTitle}>
                        {uploads.videotitle}
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

function Subscriptions({ navigation }) {
  const video = React.useRef(null);
  const [user, setUser] = useState();
  const [subscriptions, setSubscriptions] = useState();
  const [isVisible, setIsVisible] = useState(false);

  async function getVideoData() {
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));
    let id = JSON.parse(await AsyncStorage.getItem('videoID'));
    console.log(id);
    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/content/getVideo/${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      const data = await response.json();
      return data.uploads;
    } catch (error) {
      console.log('Ooops, could not get that video!', error);
    }
  }

  const getUser = async () => {
    const loggedInUser = await AsyncStorage.getItem('fariToken');
    if (!loggedInUser) {
      Alert.alert('Sign in to add videos to your watchlist');
    }
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  };

  async function laterVideo() {
    var user = JSON.parse(await AsyncStorage.getItem('userID'));
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));
    var getFeature = await getVideoData();

    var userListed = user;
    var vidID = getFeature[0].videoid;
    var channelname = getFeature[0].channel_name;
    var channel_avi = getFeature[0].channelpic;
    var video = getFeature[0].videofile;
    var posFile = getFeature[0].videothumbnail;
    var vidTitle = getFeature[0].videotitle;
    var channelID = getFeature[0].channelid;
    var views = getFeature[0].videoviewcount;

    const laterBody = {
      userListed: userListed,
      videoid: vidID,
      channel: channelname,
      channel_avi: channel_avi,
      video: video,
      thumbnail: posFile,
      title: vidTitle,
      channelid: channelID,
      videoviewcount: views,
      paidtoview: false,
    };

    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/content/watchlist`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify(laterBody),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('Oops could not add to watchlist', error);
    }
  }

  function addToWatchlist() {
    getUser().then(getVideoData).then(laterVideo);
    setIsVisible(false);
    Alert.alert('Added to watchlist');
  }

  const list = [
    {
      title: 'Add to Watchlist',
      containerStyle: { backgroundColor: '#0C1559' },
      titleStyle: { color: '#FDFBF9', fontFamily: 'Teko_700Bold' },
      onPress: addToWatchlist,
    },
    {
      title: 'Cancel',
      containerStyle: { backgroundColor: '#0C1559' },
      titleStyle: { color: '#FDFBF9', fontFamily: 'Teko_700Bold' },
      onPress: () => setIsVisible(false),
    },
  ];

  useEffect(() => {
    const getUser = async () => {
      const loggedInUser = await AsyncStorage.getItem('fariToken');
      if (!loggedInUser) {
        Alert.alert('Sign in to view your subscriptions');
      }
      if (loggedInUser) {
        setUser(JSON.parse(loggedInUser));
      }
    };

    const fetchSubUploads = async () => {
      let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'))
      let userID = JSON.parse(await AsyncStorage.getItem('userID'))
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/content/subs/uploads/${userID}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      let data = await response.json();
      setSubscriptions(data.subscriptionUploads);
      return data.subscriptionUploads;
    };

    getUser().then(fetchSubUploads);
  }, []);

  return (
    <>
    <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <ScrollView>
          {subscriptions && subscriptions.length === 0 && (
            <Text style={styles.message}>
              You do not have any Subscriptions yet.
            </Text>
          )}
          {subscriptions && subscriptions.length > 0 ? (
            subscriptions.map((subscriptionUploads) => {
              return subscriptionUploads.paid_content === 'pay' &&
                subscriptionUploads.content_type === 'film' ? (
                <View style={styles.movieCard}>
                  <Video
                    style={styles.video}
                    ref={video}
                    source={{ uri: subscriptionUploads.videofile }}
                    posterSource={{
                      uri: subscriptionUploads.videothumbnail,
                    }}
                    resizeMode={'cover'}
                    usePoster
                    posterStyle={{ width: '100%', height: '100%' }}
                    isMuted></Video>
                  <View className="controls" style={styles.controls}>
                    <View className="controls-two" style={styles.controlsTwo}>
                      <View className="channel" style={styles.channel}>
                      <Pressable style={{width: 65, height: 65, borderRadius: '50%'}} 
                        onPress={() => {AsyncStorage.setItem(
                                  'userChannelID',
                                  JSON.stringify(subscriptionUploads.channelid)
                                ), 
                                navigation.navigate('Untitled')                                
                                }}>
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
                              uri: subscriptionUploads.channel_avi ? subscriptionUploads.channel_avi : 'https://drotje36jteo8.cloudfront.net/noAvi.png'
                            }}
                            style={{
                              width: 60,
                              height: 60,
                              borderRadius: '50%',
                              zIndex: 20,
                            }}
                          />
                        </View>
                        </Pressable>
                        <View
                          style={{
                            width: '90%',
                            display: 'flex',
                            flexDirection: 'column',
                            marginRight: 15,
                          }}>
                            <Pressable
                              style={{ width: '100%', height: 30}}
                              onPress={() => {
                                AsyncStorage.setItem(
                                  'userChannelID',
                                  JSON.stringify(subscriptionUploads.channelid)
                                ),
                                navigation.navigate('Untitled')
                              }}>
                            <Text style={styles.viewName}>
                              {subscriptionUploads.channel}
                            </Text>
                          </Pressable>
                          <Text style={styles.viewText}>
                            Views: {`${viewsConversion(subscriptionUploads.videoviewcount)}`}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.purchase}>
                      <Button
                        title="Purchase Ticket"
                        buttonStyle={styles.btn}
                        key={subscriptionUploads.videoid}></Button>
                    </View>
                    <View className="movie-info" style={{width: '100%'}}>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={styles.cardTextTitle}>
                        {subscriptionUploads.videotitle}
                      </Text>
                    </View>
                  </View>
                </View>
              ) : (
                <View style={styles.movieCard}>
                  <Video
                    style={styles.video}
                    ref={video}
                    source={{
                      uri: subscriptionUploads.videofile,
                    }}
                    posterSource={{
                      uri: subscriptionUploads.videothumbnail,
                    }}
                    resizeMode={'cover'}
                    usePoster
                    posterStyle={{ width: '100%', height: '100%' }}
                    isMuted></Video>
                  <View className="controls" style={styles.controls}>
                    <View className="controls-two" style={styles.controlsTwo}>
                      <View className="channel" style={styles.channel}>
                       <Pressable style={{width: 65, height: 65, borderRadius: '50%'}} 
                        onPress={() => {AsyncStorage.setItem(
                                  'userChannelID',
                                  JSON.stringify(subscriptionUploads.channelid)
                                ), 
                                navigation.navigate('Untitled')                                
                                }}>
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
                              uri: subscriptionUploads.channel_avi,
                            }}
                            style={{
                              width: 60,
                              height: 60,
                              borderRadius: '50%',
                              zIndex: 20,
                            }}
                          />
                        </View>
                        </Pressable>
                        <View
                          style={{
                            width: '90%',
                            display: 'flex',
                            flexDirection: 'column',
                            marginRight: 15,
                          }}>
                          <Pressable
                              style={{ width: '100%', height: 30}}
                              onPress={() => {
                                AsyncStorage.setItem(
                                  'userChannelID',
                                  JSON.stringify(subscriptionUploads.channelid)
                                ),
                                navigation.navigate('Untitled')
                              }}>
                            <Text style={styles.viewName}>
                              {subscriptionUploads.channel}
                            </Text>
                          </Pressable>
                          <Text style={styles.viewText}>
                            Views: {`${viewsConversion(subscriptionUploads.videoviewcount)}`}
                          </Text>
                        </View>

                        <View className="edits" style={styles.edits}>
                          <Pressable
                            style={styles.editOptions}
                            onPress={() => {
                              AsyncStorage.setItem(
                                'videoID',
                                JSON.stringify(subscriptionUploads.videoid)
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
                    </View>
                    <Pressable
                      onPress={() => {
                        AsyncStorage.setItem(
                          'videoID',
                          JSON.stringify(subscriptionUploads.videoid)
                        ),
                          navigation.navigate('Theater', {
                            videoid: subscriptionUploads.videoid,
                            videotitle: subscriptionUploads.videotitle,
                            videodescription:
                              subscriptionUploads.videodescription,
                            videofile: subscriptionUploads.videofile,
                            videothumbnail: subscriptionUploads.videothumbnail,
                            videocreator: subscriptionUploads.channel,
                            creatoravatar: subscriptionUploads.channel_avi,
                            videoviewcount: subscriptionUploads.videoviewcount,
                            videolikecount: subscriptionUploads.videolikecount,
                            videodislikecount:
                              subscriptionUploads.videodislikecount,
                            channelid: subscriptionUploads.channelid,
                          });
                      }}
                      style={styles.buttonOpen}>
                      <FontAwesome
                        name="play"
                        size={24}
                        color="#001399"
                        style={styles.play}
                      />
                    </Pressable>

                    <View className="movie-info" style={{width: '100%'}}>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={styles.cardTextTitle}>
                        {subscriptionUploads.videotitle}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          ) : (
            <Text style={styles.message}>
              {' '}
              You do not have any Subscriptions yet.
            </Text>
          )}
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

function Favorites({ navigation }) {
  const video = React.useRef(null);
  const [user, setUser] = useState();
  const [favorites, setFavorites] = useState();
  const [isVisible, setIsVisible] = useState(false);

  async function deleteFav() {
    let userFaved = JSON.parse(await AsyncStorage.getItem('userID'));
    let videoid = JSON.parse(await AsyncStorage.getItem('videoID'));
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));

    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/content/delete/favs/${userFaved}/${videoid}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      const data = await response.json();
      fetchFavorites();
      return data;
    } catch (error) {
      console.log('Oops could not delete fav', error);
    }
  }

  function removeFromFavs() {
    deleteFav();
    setIsVisible(false);
    Alert.alert('Removed from Favorites');
  }

  const list = [
    {
      title: 'Remove from Favorites',
      containerStyle: { backgroundColor: '#0C1559' },
      titleStyle: { color: '#FDFBF9', fontFamily: 'Teko_700Bold' },
      onPress: removeFromFavs,
    },
    {
      title: 'Cancel',
      containerStyle: { backgroundColor: '#0C1559' },
      titleStyle: { color: '#FDFBF9', fontFamily: 'Teko_700Bold' },
      onPress: () => setIsVisible(false),
    },
  ];

  const getUser = async () => {
    const loggedInUser = await AsyncStorage.getItem('fariToken');
    if (!loggedInUser) {
      Alert.alert('Sign in to view your favorites');
    }
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  };

  const fetchFavorites = async () => {
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));
    let userID = await AsyncStorage.getItem('userID');
    const response = await fetch(
      `https://fari-testapi.herokuapp.com/api/content/explorer/myfavs/${userID}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );
    let data = await response.json();
    setFavorites(data.myFavVids);
    return data.myFavVids;
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <>
    <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <ScrollView>
          {favorites && favorites.length === 0 && (
            <Text style={styles.message}>
              You do not have any favorites yet.
            </Text>
          )}
          {favorites && favorites.length > 0
            ? favorites.map((myFavVids) => {
                return (
                  <View style={styles.movieCard}>
                    <Video
                      style={styles.video}
                      ref={video}
                      source={{
                        uri: myFavVids.video,
                      }}
                      posterSource={{
                        uri: myFavVids.thumbnail,
                      }}
                      resizeMode={'cover'}
                      usePoster
                      posterStyle={{ width: '100%', height: '100%' }}
                      isMuted></Video>
                    <View className="controls" style={styles.controls}>
                      <View className="controls-two" style={styles.controlsTwo}>
                        <View className="channel" style={styles.channel}>
                        <Pressable style={{width: 65, height: 65, borderRadius: '50%'}} 
                        onPress={() => {AsyncStorage.setItem(
                                  'userChannelID',
                                  JSON.stringify(myFavVids.channelid)
                                ), 
                                navigation.navigate('Untitled')}}>
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
                                uri: myFavVids.channel_avi ? myFavVids.channel_avi : 'https://drotje36jteo8.cloudfront.net/noAvi.png'
                              }}
                              style={{
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                                zIndex: 20,
                              }}
                            />
                          </View>
                          </Pressable>
                          <View
                            style={{
                              width: '90%',
                              display: 'flex',
                              flexDirection: 'column',
                              marginRight: 15,
                            }}>
                            <Pressable
                              style={{ width: '100%', height: 30}}
                              onPress={() => {
                                AsyncStorage.setItem(
                                  'userChannelID',
                                  JSON.stringify(myFavVids.channelid)
                                ),
                                navigation.navigate('Untitled')
                              }}>
                              <Text style={styles.viewName}>
                                {myFavVids.channel}
                              </Text>
                            </Pressable>
                            <Text style={styles.viewText}>
                              Views: {`${viewsConversion(myFavVids.videoviewcount)}`}
                            </Text>
                          </View>

                          <View className="edits" style={styles.edits}>
                            <Pressable
                              style={styles.editOptions}
                              onPress={() => {
                                AsyncStorage.setItem(
                                  'videoID',
                                  JSON.stringify(myFavVids.videoid)
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
                      </View>
                      <Pressable
                        onPress={() => {
                          AsyncStorage.setItem(
                            'videoID',
                            JSON.stringify(myFavVids.videoid)
                          ),
                            navigation.navigate('Theater', {
                              videoid: myFavVids.videoid,
                              videotitle: myFavVids.title,
                              videodescription: myFavVids.description,
                              videofile: myFavVids.video,
                              videothumbnail: myFavVids.thumbnail,
                              videocreator: myFavVids.channel,
                              creatoravatar: myFavVids.channel_avi,
                              videoviewcount: myFavVids.videoviewcount,
                              videolikecount: myFavVids.videolikecount,
                              videodislikecount: myFavVids.videodislikecount,
                              channelid: myFavVids.channelid,
                            });
                        }}
                        style={styles.buttonOpen}>
                        <FontAwesome
                          name="play"
                          size={24}
                          color="#001399"
                          style={styles.play}
                        />
                      </Pressable>
                      <View className="movie-info" style={{width: '100%'}}>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={styles.cardTextTitle}>
                          {myFavVids.title}
                        </Text>
                      </View>
                    </View>
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

function Watchlist({ navigation }) {
  const video = React.useRef(null);
  const [user, setUser] = useState();
  const [watchlist, setWatchlist] = useState();
  const [isVisible, setIsVisible] = useState(false);

  async function deleteWatchLater() {
    let userListed = JSON.parse(await AsyncStorage.getItem('userID'));
    let videoid = JSON.parse(await AsyncStorage.getItem('videoID'));
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));
    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/content/delete/watchlater/${userListed}/${videoid}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      const data = await response.json();
      fetchWatchlist();
      return data;
    } catch (error) {
      console.log('Oops could not delete fav', error);
    }
  }

  function removeFromWatchlist() {
    deleteWatchLater();
    setIsVisible(false);
    Alert.alert('Removed from Watchlist');
  }

  const list = [
    {
      title: 'Remove from Watchlist',
      containerStyle: { backgroundColor: '#0C1559' },
      titleStyle: { color: '#FDFBF9', fontFamily: 'Teko_700Bold' },
      onPress: removeFromWatchlist,
    },
    {
      title: 'Cancel',
      containerStyle: { backgroundColor: '#0C1559' },
      titleStyle: { color: '#FDFBF9', fontFamily: 'Teko_700Bold' },
      onPress: () => setIsVisible(false),
    },
  ];

  const getUser = async () => {
    const loggedInUser = await AsyncStorage.getItem('fariToken');
    if (!loggedInUser) {
      Alert.alert('Sign in to view your watchlist');
    }
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  };

  const fetchWatchlist = async () => {
    let USER_TOKEN = await AsyncStorage.getItem('fariToken');
    let TOKEN = JSON.parse(USER_TOKEN);
    let userID = await AsyncStorage.getItem('userID');
    const response = await fetch(
      `https://fari-testapi.herokuapp.com/api/content/explorer/watchlater/${userID}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );
    let data = await response.json();
    setWatchlist(data.myWatchList);
    return data;
  };

  useEffect(() => {
    getUser().then(fetchWatchlist);
  }, []);
  return (
    <>
    <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <ScrollView>
          {watchlist && watchlist.length === 0 && (
            <Text style={styles.message}>
              You do not have any videos on your watchlist yet.
            </Text>
          )}
          {watchlist && watchlist.length > 0
            ? watchlist.map((myWatchList) => {
                return (
                  <View style={styles.movieCard}>
                    <Video
                      style={styles.video}
                      ref={video}
                      source={{
                        uri: myWatchList.video,
                      }}
                      posterSource={{
                        uri: myWatchList.thumbnail,
                      }}
                      resizeMode={'cover'}
                      usePoster
                      posterStyle={{ width: '100%', height: '100%' }}
                      isMuted></Video>
                    <View className="controls" style={styles.controls}>
                      <View className="controls-two" style={styles.controlsTwo}>
                        <View className="channel" style={styles.channel}>
                                                <Pressable style={{width: 65, height: 65, borderRadius: '50%'}} 
                        onPress={() => {AsyncStorage.setItem(
                                  'userChannelID',
                                  JSON.stringify(myWatchList.channelid)
                                ), 
                                navigation.navigate('Untitled')}}>
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
                                uri: myWatchList.channel_avi ? myWatchList.channel_avi : 'https://drotje36jteo8.cloudfront.net/noAvi.png'
                              }}
                              style={{
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                                zIndex: 20,
                              }}
                            />
                          </View>
                          </Pressable>
                          <View
                            style={{
                              width: '90%',
                              display: 'flex',
                              flexDirection: 'column',
                              marginRight: 15,
                            }}>
                            <Pressable
                              style={{ width: '100%', height: 30}}
                              onPress={() => {
                                AsyncStorage.setItem(
                                  'userChannelID',
                                  JSON.stringify(myWatchList.channelid)
                                ),
                                navigation.navigate('Untitled')
                              }}>
                              <Text style={styles.viewName}>
                                {myWatchList.channel}
                              </Text>
                            </Pressable>
                            <Text style={styles.viewText}>
                              Views: {`${viewsConversion(myWatchList.videoviewcount)}`}
                            </Text>
                          </View>

                          <View className="edits" style={styles.edits}>
                            <Pressable
                              style={styles.editOptions}
                              onPress={() => {
                                AsyncStorage.setItem(
                                  'videoID',
                                  JSON.stringify(myWatchList.videoid)
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
                      </View>
                      <Pressable
                        onPress={() => {
                          AsyncStorage.setItem(
                            'videoID',
                            JSON.stringify(myWatchList.videoid)
                          ),
                            navigation.navigate('Theater', {
                              videoid: myWatchList.videoid,
                              videotitle: myWatchList.title,
                              videodescription: myWatchList.videodescription,
                              videofile: myWatchList.video,
                              videothumbnail: myWatchList.thumbnail,
                              videocreator: myWatchList.channel,
                              creatoravatar: myWatchList.channel_avi,
                              videoviewcount: myWatchList.videoviewcount,
                              videolikecount: myWatchList.videolikecount,
                              videodislikecount: myWatchList.videodislikecount,
                              channelid: myWatchList.channelid,
                            });
                        }}
                        style={styles.buttonOpen}>
                        <FontAwesome
                          name="play"
                          size={24}
                          color="#001399"
                          style={styles.play}
                        />
                      </Pressable>
                      <View className="movie-info" style={{width: '100%'}}>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={styles.cardTextTitle}>
                          {myWatchList.title}
                        </Text>
                      </View>
                    </View>
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

function Movies({ navigation }) {
  const video = React.useRef(null);
  const [movies, setMovies] = useState();
  const [isVisible, setIsVisible] = useState(false);

  async function getVideoData() {
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));
    let id = JSON.parse(await AsyncStorage.getItem('videoID'));
    console.log(id);
    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/content/getVideo/${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      const data = await response.json();
      return data.uploads;
    } catch (error) {
      console.log('Ooops, could not get that video!', error);
    }
  }

  const getUser = async () => {
    const loggedInUser = await AsyncStorage.getItem('fariToken');
    if (!loggedInUser) {
      Alert.alert('Sign in to add videos to your watchlist');
    }
    if (loggedInUser) {
      return;
    }
  };

  async function laterVideo() {
    var user = JSON.parse(await AsyncStorage.getItem('userID'));
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));
    var getFeature = await getVideoData();

    var userListed = user;
    var vidID = getFeature[0].videoid;
    var channelname = getFeature[0].channel_name;
    var channel_avi = getFeature[0].channelpic;
    var video = getFeature[0].videofile;
    var posFile = getFeature[0].videothumbnail;
    var vidTitle = getFeature[0].videotitle;
    var channelID = getFeature[0].channelid;
    var views = getFeature[0].videoviewcount;

    const laterBody = {
      userListed: userListed,
      videoid: vidID,
      channel: channelname,
      channel_avi: channel_avi,
      video: video,
      thumbnail: posFile,
      title: vidTitle,
      channelid: channelID,
      videoviewcount: views,
      paidtoview: false,
    };

    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/content/watchlist`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify(laterBody),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('Oops could not add to watchlist', error);
    }
  }

  function addToWatchlist() {
    getUser().then(getVideoData).then(laterVideo);
    setIsVisible(false);
    Alert.alert('Added to watchlist');
  }

  const list = [
    {
      title: 'Add to Watchlist',
      containerStyle: { backgroundColor: '#0C1559' },
      titleStyle: { color: '#FDFBF9', fontFamily: 'Teko_700Bold' },
      onPress: addToWatchlist,
    },
    {
      title: 'Cancel',
      containerStyle: { backgroundColor: '#0C1559' },
      titleStyle: { color: '#FDFBF9', fontFamily: 'Teko_700Bold' },
      onPress: () => setIsVisible(false),
    },
  ];

  useEffect(() => {
    const fetchMoviesAndShows = async () => {
      const response = await fetch(
        'https://fari-testapi.herokuapp.com/api/content/search/movies'
      );
      let data = await response.json();
      setMovies(data.videos);
      return data;
    };
    fetchMoviesAndShows();
  }, []);

  return (
    <>
    <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <ScrollView>
          {movies && movies.length > 0
            ? movies.map((videos) => {
                return (
                  <View style={styles.movieCard}>
                    <Video
                      style={styles.video}
                      ref={video}
                      source={{
                        uri: videos.videofile,
                      }}
                      posterSource={{
                        uri: videos.videothumbnail,
                      }}
                      resizeMode={'cover'}
                      usePoster
                      posterStyle={{ width: '100%', height: '100%' }}
                      isMuted></Video>
                    <View className="controls" style={styles.controls}>
                      <View className="controls-two" style={styles.controlsTwo}>
                        <View className="channel" style={styles.channel}>
                                                <Pressable style={{width: 65, height: 65, borderRadius: '50%'}} 
                        onPress={() => {AsyncStorage.setItem(
                                  'userChannelID',
                                  JSON.stringify(videos.channelid)
                                ), 
                                navigation.navigate('Untitled')}}>
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
                                uri: videos.channelpic ? videos.channelpic : 'https://drotje36jteo8.cloudfront.net/noAvi.png'
                              }}
                              style={{
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                                zIndex: 20,
                              }}
                            />
                          </View>
                          </Pressable>
                          <View
                            style={{
                              width: '90%',
                              display: 'flex',
                              flexDirection: 'column',
                              marginRight: 15,
                            }}>
                            <Pressable
                              style={{ width: '100%', height: 30}}
                              onPress={() => {
                                AsyncStorage.setItem(
                                  'userChannelID',
                                  JSON.stringify(videos.channelid)
                                ),
                                navigation.navigate('Untitled')
                              }}>
                              <Text style={styles.viewName}>
                                {videos.channel_name}
                              </Text>
                            </Pressable>
                            <Text style={styles.viewText}>
                              Views: {`${viewsConversion(videos.videoviewcount)}`}
                            </Text>
                          </View>

                          <View className="edits" style={styles.edits}>
                            <Pressable
                              style={styles.editOptions}
                              onPress={() => {
                                AsyncStorage.setItem(
                                  'videoID',
                                  JSON.stringify(videos.videoid)
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
                      </View>
                      <Pressable
                        onPress={() => {
                          AsyncStorage.setItem(
                            'videoID',
                            JSON.stringify(videos.videoid)
                          ),
                            navigation.navigate('Theater', {
                              videoid: videos.videoid,
                              videotitle: videos.videotitle,
                              videodescription: videos.videodescription,
                              videofile: videos.videofile,
                              videothumbnail: videos.videothumbnail,
                              videocreator: videos.channel_name,
                              creatoravatar: videos.channelpic,
                              videoviewcount: videos.videoviewcount,
                              videolikecount: videos.videolikecount,
                              videodislikecount: videos.videodislikecount,
                              channelid: videos.channelid,
                            });
                        }}
                        style={styles.buttonOpen}>
                        <FontAwesome
                          name="play"
                          size={24}
                          color="#001399"
                          style={styles.play}
                        />
                      </Pressable>
                      <View className="movie-info" style={{width: '100%'}}>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={styles.cardTextTitle}>
                          {videos.videotitle}
                        </Text>
                      </View>
                    </View>
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

function Podcast({ navigation }) {
  const video = React.useRef(null);
  const [podcastMedia, setPodcastMedia] = useState();
  const [isVisible, setIsVisible] = useState(false);

  async function getVideoData() {
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));
    let id = JSON.parse(await AsyncStorage.getItem('videoID'));
    console.log(id);
    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/content/getVideo/${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      const data = await response.json();
      return data.uploads;
    } catch (error) {
      console.log('Ooops, could not get that video!', error);
    }
  }

  const getUser = async () => {
    const loggedInUser = await AsyncStorage.getItem('fariToken');
    if (!loggedInUser) {
      Alert.alert('Sign in to add videos to your watchlist');
    }
    if (loggedInUser) {
      return;
    }
  };

  async function laterVideo() {
    var user = JSON.parse(await AsyncStorage.getItem('userID'));
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));
    var getFeature = await getVideoData();

    var userListed = user;
    var vidID = getFeature[0].videoid;
    var channelname = getFeature[0].channel_name;
    var channel_avi = getFeature[0].channelpic;
    var video = getFeature[0].videofile;
    var posFile = getFeature[0].videothumbnail;
    var vidTitle = getFeature[0].videotitle;
    var channelID = getFeature[0].channelid;
    var views = getFeature[0].videoviewcount;

    const laterBody = {
      userListed: userListed,
      videoid: vidID,
      channel: channelname,
      channel_avi: channel_avi,
      video: video,
      thumbnail: posFile,
      title: vidTitle,
      channelid: channelID,
      videoviewcount: views,
      paidtoview: false,
    };

    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/content/watchlist`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify(laterBody),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('Oops could not add to watchlist', error);
    }
  }

  function addToWatchlist() {
    getUser().then(getVideoData).then(laterVideo);
    setIsVisible(false);
    Alert.alert('Added to watchlist');
  }

  const list = [
    {
      title: 'Add to Watchlist',
      containerStyle: { backgroundColor: '#0C1559' },
      titleStyle: { color: '#FDFBF9', fontFamily: 'Teko_700Bold' },
      onPress: addToWatchlist,
    },
    {
      title: 'Cancel',
      containerStyle: { backgroundColor: '#0C1559' },
      titleStyle: { color: '#FDFBF9', fontFamily: 'Teko_700Bold' },
      onPress: () => setIsVisible(false),
    },
  ];

  useEffect(() => {
    const fetchPodcast = async () => {
      const response = await fetch(
        'https://fari-testapi.herokuapp.com/api/content/search/podcasts'
      );
      let data = await response.json();
      setPodcastMedia(data.videos);
      return data;
    };
    fetchPodcast();
  }, []);

  return (
    <>
    <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <ScrollView>
          {podcastMedia && podcastMedia.length > 0
            ? podcastMedia.map((videos) => {
                return (
                  <View style={styles.movieCard}>
                    <Video
                      style={styles.video}
                      ref={video}
                      source={{
                        uri: videos.videofile,
                      }}
                      posterSource={{
                        uri: videos.videothumbnail,
                      }}
                      resizeMode={'cover'}
                      usePoster
                      posterStyle={{ width: '100%', height: '100%' }}
                      isMuted></Video>
                    <View className="controls" style={styles.controls}>
                      <View className="controls-two" style={styles.controlsTwo}>
                        <View className="channel" style={styles.channel}>
                        <Pressable style={{width: 65, height: 65, borderRadius: '50%'}} 
                        onPress={() => {AsyncStorage.setItem(
                                  'userChannelID',
                                  JSON.stringify(videos.channelid)
                                ), 
                                navigation.navigate('Untitled')}}>
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
                                uri: videos.channelpic ? videos.channelpic : 'https://drotje36jteo8.cloudfront.net/noAvi.png'
                              }}
                              style={{
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                                zIndex: 20,
                              }}
                            />
                          </View>
                          </Pressable>
                          <View
                            style={{
                              width: '90%',
                              display: 'flex',
                              flexDirection: 'column',
                              marginRight: 15,
                            }}>
                            <Pressable
                              style={{ width: '100%', height: 30}}
                              onPress={() => {
                                AsyncStorage.setItem(
                                  'userChannelID',
                                  JSON.stringify(videos.channelid)
                                ),
                                navigation.navigate('Untitled')
                              }}>
                              <Text style={styles.viewName}>
                                {videos.channel_name}
                              </Text>
                            </Pressable>
                            <Text style={styles.viewText}>
                              Views: {`${viewsConversion(videos.videoviewcount)}`}
                            </Text>
                          </View>

                          <View className="edits" style={styles.edits}>
                            <Pressable
                              style={styles.editOptions}
                              onPress={() => {
                                AsyncStorage.setItem(
                                  'videoID',
                                  JSON.stringify(videos.videoid)
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
                      </View>
                      <Pressable
                        onPress={() => {
                          AsyncStorage.setItem(
                            'videoID',
                            JSON.stringify(videos.videoid)
                          ),
                            navigation.navigate('Theater', {
                              videoid: videos.videoid,
                              videotitle: videos.videotitle,
                              videodescription: videos.videodescription,
                              videofile: videos.videofile,
                              videothumbnail: videos.videothumbnail,
                              videocreator: videos.channel_name,
                              creatoravatar: videos.channelpic,
                              videoviewcount: videos.videoviewcount,
                              videolikecount: videos.videolikecount,
                              videodislikecount: videos.videodislikecount,
                              channelid: videos.channelid,
                            });
                        }}
                        style={styles.buttonOpen}>
                        <FontAwesome
                          name="play"
                          size={24}
                          color="#001399"
                          style={styles.play}
                        />
                      </Pressable>
                      <View className="movie-info" style={{width: '100%'}}>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={styles.cardTextTitle}>
                          {videos.videotitle}
                        </Text>
                      </View>
                    </View>
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

function Music({ navigation }) {
  const video = React.useRef(null);
  const [musicMedia, setMusicMedia] = useState();
  const [isVisible, setIsVisible] = useState(false);

  async function getVideoData() {
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));
    let id = JSON.parse(await AsyncStorage.getItem('videoID'));
    console.log(id);
    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/content/getVideo/${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      const data = await response.json();
      return data.uploads;
    } catch (error) {
      console.log('Ooops, could not get that video!', error);
    }
  }

  const getUser = async () => {
    const loggedInUser = await AsyncStorage.getItem('fariToken');
    if (!loggedInUser) {
      Alert.alert('Sign in to add videos to your watchlist');
    }
    if (loggedInUser) {
      return;
    }
  };

  async function laterVideo() {
    var user = JSON.parse(await AsyncStorage.getItem('userID'));
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));
    var getFeature = await getVideoData();

    var userListed = user;
    var vidID = getFeature[0].videoid;
    var channelname = getFeature[0].channel_name;
    var channel_avi = getFeature[0].channelpic;
    var video = getFeature[0].videofile;
    var posFile = getFeature[0].videothumbnail;
    var vidTitle = getFeature[0].videotitle;
    var channelID = getFeature[0].channelid;
    var views = getFeature[0].videoviewcount;

    const laterBody = {
      userListed: userListed,
      videoid: vidID,
      channel: channelname,
      channel_avi: channel_avi,
      video: video,
      thumbnail: posFile,
      title: vidTitle,
      channelid: channelID,
      videoviewcount: views,
      paidtoview: false,
    };

    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/content/watchlist`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify(laterBody),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('Oops could not add to watchlist', error);
    }
  }

  function addToWatchlist() {
    getUser().then(getVideoData).then(laterVideo);
    setIsVisible(false);
    Alert.alert('Added to watchlist');
  }

  const list = [
    {
      title: 'Add to Watchlist',
      containerStyle: { backgroundColor: '#0C1559' },
      titleStyle: { color: '#FDFBF9', fontFamily: 'Teko_700Bold' },
      onPress: addToWatchlist,
    },
    {
      title: 'Cancel',
      containerStyle: { backgroundColor: '#0C1559' },
      titleStyle: { color: '#FDFBF9', fontFamily: 'Teko_700Bold' },
      onPress: () => setIsVisible(false),
    },
  ];

  useEffect(() => {
    const fetchMusic = async () => {
      const response = await fetch(
        'https://fari-testapi.herokuapp.com/api/content/search/music'
      );
      let data = await response.json();
      setMusicMedia(data.videos);
      return data;
    };
    fetchMusic();
  }, []);

  return (
    <>
    <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <ScrollView>
          {musicMedia && musicMedia.length > 0
            ? musicMedia.map((videos) => {
                return (
                  <View style={styles.movieCard}>
                    <Video
                      style={styles.video}
                      ref={video}
                      source={{
                        uri: videos.videofile,
                      }}
                      posterSource={{
                        uri: videos.videothumbnail,
                      }}
                      resizeMode={'cover'}
                      usePoster
                      posterStyle={{ width: '100%', height: '100%' }}
                      isMuted></Video>
                    <View className="controls" style={styles.controls}>
                      <View className="controls-two" style={styles.controlsTwo}>
                        <View className="channel" style={styles.channel}>
                        <Pressable style={{width: 65, height: 65, borderRadius: '50%'}} 
                        onPress={() => {AsyncStorage.setItem(
                                  'userChannelID',
                                  JSON.stringify(videos.channelid)
                                ), 
                                navigation.navigate('Untitled')}}>
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
                                uri: videos.channelpic ? videos.channelpic : 'https://drotje36jteo8.cloudfront.net/noAvi.png'
                              }}
                              style={{
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                                zIndex: 20,
                              }}
                            />
                          </View>
                          </Pressable>
                          <View
                            style={{
                              width: '90%',
                              display: 'flex',
                              flexDirection: 'column',
                              marginRight: 15,
                            }}>
                            <Pressable
                              style={{ width: '100%', height: 30}}
                              onPress={() => {
                                AsyncStorage.setItem(
                                  'userChannelID',
                                  JSON.stringify(videos.channelid)
                                ),
                                navigation.navigate('Untitled')
                              }}>
                              <Text style={styles.viewName}>
                                {videos.channel_name}
                              </Text>
                            </Pressable>
                            <Text style={styles.viewText}>
                              Views: {`${viewsConversion(videos.videoviewcount)}`}
                            </Text>
                          </View>

                          <View className="edits" style={styles.edits}>
                            <Pressable
                              style={styles.editOptions}
                              onPress={() => {
                                AsyncStorage.setItem(
                                  'videoID',
                                  JSON.stringify(videos.videoid)
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
                      </View>
                      <Pressable
                        onPress={() => {
                          AsyncStorage.setItem(
                            'videoID',
                            JSON.stringify(videos.videoid)
                          ),
                            navigation.navigate('Theater', {
                              videoid: videos.videoid,
                              videotitle: videos.videotitle,
                              videodescription: videos.videodescription,
                              videofile: videos.videofile,
                              videothumbnail: videos.videothumbnail,
                              videocreator: videos.channel_name,
                              creatoravatar: videos.channelpic,
                              videoviewcount: videos.videoviewcount,
                              videolikecount: videos.videolikecount,
                              videodislikecount: videos.videodislikecount,
                              channelid: videos.channelid,
                            });
                        }}
                        style={styles.buttonOpen}>
                        <FontAwesome
                          name="play"
                          size={24}
                          color="#001399"
                          style={styles.play}
                        />
                      </Pressable>
                      <View className="movie-info" style={{width: '100%'}}>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={styles.cardTextTitle}>
                          {videos.videotitle}
                        </Text>
                      </View>
                    </View>
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

function Gaming({ navigation }) {
  const video = React.useRef(null);
  const [gamingMedia, setGamingMedia] = useState();
  const [isVisible, setIsVisible] = useState(false);

  async function getVideoData() {
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));
    let id = JSON.parse(await AsyncStorage.getItem('videoID'));
    console.log(id);
    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/content/getVideo/${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      const data = await response.json();
      return data.uploads;
    } catch (error) {
      console.log('Ooops, could not get that video!', error);
    }
  }

  const getUser = async () => {
    const loggedInUser = await AsyncStorage.getItem('fariToken');
    if (!loggedInUser) {
      Alert.alert('Sign in to add videos to your watchlist');
    }
    if (loggedInUser) {
      return;
    }
  };

  async function laterVideo() {
    var user = JSON.parse(await AsyncStorage.getItem('userID'));
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));
    var getFeature = await getVideoData();

    var userListed = user;
    var vidID = getFeature[0].videoid;
    var channelname = getFeature[0].channel_name;
    var channel_avi = getFeature[0].channelpic;
    var video = getFeature[0].videofile;
    var posFile = getFeature[0].videothumbnail;
    var vidTitle = getFeature[0].videotitle;
    var channelID = getFeature[0].channelid;
    var views = getFeature[0].videoviewcount;

    const laterBody = {
      userListed: userListed,
      videoid: vidID,
      channel: channelname,
      channel_avi: channel_avi,
      video: video,
      thumbnail: posFile,
      title: vidTitle,
      channelid: channelID,
      videoviewcount: views,
      paidtoview: false,
    };

    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/content/watchlist`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify(laterBody),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('Oops could not add to watchlist', error);
    }
  }

  function addToWatchlist() {
    getUser().then(getVideoData).then(laterVideo);
    setIsVisible(false);
    Alert.alert('Added to watchlist');
  }

  const list = [
    {
      title: 'Add to Watchlist',
      containerStyle: { backgroundColor: '#0C1559' },
      titleStyle: { color: '#FDFBF9', fontFamily: 'Teko_700Bold' },
      onPress: addToWatchlist,
    },
    {
      title: 'Cancel',
      containerStyle: { backgroundColor: '#0C1559' },
      titleStyle: { color: '#FDFBF9', fontFamily: 'Teko_700Bold' },
      onPress: () => setIsVisible(false),
    },
  ];

  useEffect(() => {
    const fetchGaming = async () => {
      const response = await fetch(
        'https://fari-testapi.herokuapp.com/api/content/search/gaming'
      );
      let data = await response.json();
      setGamingMedia(data.videos);
      return data;
    };
    fetchGaming();
  }, []);

  return (
    <>
    <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <ScrollView>
          {gamingMedia && gamingMedia.length > 0
            ? gamingMedia.map((videos) => {
                return (
                  <View style={styles.movieCard}>
                    <Video
                      style={styles.video}
                      ref={video}
                      source={{
                        uri: videos.videofile,
                      }}
                      posterSource={{
                        uri: videos.videothumbnail,
                      }}
                      resizeMode={'cover'}
                      usePoster
                      posterStyle={{ width: '100%', height: '100%' }}
                      isMuted></Video>
                    <View className="controls" style={styles.controls}>
                      <View className="controls-two" style={styles.controlsTwo}>
                        <View className="channel" style={styles.channel}>
                        <Pressable style={{width: 65, height: 65, borderRadius: '50%'}} 
                        onPress={() => {AsyncStorage.setItem(
                                  'userChannelID',
                                  JSON.stringify(videos.channelid)
                                ), 
                                navigation.navigate('Untitled')}}>
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
                                uri: videos.channelpic ? videos.channelpic : 'https://drotje36jteo8.cloudfront.net/noAvi.png'
                              }}
                              style={{
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                                zIndex: 20,
                              }}
                            />
                          </View>
                          </Pressable>
                          <View
                            style={{
                              width: '90%',
                              display: 'flex',
                              flexDirection: 'column',
                              marginRight: 15,
                            }}>
                            <Pressable
                              style={{ width: '100%', height: 30}}
                              onPress={() => {
                                AsyncStorage.setItem(
                                  'userChannelID',
                                  JSON.stringify(videos.channelid)
                                ),
                                navigation.navigate('Untitled')
                              }}>
                              <Text style={styles.viewName}>
                                {videos.channel_name}
                              </Text>
                            </Pressable>
                            <Text style={styles.viewText}>
                              Views: {`${viewsConversion(videos.videoviewcount)}`}
                            </Text>
                          </View>

                          <View className="edits" style={styles.edits}>
                            <Pressable
                              style={styles.editOptions}
                              onPress={() => {
                                AsyncStorage.setItem(
                                  'videoID',
                                  JSON.stringify(videos.videoid)
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
                      </View>
                      <Pressable
                        onPress={() => {
                          AsyncStorage.setItem(
                            'videoID',
                            JSON.stringify(videos.videoid)
                          ),
                            navigation.navigate('Theater', {
                              videoid: videos.videoid,
                              videotitle: videos.videotitle,
                              videodescription: videos.videodescription,
                              videofile: videos.videofile,
                              videothumbnail: videos.videothumbnail,
                              videocreator: videos.channel_name,
                              creatoravatar: videos.channelpic,
                              videoviewcount: videos.videoviewcount,
                              videolikecount: videos.videolikecount,
                              videodislikecount: videos.videodislikecount,
                              channelid: videos.channelid,
                            });
                        }}
                        style={styles.buttonOpen}>
                        <FontAwesome
                          name="play"
                          size={24}
                          color="#001399"
                          style={styles.play}
                        />
                      </Pressable>
                      <View className="movie-info" style={{width: '100%'}}>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={styles.cardTextTitle}>
                          {videos.videotitle}
                        </Text>
                      </View>
                    </View>
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

function Search({ navigation }) {
  const video = React.useRef(null);
  const [searchedMedia, setSearchedMedia] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const onChangeSearch = (query) => setSearchQuery(query);
  const [isVisible, setIsVisible] = useState(false);

  async function getVideoData() {
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));
    let id = JSON.parse(await AsyncStorage.getItem('videoID'));
    console.log(id);
    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/content/getVideo/${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      const data = await response.json();
      return data.uploads;
    } catch (error) {
      console.log('Ooops, could not get that video!', error);
    }
  }

  const getUser = async () => {
    const loggedInUser = await AsyncStorage.getItem('fariToken');
    if (!loggedInUser) {
      Alert.alert('Sign in to add videos to your watchlist');
    }
    if (loggedInUser) {
      // setUser(JSON.parse(loggedInUser));
    }
  };

  async function laterVideo() {
    var user = JSON.parse(await AsyncStorage.getItem('userID'));
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));
    var getFeature = await getVideoData();

    var userListed = user;
    var vidID = getFeature[0].videoid;
    var channelname = getFeature[0].channel_name;
    var channel_avi = getFeature[0].channelpic;
    var video = getFeature[0].videofile;
    var posFile = getFeature[0].videothumbnail;
    var vidTitle = getFeature[0].videotitle;
    var channelID = getFeature[0].channelid;
    var views = getFeature[0].videoviewcount;

    const laterBody = {
      userListed: userListed,
      videoid: vidID,
      channel: channelname,
      channel_avi: channel_avi,
      video: video,
      thumbnail: posFile,
      title: vidTitle,
      channelid: channelID,
      videoviewcount: views,
      paidtoview: false,
    };

    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/content/watchlist`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify(laterBody),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('Oops could not add to watchlist', error);
    }
  }

  function addToWatchlist() {
    getUser().then(getVideoData).then(laterVideo);
    setIsVisible(false);
    Alert.alert('Added to watchlist');
  }

  const list = [
    {
      title: 'Add to Watchlist',
      containerStyle: { backgroundColor: '#0C1559' },
      titleStyle: { color: '#FDFBF9', fontFamily: 'Teko_700Bold' },
      onPress: addToWatchlist,
    },
    {
      title: 'Cancel',
      containerStyle: { backgroundColor: '#0C1559' },
      titleStyle: { color: '#FDFBF9', fontFamily: 'Teko_700Bold' },
      onPress: () => setIsVisible(false),
    },
  ];

  const fetchSearchResults = async () => {
    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/content/video/search/${searchQuery}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      setSearchedMedia(data.videos);
      return data.videos;
    } catch (error) {
      console.log(
        'Oops Something Went Wrong! Could not get the search results list.',
        error
      );
    }
  };

  async function renderSearchResults(videos) {
    let payVideos = [];
    let freeVideos = [];

    for (let index = 0; index < videos.length; index++) {
      if (
        videos[index].paid_content === 'free' ||
        videos[index].paid_content === null ||
        videos[index].content_type === 'vlog' ||
        videos[index].content_type === 'other'
      ) {
        freeVideos.push(videos[index]);
      } else if (
        videos[index].paid_content === 'pay' &&
        videos[index].content_type === 'film'
      ) {
        payVideos.push(videos[index]);
      }
    }
  }

  return (
    <>
    <StatusBar barStyle="light-content" />
      <Searchbar
        placeholder="Search"
        placeholderTextColor="#a9a9b0"
        onChangeText={onChangeSearch}
        keyboardAppearance="dark"
        value={searchQuery}
        returnKeyType="search"
        inputStyle={{ color: '#fdfbf9', caretColor: '#0c1559' }}
        onSubmitEditing={() => {
          fetchSearchResults().then(renderSearchResults);
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
          {searchedMedia && searchedMedia.length === 0 && (
            <Text style={styles.message}>No Matching Results.</Text>
          )}
          {searchedMedia && searchedMedia.length > 0 ? (
            searchedMedia.map((videos) => {
              return videos.paid_content === 'pay' &&
                videos.content_type === 'film' ? (
                <View style={styles.movieCard}>
                  <Video
                    style={styles.video}
                    ref={video}
                    source={{ uri: videos.videofile }}
                    posterSource={{
                      uri: videos.videothumbnail,
                    }}
                    resizeMode={'cover'}
                    usePoster
                    posterStyle={{ width: '100%', height: '100%' }}
                    isMuted></Video>
                  <View className="controls" style={styles.controls}>
                    <View className="controls-two" style={styles.controlsTwo}>
                      <View className="channel" style={styles.channel}>
                      <Pressable style={{width: 65, height: 65, borderRadius: '50%'}} 
                        onPress={() => {AsyncStorage.setItem(
                                  'userChannelID',
                                  JSON.stringify(videos.channelid)
                                ), 
                                navigation.navigate('Untitled')}}>
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
                              uri: videos.channelpic ? videos.channelpic : 'https://drotje36jteo8.cloudfront.net/noAvi.png'
                            }}
                            style={{
                              width: 60,
                              height: 60,
                              borderRadius: '50%',
                              zIndex: 20,
                            }}
                          />
                        </View>
                        </Pressable>
                        <View
                          style={{
                            width: '90%',
                            display: 'flex',
                            flexDirection: 'column',
                            marginRight: 15,
                          }}>
                            <Pressable
                              style={{ width: '100%', height: 30}}
                              onPress={() => {
                                AsyncStorage.setItem(
                                  'userChannelID',
                                  JSON.stringify(videos.channelid)
                                ),
                                navigation.navigate('Untitled')
                              }}>
                            <Text style={styles.viewName}>
                              {videos.channel_name}
                            </Text>
                          </Pressable>
                          <Text style={styles.viewText}>
                            Views: {`${viewsConversion(videos.videoviewcount)}`}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.purchase}>
                      <Button
                        title="Purchase Ticket"
                        buttonStyle={styles.btn}
                        key={videos.videoid}></Button>
                    </View>
                    <View className="movie-info" style={{width: '100%'}}>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={styles.cardTextTitle}>
                        {videos.videotitle}
                      </Text>
                    </View>
                  </View>
                </View>
              ) : (
                <View style={styles.movieCard}>
                  <Video
                    style={styles.video}
                    ref={video}
                    source={{
                      uri: videos.videofile,
                    }}
                    posterSource={{
                      uri: videos.videothumbnail,
                    }}
                    resizeMode={'cover'}
                    usePoster
                    posterStyle={{ width: '100%', height: '100%' }}
                    isMuted></Video>
                  <View className="controls" style={styles.controls}>
                    <View className="controls-two" style={styles.controlsTwo}>
                      <View className="channel" style={styles.channel}>
                      <Pressable style={{width: 65, height: 65, borderRadius: '50%'}} 
                        onPress={() => {AsyncStorage.setItem(
                                  'userChannelID',
                                  JSON.stringify(videos.channelid)
                                ), 
                                navigation.navigate('Untitled')}}>
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
                              uri: videos.channelpic ? videos.channelpic : 'https://drotje36jteo8.cloudfront.net/noAvi.png'
                            }}
                            style={{
                              width: 60,
                              height: 60,
                              borderRadius: '50%',
                              zIndex: 20,
                            }}
                          />
                        </View>
                        </Pressable>
                        <View
                          style={{
                            width: '90%',
                            display: 'flex',
                            flexDirection: 'column',
                            marginRight: 15,
                          }}>
                            <Pressable
                              style={{ width: '100%', height: 30}}
                              onPress={() => {
                                AsyncStorage.setItem(
                                  'userChannelID',
                                  JSON.stringify(videos.channelid)
                                ),
                                navigation.navigate('Untitled')
                              }}>
                            <Text style={styles.viewName}>
                              {videos.channel_name}
                            </Text>
                          </Pressable>
                          <Text style={styles.viewText}>
                            Views: {`${viewsConversion(videos.videoviewcount)}`}
                          </Text>
                        </View>

                        <View className="edits" style={styles.edits}>
                          <Pressable
                            style={styles.editOptions}
                            onPress={() => {
                              AsyncStorage.setItem(
                                'videoID',
                                JSON.stringify(videos.videoid)
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
                    </View>
                    <Pressable
                      onPress={() => {
                        AsyncStorage.setItem(
                          'videoID',
                          JSON.stringify(videos.videoid)
                        ),
                          navigation.navigate('Theater', {
                            videoid: videos.videoid,
                            videotitle: videos.videotitle,
                            videodescription: videos.videodescription,
                            videofile: videos.videofile,
                            videothumbnail: videos.videothumbnail,
                            videocreator: videos.channel_name,
                            creatoravatar: videos.channelpic,
                            videoviewcount: videos.videoviewcount,
                            videolikecount: videos.videolikecount,
                            videodislikecount: videos.videodislikecount,
                            channelid: videos.channelid,
                          });
                      }}
                      style={styles.buttonOpen}>
                      <FontAwesome
                        name="play"
                        size={24}
                        color="#001399"
                        style={styles.play}
                      />
                    </Pressable>

                    <View className="movie-info" style={{width: '100%'}}>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={styles.cardTextTitle}>
                        {videos.videotitle}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          ) : (
            <Text style={styles.message}></Text>
          )}
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

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
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
          headerShadowVisible: false,
        },
        drawerLabelStyle: {
          color: '#fdfbf9',
          fontFamily: 'Teko_700Bold',
          fontSize: 18,
        },
      }}>
      <Drawer.Screen
        name="Discover"
        component={Discover}
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
        name="Pay to View"
        component={PaidContent}
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
        name="Subscriptions"
        component={Subscriptions}
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
        name="Favorites"
        component={Favorites}
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
        name="Watchlist"
        component={Watchlist}
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
      <Drawer.Screen name=" " />
      <Drawer.Screen
        name="Movies and Shows"
        component={Movies}
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
        name="Podcast"
        component={Podcast}
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
        name="Gaming"
        component={Gaming}
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
        name="Music"
        component={Music}
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
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignContent:'space-between',
    backgroundColor: '#171717',
    width: WIDTH,
    height: '100%'
  },

  movieCard: {
    height: 250,
    width: WIDTH,
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
    marginTop: '20px',
    marginBottom: 20,
    backgroundColor: 'transparent',
    width: 50,
    height: 50,
    border: 'none',
    borderRadius: '5px',
    fontSize: '50px',
    color: '#001399',
    textAlign: 'center',
  },

  buttonOpen: {
    width: '100%',
    height: 50,
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
    width: 45,
    height: 50,
    position: 'relative',
    right: 0,
    top: 0,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 5,
    marginLeft: 20,
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

  viewText: {
    color: '#fdfbf9',
    fontFamily: 'Teko_700Bold',
    letterSpacing: '0.02rem',
    marginTop: 5,
    marginLeft: 5,
    fontSize: 15,
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

  purchase: {
    width: 200,
    height: 50,
    textAlign: 'center',
    position: 'relative',
    left: '25%',
    marginTop: 20,
    marginBottom: 10,
  },

  message: {
    fontSize: 21,
    textAlign: 'center',
    margin: '1rem auto',
    marginTop: 250,
    color: '#a9a9b0',
    fontFamily: 'Teko_700Bold',
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

export default function App() {
  return <MyDrawer />;
}
