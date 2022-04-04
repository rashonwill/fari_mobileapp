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
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { BottomSheet, Button, ListItem, Icon } from 'react-native-elements';
import Constants from 'expo-constants';

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

import { Video, Audio, AVPlaybackStatus } from 'expo-av';

function Theater({ navigation }) {
  let [fontsLoaded, error] = useFonts({
    PermanentMarker_400Regular,
    Teko_700Bold,
  });

  const video = React.useRef(null);
  const route = useRoute();

  const [isVisible, setIsVisible] = useState(false);
  const [info, setInfo] = useState(true);
  const [vidcomments, setVidComments] = useState(false);
  const [morerecommended, setMoreRecommended] = useState(false);
  const [watchpage, setWatchPage] = useState(true);
  const [likeColor, setlikeColor] = useState('#fdfbf9');
  const [dislikeColor, setdislikeColor] = useState('#fdfbf9');
  const [favColor, setfavColor] = useState('#fdfbf9');
  const [laterColor, setlaterColor] = useState('#fdfbf9');
  const [visible, setVisible] = useState();

  useEffect(() => {
    async function playVideo() {
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
      const loggedInUser = await AsyncStorage.getItem('fariToken');
      let TOKEN = JSON.parse(loggedInUser);
      let videoid = route.params.videoid;
      let id = AsyncStorage.getItem('userID');
      let userid = JSON.parse(id);
      console.log('we at least trying to check the likes');

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
          AsyncStorage.setItem('likeID', data.iLike[0].likeid);
        }
        return data;
      } catch (error) {
        console.error('Oops could not determine if you like this video', error);
      }
    }

    async function checkUserDisLikes() {
      const loggedInUser = await AsyncStorage.getItem('fariToken');
      let TOKEN = JSON.parse(loggedInUser);
      let videoid = route.params.videoid;
      let id = AsyncStorage.getItem('userID');
      let userid = JSON.parse(id);
      console.log('we at least trying to check the dislikes');

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
          AsyncStorage.setItem('disLikeID', data.idisLike[0].dislikeid);
        }
        return data;
      } catch (error) {
        console.error(
          'Oops could not determine if you dislike this video',
          error
        );
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

    async function recommendedVideos() {
      try {
        const response = await fetch(
          `https://fari-testapi.herokuapp.com/api/content/recommended`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const data = await response.json();
        setMoreRecommended(data.uploads);
        return data.uploads;
      } catch (error) {
        console.error('Oops could not get recommended videos', error);
      }
    }

    playVideo()
      .then(videoComments)
      .then(recommendedVideos)
      .then(checkUserLikes)
      .then(checkUserDisLikes);
  }, [route]);

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
    const loggedInUser = await AsyncStorage.getItem('fariToken');
    let TOKEN = JSON.parse(loggedInUser);
    if (!loggedInUser) {
      Alert.alert('Sign in to use this feature');
    }
    if (loggedInUser) {
      var favedUser = await AsyncStorage.getItem('userID');
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
    const loggedInUser = await AsyncStorage.getItem('fariToken');
    let TOKEN = JSON.parse(loggedInUser);
    if (!loggedInUser) {
      Alert.alert('Sign in to use this feature');
    }
    if (loggedInUser) {
      var listedUser = await AsyncStorage.getItem('userID');

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
    const loggedInUser = await AsyncStorage.getItem('fariToken');
    let TOKEN = JSON.parse(loggedInUser);
    if (!loggedInUser) {
      Alert.alert('Sign in to use this feature');
    } else if (loggedInUser) {
      var userlike = await AsyncStorage.getItem('userID');
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
        console.log(data);
        colorChange();
        return data;
      } catch (error) {
        console.error('Oops could not like that video', error);
      }
    }
  }

  async function likeStatus() {
    const loggedInUser = await AsyncStorage.getItem('fariToken');
    let TOKEN = JSON.parse(loggedInUser);
    if (!loggedInUser) {
      Alert.alert('Sign in to use this feature');
    }
    if (loggedInUser) {
      let videoid = route.params.videoid;
      var userid = await AsyncStorage.getItem('userID');

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
          colorChange();
        }
        return data;
      } catch (error) {
        console.error('Oops could not determine if you like that video', error);
      }
    }
  }

  async function revokeLike() {
    const loggedInUser = await AsyncStorage.getItem('fariToken');
    let TOKEN = JSON.parse(loggedInUser);
    let videoid = route.params.videoid;
    var id = await AsyncStorage.getItem('userID');

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
      return data;
    } catch (error) {
      console.error('Oops could not revoke the like of that video', error);
    }
  }

  async function userdisLiked() {
    const loggedInUser = await AsyncStorage.getItem('fariToken');
    let TOKEN = JSON.parse(loggedInUser);
    if (!loggedInUser) {
      Alert.alert('Sign in to use this feature');
    } else if (loggedInUser) {
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
        console.log(data);
        colorChange2();
        return data;
      } catch (error) {
        console.error('Oops could not dislike that video', error);
      }
    }
  }

  async function dislikeStatus() {
    const loggedInUser = await AsyncStorage.getItem('fariToken');
    let TOKEN = JSON.parse(loggedInUser);
    var userid = await AsyncStorage.getItem('userID');
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
    const loggedInUser = await AsyncStorage.getItem('fariToken');
    let TOKEN = JSON.parse(loggedInUser);
    var id = await AsyncStorage.getItem('userID');
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
      return data;
    } catch (error) {
      console.error('Oops could not revoke the dislike of that video', error);
    }
  }

  const Synopsis = () => (
    <ScrollView>
      <View className="feature-info" style={styles.featureInfo} info={info}>
        <View className="channelInfo" style={styles.channelInfo}>
          <View style={{ width: 70, height: 70 }}>
            <Image
              source={{
                uri: route.params.creatoravatar,
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
              fontSize: '22px',
              color: '#fdfbf9',
              fontFamily: 'Teko_700Bold',
              letterSpacing: '0.02rem',
              margin: 8,
              marginTop: 22,
            }}>
            {route.params.videocreator}
          </Text>
        </View>
        <View style={{ display: 'flex', flexDirection: 'column' }}>
          <Text
            style={{
              fontSize: '18px',
              color: '#fdfbf9',
              fontFamily: 'Teko_700Bold',
              letterSpacing: '0.02rem',
              margin: 5,
              marginTop: 20,
            }}>
            {route.params.videotitle}
          </Text>

          <Text
            style={{
              fontSize: '16px',
              color: '#fdfbf9',
              fontFamily: 'Teko_700Bold',
              letterSpacing: '0.02rem',
              margin: 5,
              marginTop: 5,
            }}>
            Views: {route.params.videoviewcount}
          </Text>
        </View>

        <View className="video-info" style={styles.videoInfo}>
          <Text
            style={{
              fontSize: '16px',
              color: '#fdfbf9',
              fontFamily: 'Teko_700Bold',
              letterSpacing: '0.01rem',
              margin: 5,
              marginTop: 10,
            }}>
            {route.params.videodescription}
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  const Comments = () => (
    <View style={styles.commentsSection}>
      <ScrollView>
        {vidcomments && vidcomments.length == 0 && (
          <Text style={styles.message}>No comment(s)</Text>
        )}
        {vidcomments && vidcomments.length > 0
          ? vidcomments.map((comments) => {
              return (
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
  );

  const Recommended = ({ navigation }) => (
    
    <View className="recommended" style={styles.recommendedSection}>
      <ScrollView>
        {morerecommended && morerecommended.length == 0 && (
          <Text style={styles.message}>No recommendations</Text>
        )}
        {morerecommended && morerecommended.length > 0
          ? morerecommended.map((uploads) => {
              return (
                <View style={styles.recommendCard}>
                  <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <View style={styles.videoView}>
                      <Video
                        style={styles.videoRecommended}
                        ref={video}
                        source={{
                          uri: uploads.videofile,
                        }}
                        posterSource={{
                          uri: uploads.videothumbnail,
                        }}
                        resizeMode={'fill'}
                        usePoster
                        isMuted></Video>
                      <View style={styles.controls}>
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
                      </View>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirecton: 'column',
                        flexShrink: 1,
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: '16px',
                          color: '#a9a9b0',
                          fontFamily: 'Teko_700Bold',
                          letterSpacing: '0.01rem',
                          marginTop: 10,
                          margin: 5,
                          opacity: 1,
                          flex: 1,
                        }}>
                        {' '}
                        {uploads.channel_name}
                      </Text>
                      <Text
                        numberOfLines={5}
                        style={{
                          fontSize: '15px',
                          color: '#a9a9b0',
                          fontFamily: 'Teko_700Bold',
                          letterSpacing: '0.01rem',
                          margin: 5,
                          marginTop: -5,
                          opacity: 1,
                          flex: 1,
                        }}>
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

  const renderScene = SceneMap({
    synopsis: Synopsis,
    comments: Comments,
    recommended: Recommended,
  });

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'synopsis', title: 'Synopsis' },
    { key: 'comments', title: 'Comments' },
    { key: 'recommended', title: 'Recommeded' },
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
            fontSize: 15,
            fontFamily: 'Teko_700Bold',
          }}>
          {route.title}
        </Text>
      )}
    />
  );

  return (
    <>
      <GestureRecognizer onSwipeDown={(watchpage) => setWatchPage(false)}>
        <View style={styles.mainEvent}>
          <View className="feature" style={styles.feature}>
            <Video
              style={styles.video2}
              ref={video}
              source={{
                uri: route.params.videofile,
              }}
              posterSource={{
                uri: route.params.videothumbnail,
              }}
              resizeMode={'fill'}
              usePoster={true}
              isBuffering={true}
              useNativeControls={true}
              shouldPlay={true}
              ignoreSilentSwitch={'ignore'}
              playsInSilentLockedModeIOS={true}
              staysActiveInBackground={false}
              onLoad={async () => {
                await video.current?.playAsync();
                await video.current?.pauseAsync();
              }}
              
              />
          </View>

          <View style={styles.theaterModeOptions2}>
            <View style={styles.interactiveIcons}>
              <Pressable
                style={{ margin: 15, display: 'flex', flexDirection: 'row' }}
                onPress={likeStatus}>
                <TouchableOpacity onPress={setlikeColor}>
                  <FontAwesome name="thumbs-up" size={24} color={likeColor} />
                </TouchableOpacity>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 21,
                    marginLeft: 6,
                    marginTop: -4,
                    fontFamily: 'Teko_700Bold',
                  }}>
                  {route.params.videolikecount}
                </Text>
              </Pressable>
              <Pressable
                style={{ margin: 15, display: 'flex', flexDirection: 'row' }}
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
                    marginTop: -4,
                    fontFamily: 'Teko_700Bold',
                  }}>
                  {route.params.videodislikecount}
                </Text>
              </Pressable>

              <Pressable style={{ margin: 15 }} onPress={favedVideo}>
                <TouchableOpacity onPress={setfavColor}>
                  <FontAwesome name="heart" size={24} color={favColor} />
                </TouchableOpacity>
              </Pressable>

              <Pressable style={{ margin: 15 }} onPress={watchlistVideo}>
                <TouchableOpacity onPress={setlaterColor}>
                  <MaterialIcons
                    name="watch-later"
                    size={24}
                    color={laterColor}
                  />
                </TouchableOpacity>
              </Pressable>
            </View>
          </View>

          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            renderTabBar={renderTabBar}
            style={{ backgroundColor: '#171717', height: '100%' }}
          />
        </View>
      </GestureRecognizer>
    </>
  );
}

const styles = StyleSheet.create({
  mainEvent: {
    background: '#171717',
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
    borderWidth: 1
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
  },

  channelInfo: {
    display: 'flex',
    flexDirection: 'row',
  },

  commentCard: {
    width: '100%',
    minHeight: 100,
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
});

export default Theater;
