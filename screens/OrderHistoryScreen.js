import React, { memo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

const orders = [
  {
    id: '#ORD-58294',
    date: '24 Jul 2024',
    total: '$1,250.00',
    status: 'Delivered',
    statusColor: '#10b981',
    statusBgColor: '#d1fae5',
    items: [
      { name: 'Premium Egyptian Cotton', qty: '50 meters', price: '$750.00', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBck-mqKYUzaPA2I9ehew7MDW55NvnaSmxu4vbiUg4EUaakac1L_6PNZewegwiNjZc3kPN1OnUro-kGxlqeUSYTWJphum9Hfc2ss56ugZPc6gIrUfXc1YvPixpPSjPq1jCE-WLIv6ofPrQY-hb2DILosrfP7Q-SExDbxaVqmHB9l9nQJxfiuFkqfHW5JGGhTtkCXsilavaLVtoHnWuU0zi3srS1Z-x9-1WODbY1cDes6bbnYAxOt_GeySVXIuibNaMnqy09D96TpuA' },
      { name: 'Charmeuse Silk', qty: '20 meters', price: '$500.00', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGo3kHCthk7Q5UGLwbMsiOiKC1WiHdXqLpY_f4T4a2Oz_gBGQ9RxxccOWhMrC2ODevKg7AEKouGs0GIYB5kiQ04PwZtdyAW_CldbPEQSOS3TNL7LazkRV1fUi16wHD0WGQqONDSlQ-A2io3T56wa8sonswzD6ih7RpAPVK5XQFkFmu8PKKuOUfA96VgpCZxgXvWw-13NILGdDaGs6N0OKNrIiCqMHm_dAORGApPnud7v8vOqs39uKen-9cq4HycLGV90iUONNKvNU' },
    ],
  },
  {
    id: '#ORD-58215',
    date: '15 Jul 2024',
    total: '$890.50',
    status: 'Pending',
    statusColor: '#f59e0b',
    statusBgColor: '#fef3c7',
    items: [
      { name: 'Belgian Linen', qty: '100 meters', price: '$890.50', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKe5bOyXMK5G9vYlGy6aVuQLNg_5DeqUz8eoCHfNIH28vcSVa9LSQi3mkKT_aO6yM3hPjZJWdf37UO3GLDNo2KvBQJVc4Xm7DP6jNfSzDBzuYMiGlXT7znc9mHYIlNsXMzfZJ_t9tTkKVmim4SVw1qdxX8dd-Vcm6HkpzoxfVOSB7jjrhhLOVD3Mss_vfGrtZq4W_S0nh98-6kWC1xP9ccSqNI8LaVVVrxM671me0qCMd9tVg8I0WrIYbOP3cxjss24kjvifSIxjY' },
    ],
  },
  {
    id: '#ORD-58102',
    date: '02 Jul 2024',
    total: '$2,110.00',
    status: 'Cancelled',
    statusColor: '#ef4444',
    statusBgColor: '#fee2e2',
    items: [
      { name: 'Merino Wool', qty: '80 meters', price: '$2,110.00', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0utLoOLzII_j2jfp0mec85Ilmz3Y0toOSB6R8qLgE9hg2Wjc1uWiEqpmAkZWt3eOBk0TCn1-ympPg2b6G9Kg73AoYaWTnjg93BDL-9imb-sBrXv2uolQowBaBw7GRC2WJbFgd7nnXpmrflv4nJ-F5XWZiky0CWYhMZq40iMVb7E5w0Hcsrp2IRwQgHkCxCAVIKMdsbHeFBCM2TD1Z3EO1IdJm3vFeIlP60QPghfFwOKYddGNcb0o3H1fql-7qXzex-y1CXKUqcA8' },
    ]
  }
];

const OrderItem = memo(({ item }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View>
        <Text style={styles.orderId}>{item.id}</Text>
        <Text style={styles.orderDate}>{item.date}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.orderTotal}>{item.total}</Text>
        <View style={[styles.statusBadge, { backgroundColor: item.statusBgColor }]}>
          <Text style={[styles.statusText, { color: item.statusColor }]}>{item.status}</Text>
        </View>
      </View>
    </View>
    <View style={styles.cardBody}>
      {item.items.map((product, index) => (
        <View style={styles.productItem} key={index}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
          <View>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productQty}>{product.qty}</Text>
            <Text style={styles.productPrice}>{product.price}</Text>
          </View>
        </View>
      ))}
    </View>
  </View>
));

const renderItem = ({ item }) => <OrderItem item={item} />;
const keyExtractor = item => item.id;

const OrderHistoryScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="menu" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order History</Text>
        <TouchableOpacity onPress={() => navigation.navigate('BuyerHomeScreen')}>
          <MaterialIcons name="home" size={24} color="#0f172a" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContainer}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f6f7f8',
    fontFamily: 'Inter_400Regular',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f6f7f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: '#0f172a',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 24,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderId: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#0f172a',
  },
  orderDate: {
    fontSize: 14,
    color: '#475569',
  },
  orderTotal: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#0f172a',
  },
  statusBadge: {
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginTop: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  cardBody: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 16,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 16,
  },
  productName: {
    fontFamily: 'Inter_500Medium',
    color: '#0f172a',
  },
  productQty: {
    fontSize: 14,
    color: '#475569',
  },
  productPrice: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#0f172a',
  },
});

export default OrderHistoryScreen;
