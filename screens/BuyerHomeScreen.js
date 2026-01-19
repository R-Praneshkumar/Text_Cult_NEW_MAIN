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
  },
  {
    type: 'Polyester',
    description: 'Durable & Wrinkle-free',
    image: require('../assets/images/polyester_yarn.jpg'),
  },
  {
    type: 'Rayon',
    description: 'Soft & Breathable',
    image: require('../assets/images/rayon_yarn.jpg'),
  },
];

const BuyerHomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <HeroSection insets={insets} navigation={navigation} />
        <View style={styles.cardContainer}>
          {yarnTypes.map((yarn, index) => (
            <YarnCard key={index} yarn={yarn} navigation={navigation} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};


const HeroSection = ({ insets, navigation }) => (
  <ImageBackground
    source={require('../assets/images/hero_bg.jpg')}
    style={styles.heroBackground}
  >
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <TouchableOpacity style={styles.headerButton}>
        <MaterialIcons name="menu" size={24} color="#f1f5f9" />
      </TouchableOpacity>
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('NotificationsScreen')}>
          <MaterialIcons name="notifications" size={24} color="#f1f5f9" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.pendingButton} onPress={() => navigation.navigate('PendingOrdersScreen')}>
          <MaterialIcons name="hourglass-top" size={16} color="#1e293b" />
          <Text style={styles.pendingButtonText}>Pending Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('MyCartScreen')}>
          <MaterialIcons name="shopping-cart" size={24} color="#f1f5f9" />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
    <View style={styles.heroOverlay}>
      <View style={styles.heroContent}>
        <Text style={styles.heroTitle}>Explore Yarn</Text>
        <Text style={styles.heroSubtitle}>Find the perfect type for your needs.</Text>
      </View>
    </View>
  </ImageBackground>
);

const YarnCard = ({ yarn, navigation }) => (
  <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProductDetailsScreen')}>
    <Image source={yarn.image} style={styles.cardImage} />
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{yarn.type}</Text>
      <Text style={styles.cardDescription}>{yarn.description}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e293b',
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
    paddingBottom: 8,
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
    backgroundColor: '#f1f5f9',
    borderRadius: 9999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 4,
  },
  pendingButtonText: {
    color: '#1e293b',
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
    color: '#94a3b8',
    fontSize: 16,
  },
  cardContainer: {
    padding: 16,
    backgroundColor: '#1e293b',
    marginTop: -24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  card: {
    backgroundColor: '#334155',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
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
    color: '#f1f5f9',
  },
  cardDescription: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
});

export default BuyerHomeScreen;
