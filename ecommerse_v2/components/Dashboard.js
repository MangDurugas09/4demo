import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Animated,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function Dashboard({ colors, apiBaseUrl, user, isActive, onScroll, onLogout, onUserRefresh }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    address: '',
    contact: '',
    avatar: 'https://www.pngmart.com/files/23/Profile-PNG-Photo.png',
  });

  const mapUserToProfile = (userData) => ({
    name: userData.name || userData.username || '',
    email: userData.email || '',
    address: userData.address || userData.Address || '',
    contact: userData.contact || userData.contactNumber || '',
    avatar:
      userData.avatar ||
      userData.profilePic ||
      'https://www.pngmart.com/files/23/Profile-PNG-Photo.png',
  });

  const isInvalidApiPayload = (payload) =>
    typeof payload === 'string' &&
    (payload.startsWith('Tunnel') || payload.includes('ngrok') || payload.startsWith('<!DOCTYPE') || payload.startsWith('<html'));

  const apiHeaders = { headers: { 'ngrok-skip-browser-warning': 'true' } };

  useEffect(() => {
    if (!apiBaseUrl || !user?._id) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/users/${user._id}`, apiHeaders);
        if (isInvalidApiPayload(response.data)) {
          throw new Error('Tunnel is inactive or API URL is stale. Start a fresh tunnel and reload the app.');
        }
        setProfile(mapUserToProfile(response.data));
      } catch (error) {
        console.error('Error fetching profile:', error);
        Alert.alert('Error', error?.message || 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [apiBaseUrl, user?._id]);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission required', 'Allow access to gallery');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
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
    if (!apiBaseUrl || !user?._id) {
      Alert.alert('Error', 'No user is logged in');
      return;
    }

    try {
      await axios.put(`${apiBaseUrl}/users/${user._id}`, profile, apiHeaders);
      onUserRefresh?.(profile);
      setIsEditing(false);
      Alert.alert('Saved', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  const handleChangePassword = async () => {
    if (!apiBaseUrl || !user?._id) {
      Alert.alert('Error', 'No user is logged in');
      return;
    }

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      Alert.alert('Error', 'Please complete the password form');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Alert.alert('Error', 'New password confirmation does not match');
      return;
    }

    try {
      const response = await axios.post(`${apiBaseUrl}/users/${user._id}/change-password`, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }, apiHeaders);
      Alert.alert('Success', response.data.message);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordForm(false);
    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to change password');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: colors.darkBg }}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <Animated.ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      bounces={false}
      alwaysBounceVertical={false}
      overScrollMode="never"
      onScroll={onScroll}
      scrollEventThrottle={16}
    >
      <View style={[styles.mainContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.sectionBlock}>
          <View style={styles.profileHeader}>
            <Text style={[styles.profileTitle, { color: colors.text }]}>Profile</Text>

            {!isEditing ? (
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <Text style={[styles.editButton, { color: colors.accent }]}>Edit</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.editButtons}>
                <TouchableOpacity onPress={() => setIsEditing(false)}>
                <Text style={[styles.cancelButton, { color: colors.mutedText }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSave}>
                  <Text style={[styles.saveButton, { color: colors.accent }]}>Save</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={isEditing ? pickImage : null}>
              <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            </TouchableOpacity>
            {isEditing && (
              <Text style={{ fontSize: 12, color: colors.mutedText, marginTop: 6 }}>
                Tap image to change
              </Text>
            )}
          </View>

          <View style={styles.profileField}>
            <Text style={[styles.fieldLabel, { color: colors.mutedText }]}>Name:</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
                value={profile.name}
                placeholderTextColor={colors.mutedText}
                onChangeText={(text) => setProfile({ ...profile, name: text })}
              />
            ) : (
              <Text style={[styles.fieldValue, { color: colors.text }]}>{profile.name}</Text>
            )}
          </View>

          <View style={styles.profileField}>
            <Text style={[styles.fieldLabel, { color: colors.mutedText }]}>Email:</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
                value={profile.email}
                placeholderTextColor={colors.mutedText}
                onChangeText={(text) => setProfile({ ...profile, email: text })}
              />
            ) : (
              <Text style={[styles.fieldValue, { color: colors.text }]}>{profile.email}</Text>
            )}
          </View>

          <View style={styles.profileField}>
            <Text style={[styles.fieldLabel, { color: colors.mutedText }]}>Address:</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
                value={profile.address}
                placeholderTextColor={colors.mutedText}
                onChangeText={(text) => setProfile({ ...profile, address: text })}
              />
            ) : (
              <Text style={[styles.fieldValue, { color: colors.text }]}>{profile.address}</Text>
            )}
          </View>

          <View style={styles.profileField}>
            <Text style={[styles.fieldLabel, { color: colors.mutedText }]}>Contact:</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
                value={profile.contact}
                placeholderTextColor={colors.mutedText}
                onChangeText={(text) => setProfile({ ...profile, contact: text })}
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={[styles.fieldValue, { color: colors.text }]}>{profile.contact}</Text>
            )}
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.sectionBlock}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account Session</Text>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.darkBlue }]} onPress={onLogout}>
            <Text style={{ color: colors.white, fontWeight: 'bold' }}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.sectionBlock}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Change Password</Text>
          <TouchableOpacity onPress={() => setShowPasswordForm((value) => !value)}>
            <Text style={[styles.linkText, { color: colors.accent }]}>
              {showPasswordForm ? 'Hide Password Form' : 'Open Password Form'}
            </Text>
          </TouchableOpacity>

          {showPasswordForm && (
            <View style={styles.passwordForm}>
              <TextInput
                style={[styles.passwordInput, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
                placeholder="Current Password"
                placeholderTextColor={colors.mutedText}
                secureTextEntry
                value={passwordForm.currentPassword}
                onChangeText={(text) => setPasswordForm({ ...passwordForm, currentPassword: text })}
              />
              <TextInput
                style={[styles.passwordInput, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
                placeholder="New Password"
                placeholderTextColor={colors.mutedText}
                secureTextEntry
                value={passwordForm.newPassword}
                onChangeText={(text) => setPasswordForm({ ...passwordForm, newPassword: text })}
              />
              <TextInput
                style={[styles.passwordInput, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
                placeholder="Confirm New Password"
                placeholderTextColor={colors.mutedText}
                secureTextEntry
                value={passwordForm.confirmPassword}
                onChangeText={(text) => setPasswordForm({ ...passwordForm, confirmPassword: text })}
              />
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.accent }]} onPress={handleChangePassword}>
                <Text style={{ color: colors.darkBg, fontWeight: 'bold' }}>Update Password</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 20 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginBottom: 20,
  },
  sectionBlock: {
    width: '100%',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  profileTitle: { fontSize: 20, fontWeight: '800' },
  editButtons: { flexDirection: 'row' },
  avatarContainer: { alignItems: 'center', marginBottom: 12 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  profileField: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  fieldLabel: { width: 70, fontWeight: '600' },
  fieldValue: { flex: 1 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(11, 30, 46, 0.15)',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  actionButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  linkText: {
    fontWeight: '700',
  },
  passwordForm: {
    marginTop: 12,
  },
  passwordInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
});
