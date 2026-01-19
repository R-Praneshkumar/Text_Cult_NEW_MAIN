import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const WelcomeScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../assets/images/welcome_bg.jpg')}
      style={styles.background}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.logo}>TexCult</Text>
            <Text style={styles.subtitle}>Entire textile in one place</Text>
          </View>
          <View style={styles.mainContent}>
            <Text style={styles.quote}>
              "Weaving connections between tradition and tomorrow"
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('LoginScreen')}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
            <View style={styles.featureBox}>
              <MaterialIcons name="local-offer" size={24} color="white" />
              <Text style={styles.featureText}>Low Price</Text>
            </View>
            <View style={styles.featureBox}>
              <MaterialIcons name="workspace-premium" size={24} color="white" />
              <Text style={styles.featureText}>Highest Quality</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(25, 25, 25, 0.75)',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
  },
  logo: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'PlayfairDisplay_700Bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    marginTop: 16,
    fontSize: 16,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  quote: {
    fontSize: 20,
    fontFamily: 'PlayfairDisplay_700Bold_Italic', // Or generic italic if font mostly loaded
    fontStyle: 'italic',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  mainContent: {
    width: '100%',
    maxWidth: 384,
    gap: 16,
  },
  button: {
    height: 56,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#191919',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 24,
  },
  featureBox: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
  },
});

export default WelcomeScreen;
