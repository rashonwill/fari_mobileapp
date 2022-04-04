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
import { useState, useEffect } from 'react';
import GestureRecognizer from 'react-native-swipe-gestures';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Foundation } from '@expo/vector-icons';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

function MarketPlace({ navigation }) {
  const [user, setUser] = useState();
  const [products, setProducts] = useState();
  const [selectedColor, setSelectedColor] = useState();
  const [selectedSize, setSelectedSize] = useState();
  const [imageActive, setImageActive] = useState(0);
  const [productinfo, setProductInfo] = useState(false);
  const [selected, setSelected] = useState({});

  const [stocked, setStocked] = useState({});
  const [oos, setOOS] = useState({});

  const route = useRoute();

  const images = [
    selected.prod_img1,
    selected.prod_img2,
    selected.prod_img3,
    selected.prod_img4,
  ];

  const onchange = (nativeEvent) => {
    if (nativeEvent) {
      const slide = Math.ceil(
        nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width
      );
      if (slide != imageActive) {
        setImageActive(slide);
      }
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(
        'https://fari-testapi.herokuapp.com/api/store/products'
      );
      let data = await response.json();
      setProducts(data.products);
      return data.products;
    };

    function splitStock(products) {
      let inStock = [];
      let outOfStock = [];

      for (let index = 0; index < products.length; index++) {
        if (products[index].prod_quantity <= 0) {
          outOfStock.push(products[index]);
          setOOS(outOfStock);
        } else if (products[index].prod_quantity >= 1) {
          inStock.push(products[index]);
          setStocked(inStock);
        }
      }
    }

    fetchProducts().then(splitStock);
  }, []);

  return (
    <>
      <GestureRecognizer onSwipeDown={(productinfo) => setProductInfo(false)}>
        <Modal
          animationType="slide"
          visible={productinfo}
          transparent={false}
          presentationStyle={'fullScreen'}
          onRequestClose={() => {
            setProductInfo(!productinfo);
          }}>
          <View style={styles.wrap}>
            <ScrollView
              onScroll={({ nativeEvent }) => onchange(nativeEvent)}
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              horizontal
              style={styles.wrap}>
              {images.map((e, index) => (
                <Image
                  key={e}
                  resizeMode="stretch"
                  style={styles.wrap}
                  source={{ uri: e }}
                />
              ))}
            </ScrollView>
            <View style={styles.wrapDot}>
              {images.map((e, index) => (
                <Text
                  key={e}
                  style={imageActive == index ? styles.dotActive : styles.dots}>
                  ●
                </Text>
              ))}
            </View>
          </View>
          <View style={styles.info}>
            <Text
              style={{
                color: '#fdfbf9',
                fontFamily: 'Teko_700Bold',
                fontSize: 25,
                textAlign: 'center',
                margin: 10,
                marginTop: 15,
              }}>
              {selected.prod_name}
            </Text>
            <Text
              style={{
                color: '#fdfbf9',
                fontFamily: 'Teko_700Bold',
                fontSize: 20,
                textAlign: 'center',
                margin: 5,
              }}>
              {selected.prod_description}
            </Text>
            <Text
              style={{
                color: '#fdfbf9',
                fontFamily: 'Teko_700Bold',
                fontSize: 20,
                textAlign: 'center',
                margin: 5,
              }}>
              Price: ${selected.prod_price}
            </Text>

            <View style={styles.pickers}>
              <Picker
                selecetedSize={selectedSize}
                style={{
                  height: 50,
                  width: 200,
                  color: '#fdfbf9',
                  backgroundColor: '#a9a9b0',
                  justifyContent: 'center',
                  borderRadius: 10,
                  fontFamily: 'Teko_700Bold',
                  margin: 10,
                }}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedSize(itemValue)
                }>
                <Picker.Item label="Choose Size" value="Choose Size" />
                <Picker.Item
                  label={selected.prod_size1}
                  value={selected.prod_size1}
                />
                <Picker.Item
                  label={selected.prod_size2}
                  value={selected.prod_size2}
                />
                <Picker.Item
                  label={selected.prod_size3}
                  value={selected.prod_size3}
                />
                <Picker.Item
                  label={selected.prod_size4}
                  value={selected.prod_size4}
                />
              </Picker>

              <Picker
                selectedColor={selectedColor}
                style={{
                  height: 50,
                  width: 200,
                  color: '#fdfbf9',
                  justifyContent: 'center',
                  backgroundColor: '#a9a9b0',
                  borderRadius: 10,
                  fontFamily: 'Teko_700Bold',
                  margin: 10,
                }}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedColor(itemValue)
                }>
                <Picker.Item label="Choose Color" value="Choose Color" />
                <Picker.Item
                  label={selected.prod_color1}
                  value={selected.prod_color1}
                />
                <Picker.Item
                  label={selected.prod_color2}
                  value={selected.prod_color2}
                />
                <Picker.Item
                  label={selected.prod_color3}
                  value={selected.prod_color3}
                />
                <Picker.Item
                  label={selected.prod_color4}
                  value={selected.prod_color4}
                />
              </Picker>
            </View>

            <View
              style={{
                backgroundColor: 'transparent',
                width: '100%',
                height: 150,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Button title="Buy Now" buttonStyle={styles.buyBtn}></Button>
            </View>
          </View>
        </Modal>
      </GestureRecognizer>

      <ScrollView>
        <View style={styles.container}>
          {stocked && stocked.length > 0
            ? stocked.map((products) => {
                return (
                  <View className="item" style={styles.item}>
                    <View className="header" style={styles.itemHeader}>
                      <Text
                        style={{
                          color: '#fdfbf9',
                          fontSize: '20px',
                          fontFamily: 'Teko_700Bold',
                        }}>
                        {products.prod_name}
                      </Text>
                      <Text
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
                        className="btn"
                        title="View Product"
                        buttonStyle={styles.btn}
                        key={products.id}
                        onPress={() => {
                          setProductInfo(true);
                          setSelected(products);
                        }}></Button>
                      <Text
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

          {oos && oos.length > 0
            ? oos.map((products) => {
                return (
                  <View className="item" style={styles.item}>
                    <View className="header" style={styles.itemHeader}>
                      <Text
                        style={{
                          color: '#fdfbf9',
                          fontSize: '20px',
                          fontFamily: 'Teko_700Bold',
                        }}>
                        {products.prod_name}
                      </Text>
                      <Text
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

function MyOrders() {
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

function CustomerOrders() {
  const [customerOrders, setCustomerOrders] = useState({});
  const [fulfilledOrders, setFulfilledOrders] = useState({});
  const [unfulfilledOrders, setUnfulfilledOrders] = useState({});

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

    async function splitOrders(orders) {
      let fulfilled = [];
      let unfulfilled = [];

      for (let index = 0; index < orders.length; index++) {
        if (orders[index].vendor_status === 'Fulfillment Complete') {
          fulfilled.push(orders[index]);
          setFulfilledOrders(fulfilled);
        } else {
          unfulfilled.push(orders[index]);
          setUnfulfilledOrders(unfulfilled);
        }
      }
    }

    getUser().then(getCustomerOrders).then(splitOrders);
  }, []);

  return (
    <>
    
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
           
          {unfulfilledOrders && unfulfilledOrders.length > 0
            ? unfulfilledOrders.map((orders) => {
                return (
                  <View style={styles.rowsUnfulfilled}>
                  <Foundation name="burst-new" size={40} color="#48A14D" style={{position: 'absolute', zIndex: 20, marginTop: -5}} />
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
            : null}

          {fulfilledOrders && fulfilledOrders.length > 0
            ? fulfilledOrders.map((orders) => {
                return (
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
                );
              })
            : null}
      
      </ScrollView>
        </View>
    </>
  );
}

const Drawer = createDrawerNavigator();
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#171717',
    color: '#fdfbf9',
  },
};

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
          elevation: 0,
          shadowOpacity: 0,
        },
        drawerLabelStyle: {
          color: '#fdfbf9',
          fontFamily: 'Teko_700Bold',
          fontSize: 18,
        },
      }}>
      <Drawer.Screen
        name="Marketplace"
        component={MarketPlace}
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
        name="My Order History"
        component={MyOrders}
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
        name="Customer Orders"
        component={CustomerOrders}
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
  },
  item: {
    marginBottom: '25px',
    backgroundColor: 'black',
    opacity: '.8',
    width: 350,
    height: 500,
    padding: 20,
    margin: 20,
    shadowColor: 'black',
    shadowRadius: 10,
    shadowOpacity: 1,
    shadowOffset: { width: -2, height: 4 },
    borderRadius: 10,
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
    backgroundColor: 'black',
    fontSize: '18px',
    maxHeight: 110,
    minHeight: 100,
    display: 'flex',
    flexDirectin: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  itemPiece: {
    width: '100%',
    height: 200,
    marginBottom: '3px',
    marginTop: '25px',
    border: 'none',
    borderRadius: '5px',
  },

  itemFooter: {
    backgroundColor: 'black',
    fontSize: '20px',
    height: 115,
    color: '#fdfbf9',
    display: 'flex',
    flexDirectin: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  itemOutofStock: {
    backgroundColor: 'black',
    fontSize: '22px',
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

  wrap: {
    width: WIDTH,
    height: HEIGHT * 0.4,
    backgroundColor: '#171717',
  },
  dots: {
    margin: 3,
    color: '#a9a9b0',
  },

  dotActive: {
    margin: 3,
    color: '#0C1559',
  },

  wrapDot: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignSelf: 'center',
  },

  info: {
    width: '100%',
    height: '100%',
    backgroundColor: '#171717',
    textAlign: 'center',
  },

  buyBtn: {
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

  pickers: {
    width: '100%',
    height: 150,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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

export default function App() {
  return <MyDrawer />;
}
