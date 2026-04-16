import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { productService } from '../api/productService';

const ProductDetailsScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();

  // Dynamically receive the ID from the Home Screen click
  // Default to 1 just in case, but it should be passed in via route.params
  const passedProductId = route.params?.productId;
  const currentProdId = passedProductId || 1;

  const [loading, setLoading] = useState(true);
  const [attributes, setAttributes] = useState([]); // Raw API data
  const [selectedOptions, setSelectedOptions] = useState({}); // { "Count": { value: "30", sku: "30s" } }

  const [price, setPrice] = useState(null);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    loadProductData();
  }, []);

  const loadProductData = async () => {
    try {
      setLoading(true);
      const data = await productService.getProductAttributes(currentProdId);

      if (data && data.attributes && data.attributes.length > 0) {
        setAttributes(data.attributes);

        // Pre-select "Smart Defaults" to ensure we show a valid price (e.g. Weaving + RS)
        const defaults = {};

        // Define preferred values for each attribute
        const PREFERRED = {
          'Application': 'Weaving',
          'Spinning Type': 'Ring Spun',
          'Strand': 'Single',
          'Count': '30'
        };

        data.attributes.forEach(attr => {
          if (attr.productAttributeValues.length > 0) {
            // Try to find the preferred value
            const preferredVal = PREFERRED[attr.attrName];
            const foundOption = attr.productAttributeValues.find(opt => opt.value === preferredVal);

            // Use preferred if found, otherwise use the first one
            defaults[attr.attrName] = foundOption || attr.productAttributeValues[0];
          }
        });

        setSelectedOptions(defaults);
        calculatePrice(defaults, data.attributes);
      } else {
        console.log('No attributes found for product', currentProdId);
      }
    } catch (e) {
      console.error('Error loading product attributes:', e);
      Alert.alert('Server Waking Up', 'The database server is sleeping and needs a moment to wake up. Please wait 30 seconds and reopen the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (attrName, option) => {
    const newOptions = { ...selectedOptions, [attrName]: option };
    setSelectedOptions(newOptions);
    calculatePrice(newOptions);
  };

  const calculatePrice = async (currentOptions, currentAttributes = attributes) => {
    setCalculating(true);
    setPrice(null); // Reset while calculating

    // CONSTRUCT PAYLOAD - THE CRITICAL PART
    // User Requirement: "YR", "30S" (Caps), "W" (Caps), "RS" (Caps), "SS" (Caps)

    // 1. Base SKU
    const baseSku = "YR";

    // 2. Map Attributes to Array
    // We need to map our selectedOptions to the structure expected by API
    // AND Ensure the SKUs are UPPERCASE as per user instruction.

    const mappedAttributes = Object.keys(currentOptions).map(key => {
      const option = currentOptions[key];
      const attrDef = currentAttributes.find(a => a.attrName === key);

      // Transform Logic: "30s" -> "30S"
      let skuToSend = option.sku ? option.sku.toUpperCase() : option.value.toUpperCase();

      // Safety: ensure reasonable bounds (e.g. if sku is missing, use value)

      return {
        attrId: attrDef.attrId,
        attrName: attrDef.attrName,
        productAttributeValue: {
          attrValue: option.value,
          sku: skuToSend
        }
      };
    });

    const payload = {
      prodId: currentProdId,
      prodName: "Rayon Yarn", // Should come from API really, but sticking to knowns
      prodSku: baseSku,
      attributes: mappedAttributes
    };

    console.log('Calculating Price Payload:', JSON.stringify(payload));

    try {
      const result = await productService.calculatePrice(payload);
      console.log('Price API Result:', result);

      if (result && result.sellingPrice) {
        setPrice(result.sellingPrice);
      } else {
        setPrice('Unavailable');
      }
    } catch (e) {
      console.error('Price calculation failed:', e);
      setPrice('Timeout - Try again');
    } finally {
      setCalculating(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#513B56" />
      </View>
    );
  }

  // Helper to find specific attribute sections by name (to maintain UI layout)
  const getOptionsFor = (name) => {
    const attr = attributes.find(a => a.attrName === name);
    return attr ? attr.productAttributeValues : [];
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
              <MaterialIcons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.headerRight}>
              {/* Icons... */}
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.titleSection}>
            <Text style={styles.productTitle}>Rayon Yarn</Text>
            <Text style={styles.productSubtitle}>Smooth & Silky</Text>
          </View>

          <View style={styles.optionsContainer}>

            {/* DYNAMIC RENDERING OF SECTIONS */}
            {/* The user wants specific UI layout: Application, Spinning, Count, Strand */}

            {/* Application */}
            <OptionSection title="Application">
              <View style={styles.optionRow}>
                {getOptionsFor('Application').map((opt, idx) => (
                  <Checkbox
                    key={idx}
                    label={opt.value}
                    checked={selectedOptions['Application']?.value === opt.value}
                    onPress={() => handleOptionSelect('Application', opt)}
                  />
                ))}
              </View>
            </OptionSection>

            {/* Spinning Type */}
            <OptionSection title="Spinning Type">
              <View style={styles.optionRow}>
                {getOptionsFor('Spinning Type').map((opt, idx) => (
                  <Checkbox
                    key={idx}
                    label={opt.value}
                    checked={selectedOptions['Spinning Type']?.value === opt.value}
                    onPress={() => handleOptionSelect('Spinning Type', opt)}
                  />
                ))}
              </View>
            </OptionSection>

            {/* Yarn Count */}
            <OptionSection title="Yarn Count" note="(s)">
              <View style={styles.optionRow}>
                {getOptionsFor('Count').map((opt, idx) => (
                  <Checkbox
                    key={idx}
                    // Display lowercase "30s" in UI as requested ("ui should have only small s")
                    label={opt.value + (opt.value.includes('s') ? '' : 's')}
                    checked={selectedOptions['Count']?.value === opt.value}
                    onPress={() => handleOptionSelect('Count', opt)}
                  />
                ))}
              </View>
            </OptionSection>

            {/* Strand */}
            <OptionSection title="Strand">
              <View style={styles.optionRow}>
                {getOptionsFor('Strand').map((opt, idx) => (
                  <RadioButton
                    key={idx}
                    label={opt.value}
                    checked={selectedOptions['Strand']?.value === opt.value}
                    onPress={() => handleOptionSelect('Strand', opt)}
                  />
                ))}
              </View>
            </OptionSection>


            <View style={styles.divider} />

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Price per 1kg</Text>
              {calculating ? (
                <ActivityIndicator size="small" color="#0f172a" />
              ) : (
                <Text style={price === 'Unavailable' || (typeof price === 'string' && price.includes('Timeout')) ? styles.priceUnavailable : styles.priceValue}>
                  {typeof price === 'number' ? `₹${price.toFixed(2)}` : price || '-'}
                </Text>
              )}
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

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('OrderConfirmationScreen')}>
            <Text style={styles.footerButtonText}>Proceed to Buy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Text style={styles.footerButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};

// Reusing same components but cleaner
const OptionSection = ({ title, children, note }) => (
  <View style={styles.section}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {note && <Text style={{ fontSize: 12, color: '#666', marginLeft: 4, marginBottom: 8 }}>{note}</Text>}
    </View>
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
    top: 0, left: 0, right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  productImage: { width: '100%', height: 200 },
  contentContainer: { backgroundColor: '#f8fafc', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16, marginTop: -20 },
  titleSection: { paddingBottom: 16, borderBottomWidth: 1, borderColor: '#e2e8f0' },
  productTitle: { fontSize: 20, fontFamily: 'Poppins_600SemiBold', color: '#0f172a' },
  productSubtitle: { fontSize: 14, color: '#475569' },
  optionsContainer: { paddingTop: 16 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_500Medium', color: '#0f172a', marginBottom: 8 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap' },
  optionButton: { minWidth: 70, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, backgroundColor: '#f1f5f9', marginRight: 8, marginBottom: 8, justifyContent: 'center', alignItems: 'center' },
  optionButtonChecked: { backgroundColor: '#dbeafe', borderWidth: 1, borderColor: '#3b82f6' },
  optionText: { color: '#475569', fontFamily: 'Inter_500Medium' },
  optionTextChecked: { color: '#1e40af' },
  divider: { height: 1, backgroundColor: '#e2e8f0', marginVertical: 16 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 8, backgroundColor: '#f1f5f9', marginBottom: 16 },
  priceLabel: { fontSize: 14, fontFamily: 'Inter_500Medium', color: '#475569' },
  priceValue: { fontSize: 24, fontFamily: 'Inter_700Bold', color: '#0f172a' },
  priceUnavailable: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#ef4444' },
  quantityRow: { flexDirection: 'row', gap: 8 },
  quantityInput: { flex: 1, padding: 12, borderRadius: 8, backgroundColor: '#f1f5f9', borderColor: '#e2e8f0', borderWidth: 1 },
  unitSelector: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 8, padding: 4 },
  unitOption: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  unitOptionSelected: { backgroundColor: '#dbeafe', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  unitText: { color: '#475569', fontFamily: 'Inter_500Medium' },
  unitTextSelected: { color: '#1e40af', fontFamily: 'Inter_500Medium' },
  requestButton: { borderWidth: 2, borderColor: '#3b82f6', borderRadius: 8, padding: 12, alignItems: 'center', marginTop: 16 },
  requestButtonText: { color: '#3b82f6', fontFamily: 'Inter_700Bold' },
  footer: { flexDirection: 'row', gap: 12, padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#e2e8f0' },
  footerButton: { flex: 1, backgroundColor: 'black', padding: 14, borderRadius: 8, alignItems: 'center' },
  footerButtonText: { color: 'white', fontFamily: 'Inter_700Bold' },
});

export default ProductDetailsScreen;
