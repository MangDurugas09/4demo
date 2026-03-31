import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
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
  local: 'http://10.0.78.46:5000',
  tunnel: 'https://4b94-180-190-124-182.ngrok-free.app',
};

const API_CANDIDATES = [
  API_CONFIG.tunnel,
  process.env.EXPO_PUBLIC_API_URL,
  API_CONFIG.local,
  'http://127.0.0.1:5000',
  'http://localhost:5000',
  'http://10.0.2.2:5000',
]
  .map((url) => (typeof url === 'string' ? url.trim().replace(/\/+$/, '') : ''))
  .filter(Boolean)
  .filter((url, index, arr) => arr.indexOf(url) === index);

const NGROK_HEADERS = {
  'ngrok-skip-browser-warning': 'true',
};

const THEMES = {
  dark: {
    mode: 'dark',
    background: '#081121',
    surface: '#111d33',
    surfaceAlt: '#182848',
    primary: '#182848',
    accent: '#fbbf24',
    darkBlue: '#1f3258',
    white: '#f8fafc',
    darkBg: '#f8fafc',
    text: '#f8fafc',
    mutedText: '#9fb0cd',
    border: 'rgba(148, 163, 184, 0.2)',
    overlay: 'rgba(2, 6, 23, 0.72)',
    success: '#16a34a',
    danger: '#ef4444',
    inputBg: '#0a1427',
    tabBarBg: '#0b162b',
    shadow: '#000000',
  },
  light: {
    mode: 'light',
    background: '#eef4ff',
    surface: '#ffffff',
    surfaceAlt: '#e3edff',
    primary: '#e3edff',
    accent: '#ea580c',
    darkBlue: '#2a5fbf',
    white: '#ffffff',
    darkBg: '#0f172a',
    text: '#0f172a',
    mutedText: '#475569',
    border: 'rgba(15, 23, 42, 0.12)',
    overlay: 'rgba(15, 23, 42, 0.38)',
    success: '#15803d',
    danger: '#dc2626',
    inputBg: '#f8fafc',
    tabBarBg: '#ffffff',
    shadow: '#1e293b',
  },
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
  const [apiUrl, setApiUrl] = useState('');
  const [isResolvingApi, setIsResolvingApi] = useState(true);
  const [themeMode, setThemeMode] = useState('dark');
  const tabIndicatorAnim = useRef(new Animated.Value(0)).current;
  const pagerRef = useRef(null);
  const colors = THEMES[themeMode];

  const tabs = ['company', 'payment', 'usage', 'profile'];
  const screenWidth = Dimensions.get('window').width;
  const tabWidth = screenWidth / tabs.length;

  const resetAuthFields = () => {
    setUsername('');
    setPassword('');
    setSignupForm(emptySignupForm);
    setForgotForm(emptyForgotForm);
  };

  const fetchWithTimeout = async (url, options = {}, timeoutMs = 5000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, {
        ...options,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const resolveApiUrl = async () => {
    setIsResolvingApi(true);

    for (const candidate of API_CANDIDATES) {
      try {
        const healthResponse = await fetchWithTimeout(
          `${candidate}/health`,
          { headers: NGROK_HEADERS },
          4500
        );

        if (!healthResponse.ok) {
          continue;
        }

        const parsed = await parseApiResponse(healthResponse);
        if (parsed?.ok) {
          setApiUrl(candidate);
          setIsResolvingApi(false);
          return candidate;
        }
      } catch (error) {
        continue;
      }
    }

    setApiUrl('');
    setIsResolvingApi(false);
    return '';
  };

  useEffect(() => {
    let isMounted = true;

    const probeApi = async () => {
      const resolvedUrl = await resolveApiUrl();
      if (!isMounted) {
        return;
      }

      if (resolvedUrl) {
        return;
      }
    };

    probeApi();
    const intervalId = setInterval(probeApi, 8000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const parseApiResponse = async (response) => {
    const rawText = await response.text();

    if (!rawText) {
      return {};
    }

    try {
      return JSON.parse(rawText);
    } catch (error) {
      if (rawText.startsWith('Tunnel') || rawText.includes('ngrok')) {
        throw new Error('The ngrok tunnel is inactive or showing a tunnel warning page. Start a fresh tunnel and update EXPO_PUBLIC_API_URL (or API_CONFIG.tunnel) in App.js.');
      }

      if (rawText.startsWith('<!DOCTYPE') || rawText.startsWith('<html')) {
        throw new Error('The server returned an HTML page instead of API JSON. Check the backend API base URL in App.js.');
      }

      throw new Error(`Unexpected server response: ${rawText.slice(0, 120)}`);
    }
  };

  const switchAuthMode = (mode) => {
    setAuthMode(mode);
    resetAuthFields();
  };

  const handleLogin = async () => {
    const resolvedApiUrl = apiUrl || await resolveApiUrl();

    if (!resolvedApiUrl) {
      Alert.alert('Error', 'API server is not reachable yet. Start your backend server and ngrok, then reload the app.');
      return;
    }

    try {
      const res = await fetch(`${resolvedApiUrl}/login`, {
        method: 'POST',
        headers: { ...NGROK_HEADERS, 'Content-Type': 'application/json' },
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
    const resolvedApiUrl = apiUrl || await resolveApiUrl();

    if (!resolvedApiUrl) {
      Alert.alert('Error', 'API server is not reachable yet. Start your backend server and ngrok, then reload the app.');
      return;
    }

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
      const res = await fetch(`${resolvedApiUrl}/signup`, {
        method: 'POST',
        headers: { ...NGROK_HEADERS, 'Content-Type': 'application/json' },
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
    const resolvedApiUrl = apiUrl || await resolveApiUrl();

    if (!resolvedApiUrl) {
      Alert.alert('Error', 'API server is not reachable yet. Start your backend server and ngrok, then reload the app.');
      return;
    }

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
      const res = await fetch(`${resolvedApiUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: { ...NGROK_HEADERS, 'Content-Type': 'application/json' },
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
  const toggleTheme = () => {
    setThemeMode((mode) => (mode === 'dark' ? 'light' : 'dark'));
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
    const themedInputStyle = [
      styles.inputModern,
      { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border },
    ];

    if (authMode === 'signup') {
      return (
        <>
          <TextInput style={themedInputStyle} placeholder="Full Name" value={signupForm.name} onChangeText={(text) => setSignupForm({ ...signupForm, name: text })} placeholderTextColor={colors.mutedText} />
          <TextInput style={themedInputStyle} placeholder="Email" value={signupForm.email} onChangeText={(text) => setSignupForm({ ...signupForm, email: text })} placeholderTextColor={colors.mutedText} autoCapitalize="none" />
          <TextInput style={themedInputStyle} placeholder="Contact Number" value={signupForm.contact} onChangeText={(text) => setSignupForm({ ...signupForm, contact: text })} placeholderTextColor={colors.mutedText} keyboardType="phone-pad" />
          <TextInput style={themedInputStyle} placeholder="Address" value={signupForm.address} onChangeText={(text) => setSignupForm({ ...signupForm, address: text })} placeholderTextColor={colors.mutedText} />
          <TextInput style={themedInputStyle} placeholder="Username" value={signupForm.username} onChangeText={(text) => setSignupForm({ ...signupForm, username: text })} placeholderTextColor={colors.mutedText} autoCapitalize="none" />
          <TextInput style={themedInputStyle} placeholder="Password" secureTextEntry value={signupForm.password} onChangeText={(text) => setSignupForm({ ...signupForm, password: text })} placeholderTextColor={colors.mutedText} />
          <TextInput style={themedInputStyle} placeholder="Confirm Password" secureTextEntry value={signupForm.confirmPassword} onChangeText={(text) => setSignupForm({ ...signupForm, confirmPassword: text })} placeholderTextColor={colors.mutedText} />
          <TouchableOpacity style={[styles.loginButton, { backgroundColor: colors.accent }]} onPress={handleSignup}>
            <Text style={[styles.loginButtonText, { color: colors.mode === 'dark' ? '#0b1020' : '#ffffff' }]}>Create Account</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => switchAuthMode('login')}>
            <Text style={[styles.authLink, { color: colors.darkBlue }]}>Back to Login</Text>
          </TouchableOpacity>
        </>
      );
    }

    if (authMode === 'forgot') {
      return (
        <>
          <TextInput style={themedInputStyle} placeholder="Username" value={forgotForm.username} onChangeText={(text) => setForgotForm({ ...forgotForm, username: text })} placeholderTextColor={colors.mutedText} autoCapitalize="none" />
          <TextInput style={themedInputStyle} placeholder="Email" value={forgotForm.email} onChangeText={(text) => setForgotForm({ ...forgotForm, email: text })} placeholderTextColor={colors.mutedText} autoCapitalize="none" />
          <TextInput style={themedInputStyle} placeholder="Contact Number" value={forgotForm.contact} onChangeText={(text) => setForgotForm({ ...forgotForm, contact: text })} placeholderTextColor={colors.mutedText} keyboardType="phone-pad" />
          <TextInput style={themedInputStyle} placeholder="New Password" secureTextEntry value={forgotForm.newPassword} onChangeText={(text) => setForgotForm({ ...forgotForm, newPassword: text })} placeholderTextColor={colors.mutedText} />
          <TextInput style={themedInputStyle} placeholder="Confirm New Password" secureTextEntry value={forgotForm.confirmNewPassword} onChangeText={(text) => setForgotForm({ ...forgotForm, confirmNewPassword: text })} placeholderTextColor={colors.mutedText} />
          <TouchableOpacity style={[styles.loginButton, { backgroundColor: colors.accent }]} onPress={handleForgotPassword}>
            <Text style={[styles.loginButtonText, { color: colors.mode === 'dark' ? '#0b1020' : '#ffffff' }]}>Reset Password</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => switchAuthMode('login')}>
            <Text style={[styles.authLink, { color: colors.darkBlue }]}>Back to Login</Text>
          </TouchableOpacity>
        </>
      );
    }

    return (
      <>
        <TextInput style={themedInputStyle} placeholder="Username" value={username} onChangeText={setUsername} placeholderTextColor={colors.mutedText} autoCapitalize="none" />
        <TextInput style={themedInputStyle} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} placeholderTextColor={colors.mutedText} />
        <TouchableOpacity style={[styles.loginButton, { backgroundColor: colors.accent }]} onPress={handleLogin}>
          <Text style={[styles.loginButtonText, { color: colors.mode === 'dark' ? '#0b1020' : '#ffffff' }]}>
            {isResolvingApi ? 'Connecting...' : 'Login'}
          </Text>
        </TouchableOpacity>
        {!apiUrl && (
          <Text style={[styles.connectionText, { color: colors.mutedText }]}>
            {isResolvingApi ? 'Checking server connection...' : 'Server not connected yet. Tap Login to retry.'}
          </Text>
        )}
        <TouchableOpacity onPress={() => switchAuthMode('forgot')}>
          <Text style={[styles.authLink, { color: colors.darkBlue }]}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => switchAuthMode('signup')}>
          <Text style={[styles.authLink, { color: colors.darkBlue }]}>Create a New Account</Text>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colors.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <Modal visible={showLoginModal && !isLoggedIn} transparent animationType="fade">
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Electripay</Text>
            {renderAuthContent()}
          </View>
        </View>
      </Modal>

      <View style={styles.mainContent}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={styles.headerBrand}>
            <Image
              source={require('./assets/Electripay-final-logo.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View>
              <Text style={[styles.headerTitle, { color: colors.text }]}>
              ELECTRIPAY
              </Text>
              <Text style={[styles.headerSubtitle, { color: colors.mutedText }]}>
                Smart electric billing
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.themeButton, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
          >
            <Text style={[styles.themeButtonText, { color: colors.text }]}>
              {themeMode === 'dark' ? 'Light' : 'Dark'}
            </Text>
          </TouchableOpacity>
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
                  colors={colors}
                  apiBaseUrl={apiUrl}
                  isActive={activeTab === 'company'}
                />
              </View>
            </View>
            <View style={[styles.page, { width: screenWidth }]}>
              <View style={styles.content}>
                <PaymentSection
                  colors={colors}
                  apiBaseUrl={apiUrl}
                  user={currentUser}
                  isActive={activeTab === 'payment'}
                />
              </View>
            </View>
            <View style={[styles.page, { width: screenWidth }]}>
              <View style={styles.content}>
                <UsageSection
                  colors={colors}
                  apiBaseUrl={apiUrl}
                  user={currentUser}
                  isActive={activeTab === 'usage'}
                />
              </View>
            </View>
            <View style={[styles.page, { width: screenWidth }]}>
              <View style={styles.content}>
                <Dashboard
                  colors={colors}
                  apiBaseUrl={apiUrl}
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

      <View style={[styles.tabBar, { backgroundColor: colors.tabBarBg, borderTopColor: colors.border }]}>
        <Animated.View
          style={[
            styles.tabIndicator,
            {
              backgroundColor: colors.accent,
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
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab ? colors.text : colors.mutedText },
              ]}
            >
              {tab.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mainContent: { flex: 1 },
  pagerContainer: { flex: 1 },
  pager: { flex: 1 },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingTop: 44,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  headerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  headerLogo: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 30,
    fontFamily: 'ElectroFont1',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: -2,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  themeButton: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  themeButtonText: {
    fontSize: 12,
    fontWeight: '700',
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
    height: 84,
    bottom: 0,
    borderTopWidth: 1,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.7,
    marginBottom: 35,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 40,
    height: 4,
    width: '25%',
    borderRadius: 999,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '88%',
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'ElectroFont1',
  },
  inputModern: {
    marginBottom: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
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
  connectionText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 12,
  },
});
