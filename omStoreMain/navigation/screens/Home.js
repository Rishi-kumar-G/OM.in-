import React, {useEffect, useRef, useState} from 'react';
import {Text, View, StyleSheet, ImageBackground, FlatList, TextInput, Image, TouchableOpacity, ToastAndroid, ScrollView, BackHandler, LogBox, Alert, Dimensions} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import ItemCard from './ItemCard';
import Spinner from 'react-native-loading-spinner-overlay';
import ItemDaily from './ItemDaily';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const Category_data = [
  { category: 'Technical\nCategory', items: require('../../assets/all.png') ,search:''},
  { category: 'Electrical \n& Spare', items: require('../../assets/electrical.jpeg'),search:'Electrical' },
  { category: 'Electronics \n Home Appliance', items: require('../../assets/electronics.jpeg'),search:'Electronics' },
  { category: 'Hardware \n Products', items: require('../../assets/nutbolt.jpeg'),search:'Hardware'},
  { category: 'Tap Fittings \n& Sanitery', items: require('../../assets/tape.jpeg'),search:'Tape Fitting'},
  { category: 'Tools & \nPower Tools', items: require('../../assets/hardware.jpeg'),search:'Tools And PowerTools'},
  { category: 'Original\n Jwellery', items: require('../../assets/jwellery.jpg'),search:'Jwellery'},
  { category: 'Dairy\nProducts', items: require('../../assets/dairy.jpg'),search:'Dairy Products'},  
  { category: 'Provision &\nBakery', items: require('../../assets/bakery.jpeg') ,search:'Bakery'},
  { category: 'Garments', items: require('../../assets/garments.jpeg'),search:'Garments'},
  { category: 'Kirana &\n Dry Fruits', items: require('../../assets/kirana.jpeg'),search:'Kirana'},
  { category: 'Fresh Vegi\n&  Fruits', items: require('../../assets/vegitables.jpeg') ,search:'Veg Fresh & Fruits'},
  { category: 'Cosmatics', items: require('../../assets/cosmatics.jpeg'),search:'Cosmatics'},
  { category: 'Sweets \n& Namkeen', items: require('../../assets/sweets.jpeg'),search:'Sweets And Namkeen' },
  { category: 'Food Deleviry', items: require('../../assets/foodDeliviry.png'),search:'Food Delivery' },
  { category: 'Pooja &\nAggarbatti',items: require('../../assets/pooja.jpeg'), search: 'Pooja' },
  { category: 'Stationary',items: require('../../assets/stationary.jpeg'), search: 'Stationary' },
  { category: 'Games \n& Sports',items: require('../../assets/sports.jpeg'), search: 'Games' },
  { category: 'General\n& Plastic',items: require('../../assets/plastic.jpeg'), search: 'Plastic Product' },
  { category: 'Shoes &\nSleepers',items: require('../../assets/shoes.jpeg'), search: 'Shoes And Slippers' },
  { category: 'Home Care',items: require('../../assets/HomeCare.jpeg'), search: 'Home Care Products' },
  { category: 'Mobile &\nLaptop Accessories',items: require('../../assets/mobile.jpeg'), search: 'Mobile Accessories' },
  { category: 'Furniture',items: require('../../assets/furniture.jpeg'), search: 'Furniture' },
  { category: 'Gifts',items: require('../../assets/gifts.jpeg'), search: 'Gifts' },
  { category: 'Service\nProviders', items: require('../../assets/service.png') ,search:'Service Providers'},
  { category: 'Products\nCategory', items: require('../../assets/all.png') ,search:'-1'},
];

