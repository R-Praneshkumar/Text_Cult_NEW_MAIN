import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

const ForgotPasswordScreen = ({ navigation }) => {
  const handleResetPassword = () => {
    Alert.alert(
      'Contact Support',
      'Password reset is not yet available. Please contact support at support@texcult.com for assistance.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <Header navigation={navigation} />
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Enter the email address associated with your account and we'll send you a link to reset your password.
          </Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="mail" size={24} color="rgba(81, 59, 86, 0.4)" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor="rgba(81, 59, 86, 0.4)"
                keyboardType="email-address"
              />
            </View>
          </View>
          <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
            <Text style={styles.resetButtonText}>Send Reset Link</Text>
          </TouchableOpacity>
          <View style={styles.supportNote}>
            <MaterialIcons name="info-outline" size={16} color="rgba(81, 59, 86, 0.6)" />
            <Text style={styles.supportNoteText}>
              Password reset will be available soon. Contact support for immediate assistance.
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.footerText}>Back to Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const Header = ({ navigation }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <MaterialIcons name="arrow-back" size={24} color="#513B56" />
    </TouchableOpacity>
    <View style={styles.logoContainer}>
      <MaterialIcons name="hub" size={30} color="#FF6B6B" />
      <Text style={styles.logoText}>TextileFlow</Text>
    </View>
    <View style={{ width: 24 }} />
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F5F0', // soft-cream
    fontFamily: 'Manrope_400Regular',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 64,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 20,
    fontFamily: 'Manrope_700Bold',
    color: '#513B56', // deep-violet
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  content: {
    width: '100%',
    maxWidth: 448,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Manrope_800ExtraBold',
    color: '#513B56',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 12,
    fontSize: 16,
    color: 'rgba(81, 59, 86, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  inputContainer: {
    marginTop: 32,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Manrope_700Bold',
    color: '#513B56',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 9999,
    height: 56,
  },
  inputIcon: {
    marginLeft: 16,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#513B56',
    fontFamily: 'Manrope_400Regular',
  },
  resetButton: {
    marginTop: 32,
    backgroundColor: '#513B56',
    borderRadius: 9999,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
    letterSpacing: 0.5,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Manrope_700Bold',
    color: '#FF6B6B', // coral
  },
  supportNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(81, 59, 86, 0.05)',
    borderRadius: 8,
    gap: 8,
  },
  supportNoteText: {
    flex: 1,
    fontSize: 12,
    color: 'rgba(81, 59, 86, 0.6)',
    lineHeight: 18,
  },
});

export default ForgotPasswordScreen;
