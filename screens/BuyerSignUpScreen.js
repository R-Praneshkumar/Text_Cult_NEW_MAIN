import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../context/AuthContext';
import { authService } from '../api/authService';
import { BUYER_TYPES } from '../api/config';

const BuyerSignUpScreen = ({ navigation }) => {
  // Form state
  const [email, setEmail] = useState('');
  const [alternateEmail, setAlternateEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phoneno, setPhoneno] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [buyerType, setBuyerType] = useState('WEAVER');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auth context
  const { signup } = useAuth();

  // Validate form
  const validateForm = () => {
    if (!firstname.trim()) {
      setErrorMessage('Please enter your first name');
      return false;
    }
    if (!lastname.trim()) {
      setErrorMessage('Please enter your last name');
      return false;
    }
    if (!email.trim()) {
      setErrorMessage('Please enter your email');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address');
      return false;
    }
    // Alternate email validation (optional but must be valid if entered)
    if (alternateEmail.trim() && !emailRegex.test(alternateEmail.trim())) {
      setErrorMessage('Please enter a valid alternate email address');
      return false;
    }

    if (!phoneno.trim()) {
      setErrorMessage('Please enter your phone number');
      return false;
    }

    // Simple phone length check (adjust as needed)
    if (phoneno.trim().length < 10) {
      setErrorMessage('Phone number must be at least 10 digits');
      return false;
    }

    // Alternate phone check (optional)
    if (alternatePhone.trim() && alternatePhone.trim().length < 10) {
      setErrorMessage('Alternate phone number must be at least 10 digits');
      return false;
    }

    if (!companyName.trim()) {
      setErrorMessage('Please enter your company name');
      return false;
    }
    return true;
  };

  // Handle signup (Send OTP)
  const handleSignup = async () => {
    setErrorMessage('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const userData = {
        username: email.trim(),
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        companyName: companyName.trim(),
        phoneno: phoneno.trim().startsWith('+') ? phoneno.trim() : `+91${phoneno.trim()}`,
        buyerType,
        // API spec for send-otp triggers (Page 1) does not list alternateEmail, 
        // but we'll keep it if backend supports it, or it might be ignored.
        // Spec lists 'alternatePhoneNo'.
        alternatePhoneNo: alternatePhone.trim(),
        // Backend DB requires 'category' (violates not-null), despite spec saying optional.
        category: 'General',
      };

      await authService.sendSignupOtp(userData);

      navigation.navigate('OTPScreen', { userData, isLogin: false });

    } catch (error) {
      setErrorMessage(error.message || 'Failed to send OTP. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/login_bg.jpg')}
      style={styles.background}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <View style={styles.formContainer}>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.tabButton, styles.activeTab]}>
                  <Text style={styles.activeTabText}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('LoginScreen')}>
                  <Text style={styles.tabText}>Login</Text>
                </TouchableOpacity>
              </View>

              {/* Error Message */}
              {errorMessage ? (
                <View style={styles.errorContainer}>
                  <MaterialIcons name="error-outline" size={20} color="#ff6b6b" />
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              ) : null}

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              >
                <TextInput
                  style={styles.input}
                  placeholder="First Name *"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={firstname}
                  onChangeText={setFirstname}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Last Name *"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={lastname}
                  onChangeText={setLastname}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Email *"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Alternate Email (Optional)"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  keyboardType="email-address"
                  value={alternateEmail}
                  onChangeText={setAlternateEmail}
                  autoCapitalize="none"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Phone Number *"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  keyboardType="phone-pad"
                  value={phoneno}
                  onChangeText={setPhoneno}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Alternate Phone (Optional)"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  keyboardType="phone-pad"
                  value={alternatePhone}
                  onChangeText={setAlternatePhone}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Company Name *"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={companyName}
                  onChangeText={setCompanyName}
                />

                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={buyerType}
                    onValueChange={(itemValue) => setBuyerType(itemValue)}
                    style={styles.picker}
                    dropdownIconColor="rgba(255, 255, 255, 0.5)"
                  >
                    {BUYER_TYPES.map((type) => (
                      <Picker.Item key={type.value} label={type.label} value={type.value} />
                    ))}
                  </Picker>
                </View>



                <TouchableOpacity
                  style={[styles.signUpButton, isLoading && styles.disabledButton]}
                  onPress={handleSignup}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#191919" />
                  ) : (
                    <Text style={styles.signUpButtonText}>Get OTP</Text>
                  )}
                </TouchableOpacity>
              </ScrollView>
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
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  safeArea: {
    flex: 1,
    fontFamily: 'Manrope_400Regular',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  formContainer: {
    width: '100%',
    maxWidth: 384,
    height: 585, // Increased to 575px as requested
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 24,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderWidth: 1,
    borderColor: '#ff6b6b',
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  tabButton: {
    flex: 1,
    borderBottomWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingBottom: 8,
    alignItems: 'center',
  },
  activeTab: {
    borderColor: '#f2f2f2',
  },
  tabText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
  activeTabText: {
    fontSize: 16,
    color: '#f2f2f2',
    fontWeight: 'bold',
  },
  input: {
    height: 48,
    width: '100%',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    color: 'white',
    marginBottom: 16,
  },
  pickerContainer: {
    height: 48,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    marginBottom: 16,
  },
  picker: {
    color: 'white',
  },

  signUpButton: {
    marginTop: 16,
    height: 56,
    width: '100%',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.7,
  },
  signUpButtonText: {
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
    color: '#191919',
  },
});

export default BuyerSignUpScreen;
