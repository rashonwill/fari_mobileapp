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
  Pressable,
  TouchableOpacity,
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
import Swipeable from 'react-native-gesture-handler/Swipeable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Foundation } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;



 function Cart({navigation}){
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState();

  async function createShopOrder(){
      let customerid = JSON.parse(await AsyncStorage.getItem('userID'))
      let order_total = JSON.parse(await AsyncStorage.getItem('cartTotal'))
      let TOKEN = JSON.parse(await AsyncStorage.getItem('fariToken'))
	
	
 const newOrder = {
 customerid: customerid,
 order_total: order_total, 
 }

 try {
    const response = await fetch(`https://fari-testapi.herokuapp.com/api/store/new-order`,{
      method: 'POST',  
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`
      },body: JSON.stringify(newOrder)
    })
    const data = await response.json();
    AsyncStorage.setItem('orderID', JSON.stringify(data.customerOrder.id))
    return data;
  } catch (error) {
    console.log('Oops Something Went Wrong! Could not create new order.', error);
  }

}
 


  async function getTotal(){
      let myItems = JSON.parse(await AsyncStorage.getItem('MyCartItems'))
      let totalCart = myItems.reduce((sum, item) => {
        return sum + item.price * item.quantity;
      }, 0).toFixed(2)
      setTotal(totalCart)
      await AsyncStorage.setItem('cartTotal', JSON.stringify(totalCart))
    }

     async function removeCartItem(){
      let newCart = [];	
      let lettingGo = JSON.parse(await AsyncStorage.getItem('productID'))

      let theCart = JSON.parse(await AsyncStorage.getItem('MyCartItems'));
      let removingPurchase = theCart.findIndex(items => items.productid === lettingGo)
	
      theCart.splice(removingPurchase, 1);
      newCart = theCart 
      AsyncStorage.setItem('MyCartItems', JSON.stringify(newCart))
      let cartItem = JSON.parse(await AsyncStorage.getItem('cartItemsCount'))
      let itemCount = cartItem - 1;
      await AsyncStorage.setItem('cartItemsCount', JSON.stringify(itemCount));
      getItems().then(getTotal);
     
  }

    const rightSwipe = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity activeOpacity={0.6}>
                <Pressable
            onPress={() => {
              removeCartItem();
            }}>
        <View style={styles.deleteBox}>

            <FontAwesome name="trash-o" size={24} color="black" />
              </View>
          </Pressable>
      
      </TouchableOpacity>
    );
  };

  async function getItems(){
  let myItems = JSON.parse(await AsyncStorage.getItem('MyCartItems'))	
  if(myItems){
  setItems(myItems)
  }else{
    setItems([])
  }
  }

  useEffect(() => {
    getItems().then(getTotal);
  }, []);
  
  return (
    <>
    <StatusBar barStyle="light-content" />
      <View style={styles.table}>
        <View style={styles.columns}>
          <Text
            style={{
              marginRight: 70,
              color: '#fdfbf9',
              textAlign: 'center',
              margin: 10,
              fontSize: 20,
              fontFamily: 'Teko_700Bold',
            }}>
            Product
          </Text>
          <Text style={styles.firstcolumnText}>Qty/Price</Text>
          <Text style={styles.columnText}>Total</Text>
        </View>
          <ScrollView>
            {items && items.length === 0 && (
              <Text style={styles.message}>
                Your cart is Empty.
              </Text>
            )}
            {items && items.length > 0 ? items.map((item) => {
              return (
                  <Swipeable renderRightActions={rightSwipe}
                   onSwipeableOpen={() => {
                      AsyncStorage.setItem(
                      'productID',
                      JSON.stringify(item.productid)
                    )}
                   }>
                    <View style={styles.rows}>
                    <Image
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        marginLeft: 20,
                        margingTop: 10
                      }}
                      source={{
                        uri: item.image,
                      }}
                    />
                    <Text
                      style={styles.rowsText}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {item.name}
                    </Text>
                      <Text
                      style={styles.rowsText}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {item.quantity} @ ${item.price}
                    </Text>
                      <Text
                      style={styles.rowsText}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      ${item.total}
                    </Text>
                  </View>
                  </Swipeable>
              )
              
            }): null}
            </ScrollView>
            </View>
            <View style={{width: '100%', height: 50, justifyContent:'center', alignItems: 'center'}}>
            <Text style={{color: '#0c1559', fontSize: '20', fontFamily: 'Teko_700Bold'}}> Cart Total: ${total} </Text>
            <Button title="Checkout"
            color="#fdfbf9"
            backgroundColor="#0C1559"
            buttonStyle={styles.button}
            onPress={() => {createShopOrder()}}
            ></Button>
            <View style={styles.paypal}></View>
            </View>
    </>

  )

}


const styles = StyleSheet.create({
    message: {
    fontSize: 21,
    textAlign: 'center',
    margin: '1rem auto',
    marginTop: 200,
    color: '#a9a9b0',
    fontFamily: 'Teko_700Bold',
  },
   table: {
    width: WIDTH,
    height: '85%',
    background: 'black',
  },
  columns: {
    borderBottomColor: '#a9a9b0',
    borderBottomWidth: 2,
    display: 'flex',
    flexDirection: 'row',
    padding: 5,
    backgroundColor: '#a9a9b0',
  },

  rows: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    marginBottom: 10,
    backgroundColor: 'transparent',
    height: 70,
    borderBottomColor: '#a9a9b0',
    borderBottomWidth: 2,
  },


  columnText: {
    color: '#fdfbf9',
    textAlign: 'center',
    borderRightColor: '#a9a9b0',
    borderRightWidth: 2,
    margin: 8,
    marginLeft: 30,
    fontSize: 20,
    fontFamily: 'Teko_700Bold',
  },

  firstcolumnText: {
    color: '#fdfbf9',
    textAlign: 'center',
    margin: 8,
    marginLeft: 20,
    fontSize: 20,
    fontFamily: 'Teko_700Bold',
  },

  rowsText: {
    color: '#171717',
    textAlign: 'center',
    margin: 10,
    fontSize: 16,
    fontFamily: 'Teko_700Bold',
    flex: 1,
    width: 100,
  },

    deleteBox: {
    backgroundColor: '#B2022F',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 70,
  },

    button: {
    width: 200,
    backgroundColor: '#0c1559',
    margin: 10,
    textAlign: 'center',
    padding: 5,
    alignItems: 'center',
    marginBottom: 10,
    fontSize: 20,
    color: '#fdfbf9',
    marginTop: 10,
    height: 50,
    fontFamily: 'Teko_700Bold',
  },


});

export default Cart;
