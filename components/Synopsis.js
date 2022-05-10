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
  Dimensions
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

import { viewsConversion } from './Conversion'

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;


function Synopsis() {
  const route = useRoute();
  const [nowplaying, setNowPlaying] = useState({});

    useEffect(() => {

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


    getVideoData();

  }, [route]);

  return (
   
<View className="feature-info" style={styles.featureInfo}>
    <ScrollView>
    {nowplaying && nowplaying.length > 0 ? nowplaying.map((uploads) => {
      return(
        <>
        <View className="channelInfo" style={styles.channelInfo}>
          <View style={{ width: 70, height: 70 }}>
            <Image
              source={{
                uri: route.params.creatoravatar ? route.params.creatoravatar : 'https://drotje36jteo8.cloudfront.net/noAvi.png'
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
            Views: {`${viewsConversion(route.params.videoviewcount)}`}
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
            {uploads.videodescription}
          </Text>
        </View>
        </>
      )
    }): null}
    </ScrollView>
  </View>

  )


}


  const styles = StyleSheet.create({

  featureInfo: {
    backgroundColor: '#0c1559',
    width: WIDTH,
    minHeight: 375,
    fontSize: '20px',
    padding: 5,
    flex: 1,
    borderBottomColor: '#fdfbf9',
    borderWidth: 1,
  },

  channelInfo: {
    display: 'flex',
    flexDirection: 'row',
  },



});

export default React.memo(Synopsis);