export default function Home({navigation, route}) {
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [searchQuerry, setSearchQuerry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ImagesData, setImagesData] = useState([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);

  const scrollViewRef = useRef(null);
  const [backPressedOnce, setBackPressedOnce] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }

      if (backPressedOnce) {
        showExitConfirmation();
      } else {
        setBackPressedOnce(true);
        ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);

        setTimeout(() => {
          setBackPressedOnce(false);
        }, 2000);
      }

      return true;
    });

    return () => backHandler.remove();
  }, [backPressedOnce]);

  const showExitConfirmation = () => {
    Alert.alert(
      'Exit App',
      'Are you sure you want to exit?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Exit',
          onPress: () => BackHandler.exitApp(),
        },
      ]
    );
  };

  const showAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [{ text: 'OK' }],
      { cancelable: true },
    );
  };

  const collectionRef = firestore().collection('products');

  // Main products data
  useEffect(() => {
    const filter = [
      Category_data[0].search,Category_data[1].search,Category_data[2].search,
      Category_data[3].search,Category_data[4].search,Category_data[5].search,
    ];

    const unsubscribe = collectionRef.onSnapshot(snapshot => {
      const items = snapshot.docs.map(doc => ({
        productName: doc.data().productName,
        productDescription: doc.data().productDescription,
        productPrice: doc.data().productPrice,
        productDiscount: doc.data().productDiscount,
        productImageUrl: doc.data().productImageUrl,
        productID: doc.data().productID,
        productGST: doc.data().productGST,
        productSelling: doc.data().productSelling,
        productCode: doc.data().productCode,
        productSeller: doc.data().productSeller,
        productCatagory: doc.data().productCatagory,
        productSubCatagory: doc.data().productSubCatagory,
        ListImageUrl: doc.data().productListImageUrl,
        productNameHindi: doc.data().productNameHindi,
        productForDelivery: doc.data().forDelivery,
        productStatus: doc.data().productStatus
      }));

      const homeData = items.filter(doc => filter.includes(doc.productCatagory));
      
      setAllProducts(items);
      setData(homeData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Daily deal products data
  useEffect(() => {
    const collectionRef = firestore().collection('products').where('daily', '!=', '0');

    const unsubscribe = collectionRef.onSnapshot(snapshot => {
      const items = snapshot.docs.map(doc => ({
        productName: doc.data().productName,
        productDescription: doc.data().productDescription,
        productPrice: doc.data().productPrice,
        productDiscount: doc.data().productDiscount,
        productImageUrl: doc.data().productImageUrl,
        productID: doc.data().productID,
        productGST: doc.data().productGST,
        productSelling: doc.data().productSelling,
        productCode: doc.data().productCode,  
        productSeller: doc.data().productSeller,
        productCatagory: doc.data().productCatagory,
        productSubCatagory: doc.data().productSubCatagory,
        ListImageUrl: doc.data().productListImageUrl,
        productNameHindi: doc.data().productNameHindi,
        productForDelivery: doc.data().forDelivery,
        daily: doc.data().daily,
        productStatus: doc.data().productStatus
      }));

      const sortedData = items.sort((objA, objB) => {
        const dailyA = parseInt(objA.daily || '0', 10);
        const dailyB = parseInt(objB.daily || '0', 10);
        return dailyB - dailyA;
      });

      setDailyData(sortedData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // For ad photos
  useEffect(() => {
    const collectionRef = firestore().collection('adphoto');

    const unsubscribe = collectionRef.onSnapshot(snapshot => {
      const items = snapshot.docs.map(doc => ({
        url: doc.data().url,
      }));
      setIsLoadingImages(false);
      setImagesData(items);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  async function searchProducts(query) {
    setIsLoading(true);
    
    query = query.toLowerCase();
    query = query.replace(/ /g, '');
    
    if(query != ""){
      const filtered = allProducts.filter(item =>{
        var lowerProductName = item.productName.toLowerCase();
        lowerProductName = lowerProductName.replace(/ /g,'');
        var productNameMatch = lowerProductName.includes(query);
        return productNameMatch;
      });

      setFilterData(filtered);
      setData(filtered);
      setIsLoading(false);
    } else {
      setData(allProducts);
      setIsLoading(false);
    }
  }

  async function searchCategory(query) {
    setIsLoading(true);

    if(query == '-1'){
      setData(allProducts);
      setIsLoading(false);
      return;
    }
    
    if(query != ''){
      const filtered = allProducts.filter(item =>{
        var lowerProductName = item.productCatagory;
        var productNameMatch = lowerProductName==(query);
        return productNameMatch;
      });

      if(filtered.length == 0){
        showAlert("No Products", "No Currently Available Products");
      }

      setIsLoading(false);
      setData(filtered); 
    } else if(query == ''){
      const filter = [
        Category_data[0].search,Category_data[1].search,Category_data[2].search,
        Category_data[3].search,Category_data[4].search,Category_data[5].search,
      ];

      const filtered = allProducts.filter(doc => filter.includes(doc.productCatagory));
      setData(filtered);
      setIsLoading(false);
    } else {
      setData(allProducts);
      setIsLoading(false);
    }
  }

  const onSaved = () => {
    navigation.navigate("ProductSaved");
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.categoryItem}
      onPress={() => searchCategory(String(item.search))}
      activeOpacity={0.7}
    >
      <View style={styles.categoryImageContainer}>
        <ImageBackground
          source={item.items}
          style={styles.categoryImage}
          imageStyle={styles.categoryImageStyle}
        />
      </View>
      <Text style={styles.categoryText}>
        {item.category}
      </Text>
    </TouchableOpacity>
  );

  const Toolbar = () => {
    const toolbarItems = [
      { icon: require('../../assets/list.png'), text: 'Index' },
      { icon: require('../../assets/coupon.png'), text: 'Voucher' },
      { icon: require('../../assets/wallet.png'), text: 'Wallet' },
      { icon: require('../../assets/filter.png'), text: 'Filter' },
      { icon: require('../../assets/wishlist.png'), text: 'Wish List', onPress: onSaved },
    ];

    return (
      <View style={styles.toolbarContainer}>
        {toolbarItems.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.toolbarItem}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.toolbarIconContainer}>
              <Image source={item.icon} style={styles.toolbarIcon} />
            </View>
            <Text style={styles.toolbarText}>{item.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Spinner
        visible={isLoading}
        textContent={'Loading...'}
        textStyle={{color: '#FFF'}}
      />

      <ImageBackground
        source={require('../../assets/home_Background.jpg')}
        style={styles.backgroundImage}
      >
        <Toolbar />

        <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.mainTitle}>OM.in</Text>
            <Text style={styles.subtitle}>आधे दाम की दुकान</Text>
          </View>

          {/* Ad Banner */}
          <View style={styles.adBannerContainer}>
            <FlatList 
              horizontal
              data={ImagesData}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <View style={styles.adBannerItem}>
                  <Spinner
                    visible={isLoadingImages}
                    textContent={''}
                    textStyle={{color: '#FFF'}}
                  />
                  <ImageBackground 
                    source={{uri: item.url}} 
                    style={styles.adBannerImage}
                    imageStyle={styles.adBannerImageStyle}
                  />
                </View>
              )}
            />
            <View style={styles.adBannerIndicator}>
              <Text style={styles.indicatorDots}>• • • • •</Text>
            </View>
          </View>

          {/* Daily Deals */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>🔥 Deals of The Day</Text>
            <FlatList
              horizontal
              data={dailyData}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.productID}
              renderItem={({item}) => (
                <ItemDaily
                  productName={item.productName}
                  productID={item.productID}
                  productPrice={item.productPrice}
                  productDiscount={item.productDiscount}
                  productUrl={item.productImageUrl}
                  navigation={navigation}
                  productDescription={item.productDescription}
                  productGST={item.productGST}
                  productSelling={item.productSelling}
                  productCode={item.productCode}
                  ListImageURL={item.ListImageUrl}
                  productSeller={item.productSeller}
                  productCatagory={item.productCatagory}
                  productSubCatagory={item.productSubCatagory}
                  productNameHindi={item.productNameHindi}
                  productForDelivery={item.productForDelivery}
                  productStatus={item.productStatus}
                />
              )}
            />
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search products..."
                placeholderTextColor="#888"
                value={searchQuerry}
                onChangeText={setSearchQuerry}
                onSubmitEditing={() => searchProducts(searchQuerry)}
              />
              <TouchableOpacity 
                onPress={() => searchProducts(searchQuerry)}
                style={styles.searchButton}
                activeOpacity={0.7}
              >
                <Image source={require('../../assets/search.png')} style={styles.searchIcon} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Categories */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>📂 Select Your Category</Text>
            <FlatList
              horizontal
              data={Category_data}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.category}
              renderItem={renderItem}
            />
          </View>

          {/* Products Grid */}
          <View style={styles.productsContainer}>
            <FlatList
              numColumns={2}
              data={data}
              keyExtractor={item => item.productID}
              renderItem={({item}) => (
                <ItemCard
                  productName={item.productName}
                  productID={item.productID}
                  productPrice={item.productPrice}
                  productDiscount={item.productDiscount}
                  productUrl={item.productImageUrl}
                  navigation={navigation}
                  productDescription={item.productDescription}
                  productGST={item.productGST}
                  productSelling={item.productSelling}
                  productCode={item.productCode}
                  ListImageURL={item.ListImageUrl}
                  productSeller={item.productSeller}
                  productCatagory={item.productCatagory}
                  productSubCatagory={item.productSubCatagory}
                  productNameHindi={item.productNameHindi}
                  productForDelivery={item.productForDelivery}
                  productStatus={item.productStatus}
                />
              )}
            />
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  // Toolbar Styles
  toolbarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  toolbarItem: {
    alignItems: 'center',
    flex: 1,
  },
  toolbarIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  toolbarIcon: {
    width: 18,
    height: 18,
    tintColor: '#333',
  },
  toolbarText: {
    fontSize: 10,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  // Header Styles
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingTop: 30,
  },
  mainTitle: {
    fontSize: 52,
    color: 'white',
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 24,
    color: 'white',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  // Ad Banner Styles
  adBannerContainer: {
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  adBannerItem: {
    width: screenWidth - 30,
    height: 180,
    marginRight: 10,
  },
  adBannerImage: {
    flex: 1,
    backgroundColor: 'white',
  },
  adBannerImageStyle: {
    borderRadius: 15,
    resizeMode: 'cover',
  },
  adBannerIndicator: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  indicatorDots: {
    color: 'white',
    fontSize: 16,
    letterSpacing: 2,
  },
  // Section Styles
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  // Search Styles
  searchContainer: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff4444',
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
  // Category Styles
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 10,
    width: 80,
  },
  categoryImageContainer: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryImageStyle: {
    resizeMode: 'cover',
    borderRadius: 32.5,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    color: '#333',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: 'hidden',
    lineHeight: 13,
  },
  // Products Container
  productsContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
});

export {Category_data};