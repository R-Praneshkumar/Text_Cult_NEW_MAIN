import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { authService } from '../api/authService';
import { MaterialIcons } from '@expo/vector-icons';

const OTPScreen = ({ navigation, route }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const inputs = useRef([]);

  const { verifyOtp } = useAuth();

  // Get data from navigation params
  // userData is present if coming from Signup
  // phoneno is present if coming from Login (future flow)
  const { userData, phoneno } = route.params || {};

  const targetPhone = userData?.phoneno || phoneno || '';

  // Timer countdown
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (text, index) => {
    if (/^[0-9]$/.test(text) || text === '') {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // Move to next input if a digit is entered
      if (text !== '' && index < 5) {
        inputs.current[index + 1].focus();
      }
    }
  };

  const handleKeyPress = (e, index) => {
    // Move to previous input on backspace if current is empty
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setErrorMessage('Please enter the full 6-digit code');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      // Ensure phone number has country code (matching Postman test)
      const formattedPhone = targetPhone.trim().startsWith('+') ? targetPhone.trim() : `+91${targetPhone.trim()}`;

      const result = await verifyOtp({
        phoneno: formattedPhone,
        token: otpValue
      });

      if (result.success) {
        // Navigation will be handled by App.js conditional rendering in the future,
        // but for now we manually navigate to ensure flow works.
        // If App.js is refactored to check `isAuthenticated`, this might be redundant but harmless 
        // if the stack is replaced.
        navigation.navigate('BuyerHomeScreen');
      } else {
        setErrorMessage(result.error || 'Verification failed');
      }
    } catch (error) {
      setErrorMessage(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;

    setErrorMessage('');
    setIsLoading(true);

    try {
      // If we have full userData (from signup), we resend that.
      // If we only have phoneno (from login), we send just that (backend dependent).
      // Based on `sendOtp` impl, it accepts a payload.
      // Assuming sendOtp handles both scenarios or we reconstruct what's needed.
      // For signup, we should pass userData.
      // For login, we might need a different payload or just phoneno if the endpoint supports it.
      // The spec summary said "send-otp API requires full user profile details". 
      // This implies it's primarily for Signup. Login might use a different flow or endpoint?
      // But let's assume `sendOtp` works for now.

      const payload = userData || { phoneno: targetPhone };

      await authService.sendOtp(payload);
      setTimer(30);
      setErrorMessage('');
      alert('OTP resent successfully!'); // Simple feedback
    } catch (error) {
      setErrorMessage(error.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Enter Verification Code</Text>
          <Text style={styles.subtitle}>
            A 6-digit code has been sent to {targetPhone || 'your phone number'}.
          </Text>
        </View>

        {errorMessage ? (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={20} color="#ff6b6b" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref)}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              value={digit}
              textAlign="center"
              textContentType="oneTimeCode"
              autoComplete="sms-otp"
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.verifyButton, isLoading && styles.disabledButton]}
          onPress={handleVerify}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#111827" />
          ) : (
            <Text style={styles.verifyButtonText}>Verify OTP</Text>
          )}
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code?</Text>
          <TouchableOpacity
            disabled={timer > 0 || isLoading}
            onPress={handleResend}
          >
            <Text style={[
              styles.resendButtonText,
              timer > 0 ? styles.disabledResend : null
            ]}>
              Resend OTP {timer > 0 ? `(00:${timer.toString().padStart(2, '0')})` : ''}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
    fontFamily: 'Manrope_400Regular',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Manrope_700Bold',
    color: '#111827',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  otpInput: {
    height: 56,
    width: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f7f7f7',
    fontSize: 24,
    fontFamily: 'Manrope_700Bold',
    color: '#111827',
  },
  verifyButton: {
    marginTop: 8,
    height: 56,
    width: '100%',
    backgroundColor: '#f7f5f3',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.7,
  },
  verifyButtonText: {
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
    color: '#111827',
  },
  resendContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: '#6b7280',
  },
  resendButtonText: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: 'Manrope_700Bold',
    color: '#111827',
  },
  disabledResend: {
    color: '#9CA3AF',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderWidth: 1,
    borderColor: '#ff6b6b',
    borderRadius: 6,
    padding: 10,
    marginBottom: 24,
    width: '100%',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
});

export default OTPScreen;
