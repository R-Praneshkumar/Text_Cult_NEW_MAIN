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

const orders = [
    {
        supplier: 'Fabricorp Inc.',
        orderId: '#S001245',
        verified: true,
        items: [
            { id: '1', name: 'Pima Cotton Jersey - PCJ-102', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDb_FxE3WFIofxYzfv7Xs_GuSq1iWTBoh9uKib6s5uYXE_ZVu-Powxaa7vq2k0VBmZRBGEcC6g6Wbrte2zGAtbM2ew81brTDqLTlJc0BSjpx3INS1GbxuSOUQnFU7032uQZNS32tcDrKrPOoy50dJVtfZT2V5nqJYC-ulU1P862ri4Vahs_z6bj3TUYwg-fc0xHnBXjzaIUlvrO8ua1DQ4fSyr3ggXDcxIQw_ci5AXvRTVzgAos_EuHQbh63rACOkHyZXuJDc-r2AU', yarnType: 'Combed Cotton', spinning: 'Ring Spun', quantity: '500 kg', price: '$6,250.00' },
            { id: '2', name: 'Organic Cotton Rib - OCR-301', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_EbXp2t7e7mt6bQVO6by5wrzw0XmWTcIqFhcIcdgaOvVfxq87U8efqSrQB-eG6cOx9k5mqWQioRq7gpTtjtNX2lHFFUKBdx3YLqfyzdMk_98N1GUsqOsrH3Ir7l6qefOukB6XrcVWV6YaQGAHRMHmO38cXVSCcwGzSHMKMPw9ygjFEkgY8JmR7PaVQmt-ee7UeHqeCkfE2Vody-HhHzXUSLrM8KTSIfngQDiYzaNX7C8tZVK-3fS19GF_vKVpwaNjsiJWdAwafBk', yarnType: 'Organic Cotton', spinning: 'Ring Spun', quantity: '300 kg', price: '$4,500.00' },
        ],
        subtotal: '$10,750.00',
        gst: '$537.50',
        shipping: '$250.00',
        total: '$11,537.50',
    },
    {
        supplier: 'Denim Weavers Ltd.',
        orderId: '#S001246',
        verified: true,
        isSingleItem: true,
        items: [
            { id: '3', name: 'Heavyweight Denim Twill - HDT-205', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjc-0cHW0S3WEiGNMhW8urJ7toVGvWOHCeYqAda0nlx7gZ5gWmYLv3VeNSJU5f4YibhTlLEHHWYtPQJVdb8yzs7d7PdLD0W_lSTGe_Z29K1o-ovH4dk97XfSF8YV1B_xnYdedi2FpknOHoPg4HgaNIIzpRa_MbYbN8VH6W_p4WLBTVXWtjR1JWhmf9vNUNb2CRnpH3dpPLQpk9eNGSv_u5E6TVZ63qFo-Gjcd7-BD_NgyDqPpC2TteQTO1wUtQoSboLHdQem6CDiU', yarnType: 'Cotton/Poly Blend', spinning: 'Open-End', count: '10s', strand: 'Two Ply', quantity: '1200 meters', price: '$10,500.00' },
        ],
        subtotal: '$10,500.00',
        gst: '$525.00',
        shipping: '$180.00',
        total: '$11,205.00',
    }
];

const PendingOrdersScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <Header navigation={navigation} />
            <ScrollView contentContainerStyle={styles.container}>
                {orders.map((order, index) => <OrderCard key={index} order={order} navigation={navigation} />)}
                <EmptyState />
            </ScrollView>
        </SafeAreaView>
    );
};

const Header = ({ navigation }) => (
    <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><MaterialIcons name="arrow-back" size={24} color="#101622" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Pending Orders</Text>
        <TouchableOpacity onPress={() => navigation.navigate('BuyerHomeScreen')}><MaterialIcons name="home" size={24} color="#101622" /></TouchableOpacity>
    </View>
);

const OrderCard = ({ order, navigation }) => (
    <View style={styles.card}>
        <TouchableOpacity style={styles.closeButton}><MaterialIcons name="close" size={20} color="#64748b" /></TouchableOpacity>

        {order.isSingleItem ? (
            <>
                <View style={styles.singleItemHeader}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.supplierName}>{order.items[0].name}</Text>
                        <Text style={styles.orderId}>{order.supplier}</Text>
                    </View>
                    <Image source={{ uri: order.items[0].image }} style={styles.itemImage} />
                </View>
                <View style={styles.itemsContainer}>
                    <ItemDetails item={order.items[0]} isSingle />
                </View>
            </>
        ) : (
            <>
                <View style={styles.cardHeader}>
                    <Text style={styles.supplierName}>{order.supplier}</Text>
                    <Text style={styles.orderId}>{order.orderId}</Text>
                </View>
                <View style={styles.itemsContainer}>
                    {order.items.map((item, index) => <ItemCard key={index} item={item} />)}
                </View>
            </>
        )}

        <Summary order={order} navigation={navigation} />
    </View>
);

const ItemCard = ({ item }) => (
    <View style={styles.itemCard}>
        <TouchableOpacity style={styles.itemCloseButton}><MaterialIcons name="close" size={18} color="#64748b" /></TouchableOpacity>
        <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <ItemDetails item={item} />
            </View>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
        </View>
    </View>
);

