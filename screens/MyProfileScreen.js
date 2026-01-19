import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

const MyProfileScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <Header navigation={navigation} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileHeader}>
          <Text style={styles.companyName}>Textile Innovations Inc.</Text>
          <Text style={styles.email}>alex.doe@textileinnovations.com</Text>
        </View>

        <TouchableOpacity style={styles.editProfileButton}>
          <Text style={styles.editProfileButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        <Section title="Profile Details">
          <View style={styles.detailsContainer}>
            <DetailRow label="Company Name" value="Textile Innovations Inc." />
            <DetailRow label="Contact Person" value="Alex Doe" />
            <DetailRow label="Phone Number" value="+1 (555) 123-4567" />
            <DetailRow label="Business Address" value="123 Fabric Lane, Suite 404, Weaverville, TX 78701" isLast />
          </View>
        </Section>

        <Section title="Order Overview">
          <View style={styles.overviewContainer}>
            <OverviewBox value="34" label="Total Orders" color="#135bec" />
            <OverviewBox value="5" label="In Progress" color="#f97316" />
            <OverviewBox value="29" label="Completed" color="#22c55e" />
          </View>
        </Section>
      </ScrollView>
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

const DetailRow = ({ label, value, isLast = false }) => (
  <View style={[styles.detailRow, !isLast && styles.detailRowBorder]}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
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
    fontFamily: 'Inter_400Regular',
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
  },
  editProfileButton: {
    backgroundColor: '#111827',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 32,
  },
  editProfileButtonText: {
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
    paddingVertical: 16,
  },
  detailRowBorder: {
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 14,
    textAlign: 'right',
    flexShrink: 1,
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
