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
import Channels from './Channels';

import GestureRecognizer from 'react-native-swipe-gestures';

function Discover({ navigation }) {
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
      return data;
    };
    fetchFreeContent();
  }, []);
  
  return (
    <>
      <View style={styles.container}>
        <ScrollView>
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
                                uri: uploads.channelpic,
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
                            <Pressable       
                            onPress={() => {
                            AsyncStorage.setItem('userChannelID', JSON.stringify(uploads.channelid)),
                            navigation.navigate('Channels', {
                            channelname: uploads.channel_name,
                            channelavatar: uploads.channelpic})
                            }
                            }
                            style={styles.buttonOpen}>
                            <Text style={styles.viewName}>
                              {uploads.channel_name}
                            </Text>
                            </Pressable>
                            <Text style={styles.viewText}>
                              Views: {uploads.videoviewcount}{' '}
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

function PaidContent({navigation}) {
  useEffect(() => {
    const fetchPaidContent = async () => {
      const response2 = await fetch(
        'https://fari-testapi.herokuapp.com/api/content/paytoview'
      );
      let data2 = await response2.json();
      // console.log(data2);
      setPaidMedia(data2.uploads);
      return data2;
    };
    const fetchUser = async () => {
      const response3 = await fetch(
        'https://fari-testapi.herokuapp.com/api/users/me'
      );
      let data3 = await response3.json();
      console.log(data3);
      setUser(data3);
      return data3;
    };

    fetchPaidContent();
  }, []);

  const video = React.useRef(null);
  const [user, setUser] = useState();
  const [paidMedia, setPaidMedia] = useState();
  return (
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
                              uri: uploads.channelpic,
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
                           <Pressable
                            
                            onPress={() => 
                            AsyncStorage.setItem('userChannelID', uploads.channelid),
                            navigation.navigate('UserChannel', {
                            channelname: uploads.channel_name,
                            channelavatar: uploads.channelpic,
                            
                          })
                            }
                              style={styles.buttonOpen}
                              >
                          <Text style={styles.viewName}>
                            {uploads.channel_name}
                          </Text>
                          </Pressable>
                          <Text style={styles.viewText}>
                            Views: {uploads.videoviewcount}
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
                    <View className="movie-info">
                      <Text style={styles.cardTextTitle}>
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
  );
}

function Subscriptions({ navigation }) {
  const video = React.useRef(null);
  const [user, setUser] = useState();
  const [subscriptions, setSubscriptions] = useState();

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
      let USER_TOKEN = await AsyncStorage.getItem('fariToken');
      let TOKEN = JSON.parse(USER_TOKEN);
      let userID = await AsyncStorage.getItem('userID');
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
      return data;
    };

    getUser().then(fetchSubUploads);
  }, []);

  return (
    <>
      <View style={styles.container}>
        <ScrollView>
          {subscriptions && subscriptions.length === 0 && (
            <Text style={styles.message}>
              You do not have any Subscriptions yet.
            </Text>
          )}
          {subscriptions && subscriptions.length > 0
            ? subscriptions.map((subscriptionUploads) => {
                return (
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
                                uri: subscriptionUploads.channelpic,
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
                            <Pressable
                            
                            onPress={() => 
                            AsyncStorage.setItem('userChannelID', subscriptionUploads.channelid),
                            navigation.navigate('UserChannel', {
                            channelname: subscriptionUploads.channel,
                            channelavatar: subscriptionUploads.channel_avi,
                            
                          })
                            }
                              style={styles.buttonOpen}
                              >
                            <Text style={styles.viewName}>
                              {subscriptionUploads.channel_name}
                            </Text>
                            </Pressable>
                            <Text style={styles.viewText}>
                              Views: {subscriptionUploads.videoviewcount}{' '}
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
                          {subscriptionUploads.videotitle}
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

function Favorites({ navigation }) {
  const video = React.useRef(null);
  const [user, setUser] = useState();
  const [favorites, setFavorites] = useState();

  useEffect(() => {
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
      let USER_TOKEN = await AsyncStorage.getItem('fariToken');
      let TOKEN = JSON.parse(USER_TOKEN);
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
      return data;
    };

    getUser().then(fetchFavorites);
  }, []);

  return (
    <>
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
                                uri: myFavVids.channel_avi,
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
                            <Pressable
                            
                            onPress={() => 
                            AsyncStorage.setItem('userChannelID', myFavVids.channelid),
                            navigation.navigate('Channels', {
                            channelname: myFavVids.channel,
                            channelavatar: myFavVids.channel_avi,
                            
                          })
                            }
                              style={styles.buttonOpen}
                              >
                            <Text style={styles.viewName}>
                              {myFavVids.channel}
                            </Text>
                            </Pressable>
                            <Text style={styles.viewText}>
                              Views: {myFavVids.videoviewcount}{' '}
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
    </>
  );
}

function Watchlist({ navigation }) {
  const video = React.useRef(null);
  const [user, setUser] = useState();
  const [watchlist, setWatchlist] = useState();

  useEffect(() => {
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

    fetchWatchlist();
  }, []);
  return (
    <>
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
                                uri: myWatchList.channel_avi,
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
                            <Pressable style={styles.buttonOpen}
                            onPress={() => 
                            AsyncStorage.setItem('userChannelID', myWatchList.channelid),
                            navigation.navigate('UserChannel', {
                            channelname: myWatchList.channel,
                            channelavatar: myWatchList.channel_avi,
                            
                          })
                            }>
                            <Text style={styles.viewName}>
                              {myWatchList.channel}
                            </Text>
                            </Pressable>
                            <Text style={styles.viewText}>
                              Views: {myWatchList.videoviewcount}{' '}
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
    </>
  );
}

function Movies({ navigation }) {
  const video = React.useRef(null);
  const [movies, setMovies] = useState();

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
                                uri: videos.channelpic,
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
                            <Pressable style={styles.buttonOpen}
                            onPress={() => 
                            AsyncStorage.setItem('userChannelID', videos.channelid),
                            navigation.navigate('UserChannel', {
                            channelname: videos.channel_name,
                            channelavatar: videos.channelpic,
                            
                          })
                            }>
                            <Text style={styles.viewName}>
                              {videos.channel_name}
                            </Text>
                            </Pressable>
                            <Text style={styles.viewText}>
                              Views: {videos.videoviewcount}{' '}
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
    </>
  );
}

function Podcast({ navigation }) {
  const video = React.useRef(null);
  const [podcastMedia, setPodcastMedia] = useState();

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
                                uri: videos.channelpic,
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
                             <Pressable style={styles.buttonOpen}
                            onPress={() => 
                            AsyncStorage.setItem('userChannelID', videos.channelid),
                            navigation.navigate('UserChannel', {
                            channelname: videos.channel_name,
                            channelavatar: videos.channelpic,
                            
                          })
                            }>
                            <Text style={styles.viewName}>
                              {videos.channel_name}
                            </Text>
                            </Pressable>
                            <Text style={styles.viewText}>
                              Views: {videos.videoviewcount}{' '}
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
    </>
  );
}

function Music({ navigation }) {
  const video = React.useRef(null);
  const [musicMedia, setMusicMedia] = useState();

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
                                uri: videos.channelpic,
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
                             <Pressable style={styles.buttonOpen}
                            onPress={() => 
                            AsyncStorage.setItem('userChannelID', videos.channelid),
                            navigation.navigate('UserChannel', {
                            channelname: videos.channel_name,
                            channelavatar: videos.channelpic,
                            
                          })
                            }>
                            <Text style={styles.viewName}>
                              {videos.channel_name}
                            </Text>
                            </Pressable>
                            <Text style={styles.viewText}>
                              Views: {videos.videoviewcount}{' '}
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
    </>
  );
}

function Gaming({ navigation }) {
  const video = React.useRef(null);
  const [gamingMedia, setGamingMedia] = useState();

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
                                uri: videos.channelpic,
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
                             <Pressable style={styles.buttonOpen}
                            onPress={() => 
                            AsyncStorage.setItem('userChannelID', videos.channelid),
                            navigation.navigate('UserChannel', {
                            channelname: videos.channel_name,
                            channelavatar: videos.channelpic,
                            
                          })
                            }>
                            <Text style={styles.viewName}>
                              {videos.channel_name}
                            </Text>
                            </Pressable>
                            <Text style={styles.viewText}>
                              Views: {videos.videoviewcount}{' '}
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
    </>
  );
}

