import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../context/AuthContext';
import { BUYER_TYPES } from '../api/config';

const BuyerSignUpScreen = ({ navigation }) => {
  // Form state
  const [email, setEmail] = useState('');
  const [alternateEmail, setAlternateEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phoneno, setPhoneno] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [buyerType, setBuyerType] = useState('RETAILER');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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
    if (!password) {
      setErrorMessage('Please enter a password');
      return false;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return false;
    }
    return true;
  };

  // Handle signup
  const handleSignup = async () => {
    setErrorMessage('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await signup({
        email: email.trim(),
        password,
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        companyName: companyName.trim(),
        phoneno: phoneno.trim().startsWith('+') ? phoneno.trim() : `+91${phoneno.trim()}`,
        buyerType,
        alternateEmail: alternateEmail.trim(),
        alternatePhone: alternatePhone.trim(),
      });

      if (result.success) {
        navigation.navigate('BuyerHomeScreen');
      } else {
        setErrorMessage(result.error || 'Signup failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.');
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
          <ScrollView contentContainerStyle={styles.container}>
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

              <ScrollView showsVerticalScrollIndicator={false}>
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

                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Password *"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    secureTextEntry={!isPasswordVisible}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    <MaterialIcons
                      name={isPasswordVisible ? "visibility" : "visibility-off"}
                      size={24}
                      color="rgba(255, 255, 255, 0.5)"
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Confirm Password *"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    secureTextEntry={!isPasswordVisible}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.signUpButton, isLoading && styles.disabledButton]}
                  onPress={handleSignup}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#191919" />
                  ) : (
                    <Text style={styles.signUpButtonText}>Sign Up</Text>
                  )}
                </TouchableOpacity>
              </ScrollView>
            </View>
          </ScrollView>
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
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  formContainer: {
    width: '100%',
    maxWidth: 384,
    maxHeight: '85%',
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
  passwordContainer: {
    height: 48,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    height: '100%',
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
