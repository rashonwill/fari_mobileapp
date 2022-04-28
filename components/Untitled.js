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

import Synposis from './Synopsis';
import Comments from './Comments';
import Recommended from './Recommended';
import Theater from './Theater';
import { viewsConversion } from './Conversion'

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

import { PermanentMarker_400Regular } from '@expo-google-fonts/permanent-marker';
import { useFonts, OpenSans_400Regular } from '@expo-google-fonts/dev';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MaterialIcons } from '@expo/vector-icons';

import { Video, Audio, AVPlaybackStatus } from 'expo-av';

import { Entypo } from '@expo/vector-icons';

import { Ionicons } from '@expo/vector-icons';

import {
  faCheckSquare,
  faCoffee,
  faBars,
} from '@fortawesome/fontawesome-free-solid';

import { FontAwesome } from '@expo/vector-icons';

import {
  Teko_300Light,
  Teko_400Regular,
  Teko_500Medium,
  Teko_600SemiBold,
  Teko_700Bold,
} from '@expo-google-fonts/teko';

function Untitled() {
  let [fontsLoaded, error] = useFonts({
    Teko_700Bold,
  });

  const video = React.useRef(null);
  const route = useRoute();
  const navigation = useNavigation();

  const [channelUploads, setChannelUploads] = useState();
  const [userchannel, setUserChannel] = useState();
  const [user, setUser] = useState();
  const [isVisible, setIsVisible] = useState(false);
  const [isSubbed, setIsSubbed] = useState(false);

  async function getChannelProfile() {
    let channelid = JSON.parse(await AsyncStorage.getItem('userChannelID'));
    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/users/channel/${channelid}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      setUserChannel(data.channel);
      return data.channel;
    } catch (error) {
      console.log(
        'Oops Something Went Wrong! Could not get that user channel.'
      );
    }
  }

  const fetchchannelUploads = async () => {
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));
    let channelid = JSON.parse(await AsyncStorage.getItem('userChannelID'));

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
    setChannelUploads(data.channelUploads);
    return data.channelUploads;
  };

  async function checkSubStatus() {
    var userSubed = JSON.parse(await AsyncStorage.getItem('userID'));
    let channelid = JSON.parse(await AsyncStorage.getItem('userChannelID'));
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));

    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/users/substatus/${userSubed}/${channelid}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      const data = await response.json();
      if (data.subedChannel.length > 0) {
        setIsSubbed(true);
      } else if (data.subedChannel.length === 0) {
        setIsSubbed(false);
      }
      return data.subedChannel;
    } catch (error) {
      console.error('Oops could not determine subscription status', error);
    }
  }

  async function subscribe() {
    var user = JSON.parse(await AsyncStorage.getItem('userID'));
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));
    var getChannel = await getChannelProfile();

    var userSubed = user.userid;
    var channelid = getChannel[0].channelid;
    var channel_avi = getChannel[0].profile_avatar;
    var channel = getChannel[0].channelname;

    try {
      const subscribedChannel = {
        userSubed: userSubed,
        channelID: channelid,
        channel: channel,
        channel_avi: channel_avi,
      };

      var channelname = getChannel[0].channelname;
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/users/subscribe/${channelname}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify(subscribedChannel),
        }
      );
      const data = await response.json();
      setIsSubbed(true);
      return data;
    } catch (error) {
      console.log('Ooops, could not subscribe to that channel!', error);
    }
  }

  async function unsubscribe() {
    var userSubed = JSON.parse(await AsyncStorage.getItem('userID'));
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));
    var getChannel = await getChannelProfile();
    try {
      var channelname = getChannel[0].channelname;
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/users/unsubscribe/${channelname}/${userSubed}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      const data = await response.json();
      setIsSubbed(false);
      return data;
    } catch (error) {
      console.log('Ooops, could not unsubscribe to that channel!', error);
    }
  }

  async function toSubOrNot() {
    var userSubed = JSON.parse(await AsyncStorage.getItem('userID'));
    let channelid = JSON.parse(await AsyncStorage.getItem('userChannelID'));
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));

    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/users/substatus/${userSubed}/${channelid}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      const data = await response.json();
      if (data.subedChannel.length > 0) {
        unsubscribe();
      } else if (data.subedChannel.length === 0) {
        subscribe();
      }
      return data;
    } catch (error) {
      console.error('Oops could not determine the sub or unsub action', error);
    }
  }

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
    getChannelProfile().then(fetchchannelUploads).then(checkSubStatus);
  }, [route]);

  return (
    <>
      <View style={styles.page}>
        {userchannel && userchannel.length > 0
          ? userchannel.map((channel) => {
              return (
                <View style={styles.profile}>
                  <View>
                    <View
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        marginRight: 'auto',
                        marginLeft: 'auto',
                        backgroundColor: '#fdfbf9',
                      }}>
                      <Image
                        source={{
                          uri: channel.profile_avatar
                            ? channel.profile_avatar
                            : 'https://cdn.onlinewebfonts.com/svg/img_258083.png',
                        }}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                        }}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: '20px',
                        color: '#fdfbf9',
                        fontFamily: 'Teko_600SemiBold',
                        letterSpacing: '0.02rem',
                        marginRight: 'auto',
                        marginLeft: 'auto',
                      }}>
                      {channel.channelname}
                    </Text>
                  </View>

                  <Text
                    style={{
                      fontSize: '16px',
                      color: '#fdfbf9',
                      fontFamily: 'Teko_600SemiBold',
                      letterSpacing: '0.02rem',
                      marginRight: 'auto',
                      marginLeft: 'auto',
                      marginBottom: 5
                    }}>
                     {`${viewsConversion(channel.subscriber_count)}`} Subscribers
                  </Text>
                  <View
                    style={{
                      width: 200,
                      height: 40,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                    }}>
                    {isSubbed ? (
                      <>
                        <Pressable
                          style={{
                            width: 150,
                            height: 40,
                            textAlign: 'center',
                            backgroundColor: '#B2022F',
                            borderRadius: 5,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          onPress={toSubOrNot}>
                          <Text
                            style={{
                              fontSize: '18px',
                              color: '#fdfbf9',
                              fontFamily: 'Teko_600SemiBold',
                              letterSpacing: '0.02rem',
                            }}>
                            Subscribed
                          </Text>
                        </Pressable>
                      </>
                    ) : (
                      <>
                        <Pressable
                          style={{
                            width: 150,
                            height: 40,
                            textAlign: 'center',
                            backgroundColor: '#0c1559',
                            borderRadius: 5,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          onPress={toSubOrNot}>
                          <Text
                            style={{
                              fontSize: '18px',
                              color: '#fdfbf9',
                              fontFamily: 'Teko_600SemiBold',
                              letterSpacing: '0.02rem',
                            }}>
                            Subscribe
                          </Text>
                        </Pressable>
                      </>
                    )}
                  </View>
                </View>
              );
            })
          : null}

        <View styles={styles.uploads}>
          <ScrollView>
            {channelUploads && channelUploads.length === 0 && (
              <Text style={styles.message}>No uploads.</Text>
            )}
            {channelUploads && channelUploads.length > 0
              ? channelUploads.map((channelUploads) => {
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
                        <View
                          className="controls-two"
                          style={styles.controlsTwo}>
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
                              <Text style={styles.viewName}>
                                {channelUploads.channel_name}
                              </Text>
                              <Text style={styles.viewText}>
                                Views: {`${viewsConversion(channelUploads.videoviewcount)}`}
                              </Text>
                            </View>

                            <View className="edits" style={styles.edits}>
                              <Pressable
                                style={styles.editOptions}
                                onPress={() => {
                                  AsyncStorage.setItem(
                                    'videoID',
                                    JSON.stringify(channelUploads.videoid)
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
                              JSON.stringify(channelUploads.videoid)
                            ),
                              navigation.navigate('Theater', {
                                videoid: channelUploads.videoid,
                                videotitle: channelUploads.videotitle,
                                videodescription:
                                  channelUploads.videodescription,
                                videofile: channelUploads.videofile,
                                videothumbnail: channelUploads.videothumbnail,
                                videocreator: channelUploads.channel_name,
                                creatoravatar: channelUploads.channelpic,
                                videoviewcount: channelUploads.videoviewcount,
                                videolikecount: channelUploads.videolikecount,
                                videodislikecount:
                                  channelUploads.videodislikecount,
                                channelid: channelUploads.channelid,
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
  page: {
    backgroundColor: '#171717',
    fontFamily: 'Teko_600SemiBold',
  },
  profile: {
    height: 220,
    width: '100%',
    backgroundColor: '#171717',
    padding: 10,
    margin: 10,
    marginTop: 30,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  uploads: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#171717',
    width: '100%',
    padding: 10,
    marginTop: 20,
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
});

export default Untitled;
