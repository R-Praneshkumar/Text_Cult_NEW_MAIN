import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

const cartItems = [
    {
        id: '1',
        name: '20s Cotton',
        quantity: '20 meters',
        specs: { Spinning: 'OE', Count: '20s', Strand: 'Single', Purpose: 'Weaving' },
        image: require('../assets/images/cart_item_1.jpg'),
        orderType: 'Sample',
        price: '₹7,000.00',
    },
    {
        id: '2',
        name: 'Silk Charmeuse',
        quantity: '15 meters',
        specs: { Spinning: 'Combed', Count: '30s', Strand: 'Double', Purpose: 'Knitting' },
        image: require('../assets/images/cart_item_2.jpg'),
        orderType: 'Bulk Order',
        price: '₹8,250.00',
    },
    {
        id: '3',
        name: 'Heavy-Duty Canvas',
        quantity: '50 meters',
        specs: { Spinning: 'Carded', Count: '10s', Strand: 'Multi', Purpose: 'Weaving' },
        image: require('../assets/images/cart_item_3.jpg'),
        orderType: 'Bulk Order',
        price: '₹14,000.00',
    }
];

const MyCartScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <Header navigation={navigation} />
            <ScrollView contentContainerStyle={styles.container}>
                {cartItems.map(item => <CartItemCard key={item.id} item={item} />)}
            </ScrollView>
            <Footer navigation={navigation} />
        </SafeAreaView>
    );
};

const Header = ({ navigation }) => (
    <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><MaterialIcons name="arrow-back" size={24} color="black" /></TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <TouchableOpacity onPress={() => navigation.navigate('BuyerHomeScreen')}><MaterialIcons name="home" size={24} color="black" /></TouchableOpacity>
    </View>
);

const CartItemCard = ({ item }) => (
    <View style={styles.card}>
        <TouchableOpacity style={styles.closeButton}><MaterialIcons name="close" size={20} color="#9ca3af" /></TouchableOpacity>
        <View style={styles.cardHeader}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQuantity}>Qty: <Text style={{ fontWeight: '600', color: 'black' }}>{item.quantity}</Text></Text>
        </View>
        <View style={styles.cardBody}>
            <View style={{ ...styles.specsContainer, borderBottomWidth: 1, borderColor: '#e5e7eb', paddingBottom: 16, marginBottom: 16 }}>
                <View style={styles.specsGrid}>
                    {Object.entries(item.specs).map(([key, value]) => (
                        <React.Fragment key={key}>
                            <Text style={styles.specLabel}>{key}:</Text>
                            <Text style={styles.specValue}>{value}</Text>
                        </React.Fragment>
                    ))}
                </View>
                <Image source={item.image} style={styles.itemImage} />
            </View>
            <View style={styles.orderTypeRow}>
                <Text style={styles.orderTypeLabel}>Order Type</Text>
                <Text style={[styles.orderTypeBadge, item.orderType === 'Sample' ? styles.sampleBadge : styles.bulkBadge]}>
                    {item.orderType}
                </Text>
            </View>
        </View>
        <View style={styles.cardFooter}>
            <Text style={styles.totalPriceLabel}>Total Price</Text>
            <Text style={styles.totalPriceValue}>{item.price}</Text>
        </View>
    </View>
);

const Footer = ({ navigation }) => (
    <View style={styles.footer}>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('BuyerHomeScreen')}>
            <Text style={styles.addButtonText}>Add Products</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={() => navigation.navigate('OrderConfirmationScreen')}>
            <Text style={styles.submitButtonText}>Submit Order</Text>
        </TouchableOpacity>
    </View>
);


const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: 'white', fontFamily: 'Inter_400Regular' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#f3f4f6' },
    headerTitle: { fontSize: 18, fontFamily: 'Inter_700Bold' },
    container: { padding: 16, paddingBottom: 100 },
    card: { borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: 'white', marginBottom: 24 },
    closeButton: { position: 'absolute', top: 8, right: 8, zIndex: 1, padding: 4 },
    cardHeader: { padding: 16 },
    itemName: { fontSize: 16, fontFamily: 'Inter_700Bold' },
    itemQuantity: { color: '#4b5563' },
    cardBody: { paddingHorizontal: 16, paddingBottom: 16 },
    specsContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 16 },
    specsGrid: { flex: 1, backgroundColor: '#f9fafb', borderRadius: 8, padding: 10, flexDirection: 'row', flexWrap: 'wrap', gap: 8, fontSize: 11 },
    specLabel: { color: '#6b7280' },
    specValue: { fontFamily: 'Inter_500Medium' },
    itemImage: { width: 96, height: 96, borderRadius: 8 },
    orderTypeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    orderTypeLabel: { color: '#4b5563', fontFamily: 'Inter_500Medium' },
    orderTypeBadge: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4, fontSize: 12, fontFamily: 'Inter_600SemiBold' },
    sampleBadge: { backgroundColor: '#dbeafe', color: '#1d4ed8' },
    bulkBadge: { backgroundColor: '#e0e7ff', color: '#4338ca' },
    cardFooter: { borderTopWidth: 1, borderColor: '#e5e7eb', backgroundColor: 'rgba(249, 250, 251, 0.5)', padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    totalPriceLabel: { fontSize: 16, fontFamily: 'Inter_500Medium', color: '#4b5563' },
    totalPriceValue: { fontSize: 16, fontFamily: 'Inter_700Bold' },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', padding: 16, gap: 16, borderTopWidth: 1, borderColor: '#e5e7eb', backgroundColor: 'rgba(255,255,255,0.8)' },
    addButton: { flex: 1, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(0,0,0,0.2)', backgroundColor: 'white', padding: 12, alignItems: 'center' },
    addButtonText: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
    submitButton: { flex: 1, borderRadius: 8, backgroundColor: 'black', padding: 12, alignItems: 'center' },
    submitButtonText: { color: 'white', fontSize: 16, fontFamily: 'Inter_600SemiBold' },
});

export default MyCartScreen;
