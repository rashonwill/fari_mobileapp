import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  Alert,
  TextInput,
  SafeAreaView,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
  Pressable,
  StatusBar
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {
  BottomSheet,
  Button,
  ButtonGroup,
  withTheme,
  ListItem,
} from 'react-native-elements';
import {
  NavigationContainer,
  DefaultTheme,
  useRoute,
  useNavigation,
} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { useState, useEffect } from 'react';
import GestureRecognizer from 'react-native-swipe-gestures';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Foundation } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

import Cart from './Cart';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const WIDTH2 = Dimensions.get("screen").width/2-40;

function MyOrders({navigation}) {
  const [myOrders, setMyOrders] = useState({});
  const [customerOrders, setCustomerOrders] = useState({});

  useEffect(() => {
    const getUser = async () => {
      const loggedInUser = await AsyncStorage.getItem('fariToken');
      if (!loggedInUser) {
        Alert.alert('Sign in to view your orders');
      }
      if (loggedInUser) {
        return;
      }
    };

    async function getMyOrders() {
      let customerid = await AsyncStorage.getItem('userID');
      let USER_TOKEN = await AsyncStorage.getItem('fariToken');
      let TOKEN = JSON.parse(USER_TOKEN);
      try {
        const response = await fetch(
          `https://fari-testapi.herokuapp.com/api/store/customerorders/${customerid}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );
        const data = await response.json();
        setMyOrders(data.orders);
        return data.orders;
      } catch (error) {
        console.log(
          'Oops Something Went Wrong! Could not update order status.',
          error
        );
      }
    }

    getUser().then(getMyOrders);
  }, []);

  return (
    <>
    <StatusBar barStyle="light-content" />
      <View style={styles.table}>
        <View style={styles.columns}>
          <Text style={styles.firstcolumnText}>Order#</Text>
          <Text style={styles.columnText}>Product</Text>
          <Text
            style={{
              marginLeft: 100,
              color: '#fdfbf9',
              textAlign: 'center',
              borderRightColor: '#a9a9b0',
              borderRightWidth: 2,
              margin: 10,
              fontSize: 20,
              fontFamily: 'Teko_700Bold',
            }}>
            Status
          </Text>
        </View>
        <ScrollView>
          {myOrders && myOrders.length === 0 && (
            <Text style={styles.message}>
              You do not have any order history.
            </Text>
          )}

          {myOrders && myOrders.length > 0
            ? myOrders.map((orders) => {
                return (
                  <View style={styles.rows}>
                    <Text
                      style={{
                        marginRight: 20,
                        color: '#fdfbf9',
                        textAlign: 'center',
                        margin: 10,
                        marginLeft: 25,
                        fontSize: 18,
                        fontFamily: 'Teko_700Bold',
                      }}>
                      {orders.orderid}
                    </Text>
                    <Image
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        marginLeft: 30,
                      }}
                      source={{
                        uri: orders.prod_img,
                      }}
                    />
                    <Text
                      style={styles.rowsText}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {orders.product_name}
                    </Text>
                    <Text
                      style={styles.rowsText}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {orders.vendor_status}
                    </Text>
                  </View>
                );
              })
            : null}
        </ScrollView>
      </View>
    </>
  );
}


const styles = StyleSheet.create({
 
  table: {
    width: '100%',
    height: '100%',
    background: 'black',
  },
  columns: {
    borderBottomColor: '#a9a9b0',
    borderBottomWidth: 2,
    display: 'flex',
    flexDirection: 'row',
    padding: 5,
    backgroundColor: '#0C1559',
  },

  rows: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    marginBottom: 10,
    backgroundColor: 'black',
    opacity: '.7',
    height: 70,
  },
  columnText: {
    color: '#fdfbf9',
    textAlign: 'center',
    borderRightColor: '#a9a9b0',
    borderRightWidth: 2,
    margin: 10,
    fontSize: 20,
    fontFamily: 'Teko_700Bold',
  },

  firstcolumnText: {
    color: '#fdfbf9',
    textAlign: 'center',
    borderRightColor: '#a9a9b0',
    borderRightWidth: 2,
    margin: 8,
    fontSize: 20,
    fontFamily: 'Teko_700Bold',
  },

  rowsText: {
    color: '#fdfbf9',
    textAlign: 'center',
    borderRightColor: '#a9a9b0',
    borderRightWidth: 2,
    margin: 10,
    fontSize: 16,
    fontFamily: 'Teko_700Bold',
    flex: 1,
  },
  message: {
    fontSize: 21,
    textAlign: 'center',
    margin: '1rem auto',
    marginTop: 250,
    color: '#a9a9b0',
    fontFamily: 'Teko_700Bold',
  },
});


export default MyOrders;