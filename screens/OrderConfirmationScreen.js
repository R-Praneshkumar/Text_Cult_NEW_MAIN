import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

// This is a wrapper to demonstrate the modal functionality
const OrderConfirmationScreen = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(true); // Default to true for demonstration

    const handleOkPress = () => {
        setModalVisible(false);
        navigation.navigate('BuyerHomeScreen');
    };

    return (
        <SafeAreaView style={styles.wrapper}>
            <StatusBar barStyle="dark-content" />
            <Text>Parent Screen Content</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text>Show Confirmation</Text>
            </TouchableOpacity>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.iconContainer}>
                            <MaterialIcons name="check-circle" size={48} color="#3498DB" />
                        </View>
                        <Text style={styles.title}>Order Submitted Successfully!</Text>
                        <Text style={styles.subtitle}>Please Check your Whatsapp to complete payment</Text>
                        <TouchableOpacity
                            style={styles.okButton}
                            onPress={handleOkPress}
                        >
                            <Text style={styles.okButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f7f7f7',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(26, 46, 71, 0.6)', // deep-navy with opacity
    },
    modalContent: {
        width: '90%',
        maxWidth: 384,
        backgroundColor: '#E8EDF2', // light-blue-grey
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(52, 152, 219, 0.2)', // sky-blue with opacity
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333', // dark-charcoal
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(51, 51, 51, 0.8)',
        textAlign: 'center',
        marginTop: 8,
    },
    okButton: {
        marginTop: 16,
        width: '100%',
        height: 44,
        backgroundColor: '#000000',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    okButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default OrderConfirmationScreen;
