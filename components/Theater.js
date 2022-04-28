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
import VideoPlayer from 'expo-video-player'

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

function Theater({ navigation }) {
  let [fontsLoaded, error] = useFonts({
    PermanentMarker_400Regular,
    Teko_700Bold,
  });

  const video = React.useRef(null);
  const route = useRoute();

  const [likeColor, setlikeColor] = useState('#fdfbf9');
  const [dislikeColor, setdislikeColor] = useState('#fdfbf9');
  const [favColor, setfavColor] = useState('#fdfbf9');
  const [laterColor, setlaterColor] = useState('#fdfbf9');
  const [nowplaying, setNowPlaying] = useState([]);
  const [user, setUser] = useState();

  async function setUserID() {
    let userIn = JSON.parse(await AsyncStorage.getItem('userID'));
    if (userIn) {
      setUser(userIn);
    }
  }
  async function getVideoData() {
    let id = route.params.videoid;
    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/content/getVideo/${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      setNowPlaying(data.uploads);
      return data.uploads;
    } catch (error) {
      console.log('Ooops, could not get that video!', error);
    }
  }

  async function updateViews() {
    let id = route.params.videoid;
    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/content/update/viewcount/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Oops could not update views', error);
    }
  }

  async function checkUserLikes() {
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));
    let userid = JSON.parse(await AsyncStorage.getItem('userID'));
    let videoid = route.params.videoid;

    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/content/mylikes/${videoid}/${userid}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      const data = await response.json();
      if (data.iLike.length > 0) {
        colorChange();
        await AsyncStorage.setItem(
          'likeID',
          JSON.stringify(data.iLike[0].likeid)
        );
      }else{
        setlikeColor('#fdfbf9')
      }
      return data;
    } catch (error) {
      console.error('Oops could not determine if you like this video', error);
    }
  }

  async function checkUserDisLikes() {
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));
    let userid = JSON.parse(await AsyncStorage.getItem('userID'));
    let videoid = route.params.videoid;

    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/content/mydislikes/${videoid}/${userid}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      const data = await response.json();
      if (data.idisLike.length > 0) {
        colorChange2();
        await AsyncStorage.setItem(
          'dislikeID',
          JSON.stringify(data.idisLike[0].dislikeid)
        );
      }else{
        setdislikeColor('#fdfbf9')
      }
      return data;
    } catch (error) {
      console.error(
        'Oops could not determine if you dislike this video',
        error
      );
    }
  }

  useEffect(() => {
    getVideoData()
      .then(updateViews)
      .then(setUserID)
      .then(checkUserLikes)
      .then(checkUserDisLikes);
  },);

  function colorChange() {
    setlikeColor('#B2022F');
  }

  function colorChange2() {
    setdislikeColor('#B2022F');
  }

  function colorChange3() {
    setfavColor('#B2022F');
  }

  function colorChange4() {
    setlaterColor('#B2022F');
  }

  async function favedVideo() {
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));
    if (!TOKEN) {
      Alert.alert('Sign in to use this feature');
    }
    if (TOKEN) {
      var favedUser = JSON.parse(await AsyncStorage.getItem('userID'));
      const userFavorited = {
        userFaved: favedUser,
        videoid: route.params.videoid,
        channel: route.params.videocreator,
        channel_avi: route.params.creatoravatar,
        video: route.params.videofile,
        thumbnail: route.params.videothumbnail,
        title: route.params.videotitle,
        channelid: route.params.channelid,
        videoviewcount: route.params.videoviewcount,
      };

      try {
        const response = await fetch(
          `https://fari-testapi.herokuapp.com/api/content/youfavedme`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${TOKEN}`,
            },
            body: JSON.stringify(userFavorited),
          }
        );
        const data = await response.json();
        Alert.alert('Added to Favorites');
        colorChange3();
        return data;
      } catch (error) {
        Alert.alert('Unable to save to your favorites please try again.');
        console.log(error);
      }
    }
  }

  async function watchlistVideo() {
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));
    if (!TOKEN) {
      Alert.alert('Sign in to use this feature');
    }
    if (TOKEN) {
      var listedUser = JSON.parse(await AsyncStorage.getItem('userID'));

      const userLatered = {
        userListed: listedUser,
        videoid: route.params.videoid,
        channel: route.params.videocreator,
        channel_avi: route.params.creatoravatar,
        video: route.params.videofile,
        thumbnail: route.params.videothumbnail,
        title: route.params.videotitle,
        channelid: route.params.channelid,
        videoviewcount: route.params.videoviewcount,
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
            body: JSON.stringify(userLatered),
          }
        );
        const data = await response.json();
        Alert.alert('Added to Watchlist');
        colorChange4();
        console.log(data);
        return data;
      } catch (error) {
        Alert.alert(
          'Unable to save to add to your watchlist please try again.'
        );
        console.log(error);
      }
    }
  }

  async function userLiked() {
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));
    if (!TOKEN) {
      Alert.alert('Sign in to use this feature');
    } else if (TOKEN) {
      var userlike = JSON.parse(await AsyncStorage.getItem('userID'));
      let id = route.params.videoid;
      try {
        const likingUser = {
          likedUser: userlike,
          videoid: id,
        };
        const response = await fetch(
          `https://fari-testapi.herokuapp.com/api/content/youlikeme/${id}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${TOKEN}`,
            },
            body: JSON.stringify(likingUser),
          }
        );
        const data = await response.json();
        getVideoData().then(checkUserLikes);
        return data;
      } catch (error) {
        console.error('Oops could not like that video', error);
      }
    }
  }

  async function likeStatus() {
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));
    if (!TOKEN) {
      Alert.alert('Sign in to use this feature');
    }
    if (TOKEN) {
      let videoid = route.params.videoid;
      var userid = JSON.parse(await AsyncStorage.getItem('userID'));

      try {
        const response = await fetch(
          `https://fari-testapi.herokuapp.com/api/content/mylikes/${videoid}/${userid}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );
        const data = await response.json();
        if (data.iLike.length > 0) {
          revokeLike();
        } else if (data.iLike.length === 0) {
          userLiked();
        }
        return data;
      } catch (error) {
        console.error('Oops could not determine if you like that video', error);
      }
    }
  }

  async function revokeLike() {
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));
    let videoid = route.params.videoid;
    var id = JSON.parse(await AsyncStorage.getItem('likeID'));

    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/content/youlikeme/revoke/${id}/${videoid}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      const data = await response.json();
      setlikeColor('#FDFBF9');
      getVideoData();
      return data;
    } catch (error) {
      console.error('Oops could not revoke the like of that video', error);
    }
  }

  async function userdisLiked() {
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));
    if (!TOKEN) {
      Alert.alert('Sign in to use this feature');
    } else if (TOKEN) {
      var userdislike = await AsyncStorage.getItem('userID');
      let id = route.params.videoid;
      try {
        const dislkingUser = {
          dislikedUser: userdislike,
          videoid: id,
        };
        const response = await fetch(
          `https://fari-testapi.herokuapp.com/api/content/youdislikeme/${id}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${TOKEN}`,
            },
            body: JSON.stringify(dislkingUser),
          }
        );
        const data = await response.json();
        getVideoData().then(checkUserDisLikes);
        return data;
      } catch (error) {
        console.error('Oops could not dislike that video', error);
      }
    }
  }

  async function dislikeStatus() {
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));
    var userid = JSON.parse(await AsyncStorage.getItem('userID'));
    let videoid = route.params.videoid;

    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/content/mydislikes/${videoid}/${userid}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      const data = await response.json();
      if (data.idisLike.length > 0) {
        revokeDisLike();
      } else if (data.idisLike.length === 0) {
        userdisLiked();
      }
      return data.idisLike;
    } catch (error) {
      console.error(
        'Oops could not determine if you dislike that video',
        error
      );
    }
  }

  async function revokeDisLike() {
    let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));
    var id = JSON.parse(await AsyncStorage.getItem('dislikeID'));
    let videoid = route.params.videoid;

    try {
      const response = await fetch(
        `https://fari-testapi.herokuapp.com/api/content/youdislikeme/revoke/${id}/${videoid}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      const data = await response.json();
      setdislikeColor('#fdfbf9');
      getVideoData().then(checkUserDisLikes)
      return data;
    } catch (error) {
      console.error('Oops could not revoke the dislike of that video', error);
    }
  }

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'synopsis':
        return <Synposis />;
      case 'comments':
        return <Comments />;
      case 'recommended':
        return <Recommended />;
    }
  };

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'synopsis', title: 'Synopsis' },
    { key: 'comments', title: 'Comments' },
    { key: 'recommended', title: 'Recommended' },
  ]);

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#fdfbf9', color: '#fdfbf9' }}
      style={{ backgroundColor: '#171717' }}
      renderLabel={({ route, focused, color }) => (
        <Text
          style={{
            color,
            margin: 5,
            fontSize: 14,
            fontFamily: 'Teko_700Bold',
          }}>
          {route.title}
        </Text>
      )}
    />
  );

  return (
    <>
      <View style={styles.mainEvent}>
        <View className="feature" style={styles.feature}>
        <VideoPlayer
            style={{
                  width: '100%',
                  height: '100%',
                  controlsBackgroundColor: 'transparent'
            }}
             ref={video}
             videoProps={{
             shouldPlay: true,
             resizeMode: Video.RESIZE_MODE_CONTAIN,
            source: {
            uri: route.params.videofile,
            },
            }}
      icon={{
          play:     
          <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <>
          <Text style={{ color: '#0C1559', fontSize: 25, fontFamily: 'Teko_700Bold' }}>PLAY</Text> 
          <FontAwesome
          name="play" size={35} color="#0c1559" />
          </>
          </View>,
          pause: 
          <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <>
          <Text style={{ color: '#0C1559', fontSize: 25, fontFamily: 'Teko_700Bold' }}>PAUSE</Text>
          <FontAwesome 
          name="pause" size={35} color="#0C1559" />
          </>
          </View>
      }}
      slider={{
            thumbTintColor: "#0C1559",
            minimumTrackTintColor: "#0C1559",
            maximumTrackTintColor: "#333",
            tapToSeek: true
      }}
            playsInSilentModeIOS={true}
            staysActiveInBackground={false}
            defaultControlsVisible={true}
            controls={true}

          />
        </View>
        <View style={styles.theaterModeOptions2}>
          <ScrollView>
            {nowplaying && nowplaying.length > 0
              ? nowplaying.map((uploads) => {
                  return (
                    <>
                      <View style={styles.interactiveIcons}>
                        <Pressable
                          style={{
                            margin: 15,
                            display: 'flex',
                            flexDirection: 'row',
                            width: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          onPress={likeStatus}>
                          <TouchableOpacity onPress={setlikeColor}>
                            <FontAwesome
                              name="thumbs-up"
                              size={24}
                              color={likeColor}
                            />
                          </TouchableOpacity>
                          <Text
                            style={{
                              color: 'white',
                              fontSize: 21,
                              marginLeft: 6,
                              marginTop: 5,
                              fontFamily: 'Teko_700Bold',
                            }}>
                            {uploads.videolikecount}
                          </Text>
                        </Pressable>
                        <Pressable
                          style={{
                            margin: 15,
                            display: 'flex',
                            flexDirection: 'row',
                            width: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          onPress={dislikeStatus}>
                          <TouchableOpacity onPress={setdislikeColor}>
                            <FontAwesome
                              name="thumbs-down"
                              size={24}
                              color={dislikeColor}
                            />
                          </TouchableOpacity>
                          <Text
                            style={{
                              color: 'white',
                              fontSize: 21,
                              marginLeft: 6,
                              marginTop: 5,
                              fontFamily: 'Teko_700Bold',
                            }}>
                            {uploads.videodislikecount}
                          </Text>
                        </Pressable>

                        <Pressable
                          style={{
                            margin: 15,
                            width: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          onPress={favedVideo}>
                          <TouchableOpacity onPress={setfavColor}>
                            <FontAwesome
                              name="heart"
                              size={24}
                              color={favColor}
                            />
                          </TouchableOpacity>
                        </Pressable>

                        <Pressable
                          style={{
                            margin: 15,
                            width: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          onPress={watchlistVideo}>
                          <TouchableOpacity onPress={setlaterColor}>
                            <MaterialIcons
                              name="watch-later"
                              size={24}
                              color={laterColor}
                            />
                          </TouchableOpacity>
                        </Pressable>
                      </View>
                    </>
                  );
                })
              : null}
          </ScrollView>
        </View>

        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          renderTabBar={renderTabBar}
          style={{ backgroundColor: '#171717', height: '100%' }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mainEvent: {
    backgroundColor: '#171717',
    height: '100%',
    width: '100%',
  },

  theaterModeOptions2: {
    display: 'flex',
    flexDirection: 'row',
    margin: 10,
    marginBottom: -5,
    marginLeft: -5,
  },

  feature: {
    width: '100%',
    height: 300,
  },

  interactiveIcons: {
    display: 'flex',
    flexDirection: 'row',
    margin: 5,
  },
});

export default Theater;
