import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function Dashboard({ colors }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    address: '',
    contact: '',
    avatar: 'https://www.pngmart.com/files/23/Profile-PNG-Photo.png',
  });

  // Fetch profile data from MongoDB
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Assuming user ID is hardcoded for demo; in real app, get from auth
        const userId = '69c9f585c466a662470a6543'; // Example ObjectId
        const response = await axios.get(`http://10.174.223.169:5000/users/${userId}`);
        const userData = response.data;
        setProfile({
          name: userData.name || '',
          email: userData.email || '',
          address: userData.address || '',
          contact: userData.contact || '',
          avatar: userData.avatar || 'https://www.pngmart.com/files/23/Profile-PNG-Photo.png',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        Alert.alert('Error', 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const billAmount = 2450;
  const dueDate = 'March 7, 2026';
  const accountNumber = 'ACC-2024-987654';
  const status = 'Active';

  // 📸 Pick image from gallery
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission required', 'Allow access to gallery');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfile({
        ...profile,
        avatar: result.assets[0].uri,
      });
    }
  };

  const handleSave = async () => {
    try {
      const userId = '69c9f585c466a662470a6543'; // Example ObjectId
      await axios.put(`http://10.174.223.169:5000/users/${userId}`, profile);
      setIsEditing(false);
      Alert.alert('Saved', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={{ color: colors.darkBg }}>Loading profile...</Text>
        </View>
      ) : (
        <>
          {/* PROFILE CARD */}
          <View style={[styles.profileCard, { backgroundColor: colors.primary }]}>
            <View style={styles.profileHeader}>
              <Text style={[styles.profileTitle, { color: colors.darkBg }]}>
                Profile
              </Text>

              {!isEditing ? (
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <Text style={[styles.editButton, { color: colors.accent }]}>
                    Edit
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.editButtons}>
                  <TouchableOpacity onPress={handleCancel}>
                    <Text style={[styles.cancelButton, { color: colors.darkBg }]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleSave}>
                    <Text style={[styles.saveButton, { color: colors.accent }]}>
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* AVATAR */}
            <View style={styles.avatarContainer}>
              <TouchableOpacity onPress={isEditing ? pickImage : null}>
                <Image source={{ uri: profile.avatar }} style={styles.avatar} />
              </TouchableOpacity>

              {isEditing && (
                <Text style={{ fontSize: 12, color: colors.darkBg, marginTop: 6 }}>
                  Tap image to change
                </Text>
              )}
            </View>

            {/* PROFILE FIELDS */}
            <View style={styles.profileContent}>
              {/* NAME */}
              <View style={styles.profileField}>
                <Text style={[styles.fieldLabel, { color: colors.darkBg }]}>
                  Name:
                </Text>
                {isEditing ? (
                  <TextInput
                    style={[styles.input, { borderColor: colors.primary }]}
                    value={profile.name}
                    onChangeText={(text) =>
                      setProfile({ ...profile, name: text })
                    }
                  />
                ) : (
                  <Text style={[styles.fieldValue, { color: colors.darkBg }]}>
                    {profile.name}
                  </Text>
                )}
              </View>

              {/* EMAIL */}
              <View style={styles.profileField}>
                <Text style={[styles.fieldLabel, { color: colors.darkBg }]}>
                  Email:
                </Text>
                {isEditing ? (
                  <TextInput
                    style={[styles.input, { borderColor: colors.primary }]}
                    value={profile.email}
                    onChangeText={(text) =>
                      setProfile({ ...profile, email: text })
                    }
                  />
                ) : (
                  <Text style={[styles.fieldValue, { color: colors.darkBg }]}>
                    {profile.email}
                  </Text>
                )}
              </View>

              {/* ADDRESS */}
              <View style={styles.profileField}>
                <Text style={[styles.fieldLabel, { color: colors.darkBg }]}>
                  Address:
                </Text>
                {isEditing ? (
                  <TextInput
                    style={[styles.input, { borderColor: colors.primary }]}
                    value={profile.address}
                    onChangeText={(text) =>
                      setProfile({ ...profile, address: text })
                    }
                  />
                ) : (
                  <Text style={[styles.fieldValue, { color: colors.darkBg }]}>
                    {profile.address}
                  </Text>
                )}
              </View>

              {/* CONTACT */}
              <View style={styles.profileField}>
                <Text style={[styles.fieldLabel, { color: colors.darkBg }]}>
                  Contact:
                </Text>
                {isEditing ? (
                  <TextInput
                    style={[styles.input, { borderColor: colors.primary }]}
                    value={profile.contact}
                    onChangeText={(text) =>
                      setProfile({ ...profile, contact: text })
                    }
                    keyboardType="phone-pad"
                  />
                ) : (
                  <Text style={[styles.fieldValue, { color: colors.darkBg }]}>
                    {profile.contact}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* STATUS */}
          <View style={[styles.statusCard, { backgroundColor: colors.primary }]}>
            <Text style={[styles.statusLabel, { color: colors.darkBg }]}>
              Account Status
            </Text>
            <Text style={[styles.statusValue, { color: colors.accent }]}>
              {status}
            </Text>
          </View>

          {/* BILL */}
          <View style={[styles.billCard, { backgroundColor: colors.darkBlue }]}>
            <Text style={[styles.label, { color: colors.white }]}>
              Current Bill
            </Text>
            <Text style={[styles.amount, { color: colors.accent }]}>
              ₱{billAmount}
            </Text>
            <Text style={[styles.dueDateText, { color: colors.white }]}>
              Due by: {dueDate}
            </Text>
          </View>

          {/* DETAILS */}
          <View style={[styles.detailsCard, { backgroundColor: colors.primary }]}>
            <Text style={{ color: colors.darkBg }}>
              Account #: {accountNumber}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 20 },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },

  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  profileTitle: { fontSize: 18, fontWeight: 'bold' },

  editButtons: { flexDirection: 'row', gap: 10 },

  avatarContainer: { alignItems: 'center', marginBottom: 12 },

  avatar: { width: 100, height: 100, borderRadius: 50 },

  profileContent: { gap: 10 },

  profileField: { flexDirection: 'row', alignItems: 'center' },

  fieldLabel: { width: 70, fontWeight: '600' },

  fieldValue: { flex: 1 },

  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 6,
    flex: 1,
  },

  statusCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },

  statusLabel: { fontSize: 12 },

  statusValue: { fontSize: 20, fontWeight: 'bold' },

  billCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },

  label: { fontSize: 14 },

  amount: { fontSize: 32, fontWeight: 'bold' },

  dueDateText: { fontSize: 12 },

  detailsCard: {
    padding: 16,
    borderRadius: 12,
  },
});