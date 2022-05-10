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
  useIsFocused
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
import CustomerOrders from './CustomerOrders'
import MyOrders from './OrderHistory'
import ProductDetails from './ProductDetails'

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const WIDTH2 = Dimensions.get("screen").width/2-40;


function MarketPlace({navigation}){
  const [user, setUser] = useState();
  const [products, setProducts] = useState();
  const route = useRoute();
  const [count, setCount] = useState();
  

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(
        'https://fari-testapi.herokuapp.com/api/store/products'
      );
      let data = await response.json();
      setProducts(data.products);
      let bag = await AsyncStorage.setItem('cartItems', JSON.stringify('0'));	
      let spending = JSON.parse(await AsyncStorage.getItem('cartItems'));
      setCount(spending)
      return data.products;
    };

    fetchProducts();
  }, [navigation]);

  return (
    <>
    <StatusBar barStyle="light-content" />
      <ScrollView>
        <View style={styles.container}>
          {products && products.length > 0
            ? products.map((products) => {
                return products.prod_quantity <= 0 ? (
                  <View className="item" style={styles.item}>
                    <View className="header" style={styles.itemHeader}>
                      <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                        style={{
                          color: '#fdfbf9',
                          fontSize: '20px',
                          fontFamily: 'Teko_700Bold',
                        }}>
                        {products.prod_name}
                      </Text>
                      <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                        style={{
                          color: '#fdfbf9',
                          fontSize: '16px',
                          fontFamily: 'Teko_700Bold',
                        }}>
                        Price: ${products.prod_price}
                      </Text>
                    </View>
                    <View className="piece" style={styles.itemPiece}>
                      <Image
                        id="item-piece"
                        source={{ uri: products.prod_img1 }}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </View>
                    <View className="footer-item" style={styles.itemFooter}>
                      <Text style={styles.itemOutofStock}> Out of Stock </Text>
                      <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                        style={{
                          color: '#fdfbf9',
                          fontSize: '18px',
                          fontFamily: 'Teko_700Bold',
                        }}>
                        {' '}
                        Vendor: {products.vendorname}{' '}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View className="item" style={styles.item}>
                    <View className="header" style={styles.itemHeader}>
                      <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                        style={{
                          color: '#fdfbf9',
                          fontSize: '20px',
                          fontFamily: 'Teko_700Bold',
                        }}>
                        {products.prod_name}
                      </Text>
                      <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                        style={{
                          color: '#fdfbf9',
                          fontSize: '16px',
                          fontFamily: 'Teko_700Bold',
                        }}>
                        Price: ${products.prod_price}
                      </Text>
                    </View>
                    <View className="piece" style={styles.itemPiece}>
                      <Image
                        id="item-piece"
                        source={{ uri: products.prod_img1 }}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </View>
                    <View className="footer-item" style={styles.itemFooter}>
                      <Button
                        title="View Product"
                        buttonStyle={styles.btn}
                        onPress={() => {
                          AsyncStorage.setItem('thisProduct', 
                          JSON.stringify(products)
                          ),
                          navigation.navigate('ProductDetails');

                        }}></Button>
                      <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                        style={{
                          color: '#fdfbf9',
                          fontSize: '18px',
                          fontFamily: 'Teko_700Bold',
                        }}>
                        {' '}
                        Vendor: {products.vendorname}{' '}
                      </Text>
                    </View>
                  </View>
                );
              })
            : null}
        </View>
      </ScrollView>
    </>
  );
}

const Stack = createStackNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#171717',
    color: '#fdfbf9',
  },
};



function MyStack() {
  const [count, setCount] = useState(0);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  async function fetchCartCount(){
    try{
    let cartItems = JSON.parse(await AsyncStorage.getItem('cartItemsCount'))
    if(cartItems){
      setCount(cartItems)
    }else if(!cartItems){
      await AsyncStorage.setItem('cartItemsCount', JSON.stringify(0))
      setCount(0)
    }
    }catch(error){
      console.log(error)
    }
      
      

  }

useEffect(() => {
fetchCartCount();
     
},)

  return (
    
    <Stack.Navigator
    screenOptions={{
            headerStyle: {
            backgroundColor: '#0c1559',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: '#fdfbf9',
          headerTitleStyle: {
          fontFamily: 'Teko_700Bold',
          fontSize: 18,
          }
    }}>

      <Stack.Screen
        name="Marketplace"
        component={MarketPlace}
        options={({navigation})  => ({
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
          headerLeft: () => (
         <>
            <View style={{display: 'flex', flexDirection: 'row', marginLeft: 10}}>
              <Pressable style={{width: 50}} onPress={() => navigation.navigate('OrderHistory')}>
              <FontAwesome name="history" size={24} color="#fdfbf9" />
              </Pressable>
              <Pressable style={{width: 50}} onPress={() => navigation.navigate('CustomerOrders')}>
              <Foundation name="clipboard-pencil" size={24} color="#fdfbf9"  />
              </Pressable>
            </View>
         </>
          ),
          headerRight: () => (
            <>
        
  
            <Pressable style={{width: 50, height: 30}} onPress={() => navigation.navigate('Cart')}>
            <View style={{width:25, height: 25, borderRadius: '50%', backgroundColor: '#B2022F', position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: -12, marginLeft: 8, zIndex: 10}}>
            <Text style={{color: '#fdfbf9', fontSize: 14, fontFamily: 'Teko_700Bold'}}>{count}</Text>
            </View>
            <FontAwesome name="shopping-cart" size={24} color="#fdfbf9"/>
            </Pressable>
            </>
    )  
        })}
      />
      <Stack.Screen name="Cart" component={Cart}
      options={{
                headertitle: 'Cart',
                headerShadowVisible: false,
                headerBackTitle:'Markeplace',
                headerBackTitleVisible: true,
                headerBackTitleStyle: {
                  fontFamily: 'Teko_700Bold',
                  fontSize: 18,
                },
      }}
       />

        <Stack.Screen name="OrderHistory" component={MyOrders}
      options={{
                headertitle: 'OrderHistory',
                headerShadowVisible: false,
                headerBackTitle:'Markeplace',
                headerBackTitleVisible: true,
                headerBackTitleStyle: {
                  fontFamily: 'Teko_700Bold',
                  fontSize: 18,
                },
      }}
       />

        <Stack.Screen name="CustomerOrders" component={CustomerOrders}
      options={{
                headertitle: 'CustomerOrders',
                headerShadowVisible: false,
                headerBackTitle:'Markeplace',
                headerBackTitleVisible: true,
                headerBackTitleStyle: {
                  fontFamily: 'Teko_700Bold',
                  fontSize: 18,
                },

            
      }}
      
       />

      <Stack.Screen name="ProductDetails" component={ProductDetails}
      options={{
                headertitle: 'ProductDetails',
                headerShadowVisible: false,
                headerBackTitle:'Markeplace',
                headerBackTitleVisible: true,
                headerBackTitleStyle: {
                  fontFamily: 'Teko_700Bold',
                  fontSize: 18,
                },

            
      }}
      
       />
    </Stack.Navigator>
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

});

export default function App() {
  return <MyStack />;
}


