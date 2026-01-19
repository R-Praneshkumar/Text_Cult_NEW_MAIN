import 'react-native-gesture-handler';
import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { Manrope_400Regular, Manrope_700Bold, Manrope_800ExtraBold } from '@expo-google-fonts/manrope';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import { Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { AuthProvider } from './context/AuthContext';

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

const Stack = createStackNavigator();

// Loading screen shown while fonts are loading
const AppLoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#513B56" />
    <Text style={styles.loadingText}>Loading TexCult...</Text>
  </View>
);

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
});

export default function App() {
  // Load fonts but don't block rendering
  useFonts({
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

  // Don't wait for fonts - render immediately
  // Fonts will load in background and update when ready

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Welcome"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="OTPScreen" component={OTPScreen} />
            <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
            <Stack.Screen name="BuyerSignUpScreen" component={BuyerSignUpScreen} />
            <Stack.Screen name="OrderHistoryScreen" component={OrderHistoryScreen} />
            <Stack.Screen name="BuyerHomeScreen" component={BuyerHomeScreen} />
            <Stack.Screen name="OrderConfirmationScreen" component={OrderConfirmationScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="ProductDetailsScreen" component={ProductDetailsScreen} />
            <Stack.Screen name="EditItemScreen" component={EditItemScreen} />
            <Stack.Screen name="PendingOrdersScreen" component={PendingOrdersScreen} />
            <Stack.Screen name="EditSampleScreen" component={EditSampleScreen} />
            <Stack.Screen name="MyProfileScreen" component={MyProfileScreen} />
            <Stack.Screen name="MyCartScreen" component={MyCartScreen} />
            <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
