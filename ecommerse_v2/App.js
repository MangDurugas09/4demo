import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Modal,
  TextInput,
  Animated,
  Dimensions,
  Alert,
  Image,
} from 'react-native';

import Dashboard from './components/Dashboard';
import UsageSection from './components/UsageSection';
import PaymentSection from './components/PaymentSection';
import CompanyInfo from './components/CompanyInfo';
import { useFonts } from 'expo-font';

const API_CONFIG = {
  local: 'http://10.0.67.191:5000',
  tunnel: 'https://5731-180-190-124-182.ngrok-free.app',
};

const USE_TUNNEL = true;
const API_URL = USE_TUNNEL ? API_CONFIG.tunnel : API_CONFIG.local;

const COLORS = {
  primary: '#ADD8E6',
  accent: '#FFD700',
  darkBlue: '#87CEEB',
  white: '#FFFFFF',
  darkBg: '#0B1E2E',
};

const emptySignupForm = {
  name: '',
  email: '',
  contact: '',
  address: '',
  username: '',
  password: '',
  confirmPassword: '',
};

const emptyForgotForm = {
  username: '',
  email: '',
  contact: '',
  newPassword: '',
  confirmNewPassword: '',
};

export default function App() {
  const [fontsLoaded] = useFonts({
    ElectroFont1: require('./assets/fonts/Electric-Formula.ttf'),
    ElectroFont2: require('./assets/fonts/Roboc.otf'),
  });
  const [activeTab, setActiveTab] = useState('company');
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [authMode, setAuthMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signupForm, setSignupForm] = useState(emptySignupForm);
  const [forgotForm, setForgotForm] = useState(emptyForgotForm);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const tabIndicatorAnim = useRef(new Animated.Value(0)).current;
  const pagerRef = useRef(null);

  if (!fontsLoaded) {
    return null;
  }

  const tabs = ['company', 'payment', 'usage', 'profile'];
  const screenWidth = Dimensions.get('window').width;
  const tabWidth = screenWidth / tabs.length;

  const resetAuthFields = () => {
    setUsername('');
    setPassword('');
    setSignupForm(emptySignupForm);
    setForgotForm(emptyForgotForm);
  };

  const parseApiResponse = async (response) => {
    const rawText = await response.text();

    if (!rawText) {
      return {};
    }

    try {
      return JSON.parse(rawText);
    } catch (error) {
      if (rawText.startsWith('Tunnel') || rawText.includes('ngrok')) {
        throw new Error('The ngrok tunnel is inactive or showing a tunnel warning page. Start a fresh tunnel and update API_CONFIG.tunnel in App.js.');
      }

      if (rawText.startsWith('<!DOCTYPE') || rawText.startsWith('<html')) {
        throw new Error('The server returned an HTML page instead of API JSON. Check the backend tunnel URL in App.js.');
      }

      throw new Error(`Unexpected server response: ${rawText.slice(0, 120)}`);
    }
  };

  const switchAuthMode = (mode) => {
    setAuthMode(mode);
    resetAuthFields();
  };

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await parseApiResponse(res);

      if (res.ok) {
        setCurrentUser(data.user);
        setIsLoggedIn(true);
        setShowLoginModal(false);
        switchAuthMode('login');
        Alert.alert('Success', 'Login successful!');
      } else {
        Alert.alert('Error', data.message || 'Login failed');
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Server not reachable');
      console.log(err);
    }
  };

  const handleSignup = async () => {
    if (
      !signupForm.name ||
      !signupForm.email ||
      !signupForm.contact ||
      !signupForm.address ||
      !signupForm.username ||
      !signupForm.password
    ) {
      Alert.alert('Error', 'Please complete all sign up fields');
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      Alert.alert('Error', 'Password confirmation does not match');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupForm.name,
          email: signupForm.email,
          contact: signupForm.contact,
          address: signupForm.address,
          username: signupForm.username,
          password: signupForm.password,
        }),
      });

      const data = await parseApiResponse(res);

      if (res.ok) {
        setCurrentUser(data.user);
        setIsLoggedIn(true);
        setShowLoginModal(false);
        switchAuthMode('login');
        Alert.alert('Success', 'Account created successfully!');
      } else {
        Alert.alert('Error', data.message || 'Sign up failed');
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to create account');
      console.log(err);
    }
  };

  const handleForgotPassword = async () => {
    if (
      !forgotForm.username ||
      !forgotForm.email ||
      !forgotForm.contact ||
      !forgotForm.newPassword
    ) {
      Alert.alert('Error', 'Please complete all recovery fields');
      return;
    }

    if (forgotForm.newPassword !== forgotForm.confirmNewPassword) {
      Alert.alert('Error', 'New password confirmation does not match');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: forgotForm.username,
          email: forgotForm.email,
          contact: forgotForm.contact,
          newPassword: forgotForm.newPassword,
        }),
      });

      const data = await parseApiResponse(res);

      if (res.ok) {
        Alert.alert('Success', 'Password reset successful. You can now log in.');
        switchAuthMode('login');
      } else {
        Alert.alert('Error', data.message || 'Password reset failed');
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to reset password');
      console.log(err);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setShowLoginModal(true);
    setActiveTab('company');
    switchAuthMode('login');
  };

  const handleUserRefresh = (updatedUser) => {
    setCurrentUser((current) => ({
      ...current,
      ...updatedUser,
    }));
  };

  const handleTabPress = (tab) => {
    const index = tabs.indexOf(tab);

    Animated.spring(tabIndicatorAnim, {
      toValue: index,
      useNativeDriver: false,
    }).start();

    setActiveTab(tab);
    pagerRef.current?.scrollTo({ x: index * screenWidth, animated: true });
  };

  const handleSwipeEnd = (event) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    const nextTab = tabs[nextIndex] || 'company';

    Animated.spring(tabIndicatorAnim, {
      toValue: nextIndex,
      useNativeDriver: false,
    }).start();

    setActiveTab(nextTab);
  };

  const renderAuthContent = () => {
    if (authMode === 'signup') {
      return (
        <>
          <TextInput style={styles.inputModern} placeholder="Full Name" value={signupForm.name} onChangeText={(text) => setSignupForm({ ...signupForm, name: text })} placeholderTextColor="#aaa" />
          <TextInput style={styles.inputModern} placeholder="Email" value={signupForm.email} onChangeText={(text) => setSignupForm({ ...signupForm, email: text })} placeholderTextColor="#aaa" autoCapitalize="none" />
          <TextInput style={styles.inputModern} placeholder="Contact Number" value={signupForm.contact} onChangeText={(text) => setSignupForm({ ...signupForm, contact: text })} placeholderTextColor="#aaa" keyboardType="phone-pad" />
          <TextInput style={styles.inputModern} placeholder="Address" value={signupForm.address} onChangeText={(text) => setSignupForm({ ...signupForm, address: text })} placeholderTextColor="#aaa" />
          <TextInput style={styles.inputModern} placeholder="Username" value={signupForm.username} onChangeText={(text) => setSignupForm({ ...signupForm, username: text })} placeholderTextColor="#aaa" autoCapitalize="none" />
          <TextInput style={styles.inputModern} placeholder="Password" secureTextEntry value={signupForm.password} onChangeText={(text) => setSignupForm({ ...signupForm, password: text })} placeholderTextColor="#aaa" />
          <TextInput style={styles.inputModern} placeholder="Confirm Password" secureTextEntry value={signupForm.confirmPassword} onChangeText={(text) => setSignupForm({ ...signupForm, confirmPassword: text })} placeholderTextColor="#aaa" />
          <TouchableOpacity style={styles.loginButton} onPress={handleSignup}>
            <Text style={styles.loginButtonText}>Create Account</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => switchAuthMode('login')}>
            <Text style={styles.authLink}>Back to Login</Text>
          </TouchableOpacity>
        </>
      );
    }

    if (authMode === 'forgot') {
      return (
        <>
          <TextInput style={styles.inputModern} placeholder="Username" value={forgotForm.username} onChangeText={(text) => setForgotForm({ ...forgotForm, username: text })} placeholderTextColor="#aaa" autoCapitalize="none" />
          <TextInput style={styles.inputModern} placeholder="Email" value={forgotForm.email} onChangeText={(text) => setForgotForm({ ...forgotForm, email: text })} placeholderTextColor="#aaa" autoCapitalize="none" />
          <TextInput style={styles.inputModern} placeholder="Contact Number" value={forgotForm.contact} onChangeText={(text) => setForgotForm({ ...forgotForm, contact: text })} placeholderTextColor="#aaa" keyboardType="phone-pad" />
          <TextInput style={styles.inputModern} placeholder="New Password" secureTextEntry value={forgotForm.newPassword} onChangeText={(text) => setForgotForm({ ...forgotForm, newPassword: text })} placeholderTextColor="#aaa" />
          <TextInput style={styles.inputModern} placeholder="Confirm New Password" secureTextEntry value={forgotForm.confirmNewPassword} onChangeText={(text) => setForgotForm({ ...forgotForm, confirmNewPassword: text })} placeholderTextColor="#aaa" />
          <TouchableOpacity style={styles.loginButton} onPress={handleForgotPassword}>
            <Text style={styles.loginButtonText}>Reset Password</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => switchAuthMode('login')}>
            <Text style={styles.authLink}>Back to Login</Text>
          </TouchableOpacity>
        </>
      );
    }

    return (
      <>
        <TextInput style={styles.inputModern} placeholder="Username" value={username} onChangeText={setUsername} placeholderTextColor="#aaa" autoCapitalize="none" />
        <TextInput style={styles.inputModern} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} placeholderTextColor="#aaa" />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => switchAuthMode('forgot')}>
          <Text style={styles.authLink}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => switchAuthMode('signup')}>
          <Text style={styles.authLink}>Create a New Account</Text>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Modal visible={showLoginModal && !isLoggedIn} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Electripay</Text>
            {renderAuthContent()}
          </View>
        </View>
      </Modal>

      <View style={styles.mainContent}>
        <View style={styles.header}>
          <View style={styles.headerBrand}>
            <Image
              source={require('./assets/Electripay-final-logo.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <Text style={styles.headerTitle}>
              ELECTRIPAY
            </Text>
          </View>
        </View>
        <View style={styles.pagerContainer}>
          <ScrollView
            ref={pagerRef}
            style={styles.pager}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleSwipeEnd}
            contentOffset={{ x: tabs.indexOf(activeTab) * screenWidth, y: 0 }}
            bounces={false}
            overScrollMode="never"
          >
            <View style={[styles.page, { width: screenWidth }]}>
              <View style={styles.content}>
                <CompanyInfo
                  colors={COLORS}
                  apiBaseUrl={API_URL}
                  isActive={activeTab === 'company'}
                />
              </View>
            </View>
            <View style={[styles.page, { width: screenWidth }]}>
              <View style={styles.content}>
                <PaymentSection
                  colors={COLORS}
                  apiBaseUrl={API_URL}
                  user={currentUser}
                  isActive={activeTab === 'payment'}
                />
              </View>
            </View>
            <View style={[styles.page, { width: screenWidth }]}>
              <View style={styles.content}>
                <UsageSection
                  colors={COLORS}
                  apiBaseUrl={API_URL}
                  user={currentUser}
                  isActive={activeTab === 'usage'}
                />
              </View>
            </View>
            <View style={[styles.page, { width: screenWidth }]}>
              <View style={styles.content}>
                <Dashboard
                  colors={COLORS}
                  apiBaseUrl={API_URL}
                  user={currentUser}
                  isActive={activeTab === 'profile'}
                  onLogout={handleLogout}
                  onUserRefresh={handleUserRefresh}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </View>

      <View style={styles.tabBar}>
        <Animated.View
          style={[
            styles.tabIndicator,
            {
              transform: [{
                translateX: tabIndicatorAnim.interpolate({
                  inputRange: tabs.map((_, i) => i),
                  outputRange: tabs.map((_, i) => i * tabWidth),
                }),
              }],
            },
          ]}
        />

        {tabs.map((tab) => (
          <TouchableOpacity key={tab} style={styles.tabButton} onPress={() => handleTabPress(tab)}>
            <Text style={styles.tabText}>{tab.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1E2E' },
  mainContent: { flex: 1 },
  pagerContainer: { flex: 1 },
  pager: { flex: 1 },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    paddingBottom: 12,
  },
  headerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogo: {
    width: 80,
    height: 80,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 55,
    color: '#d4b60b',
    fontFamily: 'ElectroFont1',
  },
  content: {
    padding: 16,
    width: '100%',
    flex: 1,
  },
  page: {
    flex: 1,
    height: '100%',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#111',
    height: 100,
    bottom: 0,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 45,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 45,
    height: 3,
    width: '25%',
    backgroundColor: '#FFD700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '88%',
    backgroundColor: '#1A2F3F',
    padding: 20,
    borderRadius: 15,
  },
  modalTitle: {
    fontSize: 24,
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputModern: {
    backgroundColor: '#2A3F50',
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    color: '#fff',
  },
  loginButton: {
    backgroundColor: '#FFD700',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  loginButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000',
  },
  authLink: {
    textAlign: 'center',
    color: '#ADD8E6',
    marginTop: 12,
    fontWeight: '600',
  },
});
