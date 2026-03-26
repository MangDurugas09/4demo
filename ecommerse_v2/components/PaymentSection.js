import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';

export default function PaymentSection({ colors }) {
  const [selectedPayment, setSelectedPayment] = useState('online');

  const paymentMethods = [
  
    
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: '💳',
      description: 'Visa, Mastercard, RuPay',
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: '👛',
      description: 'Amazon Pay, Apple Pay',
    },
    {
      id: 'cash',
      name: 'Cash Payment',
      icon: '💵',
      description: 'At collection center',
    },
  ];

  const paymentHistory = [
    { date: 'Feb 01, 2026', amount: 1782, status: 'Completed', method: 'wallet' },
    { date: 'Jan 05, 2026', amount: 2205, status: 'Completed', method: 'cash' },
    { date: 'Dec 02, 2025', amount: 1950, status: 'Completed', method: 'Credit Card' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Current Bill Summary */}
      <View style={[styles.billSummary, { backgroundColor: colors.darkBlue }]}>
        <View>
          <Text style={[styles.billLabel, { color: colors.white }]}>
            Amount Due
          </Text>
          <Text style={[styles.billAmount, { color: colors.accent }]}>
            ₱2450
          </Text>
        </View>
        <View>
          <Text style={[styles.dueLabel, { color: colors.white }]}>
            Due Date
          </Text>
          <Text style={[styles.dueDate, { color: colors.accent }]}>
            Mar 15, 2026
          </Text>
        </View>
      </View>

      {/* Payment Methods */}
      <View style={styles.methodsSection}>
        <Text style={[styles.sectionTitle, { color: colors.white }]}>
          Select Payment Method
        </Text>
        <View style={styles.methodsGrid}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodCard,
                {
                  backgroundColor:
                    selectedPayment === method.id ? colors.accent : colors.primary,
                  opacity: selectedPayment === method.id ? 1 : 0.7,
                },
              ]}
              onPress={() => setSelectedPayment(method.id)}
            >
              <Text style={styles.methodIcon}>{method.icon}</Text>
              <Text
                style={[
                  styles.methodName,
                  {
                    color:
                      selectedPayment === method.id ? colors.darkBg : colors.darkBg,
                    fontWeight: selectedPayment === method.id ? 'bold' : '600',
                  },
                ]}
              >
                {method.name}
              </Text>
              <Text
                style={[
                  styles.methodDescription,
                  {
                    color: colors.darkBg,
                    opacity: 0.6,
                  },
                ]}
              >
                {method.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Payment Instructions */}
      <View style={[styles.instructionsCard, { backgroundColor: colors.primary, opacity: 0.95 }]}>
        <Text style={[styles.instructionTitle, { color: colors.darkBg }]}>
          ℹ️ Payment Instructions for {paymentMethods.find(m => m.id === selectedPayment)?.name}
        </Text>
        {selectedPayment === 'online' && (
          <>
            <Text style={[styles.instructionStep, { color: colors.darkBg }]}>
              1. Log in to your bank's portal
            </Text>
            <Text style={[styles.instructionStep, { color: colors.darkBg }]}>
              2. Go to Bill Payments &gt; Utilities
            </Text>
            <Text style={[styles.instructionStep, { color: colors.darkBg }]}>
              3. Enter your Account Number: ACC-2024-987654
            </Text>
            <Text style={[styles.instructionStep, { color: colors.darkBg }]}>
              4. Enter amount: ₱2450
            </Text>
            <Text style={[styles.instructionStep, { color: colors.darkBg }]}>
              5. Confirm and complete the transaction
            </Text>
          </>
        )}
        {selectedPayment === 'upi' && (
          <>
            <Text style={[styles.instructionStep, { color: colors.darkBg }]}>
              1. Open your UPI app (GPay, PhonePe, Paytm)
            </Text>
            <Text style={[styles.instructionStep, { color: colors.darkBg }]}>
              2. Select "Pay Bills" or "Electricity"
            </Text>
            <Text style={[styles.instructionStep, { color: colors.darkBg }]}>
              3. Enter account number: ACC-2024-987654
            </Text>
            <Text style={[styles.instructionStep, { color: colors.darkBg }]}>
              4. Verify details and enter ₹2450
            </Text>
            <Text style={[styles.instructionStep, { color: colors.darkBg }]}>
              5. Complete UPI authentication
            </Text>
          </>
        )}
        {selectedPayment === 'card' && (
          <>
            <Text style={[styles.instructionStep, { color: colors.darkBg }]}>
              1. Enter card details (number, expiry, CVV)
            </Text>
            <Text style={[styles.instructionStep, { color: colors.darkBg }]}>
              2. Enter cardholder name
            </Text>
            <Text style={[styles.instructionStep, { color: colors.darkBg }]}>
              3. Enter billing address
            </Text>
            <Text style={[styles.instructionStep, { color: colors.darkBg }]}>
              4. Review amount: ₹2450
            </Text>
            <Text style={[styles.instructionStep, { color: colors.darkBg }]}>
              5. Complete OTP verification
            </Text>
          </>
        )}
        {selectedPayment === 'cheque' && (
          <>
            <Text style={[styles.instructionStep, { color: colors.darkBg }]}>
              1. Draw cheque in favor of "Power Distribution Ltd"
            </Text>
            <Text style={[styles.instructionStep, { color: colors.darkBg }]}>
              2. Write account number on reverse side
            </Text>
            <Text style={[styles.instructionStep, { color: colors.darkBg }]}>
              3. Make cheque for ₱2450
            </Text>
            <Text style={[styles.instructionStep, { color: colors.darkBg }]}>
              4. Post to: Power Co, 123 Main St, City
            </Text>
            <Text style={[styles.instructionStep, { color: colors.darkBg }]}>
              5. Allow 5-7 days for clearance
            </Text>
          </>
        )}
        {selectedPayment === 'wallet' && (
          <>
            <Text style={[styles.instructionStep, { color: colors.darkBg }]}>
              1. Open Amazon Pay or Apple Pay
            </Text>
            <Text style={[styles.instructionStep, { color: colors.darkBg }]}>
              2. Search for Electricity Bill Payment
            </Text>
            <Text style={[styles.instructionStep, { color: colors.darkBg }]}>
              3. Enter your account number
            </Text>
            <Text style={[styles.instructionStep, { color: colors.darkBg }]}>
              4. Confirm amount: ₹2450
            </Text>
            <Text style={[styles.instructionStep, { color: colors.darkBg }]}>
              5. Authorize payment from your wallet
            </Text>
          </>
        )}
        {selectedPayment === 'cash' && (
          <>
            <Text style={[styles.instructionStep, { color: colors.darkBg }]}>
              1. Visit nearest collection center
            </Text>
            <Text style={[styles.instructionStep, { color: colors.darkBg }]}>
              2. Bring your account number or bill copy
            </Text>
            <Text style={[styles.instructionStep, { color: colors.darkBg }]}>
              3. Inform the amount to be paid: ₹2450
            </Text>
            <Text style={[styles.instructionStep, { color: colors.darkBg }]}>
              4. Make cash payment
            </Text>
            <Text style={[styles.instructionStep, { color: colors.darkBg }]}>
              5. Collect receipt as proof
            </Text>
          </>
        )}
      </View>

      {/* Payment History */}
      <View style={[styles.historyCard, { backgroundColor: colors.primary, opacity: 0.95 }]}>
        <Text style={[styles.historyTitle, { color: colors.darkBg }]}>
          Payment History
        </Text>
        {paymentHistory.map((payment, index) => (
          <View
            key={index}
            style={[
              styles.historyItem,
              {
                borderBottomColor: colors.accent,
                borderBottomWidth: index < paymentHistory.length - 1 ? 1 : 0,
              },
            ]}
          >
            <View>
              <Text style={[styles.historyDate, { color: colors.darkBg }]}>
                {payment.date}
              </Text>
              <Text style={[styles.historyMethod, { color: colors.darkBg, opacity: 0.7 }]}>
                {payment.method}
              </Text>
            </View>
            <View style={styles.historyRight}>
              <Text style={[styles.historyAmount, { color: colors.accent, fontWeight: 'bold' }]}>
                ₱{payment.amount}
              </Text>
              <Text
                style={[
                  styles.historyStatus,
                  { color: colors.darkBg, backgroundColor: colors.accent, opacity: 0.8 },
                ]}
              >
                {payment.status}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Pay Button */}
      <TouchableOpacity
        style={[styles.payButton, { backgroundColor: colors.accent }]}
      >
        <Text style={[styles.payButtonText, { color: colors.darkBg }]}>
          Proceed to Pay ₱2450
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 30,
  },
  billSummary: {
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  billLabel: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.8,
    marginBottom: 4,
  },
  billAmount: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  dueLabel: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.8,
    marginBottom: 4,
  },
  dueDate: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  methodsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  methodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  methodCard: {
    width: '48%',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  methodIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  methodName: {
    fontSize: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  methodDescription: {
    fontSize: 10,
    textAlign: 'center',
  },
  instructionsCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  instructionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  instructionStep: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 6,
  },
  historyCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  historyDate: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  historyMethod: {
    fontSize: 11,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyAmount: {
    fontSize: 14,
    marginBottom: 4,
  },
  historyStatus: {
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  payButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
