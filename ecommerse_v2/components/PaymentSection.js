import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function PaymentSection({ colors }) {
  const [receipt, setReceipt] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const bill = {
    amount: 2450,
    dueDate: 'March 15, 2026',
    status: 'Unpaid',
    accountNumber: 'ACC-2024-987654',
  };

  const paymentHistory = [
    { date: 'Feb 01, 2026', amount: 1782, status: 'Completed' },
    { date: 'Jan 05, 2026', amount: 2205, status: 'Completed' },
    { date: 'Dec 02, 2025', amount: 1950, status: 'Completed' },
  ];

  // 📸 PICK RECEIPT IMAGE
  const pickReceipt = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission required', 'Allow access to gallery');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setReceipt(result.assets[0].uri);
      setSubmitted(false);
    }
  };

  // 📩 SUBMIT RECEIPT
  const submitReceipt = () => {
    if (!receipt) {
      Alert.alert('No Receipt', 'Please upload a receipt first.');
      return;
    }

    // 👉 Replace this with API call later
    setSubmitted(true);

    Alert.alert('Submitted', 'Receipt sent to admin for verification.');
  };

  const handleDownloadQR = () => {
    Alert.alert('Download', 'QR Code downloaded successfully!');
  };

  return (
    <ScrollView style={styles.container}>

      {/* 🧾 BILL SUMMARY */}
      <View style={[styles.card, { backgroundColor: colors.darkBlue }]}>
        <Text style={[styles.title, { color: colors.white }]}>
          Current Bill
        </Text>

        <Text style={[styles.amount, { color: colors.accent }]}>
          ₱{bill.amount}
        </Text>

        <Text style={[styles.text, { color: colors.white }]}>
          Due Date: {bill.dueDate}
        </Text>

        <Text style={[
          styles.status,
          { color: bill.status === 'Paid' ? 'green' : 'red' }
        ]}>
          Status: {bill.status}
        </Text>
      </View>

      {/* 📱 QR CODE */}
      <View style={[styles.card, { backgroundColor: colors.primary }]}>
        <Text style={[styles.title, { color: colors.darkBg }]}>
          Pay via QR Code
        </Text>

        <Image
          source={{
            uri: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PAYMENT-ACC-2024-987654',
          }}
          style={styles.qr}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.accent }]}
          onPress={handleDownloadQR}
        >
          <Text style={{ color: colors.darkBg, fontWeight: 'bold' }}>
            Download QR Code
          </Text>
        </TouchableOpacity>
      </View>

      {/* 📋 INSTRUCTIONS */}
      <View style={[styles.card, { backgroundColor: colors.primary }]}>
        <Text style={[styles.title, { color: colors.darkBg }]}>
          Payment Instructions
        </Text>

        <Text style={styles.step}>1. Open GCash / Maya</Text>
        <Text style={styles.step}>2. Tap "Scan QR"</Text>
        <Text style={styles.step}>3. Scan QR above</Text>
        <Text style={styles.step}>4. Pay ₱{bill.amount}</Text>
        <Text style={styles.step}>5. Screenshot receipt</Text>
      </View>

      {/* 📤 RECEIPT UPLOAD */}
      <View style={[styles.card, { backgroundColor: colors.primary }]}>
        <Text style={[styles.title, { color: colors.darkBg }]}>
          Upload Payment Receipt
        </Text>

        <TouchableOpacity
          style={[styles.uploadButton, { backgroundColor: colors.accent }]}
          onPress={pickReceipt}
        >
          <Text style={{ color: colors.darkBg, fontWeight: 'bold' }}>
            Select Receipt Image
          </Text>
        </TouchableOpacity>

        {/* PREVIEW */}
        {receipt && (
          <Image source={{ uri: receipt }} style={styles.receiptPreview} />
        )}

        {/* SUBMIT BUTTON */}
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: colors.darkBlue }]}
          onPress={submitReceipt}
        >
          <Text style={{ color: colors.white, fontWeight: 'bold' }}>
            Submit Receipt
          </Text>
        </TouchableOpacity>

        {/* STATUS */}
        {submitted && (
          <Text style={{ color: 'green', marginTop: 8 }}>
            ✅ Submitted. Waiting for admin approval.
          </Text>
        )}
      </View>

      {/* 🧾 HISTORY */}
      <View style={[styles.card, { backgroundColor: colors.primary }]}>
        <Text style={[styles.title, { color: colors.darkBg }]}>
          Recent Payments
        </Text>

        {paymentHistory.map((item, index) => (
          <View key={index} style={styles.historyItem}>
            <View>
              <Text style={styles.historyDate}>{item.date}</Text>
              <Text style={styles.historyStatus}>{item.status}</Text>
            </View>

            <Text style={styles.historyAmount}>
              ₱{item.amount}
            </Text>
          </View>
        ))}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },

  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },

  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },

  amount: { fontSize: 32, fontWeight: 'bold', marginBottom: 10 },

  text: { fontSize: 14 },

  status: { fontWeight: 'bold', marginTop: 6 },

  qr: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginVertical: 12,
  },

  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  step: { fontSize: 13, marginBottom: 6, color: '#000' },

  uploadButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },

  submitButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },

  receiptPreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },

  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  historyDate: { fontSize: 13, fontWeight: '600' },

  historyStatus: { fontSize: 11, color: 'green' },

  historyAmount: { fontSize: 14, fontWeight: 'bold' },
});