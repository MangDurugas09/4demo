import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput } from 'react-native';

export default function Dashboard({ colors }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://www.pngmart.com/files/23/Profile-PNG-Photo.png',
  });

  const billAmount = 2450;
  const dueDate = 'March 7, 2026';
  const accountNumber = 'ACC-2024-987654';
  const status = 'Active';

  const handleSave = () => {
    setIsEditing(false);
    // Here you could save to backend or local storage
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values if needed
  };

  return (
    <View style={styles.container}>
      {/* Profile Card */}
      <View style={[styles.profileCard, { backgroundColor: colors.primary }]}>
        <View style={styles.profileHeader}>
          <Text style={[styles.profileTitle, { color: colors.darkBg }]}>Profile</Text>
          {!isEditing ? (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Text style={[styles.editButton, { color: colors.accent }]}>Edit</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.editButtons}>
              <TouchableOpacity onPress={handleCancel}>
                <Text style={[styles.cancelButton, { color: colors.primary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave}>
                <Text style={[styles.saveButton, { color: colors.accent }]}>Save</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: profile.avatar }} style={styles.avatar} />
          {isEditing && (
            <TextInput
              style={[styles.input, { borderColor: colors.primary, marginTop: 8 }]}
              value={profile.avatar}
              onChangeText={(text) => setProfile({ ...profile, avatar: text })}
              placeholder="Avatar URL"
            />
          )}
        </View>
        <View style={styles.profileContent}>
          <View style={styles.profileField}>
            <Text style={[styles.fieldLabel, { color: colors.darkBg }]}>Name:</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, { borderColor: colors.primary }]}
                value={profile.name}
                onChangeText={(text) => setProfile({ ...profile, name: text })}
              />
            ) : (
              <Text style={[styles.fieldValue, { color: colors.darkBg }]}>{profile.name}</Text>
            )}
          </View>
          <View style={styles.profileField}>
            <Text style={[styles.fieldLabel, { color: colors.darkBg }]}>Email:</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, { borderColor: colors.primary }]}
                value={profile.email}
                onChangeText={(text) => setProfile({ ...profile, email: text })}
                keyboardType="email-address"
              />
            ) : (
              <Text style={[styles.fieldValue, { color: colors.darkBg }]}>{profile.email}</Text>
            )}
          </View>
        </View>
      </View>

      {/* Status Card */}
      <View style={[styles.statusCard, { backgroundColor: colors.primary }]}>
        <Text style={[styles.statusLabel, { color: colors.darkBg }]}>
          Account Status
        </Text>
        <Text style={[styles.statusValue, { color: colors.accent }]}>
          {status}
        </Text>
      </View>

      {/* Bill Amount Card */}
      <View style={[styles.billCard, { backgroundColor: colors.darkBlue }]}>
        <Text style={[styles.label, { color: colors.white }]}>Current Bill</Text>
        <Text style={[styles.amount, { color: colors.accent }]}>
          ₱{billAmount}
        </Text>
        <Text style={[styles.dueDateText, { color: colors.white, opacity: 0.8 }]}>
          Due by: {dueDate}
        </Text>
      </View>

      {/* Account Details */}
      <View style={[styles.detailsCard, { backgroundColor: colors.primary, opacity: 0.9 }]}>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.darkBg }]}>
            Account Number:
          </Text>
          <Text style={[styles.detailValue, { color: colors.darkBg, fontWeight: 'bold' }]}>
            {accountNumber}
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.white, opacity: 0.3 }]} />
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.darkBg }]}>
            Connection Type:
          </Text>
          <Text style={[styles.detailValue, { color: colors.darkBg, fontWeight: 'bold' }]}>
            Domestic
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.white, opacity: 0.3 }]} />
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.darkBg }]}>
            Billing Period:
          </Text>
          <Text style={[styles.detailValue, { color: colors.darkBg, fontWeight: 'bold' }]}>
            Feb 1 - Mar 1, 2026
          </Text>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statBox, { backgroundColor: colors.accent, opacity: 0.9 }]}>
          <Text style={[styles.statLabel, { color: colors.darkBg }]}>This Month</Text>
          <Text style={[styles.statValue, { color: colors.darkBg }]}>245 kWh</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: colors.primary, opacity: 0.9 }]}>
          <Text style={[styles.statLabel, { color: colors.darkBg }]}>Last Month</Text>
          <Text style={[styles.statValue, { color: colors.darkBg }]}>198 kWh</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  profileCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    fontSize: 14,
    fontWeight: '600',
  },
  editButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    fontSize: 14,
    fontWeight: '600',
  },
  profileContent: {
    gap: 12,
  },
  profileField: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    width: 60,
  },
  fieldValue: {
    fontSize: 14,
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
    flex: 1,
  },
  statusCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.7,
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  billCard: {
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.9,
    marginBottom: 8,
  },
  amount: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  dueDateText: {
    fontSize: 12,
  },
  detailsCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 12,
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statBox: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
