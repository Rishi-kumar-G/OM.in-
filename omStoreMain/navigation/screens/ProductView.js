import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ToastAndroid,
  ScrollView,
  BackHandler,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import RNFS from 'react-native-fs';
import { useNavigation } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from 'react-native-modal';
import auth from '@react-native-firebase/auth';


const { width, height } = Dimensions.get('window');

export default function ProductView({ route, navigation }) {
  let {
    productID,
    images,
    productNameHindi,
    productForDelivery,
    productCatagory,
    productStatus,
    productSubCatagory,
    productName,
    productSeller,
    productCode,
    productSelling,
    productDescription,
    productPrice,
    productDiscount,
    productUrl,
    ListImageURL,
    productGST
  } = route.params;

  const [productCount, setProductCount] = useState(1);
  const [isSpinnerVisible, setIsSpinnerVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const [Images, setImages] = useState([productUrl, ListImageURL]);

  // Set default values
  if (productStatus == "" || productStatus == null) {
    productStatus = "Available";
  }

  let gstDisplay;
  if (productGST == '0' || productGST == 0) {
    gstDisplay = 'Paid';
  } else {
    gstDisplay = String(productGST) + '%';
  }

  const originalPrice = parseInt(productPrice) + (parseInt(productGST) / 100) * parseInt(productPrice);
  const sellingPrice = parseInt(productSelling);
  const totalPrice = sellingPrice * productCount;

  useEffect(() => {
    const backHandlerSubscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (!navigation.canGoBack()) {
          return false;
        }
        navigation.goBack();
        return true;
      }
    );

    return () => backHandlerSubscription.remove();
  }, [navigation]);

  const onIncrease = () => {
    setProductCount(productCount + 1);
  };

  const onDecrease = () => {
    if (productCount > 1) {
      setProductCount(productCount - 1);
    }
  };

  const uploadProductDetails = async () => {
    if (ListImageURL == null || ListImageURL == "") {
      ListImageURL = "";
    }

    setIsSpinnerVisible(true);
    const usersCollection = firestore()
      .collection('users')
      .doc(auth().currentUser.email)
      .collection("fav")
      .doc(productID);

    usersCollection
      .set({
        productID: productID,
        productName: productName,
        productDescription: productDescription,
        productPrice: productPrice,
        productDiscount: productDiscount,
        productUrl: productUrl,
        listImageUri: ListImageURL,
        productSelling: productSelling,
        productCode: productCode,
        productGST: productGST,
      })
      .then(() => {
        console.log('Product Saved!');
        setIsSpinnerVisible(false);
        setIsWishlisted(true);
        ToastAndroid.show("Added to Wishlist", ToastAndroid.SHORT);
      })
      .catch((error) => {
        setIsSpinnerVisible(false);
        ToastAndroid.show("Failed to add to wishlist", ToastAndroid.SHORT);
      });
  };

  const onAddCart = async () => {
    setIsSpinnerVisible(true);

    firestore()
      .collection('cart')
      .doc(auth().currentUser.email)
      .collection('products')
      .doc(productID)
      .set({
        productID: productID,
        productName: productName,
        productDescription: productDescription,
        productPrice: productPrice,
        productDiscount: productDiscount,
        productUrl: productUrl,
        listImageUri: ListImageURL,
        productSelling: productSelling,
        productCode: productCode,
        productGST: productGST,
        productCount: productCount,
      })
      .then(() => {
        setIsSpinnerVisible(false);
        ToastAndroid.show('Added to Cart', ToastAndroid.SHORT);
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error.message);
        setIsSpinnerVisible(false);
        ToastAndroid.show('Failed to add. Please try again.', ToastAndroid.SHORT);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={uploadProductDetails} style={styles.wishlistButton}>
          <Text style={[styles.wishlistText, { color: isWishlisted ? "#e74c3c" : "#333" }]}>
            {isWishlisted ? "♥" : "♡"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Section */}
        <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.imageContainer}>
           <ImageViewer
                        imageUrls={images}
                        renderIndicator={() => null}
                        backgroundColor='white'


                        style={{height: 300, flex:1 }}
                        />
        </TouchableOpacity>

        {/* Product Info Section */}
        <View style={styles.productInfoContainer}>
          {/* Delivery Info & Status */}
          <View style={styles.statusContainer}>
            {productForDelivery && (
              <View style={styles.deliveryBadge}>
                <Text style={styles.deliveryText}>{productForDelivery}</Text>
              </View>
            )}
            <View style={[styles.statusBadge, { backgroundColor: productStatus === 'Available' ? '#e8f5e8' : '#fff3cd' }]}>
              <Text style={[styles.statusText, { color: productStatus === 'Available' ? '#28a745' : '#856404' }]}>
                {productStatus}
              </Text>
            </View>
          </View>

          {/* Product Title */}
          <Text style={styles.productTitle}>{productName}</Text>
          {productNameHindi && (
            <Text style={styles.productTitleHindi}>{productNameHindi}</Text>
          )}

          {/* Category & Code */}
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>{productCatagory}</Text>
            {productSubCatagory && (
              <>
                <Text style={styles.categorySeparator}>•</Text>
                <Text style={styles.categoryText}>{productSubCatagory}</Text>
              </>
            )}
          </View>
          
          {productCode && (
            <Text style={styles.productCode}>Code: {productCode}</Text>
          )}

          {/* Seller & GST Info */}
          <View style={styles.sellerContainer}>
            <Text style={styles.sellerText}>Sold by: {productSeller}</Text>
            <Text style={styles.gstText}>GST: {gstDisplay}</Text>
          </View>

          {/* Price Section */}
          <View style={styles.priceContainer}>
            <View style={styles.priceRow}>
              <Text style={styles.sellingPrice}>₹{sellingPrice}</Text>
              <Text style={styles.originalPrice}>₹{originalPrice}</Text>
              {productDiscount > 0 && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>₹{productDiscount} OFF</Text>
                </View>
              )}
            </View>
          </View>

          {/* Description */}
          {productDescription && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{productDescription}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomContainer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>
            {productCount} × ₹{sellingPrice} = ₹{totalPrice}
          </Text>
        </View>
        
        <View style={styles.actionContainer}>
          {/* Quantity Selector */}
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={onDecrease} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{productCount}</Text>
            <TouchableOpacity onPress={onIncrease} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Add to Cart Button */}
          <TouchableOpacity onPress={onAddCart} style={styles.addToCartButton}>
            <Text style={styles.addToCartText}>🛒 Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Image Modal */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}
        onSwipeComplete={() => setIsModalVisible(false)}
        onBackButtonPress={() => setIsModalVisible(false)}
        swipeDirection="down"
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity 
            onPress={() => setIsModalVisible(false)} 
            style={styles.modalCloseButton}
          >
            <Text style={styles.modalCloseText}>×</Text>
          </TouchableOpacity>
          <ImageViewer
            imageUrls={Images}
            renderIndicator={() => null}
            style={styles.modalImage}
          />
        </View>
      </Modal>

      <Spinner 
        visible={isSpinnerVisible} 
        textContent={'Processing...'} 
        textStyle={styles.spinnerText} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    minWidth: 40,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
  },
  wishlistButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    minWidth: 40,
    alignItems: 'center',
  },
  wishlistText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: 300,
    backgroundColor: '#f8f9fa',
  },
  productImage: {
    height: 300,
  },
  productInfoContainer: {
    padding: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  deliveryBadge: {
    backgroundColor: '#fff3cd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  deliveryText: {
    color: '#856404',
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    lineHeight: 30,
  },
  productTitleHindi: {
    fontSize: 18,
    color: '#666',
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  categorySeparator: {
    marginHorizontal: 8,
    color: '#666',
  },
  productCode: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  sellerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sellerText: {
    fontSize: 14,
    color: '#666',
  },
  gstText: {
    fontSize: 14,
    color: '#666',
  },
  priceContainer: {
    marginBottom: 20,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellingPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#28a745',
    marginRight: 12,
  },
  originalPrice: {
    fontSize: 18,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 12,
  },
  discountBadge: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  descriptionContainer: {
    marginTop: 8,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  bottomContainer: {
    backgroundColor: '#fff',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingTop: 8,
  },
  totalContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  totalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'right',
  },
  actionContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    paddingHorizontal: 4,
    marginRight: 16,
    elevation: 1,
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    minWidth: 40,
    textAlign: 'center',
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 25,
    elevation: 2,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    height: '100%',
    width: '100%',
    borderRadius: 10,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1000,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
  },
  modalImage: {
    height: '100%',
    flex: 1,
  },
  spinnerText: {
    color: 'white',
  },
});