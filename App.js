import 'react-native-gesture-handler';
import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider, useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { Manrope_400Regular, Manrope_700Bold, Manrope_800ExtraBold } from '@expo-google-fonts/manrope';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import { Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { AuthProvider, useAuth } from './context/AuthContext';

import WelcomeScreen from './screens/WelcomeScreen';
import OTPScreen from './screens/OTPScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import BuyerSignUpScreen from './screens/BuyerSignUpScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import BuyerHomeScreen from './screens/BuyerHomeScreen';
import OrderConfirmationScreen from './screens/OrderConfirmationScreen';
import LoginScreen from './screens/LoginScreen';
import ProductDetailsScreen from './screens/ProductDetailsScreen';
import EditItemScreen from './screens/EditItemScreen';
import PendingOrdersScreen from './screens/PendingOrdersScreen';
import EditSampleScreen from './screens/EditSampleScreen';
import MyProfileScreen from './screens/MyProfileScreen';
import MyCartScreen from './screens/MyCartScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';


import { createDrawerNavigator } from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

const Stack = createStackNavigator();
const AuthStack = createStackNavigator();
const AppStack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Loading screen shown while fonts are loading or auth is checking
const AppLoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#513B56" />
    <Text style={styles.loadingText}>Loading TexCult...</Text>
  </View>
);

const AuthNavigator = () => (
  <AuthStack.Navigator
    initialRouteName="Welcome"
    screenOptions={{ headerShown: false }}
  >
    <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
    <AuthStack.Screen name="LoginScreen" component={LoginScreen} />
    <AuthStack.Screen name="BuyerSignUpScreen" component={BuyerSignUpScreen} />
    <AuthStack.Screen name="OTPScreen" component={OTPScreen} />
    <AuthStack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
  </AuthStack.Navigator>
);

// Main App Stack (Home, Details, Cart, etc.)
// We wrap this inside the Drawer
const MainAppStack = () => (
  <AppStack.Navigator
    initialRouteName="BuyerHomeScreen"
    screenOptions={{ headerShown: false }}
  >
    <AppStack.Screen name="BuyerHomeScreen" component={BuyerHomeScreen} />
    <AppStack.Screen name="NotificationsScreen" component={NotificationsScreen} />
    <AppStack.Screen name="OrderHistoryScreen" component={OrderHistoryScreen} />
    <AppStack.Screen name="OrderConfirmationScreen" component={OrderConfirmationScreen} />
    <AppStack.Screen name="ProductDetailsScreen" component={ProductDetailsScreen} />
    <AppStack.Screen name="EditItemScreen" component={EditItemScreen} />
    <AppStack.Screen name="PendingOrdersScreen" component={PendingOrdersScreen} />
    <AppStack.Screen name="EditSampleScreen" component={EditSampleScreen} />
    <AppStack.Screen name="MyProfileScreen" component={MyProfileScreen} />
    <AppStack.Screen name="MyCartScreen" component={MyCartScreen} />
  </AppStack.Navigator>
);

// Drawer Content Component
const CustomDrawerContent = (props) => {
  const { logout } = useAuth();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <View style={{ paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
        <Text style={{ fontSize: 22, fontFamily: 'PlayfairDisplay_700Bold', color: '#513B56' }}>TexCult</Text>
      </View>
      <View style={{ flex: 1, paddingTop: 10 }}>
        {/* Profile */}
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('MainStack', { screen: 'MyProfileScreen' })}
        >
          <MaterialIcons name="person" size={24} color="#333" />
          <Text style={styles.drawerLabel}>Profile</Text>
        </TouchableOpacity>

        {/* Orders */}
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('MainStack', { screen: 'OrderHistoryScreen' })}
        >
          <MaterialIcons name="history" size={24} color="#333" />
          <Text style={styles.drawerLabel}>Orders</Text>
        </TouchableOpacity>



      </View>
      <View style={{ paddingHorizontal: 8, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#eee' }}>
        <TouchableOpacity style={styles.drawerItem} onPress={logout}>
          <MaterialIcons name="logout" size={24} color="#d32f2f" />
          <Text style={[styles.drawerLabel, { color: '#d32f2f' }]}>Log out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// The Drawer Navigator
const AppNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={{
      headerShown: false,
      drawerStyle: {
        width: 280, // Standard responsive drawer width for most phones like Oppo F21 Pro
      }
    }}
  >
    <Drawer.Screen name="MainStack" component={MainAppStack} />
  </Drawer.Navigator>
);

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Also waiting for fonts? 
  // The outer component handles fonts. Here we just handle auth loading.
  if (isLoading) {
    return <AppLoadingScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default function App() {
  // Load fonts
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
    Manrope_400Regular,
    Manrope_700Bold,
    Manrope_800ExtraBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoadingScreen />;
  }

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F5F0',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#513B56',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12, // Reduced from 15 for better spacing
    paddingHorizontal: 20,
  },
  drawerLabel: {
    fontSize: 16,
    marginLeft: 15,
    fontFamily: 'Inter_500Medium',
    color: '#333',
  },
});
