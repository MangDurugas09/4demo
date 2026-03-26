import React from 'react';
import { StyleSheet, View, Text, ScrollView, Linking, TouchableOpacity } from 'react-native';

export default function CompanyInfo({ colors }) {
  const companyDetails = {
    name: 'Power Distribution Ltd',
    establishedYear: '1995',
    tagline: 'Powering Your Tomorrow',
    serviceArea: '5 States, 200+ Cities',
    customers: '2.5 Million+',
    renewableEnergy: '35%',
  };

  const contactInfo = [
    { icon: '📞', label: 'Customer Support', value: '+1 (800) 555-0199', link: 'tel:+18005550199' },
    { icon: '✉️', label: 'Email', value: 'support@powerco.com', link: 'mailto:support@powerco.com' },
    { icon: '📍', label: 'Address', value: '123 Power Street, City, State 12345', link: null },
    { icon: '⏰', label: 'Toll Free', value: '1800-POWER-99', link: 'tel:18007369399' },
  ];

  const features = [
    { icon: '🌱', title: 'Sustainable Energy', description: 'Committed to 50% renewable by 2030' },
    { icon: '💼', title: 'Expert Staff', description: '5000+ skilled professionals' },
    { icon: '🔒', title: 'Secure Payment', description: 'SSL encrypted transactions' },
    { icon: '📊', title: 'Real-time Tracking', description: 'Monitor usage 24/7' },
  ];

  const certifications = ['ISO 9001', 'ISO 14001', 'ISO 45001'];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Company Header */}
      <View style={[styles.headerCard, { backgroundColor: colors.accent, opacity: 0.95 }]}>
        <Text style={[styles.companyName, { color: colors.darkBg }]}>
          ⚡ {companyDetails.name}
        </Text>
        <Text style={[styles.tagline, { color: colors.darkBg, opacity: 0.8 }]}>
          "{companyDetails.tagline}"
        </Text>
      </View>

      {/* About Section */}
      <View style={[styles.card, { backgroundColor: colors.primary, opacity: 0.95 }]}>
        <Text style={[styles.cardTitle, { color: colors.darkBg }]}>
          About Us
        </Text>
        <Text style={[styles.cardText, { color: colors.darkBg }]}>
          Established in {companyDetails.establishedYear}, Power Distribution Ltd has been a 
          leading electricity provider, delivering reliable power and exceptional service to millions 
          of customers across multiple states and cities.
        </Text>
        <Text style={[styles.cardText, { color: colors.darkBg, marginTop: 12 }]}>
          We are dedicated to providing sustainable and affordable electricity while maintaining 
          the highest standards of quality and customer satisfaction.
        </Text>
      </View>

      {/* Key Statistics */}
      <View style={[styles.statsCard, { backgroundColor: colors.darkBlue }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.accent }]}>
            {companyDetails.customers}
          </Text>
          <Text style={[styles.statLabel, { color: colors.white }]}>
            Active Customers
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.accent },{
            textAlign: 'center'
          }]}>
            {companyDetails.serviceArea}
          </Text>
          <Text style={[styles.statLabel, { color: colors.white },]}>
            Service Area
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.accent }]}>
            {companyDetails.renewableEnergy}
          </Text>
          <Text style={[styles.statLabel, { color: colors.white }]}>
            Green Energy
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.accent }]}>
            Est. {companyDetails.establishedYear}
          </Text>
          <Text style={[styles.statLabel, { color: colors.white }]}>
            Year Founded
          </Text>
        </View>
      </View>

      {/* Our Strengths */}
      <View style={[styles.card, { backgroundColor: colors.primary, opacity: 0.95 }]}>
        <Text style={[styles.cardTitle, { color: colors.darkBg }]}>
          Why Choose Us?
        </Text>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureBox}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={[styles.featureTitle, { color: colors.darkBg }]}>
                {feature.title}
              </Text>
              <Text style={[styles.featureDesc, { color: colors.darkBg, opacity: 0.7 }]}>
                {feature.description}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Contact Information */}
      <View style={[styles.card, { backgroundColor: colors.accent, opacity: 0.9 }]}>
        <Text style={[styles.cardTitle, { color: colors.darkBg }]}>
          Get in Touch
        </Text>
        {contactInfo.map((contact, index) => (
          <TouchableOpacity
            key={index}
            style={styles.contactItem}
            onPress={() => contact.link && Linking.openURL(contact.link)}
            disabled={!contact.link}
          >
            <Text style={styles.contactIcon}>{contact.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.contactLabel, { color: colors.darkBg }]}>
                {contact.label}
              </Text>
              <Text
                style={[
                  styles.contactValue,
                  {
                    color: contact.link ? colors.darkBlue : colors.darkBg,
                    fontWeight: contact.link ? '700' : '600',
                  },
                ]}
              >
                {contact.value}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Certifications & Awards */}
      <View style={[styles.card, { backgroundColor: colors.primary, opacity: 0.95 }]}>
        <Text style={[styles.cardTitle, { color: colors.darkBg }]}>
          🏆 Certifications & Standards
        </Text>
        <View style={styles.certificateContainer}>
          {certifications.map((cert, index) => (
            <View
              key={index}
              style={[
                styles.certBox,
                {
                  backgroundColor: colors.accent,
                  opacity: 0.85,
                },
              ]}
            >
              <Text style={[styles.certText, { color: colors.darkBg }]}>
                {cert}
              </Text>
            </View>
          ))}
        </View>
        <Text style={[styles.certDescription, { color: colors.darkBg, marginTop: 12 }]}>
          Compliant with international quality and safety standards ensuring reliability 
          and excellence in service delivery.
        </Text>
      </View>

      {/* Service Commitment */}
      <View style={[styles.card, { backgroundColor: colors.darkBlue }]}>
        <Text style={[styles.cardTitle, { color: colors.white }]}>
          Our Commitment
        </Text>
        <Text style={[styles.commitmentText, { color: colors.white }]}>
          ✓ 24/7 Customer Support
        </Text>
        <Text style={[styles.commitmentText, { color: colors.white }]}>
          ✓ Transparent Billing and Fair Pricing
        </Text>
        <Text style={[styles.commitmentText, { color: colors.white }]}>
          ✓ Regular Infrastructure Updates
        </Text>
        <Text style={[styles.commitmentText, { color: colors.white }]}>
          ✓ Community Sustainability Programs
        </Text>
        <Text style={[styles.commitmentText, { color: colors.white }]}>
          ✓ Digital Innovation for Customer Convenience
        </Text>
        <Text style={[styles.commitmentText, { color: colors.white }]}>
          ✓ Fair Employment and Safety Practices
        </Text>
      </View>

      {/* Social Responsibility */}
      <View style={[styles.card, { backgroundColor: colors.accent, opacity: 0.9 }]}>
        <Text style={[styles.cardTitle, { color: colors.darkBg }]}>
          Social Responsibility
        </Text>
        <Text style={[styles.cardText, { color: colors.darkBg }]}>
          • Electrification of rural areas to support community development
        </Text>
        <Text style={[styles.cardText, { color: colors.darkBg }]}>
          • Educational programs promoting energy conservation
        </Text>
        <Text style={[styles.cardText, { color: colors.darkBg }]}>
          • Support for renewable energy adoption and green initiatives
        </Text>
        <Text style={[styles.cardText, { color: colors.darkBg }]}>
          • Disaster relief and emergency support services
        </Text>
        <Text style={[styles.cardText, { color: colors.darkBg }]}>
          • Environmental protection and sustainability projects
        </Text>
      </View>

      {/* Footer Info */}
      <View style={[styles.footerCard, { backgroundColor: colors.primary, opacity: 0.9 }]}>
        <Text style={[styles.footerText, { color: colors.darkBg, fontSize: 12, textAlign: 'center' }]}>
          © 2026 Power Distribution Ltd. All rights reserved.
        </Text>
        <Text style={[styles.footerText, { color: colors.darkBg, fontSize: 11, opacity: 0.6, textAlign: 'center', marginTop: 8 }]}>
          Website: www.powerco.com | Follow us on social media for updates
        </Text>
      </View>
    </ScrollView>
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
    fontStyle: 'italic',
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
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
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
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 14,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(11, 30, 46, 0.1)',
  },
  contactIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  contactLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 12,
  },
  certificateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginVertical: 12,
  },
  certBox: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    minWidth: '30%',
    alignItems: 'center',
  },
  certText: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  certDescription: {
    fontSize: 12,
    lineHeight: 18,
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
