import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { userService } from '../api/userService';
import { useFocusEffect } from '@react-navigation/native';

const MyProfileScreen = ({ navigation }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  // Edit form state — only for backend-supported fields
  const [editData, setEditData] = React.useState({
    companyName: '',
    firstname: '',
    lastname: '',
    phoneno: '',
  });

  useFocusEffect(
    React.useCallback(() => {
      fetchProfile();
      // Reset edit mode when leaving and coming back
      setIsEditing(false);
    }, [])
  );

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await userService.getProfile();
      setUser(data);
      // Pre-fill edit form with current values
      setEditData({
        companyName: data?.companyName || '',
        firstname: data?.firstname || '',
        lastname: data?.lastname || '',
        phoneno: data?.phoneno || '',
      });
    } catch (error) {
      console.log('Profile fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing — reset form to original values
      setEditData({
        companyName: user?.companyName || '',
        firstname: user?.firstname || '',
        lastname: user?.lastname || '',
        phoneno: user?.phoneno || '',
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    // Basic validation
    if (!editData.firstname.trim()) {
      Alert.alert('Validation', 'First name cannot be empty');
      return;
    }
    if (!editData.companyName.trim()) {
      Alert.alert('Validation', 'Company name cannot be empty');
      return;
    }
    if (!editData.phoneno.trim()) {
      Alert.alert('Validation', 'Phone number cannot be empty');
      return;
    }

    setSaving(true);
    try {
      await userService.updateProfile({
        firstname: editData.firstname.trim(),
        lastname: editData.lastname.trim(),
        companyName: editData.companyName.trim(),
        phoneno: editData.phoneno.trim(),
      });
      Alert.alert('Success', 'Profile updated successfully!');
      setIsEditing(false);
      // Refresh profile to show updated data from server
      await fetchProfile();
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert('Error', error.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#135bec" />
      </SafeAreaView>
    );
  }

  // Fallback if user is null
  const userData = user || {
    companyName: 'Loading...',
    firstname: 'Unknown',
    lastname: '',
    email: '...',
    phoneno: '...',
    buyerType: '',
  };

  const fullName = `${userData.firstname} ${userData.lastname || ''}`.trim();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <Header navigation={navigation} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.profileHeader}>
            <Text style={styles.companyName}>
              {isEditing ? editData.companyName : (userData.companyName || 'Company Name')}
            </Text>
            {/* Email/Username — ALWAYS read-only (cannot change login identity) */}
            <Text style={styles.email}>{userData.username || userData.email || 'email@example.com'}</Text>
          </View>

          {/* Edit / Cancel / Save Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.editProfileButton, isEditing && styles.cancelButton]}
              onPress={handleEditToggle}
              disabled={saving}
            >
              <MaterialIcons
                name={isEditing ? 'close' : 'edit'}
                size={18}
                color={isEditing ? '#d32f2f' : 'white'}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.editProfileButtonText, isEditing && styles.cancelButtonText]}>
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Text>
            </TouchableOpacity>

            {isEditing && (
              <TouchableOpacity
                style={[styles.saveButton, saving && { opacity: 0.6 }]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <MaterialIcons name="check" size={18} color="white" style={{ marginRight: 6 }} />
                    <Text style={styles.saveButtonText}>Save</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>

          <Section title="Profile Details">
            <View style={styles.detailsContainer}>
              {/* EDITABLE: Company Name */}
              <EditableRow
                label="Company Name"
                value={editData.companyName}
                isEditing={isEditing}
                displayValue={userData.companyName || '-'}
                onChangeText={(text) => setEditData({ ...editData, companyName: text })}
              />
              {/* EDITABLE: First Name (Contact Person) */}
              <EditableRow
                label="First Name"
                value={editData.firstname}
                isEditing={isEditing}
                displayValue={userData.firstname || '-'}
                onChangeText={(text) => setEditData({ ...editData, firstname: text })}
              />
              {/* EDITABLE: Last Name */}
              <EditableRow
                label="Last Name"
                value={editData.lastname}
                isEditing={isEditing}
                displayValue={userData.lastname || '-'}
                onChangeText={(text) => setEditData({ ...editData, lastname: text })}
              />
              {/* EDITABLE: Phone Number */}
              <EditableRow
                label="Phone Number"
                value={editData.phoneno}
                isEditing={isEditing}
                displayValue={userData.phoneno || '-'}
                onChangeText={(text) => setEditData({ ...editData, phoneno: text })}
                keyboardType="phone-pad"
              />
              {/* READ-ONLY: Business Address (not in backend) */}
              <DetailRow
                label="Business Address"
                value={userData.address || 'Not available'}
                isLast
                isStale={true}
              />
            </View>
          </Section>

          <Section title="Order Overview">
            <View style={styles.overviewContainer}>
              <OverviewBox value="0" label="Total Orders" color="#135bec" />
              <OverviewBox value="0" label="In Progress" color="#f97316" />
              <OverviewBox value="0" label="Completed" color="#22c55e" />
            </View>
          </Section>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const Header = ({ navigation }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <MaterialIcons name="arrow-back-ios-new" size={24} color="#111827" />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>My Profile</Text>
    <TouchableOpacity onPress={() => navigation.navigate('BuyerHomeScreen')}>
      <MaterialIcons name="home" size={24} color="#111827" />
    </TouchableOpacity>
  </View>
);

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

// Editable row: shows TextInput in edit mode, plain text otherwise
const EditableRow = ({ label, value, isEditing, displayValue, onChangeText, keyboardType, isLast = false }) => (
  <View style={[styles.detailRow, !isLast && styles.detailRowBorder]}>
    <Text style={styles.detailLabel}>{label}</Text>
    {isEditing ? (
      <TextInput
        style={styles.editInput}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType || 'default'}
        placeholder={label}
        placeholderTextColor="#9ca3af"
      />
    ) : (
      <Text style={styles.detailValue}>{displayValue}</Text>
    )}
  </View>
);

// Read-only row with optional "stale" styling
const DetailRow = ({ label, value, isLast = false, isStale = false }) => (
  <View style={[styles.detailRow, !isLast && styles.detailRowBorder]}>
    <Text style={styles.detailLabel}>{label}</Text>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={[styles.detailValue, isStale && styles.staleValue]}>{value}</Text>
      {isStale && (
        <MaterialIcons name="lock-outline" size={14} color="#9ca3af" style={{ marginLeft: 4 }} />
      )}
    </View>
  </View>
);

const OverviewBox = ({ value, label, color }) => (
  <View style={styles.overviewBox}>
    <Text style={[styles.overviewValue, { color }]}>{value}</Text>
    <Text style={styles.overviewLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  companyName: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  editProfileButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editProfileButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#d32f2f',
  },
  cancelButtonText: {
    color: '#d32f2f',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#16a34a',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    marginBottom: 8,
  },
  detailsContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    minHeight: 56,
  },
  detailRowBorder: {
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
    flex: 0.4,
  },
  detailValue: {
    fontSize: 14,
    textAlign: 'right',
    flexShrink: 1,
  },
  staleValue: {
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  editInput: {
    flex: 0.58,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    textAlign: 'right',
    fontFamily: 'Inter_500Medium',
  },
  overviewContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  overviewBox: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  overviewValue: {
    fontSize: 30,
    fontFamily: 'Inter_700Bold',
  },
  overviewLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default MyProfileScreen;
