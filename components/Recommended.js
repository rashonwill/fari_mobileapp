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
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { BottomSheet, Button, ListItem, Icon } from 'react-native-elements';
import Constants from 'expo-constants';
import {
  NavigationContainer,
  DefaultTheme,
  useRoute,
  useNavigation,
} from '@react-navigation/native';

import { AppLoading } from 'expo';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

import { Video, Audio, AVPlaybackStatus } from 'expo-av';

function Recommended() {
  const [morerecommended, setMoreRecommended] = useState(false);

  const video = React.useRef(null);
  const route = useRoute();

  useEffect(() => {
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
        console.log(data);
        setMoreRecommended(data.uploads);
        return data.uploads;
      } catch (error) {
        console.error('Oops could not get recommended videos', error);
      }
    }

    recommendedVideos();
  }, [route]);
  const navigation = useNavigation();
  return (
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
                          onPress={() => {
                            AsyncStorage.setItem(
                              'videoID',
                              JSON.stringify(uploads.videoid)
                            ),
                              navigation.setParams({
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
                        numberOfLines={3}
                        ellipsizeMode="tail"
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
}

const styles = StyleSheet.create({
  recommendedSection: {
    backgroundColor: '#171717',
    width: '100%',
    height: 350,
    fontSize: '20px',
    padding: 5,
    flex: 1,
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

  message: {
    fontSize: 21,
    textAlign: 'center',
    margin: '1rem auto',
    marginTop: 50,
    color: '#a9a9b0',
    fontFamily: 'Teko_700Bold',
  },
});

export default React.memo(Recommended);
