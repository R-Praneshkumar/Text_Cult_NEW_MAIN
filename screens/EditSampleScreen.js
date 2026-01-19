import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const EditSampleScreen = ({ navigation }) => {
    const [productType, setProductType] = useState('Fabric');
    const [spinning, setSpinning] = useState('OE');
    const [count, setCount] = useState('20s');
    const [strand, setStrand] = useState('Single');
    const [purpose, setPurpose] = useState('Weaving');

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <Header navigation={navigation} />
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.itemHeader}>
                    <View>
                        <Text style={styles.itemName}>20s Cotton</Text>
                        <Text style={styles.itemId}>Sample ID: #SMP-789-101</Text>
                    </View>
                    <Image
                        source={require('../assets/images/cart_item_1.jpg')}
                        style={styles.itemImage}
                    />
                </View>

                <Section title="Sample Details">
                    <FormRow label="Product Type">
                        <Picker selectedValue={productType} onValueChange={(itemValue) => setProductType(itemValue)} style={styles.picker}>
                            <Picker.Item label="Yarn" value="Yarn" />
                            <Picker.Item label="Fabric" value="Fabric" />
                            <Picker.Item label="Apparel" value="Apparel" />
                        </Picker>
                    </FormRow>
                    <FormRow label="Sample Quantity (meters)">
                        <TextInput style={styles.input} defaultValue="5" keyboardType="numeric" />
                    </FormRow>
                    <FormRow label="Bulk Quantity (meters)">
                        <TextInput style={styles.input} placeholder="e.g. 500 (optional)" keyboardType="numeric" />
                    </FormRow>
                </Section>

                <Section title="Yarn Specifications">
                    <FormRow label="Spinning">
                        <Picker selectedValue={spinning} onValueChange={(itemValue) => setSpinning(itemValue)} style={styles.picker}>
                            <Picker.Item label="Carded" value="Carded" />
                            <Picker.Item label="OE (Open-End)" value="OE" />
                            <Picker.Item label="Combed" value="Combed" />
                        </Picker>
                    </FormRow>
                    <FormRow label="Count">
                        <Picker selectedValue={count} onValueChange={(itemValue) => setCount(itemValue)} style={styles.picker}>
                            <Picker.Item label="10s" value="10s" />
                            <Picker.Item label="20s" value="20s" />
                            <Picker.Item label="30s" value="30s" />
                        </Picker>
                    </FormRow>
                    <FormRow label="Strand">
                        <Picker selectedValue={strand} onValueChange={(itemValue) => setStrand(itemValue)} style={styles.picker}>
                            <Picker.Item label="Single" value="Single" />
                            <Picker.Item label="Double" value="Double" />
                        </Picker>
                    </FormRow>
                    <FormRow label="Purpose">
                        <Picker selectedValue={purpose} onValueChange={(itemValue) => setPurpose(itemValue)} style={styles.picker}>
                            <Picker.Item label="Weaving" value="Weaving" />
                            <Picker.Item label="Knitting" value="Knitting" />
                        </Picker>
                    </FormRow>
                </Section>

            </ScrollView>
            <View style={styles.footer}>
                <TouchableOpacity style={styles.updateButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.updateButtonText}>Update Sample</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const Header = ({ navigation }) => (
    <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><MaterialIcons name="arrow-back" size={24} color="black" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Sample</Text>
        <TouchableOpacity onPress={() => navigation.navigate('BuyerHomeScreen')}><MaterialIcons name="home" size={24} color="black" /></TouchableOpacity>
    </View>
);

const Section = ({ title, children }) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {children}
    </View>
);

const FormRow = ({ label, children }) => (
    <View style={styles.formRow}>
        <Text style={styles.label}>{label}</Text>
        {children}
    </View>
);


const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f6f6f7', fontFamily: 'Inter_400Regular' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: '#e5e7eb', backgroundColor: 'white' },
    headerTitle: { fontSize: 18, fontFamily: 'Inter_700Bold' },
    container: { padding: 16, paddingBottom: 100 },
    itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 16 },
    itemName: { fontSize: 20, fontFamily: 'Inter_700Bold' },
    itemId: { color: 'rgba(0,0,0,0.7)', fontSize: 14 },
    itemImage: { width: 96, height: 96, borderRadius: 8 },
    section: { backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', padding: 16, marginBottom: 16 },
    sectionTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', marginBottom: 8 },
    formRow: { marginBottom: 12 },
    label: { color: 'rgba(0,0,0,0.7)', fontSize: 14, fontFamily: 'Inter_500Medium', marginBottom: 6 },
    input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 10, backgroundColor: 'white' },
    picker: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, backgroundColor: 'white' },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, borderTopWidth: 1, borderColor: '#e5e7eb', backgroundColor: 'rgba(255,255,255,0.8)' },
    updateButton: { backgroundColor: 'black', borderRadius: 8, padding: 12, alignItems: 'center' },
    updateButtonText: { color: 'white', fontSize: 16, fontFamily: 'Inter_600SemiBold' }
});

export default EditSampleScreen;