const ItemDetails = ({ item, isSingle = false }) => (
    <View>
        <View style={styles.detailsGrid}>
            <DetailRow label="Yarn Type:" value={item.yarnType} />
            <DetailRow label="Spinning Type:" value={item.spinning} />
            {item.count && <DetailRow label="Count:" value={item.count} />}
            {item.strand && <DetailRow label="Strand:" value={item.strand} />}
        </View>
        <View style={styles.dashedBorder} />
        <View style={styles.priceQuantityRow}>
            <View>
                <Text style={styles.detailLabel}>{isSingle ? 'Quantity:' : 'Quantity:'}</Text>
                <Text style={styles.detailValue}>{item.quantity}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.detailLabel}>{isSingle ? 'Subtotal:' : 'Price:'}</Text>
                <Text style={[styles.detailValue, { fontSize: 16, fontWeight: 'bold' }]}>{item.price}</Text>
            </View>
        </View>
    </View>
);


const DetailRow = ({ label, value }) => (
    <>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
    </>
);

const Summary = ({ order, navigation }) => (
    <View style={styles.summaryContainer}>
        <SummaryRow label={`Subtotal (${order.items.length} items)`} value={order.subtotal} />
        <SummaryRow label="GST (5%)" value={order.gst} />
        <SummaryRow label="Shipping" value={order.shipping} />
        <View style={styles.dashedBorder} />
        <View style={styles.totalRow}>
            <View>
                <Text style={styles.detailLabel}>Total Price:</Text>
                <Text style={styles.totalValue}>{order.total}</Text>
            </View>
            <View style={styles.verifiedBadge}>
                <MaterialIcons name="check-circle" size={14} color="#16a34a" />
                <Text style={styles.verifiedText}>All Samples Verified</Text>
            </View>
        </View>
        <TouchableOpacity style={styles.submitButton} onPress={() => navigation.navigate('OrderConfirmationScreen')}>
            <Text style={styles.submitButtonText}>Submit Order</Text>
        </TouchableOpacity>
    </View>
);

const SummaryRow = ({ label, value }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={{ ...styles.detailValue, fontWeight: '500' }}>{value}</Text>
    </View>
);

const EmptyState = () => (
    <View style={styles.emptyStateContainer}>
        <View style={styles.emptyStateIcon}>
            <MaterialIcons name="inventory-2" size={40} color="#135bec" />
        </View>
        <Text style={styles.emptyStateTitle}>No Pending Orders</Text>
        <Text style={styles.emptyStateText}>Once a sample is verified, it will appear here, ready for you to place a bulk order.</Text>
    </View>
);

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f6f6f8', fontFamily: 'Inter_400Regular' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: '#e2e8f0', backgroundColor: 'white' },
    headerTitle: { fontSize: 18, fontFamily: 'Inter_700Bold' },
    container: { padding: 16 },
    card: { backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 16 },
    closeButton: { position: 'absolute', top: 8, right: 8, zIndex: 1, backgroundColor: 'rgba(241, 245, 249, 0.8)', borderRadius: 16, padding: 4 },
    cardHeader: { padding: 16 },
    supplierName: { fontSize: 16, fontFamily: 'Inter_700Bold' },
    orderId: { fontSize: 14, color: '#64748b' },
    itemsContainer: { backgroundColor: '#f8fafc', padding: 16, gap: 16 },
    itemCard: { backgroundColor: 'white', borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', padding: 16 },
    itemCloseButton: { position: 'absolute', top: 8, right: 8, zIndex: 1, backgroundColor: '#f1f5f9', borderRadius: 12, padding: 2 },
    itemName: { fontSize: 16, fontFamily: 'Inter_700Bold', flexShrink: 1, marginBottom: 8 },
    itemImage: { width: 64, height: 64, borderRadius: 8 },
    detailsGrid: { flexDirection: 'row', flexWrap: 'wrap' },
    detailLabel: { fontSize: 14, color: '#64748b' },
    detailValue: { fontSize: 14, fontFamily: 'Inter_500Medium' },
    dashedBorder: { borderTopWidth: 1, borderColor: '#e2e8f0', borderStyle: 'dashed', marginVertical: 8 },
    priceQuantityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    summaryContainer: { borderTopWidth: 1, borderColor: '#e2e8f0', padding: 16, gap: 16 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    totalValue: { fontSize: 18, fontFamily: 'Inter_700Bold' },
    verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, gap: 4 },
    verifiedText: { color: '#16a34a', fontSize: 12, fontFamily: 'Inter_500Medium' },
    submitButton: { backgroundColor: '#1e293b', borderRadius: 8, padding: 10, alignItems: 'center' },
    submitButtonText: { color: 'white', fontFamily: 'Inter_500Medium' },
    singleItemHeader: { flexDirection: 'row', padding: 16, gap: 16, alignItems: 'flex-start' },
    emptyStateContainer: { alignItems: 'center', textAlign: 'center', padding: 32, backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', marginTop: 32 },
    emptyStateIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(19, 91, 236, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    emptyStateTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', marginBottom: 4 },
    emptyStateText: { color: '#64748b', maxWidth: 300 },
});

export default PendingOrdersScreen;
