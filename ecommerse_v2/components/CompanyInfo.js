import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Linking, TouchableOpacity, Animated } from 'react-native';
import axios from 'axios';

export default function CompanyInfo({ colors, apiBaseUrl, isActive, onScroll }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
  });
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/stats/summary`);
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching company stats:', error);
      }
    };

    fetchStats();
  }, [apiBaseUrl]);

  useEffect(() => {
    if (isActive) {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }
  }, [isActive]);

  const appDetails = {
    name: 'Electripay',
    tagline: 'Track usage, pay bills, and manage your account in one place.',
    audience: 'Electricity consumers and account holders',
    purpose: 'A mobile billing companion for monitoring power usage and submitting payments.',
  };

  const contactInfo = [
    { label: 'Project Support', value: 'Electripay Help Desk', link: null },
    { label: 'Email', value: 'support@electripay.app', link: 'mailto:support@electripay.app' },
    { label: 'Help Hours', value: 'Mon-Fri, 8:00 AM to 6:00 PM', link: null },
    { label: 'Feedback', value: 'Send feature requests or issues by email', link: 'mailto:support@electripay.app' },
  ];

  const features = [
    { title: 'Dashboard Overview', description: 'Shows account profile, bill status, and customer information in one view.' },
    { title: 'Usage Monitoring', description: 'Displays weekly and monthly consumption so users can spot patterns quickly.' },
    { title: 'Payment Tracking', description: 'Generates a payment QR, accepts receipt uploads, and keeps a payment history log.' },
    { title: 'Mobile Access', description: 'Designed for phone-based account access using Expo and a MongoDB-backed API.' },
  ];

  const workflow = [
    'Log in with your account credentials.',
    'Review your current bill, usage summary, and recent payment activity.',
    'Scan or download the QR code to pay using your preferred wallet or banking app.',
    'Upload a receipt image so the payment can be marked for verification.',
  ];

  const benefits = [
    'Reduces the need to ask for bill updates manually.',
    'Keeps usage trends visible for smarter electricity decisions.',
    'Makes payment proof submission easier on mobile devices.',
    'Connects account data, usage data, and payment records in one app.',
  ];

  return (
    <Animated.ScrollView
      ref={scrollRef}
      style={styles.container}
      showsVerticalScrollIndicator={false}
      bounces={false}
      alwaysBounceVertical={false}
      overScrollMode="never"
      onScroll={onScroll}
      scrollEventThrottle={16}
    >
      <View style={[styles.headerCard, { backgroundColor: colors.accent, opacity: 0.95 }]}>
        <Text style={[styles.companyName, { color: colors.darkBg }]}>{appDetails.name}</Text>
        <Text style={[styles.tagline, { color: colors.darkBg }]}>{appDetails.tagline}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.primary, opacity: 0.95 }]}>
        <Text style={[styles.cardTitle, { color: colors.darkBg }]}>What This Project Offers</Text>
        <Text style={[styles.cardText, { color: colors.darkBg }]}>
          Electripay is a mobile application for customers who want a simpler way to manage electricity billing.
          It combines account details, current bill tracking, usage monitoring, and receipt-based payment submission
          into a single interface.
        </Text>
        <Text style={[styles.cardText, { color: colors.darkBg, marginTop: 12 }]}>
          The project is built to help users check their information faster, pay with fewer steps, and understand
          their recent consumption without relying on paper-only updates.
        </Text>
      </View>

      <View style={[styles.statsCard, { backgroundColor: colors.darkBlue }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.accent }]}>{stats.totalUsers}</Text>
          <Text style={[styles.statLabel, { color: colors.white }]}>Registered Users</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.accent }]}>QR Pay</Text>
          <Text style={[styles.statLabel, { color: colors.white }]}>Fast bill payment access</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.accent }]}>Usage View</Text>
          <Text style={[styles.statLabel, { color: colors.white }]}>Weekly and monthly tracking</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.accent }]}>Profile Tools</Text>
          <Text style={[styles.statLabel, { color: colors.white }]}>Account and password controls</Text>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.primary, opacity: 0.95 }]}>
        <Text style={[styles.cardTitle, { color: colors.darkBg }]}>Core Features</Text>
        <View style={styles.featuresGrid}>
          {features.map((feature) => (
            <View key={feature.title} style={styles.featureBox}>
              <Text style={[styles.featureTitle, { color: colors.darkBg }]}>{feature.title}</Text>
              <Text style={[styles.featureDesc, { color: colors.darkBg }]}>{feature.description}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.accent, opacity: 0.9 }]}>
        <Text style={[styles.cardTitle, { color: colors.darkBg }]}>How It Works</Text>
        {workflow.map((step) => (
          <Text key={step} style={[styles.cardText, { color: colors.darkBg, marginBottom: 8 }]}>
            - {step}
          </Text>
        ))}
      </View>

      <View style={[styles.card, { backgroundColor: colors.primary, opacity: 0.95 }]}>
        <Text style={[styles.cardTitle, { color: colors.darkBg }]}>Why It Matters</Text>
        {benefits.map((benefit) => (
          <Text key={benefit} style={[styles.cardText, { color: colors.darkBg, marginBottom: 8 }]}>
            - {benefit}
          </Text>
        ))}
      </View>

      <View style={[styles.card, { backgroundColor: colors.darkBlue }]}>
        <Text style={[styles.cardTitle, { color: colors.white }]}>Project Snapshot</Text>
        <Text style={[styles.commitmentText, { color: colors.white }]}>Audience: {appDetails.audience}</Text>
        <Text style={[styles.commitmentText, { color: colors.white }]}>Purpose: {appDetails.purpose}</Text>
        <Text style={[styles.commitmentText, { color: colors.white }]}>Frontend: React Native with Expo</Text>
        <Text style={[styles.commitmentText, { color: colors.white }]}>Backend: Express API with MongoDB</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.accent, opacity: 0.9 }]}>
        <Text style={[styles.cardTitle, { color: colors.darkBg }]}>Support and Contact</Text>
        {contactInfo.map((contact) => (
          <TouchableOpacity
            key={contact.label}
            style={styles.contactItem}
            onPress={() => contact.link && Linking.openURL(contact.link)}
            disabled={!contact.link}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.contactLabel, { color: colors.darkBg }]}>{contact.label}</Text>
              <Text
                style={[
                  styles.contactValue,
                  { color: contact.link ? colors.darkBlue : colors.darkBg, fontWeight: contact.link ? '700' : '600' },
                ]}
              >
                {contact.value}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.footerCard, { backgroundColor: colors.primary, opacity: 0.9 }]}>
        <Text style={[styles.footerText, { color: colors.darkBg, fontSize: 12 }]}>
          Copyright 2026 Electripay. Built to simplify electricity billing and payment tracking.
        </Text>
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 30,
  },
  headerCard: {
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    textAlign: 'center',
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 13,
    lineHeight: 20,
  },
  statsCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureBox: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  featureDesc: {
    fontSize: 10,
    lineHeight: 14,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(11, 30, 46, 0.1)',
  },
  contactLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 12,
  },
  commitmentText: {
    fontSize: 12,
    lineHeight: 20,
    marginBottom: 6,
  },
  footerCard: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
  },
  footerText: {
    textAlign: 'center',
  },
});
