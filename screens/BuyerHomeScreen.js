import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

const yarnTypes = [
  {
    type: 'Cotton',
    description: 'Natural & Versatile',
    image: require('../assets/images/cotton_yarn.jpg'),
    comingSoon: true, // Backend doesn't have this yet
  },
  {
    type: 'Polyester',
    description: 'Durable & Wrinkle-free',
    image: require('../assets/images/polyester_yarn.jpg'),
    comingSoon: true, // Backend doesn't have this yet
  },
  {
    type: 'Rayon',
    description: 'Soft & Breathable',
    image: require('../assets/images/rayon_yarn.jpg'),
    productId: 1, // Explicitly link to the existing database ID
    comingSoon: false,
  },
];

const BuyerHomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <Header insets={insets} navigation={navigation} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <HeroSection />
        <View style={styles.cardContainer}>
          {yarnTypes.map((yarn, index) => (
            <YarnCard key={index} yarn={yarn} navigation={navigation} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};


const Header = ({ insets, navigation }) => (
  <View style={[styles.header, { paddingTop: insets.top + 8, paddingBottom: 12 }]}>
    <TouchableOpacity style={styles.headerButton} onPress={() => navigation.openDrawer()}>
      <MaterialIcons name="menu" size={24} color="#0f172a" />
    </TouchableOpacity>
    <View style={styles.headerRight}>
      <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('NotificationsScreen')}>
        <MaterialIcons name="notifications-none" size={24} color="#0f172a" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.pendingButton} onPress={() => navigation.navigate('PendingOrdersScreen')}>
        <MaterialIcons name="hourglass-top" size={16} color="#ffffff" />
        <Text style={styles.pendingButtonText}>Pending Orders</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('MyCartScreen')}>
        <MaterialIcons name="shopping-cart" size={24} color="#0f172a" />
        <View style={styles.cartBadge}>
          <Text style={styles.cartBadgeText}>3</Text>
        </View>
      </TouchableOpacity>
    </View>
  </View>
);

const HeroSection = () => (
  <ImageBackground
    source={require('../assets/images/hero_bg.jpg')}
    style={styles.heroBackground}
  >
    <View style={styles.heroOverlay}>
      <View style={styles.heroContent}>
        <Text style={styles.heroTitle}>Explore Yarn</Text>
        <Text style={styles.heroSubtitle}>Find the perfect type for your needs.</Text>
      </View>
    </View>
  </ImageBackground>
);

import { Alert } from 'react-native'; // Ensure Alert is imported if needed, but it's simpler to just do this:

const YarnCard = ({ yarn, navigation }) => {
  const handlePress = () => {
    if (yarn.comingSoon) {
      alert(`${yarn.type} is coming soon! Our backend team is adding this product to the database.`);
    } else {
      // Pass the specific product ID to the details screen
      navigation.navigate('ProductDetailsScreen', { productId: yarn.productId });
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Image source={yarn.image} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{yarn.type}</Text>
        <Text style={styles.cardDescription}>{yarn.description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  pendingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 9999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 4,
  },
  pendingButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  heroBackground: {
    width: '100%',
    height: 250,
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  heroContent: {
    padding: 16,
    paddingBottom: 32,
  },
  heroTitle: {
    fontSize: 28,
    fontFamily: 'Poppins_700Bold',
    color: 'white',
    marginBottom: 4,
  },
  heroSubtitle: {
    color: '#cbd5e1',
    fontSize: 16,
  },
  cardContainer: {
    padding: 16,
    backgroundColor: '#f8fafc',
    marginTop: -24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 160,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#0f172a',
  },
  cardDescription: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
});

export default BuyerHomeScreen;
