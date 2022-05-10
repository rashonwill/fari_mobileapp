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


function CustomerOrders({navigation}) {
  const [customerOrders, setCustomerOrders] = useState({});


  useEffect(() => {
    const getUser = async () => {
      const loggedInUser = await AsyncStorage.getItem('fariToken');
      if (!loggedInUser) {
        Alert.alert('Sign in to view your customer orders');
      }
      if (loggedInUser) {
        return;
      }
    };

    async function getCustomerOrders() {
      let vendorid = await AsyncStorage.getItem('vendorID');
      let USER_TOKEN = await AsyncStorage.getItem('fariToken');
      let TOKEN = JSON.parse(USER_TOKEN);
      try {
        const response = await fetch(
          `https://fari-testapi.herokuapp.com/api/store/vendororders/${vendorid}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );
        const data = await response.json();
        setCustomerOrders(data.orders);
        return data.orders;
      } catch (error) {
        console.log(
          'Oops Something Went Wrong! Could not update order status.',
          error
        );
      }
    }

    getUser().then(getCustomerOrders);
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
              marginLeft: 40,
              color: '#fdfbf9',
              textAlign: 'center',
              borderRightColor: '#a9a9b0',
              borderRightWidth: 2,
              margin: 10,
              fontSize: 20,
              fontFamily: 'Teko_700Bold',
            }}>
            Total
          </Text>
          <Text style={styles.columnText}>Status</Text>
        </View>
        <ScrollView>
          {customerOrders && customerOrders.length === 0 && (
            <Text style={styles.message}>
              You do not have any customer orders.
            </Text>
          )}

          {customerOrders && customerOrders.length > 0 ? (
            customerOrders.map((orders) => {
              return orders.vendor_status === 'Fulfillment Complete' ? (
                <View style={styles.rows}>
                  <Text
                    style={{
                      marginRight: 12,
                      color: '#fdfbf9',
                      textAlign: 'center',
                      margin: 5,
                      marginLeft: 25,
                      fontSize: 18,
                      fontFamily: 'Teko_700Bold',
                    }}>
                    {orders.id}
                  </Text>
                  <Image
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      marginLeft: 20,
                    }}
                    source={{
                      uri: orders.prod_img,
                    }}
                  />
                  <Text
                    style={styles.rowsText}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    {orders.product_name}
                  </Text>

                  <Text
                    style={styles.rowsText}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    ${orders.order_total}
                  </Text>
                  <Text
                    style={styles.rowsText}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    {orders.order_status}
                  </Text>
                </View>
              ) : (
                <View style={styles.rowsUnfulfilled}>
                  <Foundation
                    name="burst-new"
                    size={40}
                    color="#48A14D"
                    style={{
                      position: 'absolute',
                      zIndex: 20,
                      marginTop: -5,
                    }}
                  />
                  <Text
                    style={{
                      marginRight: 12,
                      color: '#fdfbf9',
                      textAlign: 'center',
                      margin: 5,
                      marginLeft: 25,
                      fontSize: 18,
                      fontFamily: 'Teko_700Bold',
                    }}>
                    {orders.id}
                  </Text>
                  <Image
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      marginLeft: 20,
                    }}
                    source={{
                      uri: orders.prod_img,
                    }}
                  />
                  <Text
                    style={styles.rowsText}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    {orders.product_name}
                  </Text>

                  <Text
                    style={styles.rowsText}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    ${orders.order_total}
                  </Text>
                  <Text
                    style={styles.rowsText}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    {orders.order_status}
                  </Text>
                </View>
              );
            })
          ) : (
            <Text style={styles.message}></Text>
          )}
        </ScrollView>
      </View>
    </>
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
    alignContent: "space-between",
    backgroundColor: '#171717',
    width: WIDTH,
    height: '100%',
  },
  item: {
    marginBottom: '25px',
    backgroundColor: 'black',
    opacity: '.9',
    width: WIDTH2,
    height: 450,
    padding: 20,
    margin: 20,
    shadowColor: 'black',
    shadowRadius: 10,
    shadowOpacity: 1,
    shadowOffset: { width: -2, height: 4 },
    borderRadius: 30,
    color: '#FDFBF9',
    fontFamily: 'Teko',
    letterSpacing: '.04rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  
  },

  itemHeader: {
    backgroundColor: 'transparent',
    fontSize: '18px',
    width: '100%',
    maxHeight: 150,
    minHeight: 150,
    display: 'flex',
    flexDirectin: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0
  },

  itemPiece: {
    width: '100%',
    height: 150,
    marginTop: '25px',
    borderRadius: 5,
  },

  itemFooter: {
    backgroundColor: 'transparent',
    fontSize: '20px',
    height: 150,
    width: '100%',
    color: '#fdfbf9',
    display: 'flex',
    flexDirectin: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  itemOutofStock: {
    backgroundColor: 'black',
    fontSize: 18,
    height: 50,
    color: 'red',
    fontFamily: 'Teko_700Bold',
  },

  btn: {
    backgroundColor: '#322f30',
    color: '#FDFBF9',
    fontWeight: 'bold',
    textAlign: 'center',
    borderRadius: 10,
    padding: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    width: 150,
    height: 50,
    fontSize: 14,
  },

 
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

  rowsUnfulfilled: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    marginBottom: 10,
    backgroundColor: 'black',
    // backgroundColor: '#B2022F',
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


export default CustomerOrders;