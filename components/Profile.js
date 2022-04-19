import * as React from 'react';
import { useState, useEffect } from 'react';
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
  TextInput,
  Keyboard,
} from 'react-native';
import { BottomSheet, Button, ListItem } from 'react-native-elements';
import {
  NavigationContainer,
  DefaultTheme,
  useRoute,
  useNavigation,
} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Searchbar } from 'react-native-paper';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';

const Profile = () => {
  const video = React.useRef(null);
  const navigation = useNavigation();
  const [userUploads, setUserUploads] = useState();
  const [user, setUser] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      const loggedInUser = await AsyncStorage.getItem('fariToken');
      if (!loggedInUser) {
        return;
      }
      if (loggedInUser) {
        setUser(JSON.parse(loggedInUser));
      }
    };

    const fetchchannelUploads = async () => {
      let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));
      let channelid = await AsyncStorage.getItem('channelID');

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
      setUserUploads(data.channelUploads);
      return data.channelUploads;
    };

    getUser().then(fetchchannelUploads);
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View styles={styles.uploads}>
          <ScrollView>
            {userUploads && userUploads.length === 0 && (
              <Text style={styles.message}>
                You do not have any uploads yet.
              </Text>
            )}
            {userUploads && userUploads.length > 0
              ? userUploads.map((channelUploads) => {
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
                          onPress={() =>
                            navigation.navigate('Theater', {
                              videoid: channelUploads.videoid,
                              videotitle: channelUploads.videotitle,
                              videodescription: channelUploads.videodescription,
                              videofile: channelUploads.videofile,
                              videothumbnail: channelUploads.videothumbnail,
                              videocreator: channelUploads.channel_name,
                              creatoravatar: channelUploads.channelpic,
                              videoviewcount: channelUploads.videoviewcount,
                              videolikecount: channelUploads.videolikecount,
                              videodislikecount:
                                channelUploads.videodislikecount,
                              channelid: channelUploads.channelid,
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
};

const Analytics = () => {
  const [revenueTotal, setRevenueTotal] = useState();
  const [viewsTotal, setViewsTotal] = useState();
  const [likes, setLikes] = useState();
  const [dislikes, setDislikes] = useState();
  const [comments, setComments] = useState();
  const [soldtotal, setSoldTotal] = useState();
  useEffect(() => {
    async function totalEarningsRentals() {
      let channelid = JSON.parse(await AsyncStorage.getItem('channelID'));
      let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));

      try {
        const response = await fetch(
          `https://fari-testapi.herokuapp.com/api/analytics/rentaltotals/${channelid}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );
        const data = await response.json();
        await AsyncStorage.setItem(
          'rentalTotal',
          JSON.stringify(data.total[0].earningstotal)
        );
        return data.total;
      } catch (error) {
        console.log('Oops Something Went Wrong! Could not rental total');
      }
    }

    async function totalEarningsMarketplace() {
      let vendorid = JSON.parse(await AsyncStorage.getItem('vendorID'));
      let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));
      try {
        const response = await fetch(
          `https://fari-testapi.herokuapp.com/api/analytics/markettotals/${vendorid}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );
        const data = await response.json();
        await AsyncStorage.setItem(
          'marketPlaceEarnings',
          JSON.stringify(data.total[0].earningstotal)
        );
        return data.total;
      } catch (error) {
        console.log(
          'Oops Something Went Wrong! Could not get marektplace total.'
        );
      }
    }

    async function totalEarnings() {
      let shopEarnings = JSON.parse(
        await AsyncStorage.getItem('marketPlaceEarnings')
      );

      let rentalEarnings = JSON.parse(
        await AsyncStorage.getItem('rentalTotal')
      );

      let totalChannelEarnings =
        parseFloat(shopEarnings) + parseFloat(rentalEarnings);

      let allEarningsTotal = totalChannelEarnings.toFixed(2);

      setRevenueTotal(allEarningsTotal);
    }

    async function totalViews() {
      let channelid = JSON.parse(await AsyncStorage.getItem('channelID'));
      let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));

      try {
        const response = await fetch(
          `https://fari-testapi.herokuapp.com/api/analytics/viewstotal/${channelid}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );
        const data = await response.json();
        console.log(data);
        setViewsTotal(data.total[0].totalviews);
        return data.total;
      } catch (error) {
        console.log('Oops Something Went Wrong! Could not views total', error);
      }
    }

    async function totalLikes() {
      let channelid = JSON.parse(await AsyncStorage.getItem('channelID'));
      let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));

      try {
        const response = await fetch(
          `https://fari-testapi.herokuapp.com/api/analytics/likestotal/${channelid}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );
        const data = await response.json();
        setLikes(data.total[0].totallikes);
        return data.total;
      } catch (error) {
        console.log('Oops Something Went Wrong! Could not likes total');
      }
    }

    async function totalDislikes() {
      let channelid = JSON.parse(await AsyncStorage.getItem('channelID'));
      let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));

      try {
        const response = await fetch(
          `https://fari-testapi.herokuapp.com/api/analytics/dislikestotal/${channelid}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );
        const data = await response.json();
        setDislikes(data.total[0].totaldislikes);
        return data.total;
      } catch (error) {
        console.log('Oops Something Went Wrong! Could not dislikes total');
      }
    }

    async function totalComments() {
      let channelid = JSON.parse(await AsyncStorage.getItem('channelID'));
      let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));

      try {
        const response = await fetch(
          `https://fari-testapi.herokuapp.com/api/analytics/commentstotal/${channelid}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );
        const data = await response.json();
        setComments(data.total[0].count);
        return data.total;
      } catch (error) {
        console.log(
          'Oops Something Went Wrong! Could not comments total',
          error
        );
      }
    }

    async function totalRentedSold() {
      let channelid = JSON.parse(await AsyncStorage.getItem('channelID'));
      let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));

      try {
        const response = await fetch(
          `https://fari-testapi.herokuapp.com/api/analytics/rentedtotal/${channelid}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );
        const data = await response.json();
        await AsyncStorage.setItem(
          'rentalsSold',
          JSON.stringify(data.total[0].count)
        );
        return data.total;
      } catch (error) {
        console.log(
          'Oops Something Went Wrong! Could not get total rented from channel.',
          error
        );
      }
    }

    async function totalShopSold() {
      let vendorid = JSON.parse(await AsyncStorage.getItem('vendorID'));
      let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'));

      try {
        const response = await fetch(
          `https://fari-testapi.herokuapp.com/api/analytics/soldproductstotal/${vendorid}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );
        const data = await response.json();
        await AsyncStorage.setItem(
          'productsSold',
          JSON.stringify(data.total[0].count)
        );
        return data.total;
      } catch (error) {
        console.log(
          'Oops Something Went Wrong! Could not get total products for vendor.',
          error
        );
      }
    }

    async function totalSold() {
      let productsSold = JSON.parse(await AsyncStorage.getItem('productsSold'));
      let rentalsSold = JSON.parse(await AsyncStorage.getItem('rentalsSold'));
      let totalThingsSold = parseInt(productsSold) + parseInt(rentalsSold);
      let allSells = totalThingsSold;
      setSoldTotal(totalThingsSold);
    }

    totalEarningsRentals()
      .then(totalEarningsMarketplace)
      .then(totalEarnings)
      .then(totalViews)
      .then(totalComments)
      .then(totalLikes)
      .then(totalDislikes)
      .then(totalRentedSold)
      .then(totalShopSold)
      .then(totalSold);
  }, []);

  return (
    <>
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.statcard}>
            <Foundation name="dollar" size={50} color="#fdfbf9" />
            <Text
              style={{
                fontFamily: 'Teko_700Bold',
                fontSize: 23,
                color: '#fdfbf9',
              }}>
              ESTIMATED EARNINGS: ${revenueTotal}
            </Text>
          </View>

          <View style={styles.statcard}>
            <EvilIcons name="eye" size={50} color="#fdfbf9" />
            <Text
              style={{
                fontFamily: 'Teko_700Bold',
                fontSize: 23,
                color: '#fdfbf9',
              }}>
              TOTAL VIEWS: {viewsTotal}
            </Text>
          </View>
          <View style={styles.statcard}>
            <FontAwesome name="comment" size={50} color="#fdfbf9" />
            <Text
              style={{
                fontFamily: 'Teko_700Bold',
                fontSize: 23,
                color: '#fdfbf9',
              }}>
              TOTAL COMMENTS: {comments ? comments : '0'}
            </Text>
          </View>

          <View style={styles.statcard}>
            <FontAwesome name="thumbs-o-up" size={50} color="#fdfbf9" />
            <Text
              style={{
                fontFamily: 'Teko_700Bold',
                fontSize: 23,
                color: '#fdfbf9',
              }}>
              TOTAL LIKES: {likes}
            </Text>
          </View>
          <View style={styles.statcard}>
            <FontAwesome name="thumbs-o-down" size={50} color="#fdfbf9" />
            <Text
              style={{
                fontFamily: 'Teko_700Bold',
                fontSize: 23,
                color: '#fdfbf9',
              }}>
              TOTAL DISLIKES: {dislikes}
            </Text>
          </View>
          <View style={styles.statcard}>
            <Entypo name="bar-graph" size={50} color="#fdfbf9" />
            <Text
              style={{
                fontFamily: 'Teko_700Bold',
                fontSize: 23,
                color: '#fdfbf9',
              }}>
              TOTAL ITEMS SOLD: {soldtotal}
            </Text>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const CustomHeader = (props) => {
  const navigation = useNavigation();
  const [profile, setProfile] = useState();
  const [settings, setSettings] = useState(false);

  const logoutUser = async () => {
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys);
  };

  const onLogOut = () => {
    logoutUser();
  };

  useEffect(() => {
    const fetchchannelInfo = async () => {
      let USER_TOKEN = await AsyncStorage.getItem('fariToken');
      let TOKEN = JSON.parse(USER_TOKEN);
      let username = await AsyncStorage.getItem('userName');
      let usernameParse = JSON.parse(username);
      try {
        const response = await fetch(
          `https://fari-testapi.herokuapp.com/api/users/myprofile/channel/${usernameParse}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );
        let data = await response.json();
        console.log(data)
        setProfile(data.profile);
        return data.profile;
      } catch (error) {
        console.log('oops something went wrong', error);
      }
    };
    fetchchannelInfo();
  }, []);

  return (
    <>
      <DrawerContentScrollView {...props}>
        {profile && profile.length > 0
          ? profile.map((profile) => {
              return (
                <>
                  <View style={styles.profile}>
                    <Image
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        margin: 10,
                        backgroundColor: '#fdfbf9',
                      }}
                      source={{
                        uri: profile.profile_avatar
                          ? profile.profile_avatar
                          : 'https://cdn.onlinewebfonts.com/svg/img_258083.png',
                      }}
                    />
                    <Text
                      style={{
                        color: '#fdfbf9',
                        fontSize: 18,
                        fontFamily: 'Teko_700Bold',
                      }}>
                      {profile.channelname}
                    </Text>
                    <Text
                      style={{
                        color: '#fdfbf9',
                        fontSize: 18,
                        fontFamily: 'Teko_700Bold',
                      }}>
                      {profile.subscriber_count} Subscribers
                    </Text>
                  </View>
                </>
              );
            })
          : null}
        <View>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      <View
        style={{
          marginTop: 10,
          height: 100,
          borderWidth: 0,
          borderTopWidth: 1,
          borderTopColor: '#171717',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Pressable
            style={{ height: 30, display: 'flex', flexDirection: 'row' }}
            onPress={() => {
              onLogOut();
              navigation.navigate('Login');
            }}>
            <MaterialCommunityIcons name="logout" size={24} color="#fdfbf9" />
            <Text
              style={{
                color: '#fdfbf9',
                fontSize: 18,
                fontFamily: 'Teko_700Bold',
                textDecorationLine: 'underline',
                textDecorationColor: '#fdfbf9',
                marginTop: -5,
              }}>
              {' '}
              Logout{' '}
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
};

const Drawer = createDrawerNavigator();
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    backgroundColor: '#171717',
    color: '#fdfbf9',
  },
};

function MyDrawer() {
  return (
    <>
      <Drawer.Navigator
        drawerContent={(props) => <CustomHeader {...props} />}
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#0c1559',
            width: 250,
            fontFamily: 'Teko_700Bold',
          },
          headerStyle: {
            backgroundColor: '#0c1559',
            color: '#fdfbf9',
          },
          drawerLabelStyle: {
            color: '#fdfbf9',
            fontFamily: 'Teko_700Bold',
            fontSize: 18,
          },
        }}>
        <Drawer.Screen
          name="Profile"
          component={Profile}
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
            unmountOnBlur: true,
          }}
        />
        <Drawer.Screen
          name="Analytics"
          component={Analytics}
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
            unmountOnBlur: true,
          }}
        />
      </Drawer.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  profile: {
    height: 200,
    width: '100%',
    backgroundColor: 'transparent',
    padding: 10,
    marginBottom: 15,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 0,
    borderBottomWidth: 0.2,
    borderBottomColor: '#fdfbf9',
  },

  uploads: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    width: '100%',
    height: '100%',
    padding: 10,
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

  message: {
    fontSize: 21,
    textAlign: 'center',
    margin: '1rem auto',
    marginTop: 50,
    color: '#a9a9b0',
    fontFamily: 'Teko_700Bold',
  },

  container: {
    backgroundColor: '#171717',
    fontFamily: 'Teko_700Bold',
    width: '100%',
    height: '100%',
  },

  buttonOpen: {
    backgroundColor: 'transparent',
    width: '100%',
  },

  statcard: {
    width: '100%',
    height: 250,
    backgroundColor: '#171717',
    shadowColor: '#0c1559',
    shadowRadius: 10,
    shadowOpacity: 1,
    shadowOffset: { width: -2, height: 4 },
    borderRadius: 20,
    fontFamily: 'Teko_700Bold',
    marginBottom: 10,
    marginTop: 10,
    padding: 10,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function App() {
  return <MyDrawer />;
}
