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
import Recommended from './Reommended';

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

function Creators() {
  let [fontsLoaded, error] = useFonts({
    PermanentMarker_400Regular,
    Teko_600SemiBold,
  });

  const video = React.useRef(null);
  const route = useRoute();
  const navigation = useNavigation();

  const [channelUploads, setChannelUploads] = useState();
  const [userchannel, setUserChannel] = useState();

  useEffect(() => {
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
        console.log(data);
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
      console.log(data);
      setChannelUploads(data.channelUploads);
      return data.channelUploads;
    };
    getChannelProfile().then(fetchchannelUploads);
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
                    }}>
                    {channel.subscriber_count} Subscribers
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
                      }}>
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
      </View>
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
    height: '100%',
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
});

export default Creators;
