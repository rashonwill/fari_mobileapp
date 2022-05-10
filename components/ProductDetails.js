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

import { Dropdown } from 'react-native-element-dropdown';

import { useState, useEffect } from 'react';
import GestureRecognizer from 'react-native-swipe-gestures';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Foundation } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';

import Cart from './Cart'
import Shop from './Shop'

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;



function ProductDetails({navigation}){

  const [isAdded, setIsAdded] = useState(false)
  const [selectedColor, setSelectedColor] = useState();
  const [selectedSize, setSelectedSize] = useState();
  const [selectedQuantity, setSelectedQuantity] = useState();
  const [imageActive, setImageActive] = useState(0);
  const [selected, setSelected] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState(null);
  const route = useRoute();

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
    

    const images = [
    selected.prod_img1,
    selected.prod_img2,
    selected.prod_img3,
    selected.prod_img4,
    ];
    


   async function addToCart(){
     let count = JSON.parse(await AsyncStorage.getItem('cartItemsCount'));
     count++;
     let bag = await AsyncStorage.setItem('cartItemsCount', JSON.stringify(count));
     setIsAdded(true)
     

      let product = JSON.parse(await AsyncStorage.getItem('thisProduct'))
      let itemTotal = selectedQuantity * product.prod_price
      const cartItem = {
        productid: product.id,
        name: product.prod_name,
        description: product.prod_description,	
        vendorid: product.vendorid,
        vendor: product.vendorname,	
        quantity: selectedQuantity ? selectedQuantity  : '1',
        color: selectedColor ? selectedColor  : product.prod_color1,
        size:  selectedSize ? selectedSize : product.prod_size1,
        image: product.prod_img1,
        price: product.prod_price,
        total: itemTotal ? itemTotal : product.prod_price,
     }

       let myItems = JSON.parse(await AsyncStorage.getItem('MyCartItems'))		
       if(!myItems){
       myItems = [cartItem]
       AsyncStorage.setItem('MyCartItems', JSON.stringify(myItems))	
       }else if(myItems){
        myItems = [...myItems, cartItem]
        AsyncStorage.setItem('MyCartItems', JSON.stringify(myItems))
       }
   } 


  async function getItem(){
    try{
      let product = JSON.parse(await AsyncStorage.getItem('thisProduct'))
     if(product){
     setSelected(product)
     }

    }catch(error){
      console.log(error)
    }
  }

    const colors = [
    { label: selected.prod_color1, value: selected.prod_color1, },
    { label: selected.prod_color2, value: selected.prod_color2, },
    { label: selected.prod_color3, value: selected.prod_color3, },
    { label: selected.prod_color4, value: selected.prod_color4, },
  ];

      const sizes = [
    { label: selected.prod_size1, value: selected.prod_size1, },
    { label: selected.prod_size2, value: selected.prod_size2, },
    { label: selected.prod_size3, value: selected.prod_size3, },
    { label: selected.prod_size4, value: selected.prod_size4, },
  ];

    const qunatities = [
    { label: '1', value: '1', },
    { label: '2', value: '2', },
    { label: '3', value: '3', },
    { label: '4', value: '4', },
  ];



  useEffect(() => {
    getItem();
  },[]);


  return( 
    <>
    <StatusBar barStyle="light-content" />
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
          <ScrollView>
        <View style={styles.info}>
           
               <Text
              numberOfLines={1} 
              ellipsizeMode='tail'
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
                marginBottom: 10
              }}>
              Price: ${selected.prod_price}
            </Text>
           <View style={styles.pickers}>

                     <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: '#0C1559' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={sizes}
          maxHeight={100}
          labelField="label"
          valueField="value"
          placeholder={'Select Size'}
          searchPlaceholder="Search..."
          value={selectedSize}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setSelectedSize(item.value);
            setIsFocus(false);
          }}
            renderLeftIcon={() => (
            <MaterialCommunityIcons name="size-xl" 
            size={20} 
            style={styles.icon}
            color={isFocus ? '#0C1559' : '#171717'}
            
            />

                )}
        />

          <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: '#0C1559' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={colors}
          maxHeight={100}
          labelField="label"
          valueField="value"
          placeholder={'Select Color'}
          searchPlaceholder="Search..."
          value={selectedColor}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setSelectedColor(item.value);
            setIsFocus(false);
          }}
            renderLeftIcon={() => (
            <Ionicons 
            name="md-color-palette" 
            size={20} 
            style={styles.icon}
            color={isFocus ? '#0C1559' : '#171717'}
            
            />

                )}
        />

          <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: '#0C1559' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={qunatities}
          maxHeight={100}
          labelField="label"
          valueField="value"
          placeholder={'Select Quantity'}
          searchPlaceholder="Search..."
          value={selectedQuantity}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setSelectedQuantity(item.value);
            setIsFocus(false);
          }}
            renderLeftIcon={() => (
            <MaterialCommunityIcons 
            name="roman-numeral-4"
            size={20} 
            style={styles.icon}
            color={isFocus ? '#0C1559' : '#171717'} 
            
            />

                )}
        />
           
           
           </View>

            <View
              style={{
                backgroundColor: 'transparent',
                width: '100%',
                height: 150,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: -5
              }}>
              {isAdded ? 
                (
                  <Button title="Added to Cart!" buttonStyle={styles.buyingBtn}></Button>
                ) : 
                (
                  <Button title="Add to Cart" buttonStyle={styles.buyBtn} onPress={() => addToCart()}></Button>
                )}
            </View>     
      
       </View>
         </ScrollView>
 
   </>
  )


}

const styles = StyleSheet.create({
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

    buyingBtn: {
    width: 200,
    backgroundColor: '#B2022F',
    margin: 10,
    textAlign: 'center',
    padding: 5,
    alignItems: 'center',
    marginBottom: 10,
    fontSize: 20,
    color: '#B2022F',
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
    marginTop: 10
  },
      dropdown: {
      height: 50,
      width: 300,
      borderColor: 'gray',
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
      marginBottom: 10,
      color: '#fdfbf9',
      backgroundColor: 'gray'
    },
    icon: {
      marginRight: 5,
      color: '#fdfbf9',
    },
    placeholderStyle: {
      fontSize: 16,
      color: '#fdfbf9',
      fontFamily: 'Teko_700Bold',
    },
    selectedTextStyle: {
      fontSize: 16,
      color: '#171717',
      fontFamily: 'Teko_700Bold',
    },
    iconStyle: {
      width: 20,
      height: 20,
    },

  
});



export default ProductDetails;