function Search({ navigation }) {
  const video = React.useRef(null);
  const [searchedMedia, setSearchedMedia] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const onChangeSearch = (query) => setSearchQuery(query);
  const [freeVideosSearch, setFreeVidsSearched] = useState();
  const [paidVideosSearch, setPaidVidsSearched] = useState();
  

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
        console.log(data)
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
          setFreeVidsSearched(freeVideos);
        } else if (
          videos[index].paid_content === 'pay' &&
          videos[index].content_type === 'film'
        ) {
          payVideos.push(videos[index]);
          setPaidVidsSearched(payVideos);
        }
      }
      console.log(freeVideos);
      console.log(payVideos);
    }


  return (
    <>
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
        inputStyle={{ color: '#0c1559' }}
        onSubmitEditing={()=>{fetchSearchResults().then(renderSearchResults)}}
        style={{
          borderBottomColor: '#a9a9b0',
          borderWidth: '2',
          backgroundColor: '#a9a9b0',
          borderRadius: 10,
        }}
      />
      <View style={styles.container}>
        <ScrollView>
          {freeVideosSearch && freeVideosSearch.length > 0
            ? freeVideosSearch.map((videos) => {
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
                                uri: videos.channelpic,
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
                             <Pressable style={styles.buttonOpen}
                            onPress={() => 
                            AsyncStorage.setItem('userChannelID', videos.channelid),
                            navigation.navigate('UserChannel', {
                            channelname: videos.channel_name,
                            channelavatar: videos.channelpic,
                            
                          })
                            }>
                            <Text style={styles.viewName}>
                              {videos.channel_name}
                            </Text>
                            </Pressable>
                            <Text style={styles.viewText}>
                              Views: {videos.videoviewcount}{' '}
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
                          {videos.videotitle}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })
            : null}

          {paidVideosSearch && paidVideosSearch.length > 0
            ? paidVideosSearch.map((videos) => {
                return (
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
                                uri: videos.channelpic,
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
                             <Pressable style={styles.buttonOpen}
                            onPress={() => 
                            AsyncStorage.setItem('userChannelID', videos.channelid),
                            navigation.navigate('UserChannel', {
                            channelname: videos.channel_name,
                            channelavatar: videos.channelpic,
                            
                          })
                            }>
                            <Text style={styles.viewName}>
                              {videos.channel_name}
                            </Text>
                            </Pressable>
                            <Text style={styles.viewText}>
                              Views: {videos.videoviewcount}
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
                      <View className="movie-info">
                        <Text style={styles.cardTextTitle}>
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
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#171717',
    width: '100%',
    height: '100%',
    padding: 5,
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
    marginTop: '20px',
    marginBottom: 5,
    background: 'transparent',
    width: '50px',
    height: '50px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '50px',
    color: '#001399',
    textAlign: 'center',
  },

  buttonOpen: {
    backgroundColor: 'transparent',
    width: '100%',
    zIndex: 1
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
