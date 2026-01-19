import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

const spinningTypes = ["Ring Spun", "OE", "Airjet", "Siro Spun", "Core Spun", "Slub Spun", "Filament Spun", "Worsted Spun"];
const yarnCounts = ["10s", "20s", "30s", "40s", "50s", "60s"];

const ProductDetailsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [application, setApplication] = useState([]);
  const [strand, setStrand] = useState('single');

  const toggleApplication = (type) => {
    setApplication(prev =>
      prev.includes(type) ? prev.filter(item => item !== type) : [...prev, type]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/product_detail.jpg')}
            style={styles.productImage}
          />
          <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialIcons name="menu" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.headerRight}>
              <TouchableOpacity onPress={() => navigation.navigate('NotificationsScreen')}>
                <MaterialIcons name="notifications" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.pendingButton} onPress={() => navigation.navigate('PendingOrdersScreen')}>
                <Text style={styles.pendingText}>Pending Orders</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('MyCartScreen')}>
                <MaterialIcons name="shopping-cart" size={24} color="white" />
                <View style={styles.cartBadge}><Text style={styles.cartText}>3</Text></View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.titleSection}>
            <Text style={styles.productTitle}>Rayon Yarn</Text>
            <Text style={styles.productSubtitle}>Smooth & Silky</Text>
          </View>

          <View style={styles.optionsContainer}>
            <OptionSection title="Application">
              <View style={styles.optionRow}>
                <Checkbox
                  label="Weaving"
                  checked={application.includes('Weaving')}
                  onPress={() => toggleApplication('Weaving')}
                />
                <Checkbox
                  label="Knitting"
                  checked={application.includes('Knitting')}
                  onPress={() => toggleApplication('Knitting')}
                />
              </View>
            </OptionSection>

            <OptionSection title="Spinning Type">
              <View style={styles.optionRow}>
                {spinningTypes.map(type => <Checkbox key={type} label={type} />)}
              </View>
            </OptionSection>

            <OptionSection title="Yarn Count">
              <View style={styles.optionRow}>
                {yarnCounts.map(count => <Checkbox key={count} label={count} />)}
              </View>
            </OptionSection>

            <OptionSection title="Strand">
              <View style={styles.optionRow}>
                <RadioButton
                  label="Single"
                  checked={strand === 'single'}
                  onPress={() => setStrand('single')}
                />
                <RadioButton
                  label="Ply"
                  checked={strand === 'ply'}
                  onPress={() => setStrand('ply')}
                />
              </View>
            </OptionSection>

            <View style={styles.divider} />

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Price per 1kg</Text>
              <Text style={styles.priceValue}>$2.50</Text>
            </View>

            <OptionSection title="Quantity">
              <View style={styles.quantityRow}>
                <TextInput style={styles.quantityInput} placeholder="Enter quantity" keyboardType="numeric" />
                <View style={styles.unitSelector}>
                  <TouchableOpacity style={styles.unitOptionSelected}><Text style={styles.unitTextSelected}>kg</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.unitOption}><Text style={styles.unitText}>tons</Text></TouchableOpacity>
                </View>
              </View>
            </OptionSection>
            <TouchableOpacity style={styles.requestButton} onPress={() => navigation.navigate('EditSampleScreen')}>
              <Text style={styles.requestButtonText}>Request Sample</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('OrderConfirmationScreen')}>
            <Text style={styles.footerButtonText}>Proceed to Buy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('MyCartScreen')}>
            <Text style={styles.footerButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const OptionSection = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const Checkbox = ({ label, checked, onPress }) => (
  <TouchableOpacity style={[styles.optionButton, checked && styles.optionButtonChecked]} onPress={onPress}>
    <Text style={[styles.optionText, checked && styles.optionTextChecked]}>{label}</Text>
  </TouchableOpacity>
);

const RadioButton = ({ label, checked, onPress }) => (
  <TouchableOpacity style={[styles.optionButton, checked && styles.optionButtonChecked]} onPress={onPress}>
    <Text style={[styles.optionText, checked && styles.optionTextChecked]}>{label}</Text>
  </TouchableOpacity>
);


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1e293b' },
  scrollView: { flex: 1 },
  imageContainer: { position: 'relative' },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  pendingButton: { backgroundColor: 'black', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
  pendingText: { color: 'white', fontFamily: 'Inter_500Medium' },
  cartBadge: { position: 'absolute', top: -4, right: -4, backgroundColor: 'red', borderRadius: 8, width: 16, height: 16, justifyContent: 'center', alignItems: 'center' },
  cartText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  productImage: { width: '100%', height: 160 },
  contentContainer: { backgroundColor: '#f8fafc', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16 },
  titleSection: { paddingBottom: 16, borderBottomWidth: 1, borderColor: '#e2e8f0' },
  productTitle: { fontSize: 18, fontFamily: 'Poppins_600SemiBold', color: '#0f172a' },
  productSubtitle: { fontSize: 14, color: '#475569' },
  optionsContainer: { paddingTop: 16 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_500Medium', color: '#0f172a', marginBottom: 8 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap' },
  optionButton: { minWidth: 80, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, backgroundColor: '#f1f5f9', marginRight: 8, marginBottom: 8 },
  optionButtonChecked: { backgroundColor: '#dbeafe', borderWidth: 1, borderColor: '#3b82f6' },
  optionText: { color: '#475569', fontFamily: 'Inter_500Medium' },
  optionTextChecked: { color: '#1e40af' },
  divider: { height: 1, backgroundColor: '#e2e8f0', marginVertical: 16 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 8, backgroundColor: '#f1f5f9', marginBottom: 16 },
  priceLabel: { fontSize: 14, fontFamily: 'Inter_500Medium', color: '#475569' },
  priceValue: { fontSize: 18, fontFamily: 'Inter_700Bold', color: '#0f172a' },
  quantityRow: { flexDirection: 'row', gap: 8 },
  quantityInput: { flex: 1, padding: 10, borderRadius: 8, backgroundColor: '#f1f5f9', borderColor: 'transparent', borderWidth: 1 },
  unitSelector: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 8, padding: 4 },
  unitOption: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  unitOptionSelected: { backgroundColor: '#dbeafe', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  unitText: { color: '#475569', fontFamily: 'Inter_500Medium' },
  unitTextSelected: { color: '#1e40af', fontFamily: 'Inter_500Medium' },
  requestButton: { borderWidth: 2, borderColor: '#3b82f6', borderRadius: 8, padding: 12, alignItems: 'center', marginTop: 16 },
  requestButtonText: { color: '#3b82f6', fontFamily: 'Inter_700Bold' },
  footer: { flexDirection: 'row', gap: 12, padding: 16, backgroundColor: '#f8fafc', borderTopWidth: 1, borderColor: '#e2e8f0' },
  footerButton: { flex: 1, backgroundColor: 'black', padding: 12, borderRadius: 8, alignItems: 'center' },
  footerButtonText: { color: 'white', fontFamily: 'Inter_700Bold' },
});

export default ProductDetailsScreen;
