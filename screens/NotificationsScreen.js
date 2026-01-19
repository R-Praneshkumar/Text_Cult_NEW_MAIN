import React, { memo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

const notifications = [
  { id: '1', type: 'shipping', title: "Order #5829 Shipped", message: "Your order from 'Supreme Textiles' has been dispatched.", time: "5m ago", unread: true },
  { id: '2', type: 'message', title: "New Message from Seller", message: "Supreme Textiles sent you a new message regarding your inquiry.", time: "1h ago", unread: true },
  { id: '3', type: 'invoice', title: "Invoice #INV-2023-015 is due", message: "Your invoice for order #5820 is due in 3 days.", time: "Yesterday", unread: false },
  { id: '4', type: 'product', title: "New Product Alert", message: "ABC Fabrics has added a new line of organic cotton products.", time: "2 days ago", unread: false },
];

const iconMap = {
  shipping: 'local-shipping',
  message: 'chat-bubble',
  invoice: 'receipt-long',
  product: 'new-releases',
};

const NotificationItem = memo(({ item }) => (
  <View style={styles.notificationItem}>
    <View style={[styles.unreadDot, { backgroundColor: item.unread ? '#3b82f6' : 'transparent' }]} />
    <View style={styles.iconContainer}>
      <MaterialIcons name={iconMap[item.type]} size={24} color="#1f2937" />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemMessage}>{item.message}</Text>
    </View>
    <Text style={styles.itemTime}>{item.time}</Text>
  </View>
));

const renderItem = ({ item }) => <NotificationItem item={item} />;
const keyExtractor = item => item.id;

const NotificationsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity>
          <Text style={styles.actionText}>Mark all as read</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={[styles.actionText, styles.clearAllText]}>Clear all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={
          <View style={styles.footerContainer}>
            <View style={styles.footerIconContainer}>
              <MaterialIcons name="notifications-off" size={32} color="#6b7280" />
            </View>
            <Text style={styles.footerTitle}>You're all caught up!</Text>
            <Text style={styles.footerText}>There are no new notifications for you right now.</Text>
          </View>
        }
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
    fontFamily: 'Inter_400Regular',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#111827',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#111827',
  },
  clearAllText: {
    color: '#ef4444',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#111827',
  },
  itemMessage: {
    fontSize: 14,
    color: '#6b7280',
  },
  itemTime: {
    fontSize: 14,
    color: '#6b7280',
  },
  footerContainer: {
    alignItems: 'center',
    padding: 40,
  },
  footerIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  footerTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#111827',
  },
  footerText: {
    marginTop: 8,
    color: '#6b7280',
  },
});

export default NotificationsScreen;
