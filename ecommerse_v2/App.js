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
  Platform,
} from 'react-native';

import Dashboard from './components/Dashboard';
import UsageSection from './components/UsageSection';
import PaymentSection from './components/PaymentSection';
import CompanyInfo from './components/CompanyInfo';
import { useFonts } from 'expo-font';

const IS_WEB = Platform.OS === 'web';

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
  const [showLoginModal, setShowLoginModal] = useState(!IS_WEB);
  const [authMode, setAuthMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [signupForm, setSignupForm] = useState(emptySignupForm);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
  const [forgotForm, setForgotForm] = useState(emptyForgotForm);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showForgotConfirmPassword, setShowForgotConfirmPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [apiUrl, setApiUrl] = useState('');
  const [isResolvingApi, setIsResolvingApi] = useState(true);
  const [themeMode, setThemeMode] = useState('dark');
  const [webMenuOpen, setWebMenuOpen] = useState(false);
  const tabIndicatorAnim = useRef(new Animated.Value(0)).current;
  const modalTranslateY = useRef(new Animated.Value(70)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const webMenuTranslateX = useRef(new Animated.Value(24)).current;
  const webMenuOpacity = useRef(new Animated.Value(0)).current;
  const webContentTranslateY = useRef(new Animated.Value(18)).current;
  const webContentOpacity = useRef(new Animated.Value(0)).current;
  const pagerRef = useRef(null);
  const colors = THEMES[themeMode];
  const isWeb = IS_WEB;

  const tabs = ['company', 'payment', 'dashboard', 'profile'];
  const screenWidth = Dimensions.get('window').width;
  const tabWidth = screenWidth / tabs.length;
  const pageWidth = isWeb ? Math.min(screenWidth, 1240) : screenWidth;
  const webHighlights = [
    { value: 'Live Bills', label: 'Track balances and due dates in real time' },
    { value: 'QR Payments', label: 'Pay in seconds and keep proof in one place' },
    { value: 'Usage Trends', label: 'Spot patterns before the next billing cycle' },
  ];

  const resetAuthFields = () => {
    setUsername('');
    setPassword('');
    setShowPassword(false);
    setSignupForm(emptySignupForm);
    setShowSignupPassword(false);
    setShowSignupConfirmPassword(false);
    setForgotForm(emptyForgotForm);
    setShowForgotPassword(false);
    setShowForgotConfirmPassword(false);
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

  useEffect(() => {
    if (showLoginModal && !isLoggedIn) {
      modalTranslateY.setValue(70);
      modalOpacity.setValue(0);

      Animated.parallel([
        Animated.timing(modalTranslateY, {
          toValue: 0,
          duration: 420,
          useNativeDriver: true,
        }),
        Animated.timing(modalOpacity, {
          toValue: 1,
          duration: 360,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showLoginModal, isLoggedIn, modalOpacity, modalTranslateY]);

  useEffect(() => {
    if (!isWeb) {
      return;
    }

    if (webMenuOpen) {
      webMenuTranslateX.setValue(24);
      webMenuOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(webMenuTranslateX, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(webMenuOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    Animated.parallel([
      Animated.timing(webMenuTranslateX, {
        toValue: 24,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(webMenuOpacity, {
        toValue: 0,
        duration: 140,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isWeb, webMenuOpen, webMenuOpacity, webMenuTranslateX]);

  useEffect(() => {
    if (!isWeb || !isLoggedIn) {
      return;
    }

    webContentTranslateY.setValue(activeTab === 'profile' ? 24 : 14);
    webContentOpacity.setValue(0);

    Animated.parallel([
      Animated.timing(webContentTranslateY, {
        toValue: 0,
        duration: activeTab === 'profile' ? 340 : 220,
        useNativeDriver: true,
      }),
      Animated.timing(webContentOpacity, {
        toValue: 1,
        duration: activeTab === 'profile' ? 300 : 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeTab, isLoggedIn, isWeb, webContentOpacity, webContentTranslateY]);

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
        setWebMenuOpen(false);
        if (isWeb) setActiveTab('dashboard');
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
        setWebMenuOpen(false);
        if (isWeb) setActiveTab('dashboard');
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
    setShowLoginModal(!isWeb);
    setActiveTab('company');
    setWebMenuOpen(false);
    switchAuthMode('login');
  };
  const toggleTheme = () => {
    setThemeMode((mode) => (mode === 'dark' ? 'light' : 'dark'));
  };
  const openAuthModal = (mode) => {
    switchAuthMode(mode);
    setShowLoginModal(true);
  };
  const renderThemeSwitch = () => (
    <TouchableOpacity
      onPress={toggleTheme}
      style={[
        styles.webThemeSwitch,
        {
          backgroundColor: themeMode === 'dark' ? colors.surfaceAlt : colors.accent,
          borderColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.webThemeSwitchLabel, { color: colors.text }]}>
        {themeMode === 'dark' ? 'Dark' : 'Light'}
      </Text>
      <View
        style={[
          styles.webThemeSwitchTrack,
          { backgroundColor: themeMode === 'dark' ? '#0b162b' : '#fff7ed' },
        ]}
      >
        <View
          style={[
            styles.webThemeSwitchThumb,
            {
              backgroundColor: themeMode === 'dark' ? colors.accent : colors.darkBlue,
              transform: [{ translateX: themeMode === 'dark' ? 18 : 0 }],
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );

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
    const renderPasswordField = (fieldProps) => (
      <View
        style={[
          styles.passwordInputWrap,
          { backgroundColor: colors.inputBg, borderColor: colors.border },
        ]}
      >
        <TextInput
          style={[styles.passwordInputField, { color: colors.text }]}
          placeholder={fieldProps.placeholder}
          placeholderTextColor={colors.mutedText}
          secureTextEntry={!fieldProps.visible}
          value={fieldProps.value}
          onChangeText={fieldProps.onChangeText}
        />
        <TouchableOpacity onPress={fieldProps.onToggle} style={styles.passwordToggle}>
          <Text style={[styles.passwordToggleText, { color: colors.darkBlue }]}>
            {fieldProps.visible ? 'Hide' : 'Show'}
          </Text>
        </TouchableOpacity>
      </View>
    );

    if (authMode === 'signup') {
      return (
        <>
          <TextInput style={themedInputStyle} placeholder="Full Name" value={signupForm.name} onChangeText={(text) => setSignupForm({ ...signupForm, name: text })} placeholderTextColor={colors.mutedText} />
          <TextInput style={themedInputStyle} placeholder="Email" value={signupForm.email} onChangeText={(text) => setSignupForm({ ...signupForm, email: text })} placeholderTextColor={colors.mutedText} autoCapitalize="none" />
          <TextInput style={themedInputStyle} placeholder="Contact Number" value={signupForm.contact} onChangeText={(text) => setSignupForm({ ...signupForm, contact: text })} placeholderTextColor={colors.mutedText} keyboardType="phone-pad" />
          <TextInput style={themedInputStyle} placeholder="Address" value={signupForm.address} onChangeText={(text) => setSignupForm({ ...signupForm, address: text })} placeholderTextColor={colors.mutedText} />
          <TextInput style={themedInputStyle} placeholder="Username" value={signupForm.username} onChangeText={(text) => setSignupForm({ ...signupForm, username: text })} placeholderTextColor={colors.mutedText} autoCapitalize="none" />
          {renderPasswordField({
            placeholder: 'Password',
            value: signupForm.password,
            visible: showSignupPassword,
            onToggle: () => setShowSignupPassword((value) => !value),
            onChangeText: (text) => setSignupForm({ ...signupForm, password: text }),
          })}
          {renderPasswordField({
            placeholder: 'Confirm Password',
            value: signupForm.confirmPassword,
            visible: showSignupConfirmPassword,
            onToggle: () => setShowSignupConfirmPassword((value) => !value),
            onChangeText: (text) => setSignupForm({ ...signupForm, confirmPassword: text }),
          })}
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
          {renderPasswordField({
            placeholder: 'New Password',
            value: forgotForm.newPassword,
            visible: showForgotPassword,
            onToggle: () => setShowForgotPassword((value) => !value),
            onChangeText: (text) => setForgotForm({ ...forgotForm, newPassword: text }),
          })}
          {renderPasswordField({
            placeholder: 'Confirm New Password',
            value: forgotForm.confirmNewPassword,
            visible: showForgotConfirmPassword,
            onToggle: () => setShowForgotConfirmPassword((value) => !value),
            onChangeText: (text) => setForgotForm({ ...forgotForm, confirmNewPassword: text }),
          })}
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
        {renderPasswordField({
          placeholder: 'Password',
          value: password,
          visible: showPassword,
          onToggle: () => setShowPassword((value) => !value),
          onChangeText: setPassword,
        })}
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

  const renderActiveSection = () => {
    if (isWeb && !isLoggedIn) {
      return (
        <CompanyInfo
          colors={colors}
          apiBaseUrl={apiUrl}
          isActive
        />
      );
    }

    if (activeTab === 'company') {
      return (
        <CompanyInfo
          colors={colors}
          apiBaseUrl={apiUrl}
          isActive
        />
      );
    }

    if (activeTab === 'payment') {
      return (
        <PaymentSection
          colors={colors}
          apiBaseUrl={apiUrl}
          user={currentUser}
          isActive
        />
      );
    }

    if (activeTab === 'dashboard') {
      return (
        <UsageSection
          colors={colors}
          apiBaseUrl={apiUrl}
          user={currentUser}
          isActive
        />
      );
    }

    return (
      <Dashboard
        colors={colors}
        apiBaseUrl={apiUrl}
        user={currentUser}
        isActive
        onLogout={handleLogout}
        onUserRefresh={handleUserRefresh}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colors.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      {isWeb && (
        <>
          <View
            style={[
              styles.webBackdropTop,
              { backgroundColor: colors.mode === 'dark' ? 'rgba(251, 191, 36, 0.10)' : 'rgba(42, 95, 191, 0.10)' },
            ]}
          />
          <View
            style={[
              styles.webBackdropSide,
              { backgroundColor: colors.mode === 'dark' ? 'rgba(42, 95, 191, 0.18)' : 'rgba(234, 88, 12, 0.10)' },
            ]}
          />
          <View
            style={[
              styles.webBackdropGrid,
              { borderColor: colors.mode === 'dark' ? 'rgba(159, 176, 205, 0.08)' : 'rgba(15, 23, 42, 0.06)' },
            ]}
          />
        </>
      )}
      <Modal visible={showLoginModal && !isLoggedIn} transparent animationType="fade">
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View
            style={[
              styles.modalBackdropHalo,
              { borderColor: colors.mode === 'dark' ? 'rgba(251, 191, 36, 0.16)' : 'rgba(42, 95, 191, 0.12)' },
            ]}
          />
          <View
            style={[
              styles.modalBackdropHaloSmall,
              { borderColor: colors.mode === 'dark' ? 'rgba(159, 176, 205, 0.12)' : 'rgba(234, 88, 12, 0.10)' },
            ]}
          />
          <View
            style={[
              styles.modalBackdropGrid,
              { borderColor: colors.mode === 'dark' ? 'rgba(159, 176, 205, 0.08)' : 'rgba(15, 23, 42, 0.06)' },
            ]}
          />
          <View
            style={[
              styles.modalBackdropBeam,
              { backgroundColor: colors.mode === 'dark' ? 'rgba(31, 50, 88, 0.35)' : 'rgba(42, 95, 191, 0.12)' },
            ]}
          />
          <View
            style={[
              styles.modalBackdropGlow,
              { backgroundColor: colors.mode === 'dark' ? 'rgba(42, 95, 191, 0.24)' : 'rgba(234, 88, 12, 0.16)' },
            ]}
          />
          <View
            style={[
              styles.modalBackdropAccent,
              { backgroundColor: colors.mode === 'dark' ? 'rgba(251, 191, 36, 0.16)' : 'rgba(42, 95, 191, 0.12)' },
            ]}
          />
          <View
            style={[
              styles.modalBackdropLineOne,
              { backgroundColor: colors.mode === 'dark' ? 'rgba(251, 191, 36, 0.28)' : 'rgba(42, 95, 191, 0.18)' },
            ]}
          />
          <View
            style={[
              styles.modalBackdropLineTwo,
              { backgroundColor: colors.mode === 'dark' ? 'rgba(159, 176, 205, 0.22)' : 'rgba(234, 88, 12, 0.14)' },
            ]}
          />
          <View
            style={[
              styles.modalBackdropOrb,
              { backgroundColor: colors.mode === 'dark' ? 'rgba(16, 163, 74, 0.12)' : 'rgba(234, 88, 12, 0.10)' },
            ]}
          />
          <Animated.View
            style={[
              styles.modalCard,
              isWeb && styles.modalCardWeb,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                opacity: modalOpacity,
                transform: [{ translateY: modalTranslateY }],
              },
            ]}
          >
            {isWeb && (
              <TouchableOpacity
                onPress={() => setShowLoginModal(false)}
                style={[styles.modalCloseButton, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
              >
                <Text style={[styles.modalCloseButtonText, { color: colors.text }]}>Close</Text>
              </TouchableOpacity>
            )}
            {isWeb && (
              <Text style={[styles.modalEyebrow, { color: colors.accent }]}>
                Secure Account Access
              </Text>
            )}
            <Text style={[styles.modalTitle, isWeb && styles.modalTitleWeb, { color: colors.text }]}>Electripay</Text>
            {isWeb && (
              <Text style={[styles.modalIntro, { color: colors.mutedText }]}>
                Sign in to manage bills, monitor energy usage, and keep payment activity in one dashboard.
              </Text>
            )}
            {renderAuthContent()}
          </Animated.View>
        </View>
      </Modal>

      {isWeb ? (
        <>
          <ScrollView
            style={styles.mainContent}
            contentContainerStyle={styles.webMainScrollContent}
            showsVerticalScrollIndicator
            bounces={false}
          >
            <View style={[styles.header, styles.headerWeb, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}>
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
              {!isLoggedIn ? (
                <View style={styles.webHeaderActions}>
                  <TouchableOpacity
                    onPress={() => openAuthModal('login')}
                    style={[styles.webHeaderButton, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
                  >
                    <Text style={[styles.webHeaderButtonText, { color: colors.text }]}>Log In</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => openAuthModal('signup')}
                    style={[styles.webHeaderButton, { backgroundColor: colors.accent, borderColor: colors.accent }]}
                  >
                    <Text style={[styles.webHeaderButtonText, { color: colors.mode === 'dark' ? '#0b1020' : '#ffffff' }]}>Sign Up</Text>
                  </TouchableOpacity>
                  {renderThemeSwitch()}
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => setWebMenuOpen((value) => !value)}
                  style={[styles.webBurgerButton, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
                >
                  <View style={styles.webBurgerIcon}>
                    <View style={[styles.webBurgerLine, { backgroundColor: colors.text }]} />
                    <View style={[styles.webBurgerLine, { backgroundColor: colors.text }]} />
                    <View style={[styles.webBurgerLine, { backgroundColor: colors.text }]} />
                  </View>
                </TouchableOpacity>
              )}
            </View>
            {!isLoggedIn && (
              <View style={[styles.webHero, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                <View style={styles.webHeroCopy}>
                  <Text style={[styles.webEyebrow, { color: colors.accent }]}>Interactive Billing Portal</Text>
                  <Text style={[styles.webTitle, { color: colors.text }]}>
                    Manage electric billing with a website-style control center.
                  </Text>
                  <Text style={[styles.webDescription, { color: colors.mutedText }]}>
                    Electripay brings billing, payments, usage tracking, and account tools into one polished web experience.
                  </Text>
                </View>
                <View style={styles.webStatsRow}>
                  {webHighlights.map((item) => (
                    <View
                      key={item.value}
                      style={[styles.webStatCard, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
                    >
                      <Text style={[styles.webStatValue, { color: colors.text }]}>{item.value}</Text>
                      <Text style={[styles.webStatLabel, { color: colors.mutedText }]}>{item.label}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            {isLoggedIn ? (
              <View style={styles.webAppShell}>
                <View style={[styles.webPortalHeader, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <View>
                    <Text style={[styles.webPortalEyebrow, { color: colors.accent }]}>
                      {activeTab.toUpperCase()}
                    </Text>
                    <Text style={[styles.webPortalTitle, { color: colors.text }]}>
                      {activeTab === 'dashboard' ? 'Energy insights and account overview' : activeTab === 'payment' ? 'Payments and QR billing tools' : 'Profile and account controls'}
                    </Text>
                  </View>
                  <View style={[styles.webPortalBadge, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
                    <Text style={[styles.webPortalBadgeText, { color: colors.text }]}>
                      {currentUser?.name || currentUser?.username || 'Customer'}
                    </Text>
                  </View>
                </View>
                <Animated.View
                  style={[
                    styles.webContentFrame,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      opacity: webContentOpacity,
                      transform: [{ translateY: webContentTranslateY }],
                    },
                  ]}
                >
                  <View style={[styles.content, styles.contentWeb, styles.contentWebLoggedIn]}>
                    {renderActiveSection()}
                  </View>
                </Animated.View>
              </View>
            ) : (
              <View style={styles.pagerContainer}>
                <View style={[styles.content, styles.contentWeb]}>
                  {renderActiveSection()}
                </View>
              </View>
            )}
          </ScrollView>
          {isLoggedIn && webMenuOpen && (
          <>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setWebMenuOpen(false)}
              style={[styles.webMenuBackdrop, { backgroundColor: 'rgba(2, 6, 23, 0.42)' }]}
            />
            <Animated.View
              style={[
                styles.webMenuPanel,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: webMenuOpacity,
                  transform: [{ translateX: webMenuTranslateX }],
                },
              ]}
            >
              <View style={[styles.webDrawerThemeWrap, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
                {renderThemeSwitch()}
              </View>
              {['dashboard', 'payment', 'profile'].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => {
                    handleTabPress(tab);
                    setWebMenuOpen(false);
                  }}
                  style={[
                    styles.webDrawerItem,
                    {
                      backgroundColor: activeTab === tab ? colors.accent : colors.surfaceAlt,
                      borderColor: activeTab === tab ? colors.accent : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.webDrawerItemText,
                      { color: activeTab === tab ? (colors.mode === 'dark' ? '#0b1020' : '#ffffff') : colors.text },
                    ]}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                onPress={handleLogout}
                style={[styles.webDrawerItem, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
              >
                <Text style={[styles.webDrawerItemText, { color: colors.danger }]}>Log Out</Text>
              </TouchableOpacity>
            </Animated.View>
          </>
          )}
        </>
      ) : (
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
              contentOffset={{ x: tabs.indexOf(activeTab) * pageWidth, y: 0 }}
              bounces={false}
              overScrollMode="never"
            >
              <View style={[styles.page, { width: pageWidth }]}>
                <View style={styles.content}>
                  <CompanyInfo
                    colors={colors}
                    apiBaseUrl={apiUrl}
                    isActive={activeTab === 'company'}
                  />
                </View>
              </View>
              <View style={[styles.page, { width: pageWidth }]}>
                <View style={styles.content}>
                  <PaymentSection
                    colors={colors}
                    apiBaseUrl={apiUrl}
                    user={currentUser}
                    isActive={activeTab === 'payment'}
                  />
                </View>
              </View>
              <View style={[styles.page, { width: pageWidth }]}>
                <View style={styles.content}>
                  <UsageSection
                    colors={colors}
                    apiBaseUrl={apiUrl}
                    user={currentUser}
                    isActive={activeTab === 'dashboard'}
                  />
                </View>
              </View>
              <View style={[styles.page, { width: pageWidth }]}>
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
      )}

      <View
        style={[
          styles.tabBar,
          isWeb && styles.tabBarWeb,
          { backgroundColor: colors.tabBarBg, borderTopColor: colors.border },
        ]}
      >
        <Animated.View
          style={[
            styles.tabIndicator,
            isWeb && styles.tabIndicatorWeb,
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
                isWeb && styles.tabTextWeb,
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
  webMainScrollContent: {
    paddingBottom: 40,
  },
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
  headerWeb: {
    width: '100%',
    maxWidth: 1240,
    alignSelf: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 24,
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
  webHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  webHeaderButton: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  webHeaderButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  webThemeSwitch: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  webThemeSwitchLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  webThemeSwitchTrack: {
    width: 38,
    height: 20,
    borderRadius: 999,
    padding: 2,
    justifyContent: 'center',
  },
  webThemeSwitchThumb: {
    width: 16,
    height: 16,
    borderRadius: 999,
  },
  webBurgerButton: {
    borderWidth: 1,
    borderRadius: 999,
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webBurgerIcon: {
    width: 16,
    gap: 3,
  },
  webBurgerLine: {
    height: 2,
    borderRadius: 999,
  },
  content: {
    padding: 16,
    width: '100%',
    flex: 1,
  },
  contentWeb: {
    alignSelf: 'center',
    maxWidth: 1180,
    width: '100%',
    paddingTop: 0,
  },
  contentWebLoggedIn: {
    maxWidth: '100%',
    padding: 0,
  },
  page: {
    flex: 1,
    height: '100%',
  },
  tabBar: {
    flexDirection: 'row',
    height: 100,
    bottom: 0,
    borderTopWidth: 1,
  },
  tabBarWeb: {
    display: 'none',
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
    marginBottom: 50,
  },
  tabTextWeb: {
    marginBottom: 0,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 45,
    height: 4,
    width: '25%',
    borderRadius: 999,
  },
  tabIndicatorWeb: {
    display: 'none',
  },
  webBackdropTop: {
    position: 'absolute',
    width: 520,
    height: 520,
    borderRadius: 999,
    top: -120,
    left: '8%',
  },
  webBackdropSide: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: 999,
    right: -80,
    top: '26%',
  },
  webBackdropGrid: {
    position: 'absolute',
    width: '88%',
    height: '88%',
    alignSelf: 'center',
    top: '7%',
    borderWidth: 1,
    borderRadius: 36,
  },
  webHero: {
    width: '100%',
    maxWidth: 1240,
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 28,
    marginTop: 18,
    marginBottom: 18,
    padding: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    gap: 18,
  },
  webHeroCopy: {
    flex: 1.1,
    justifyContent: 'center',
  },
  webEyebrow: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  webTitle: {
    fontSize: 38,
    lineHeight: 46,
    fontWeight: '800',
    marginBottom: 12,
  },
  webDescription: {
    fontSize: 15,
    lineHeight: 24,
    maxWidth: 520,
  },
  webStatsRow: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 14,
  },
  webStatCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    minHeight: 96,
    justifyContent: 'center',
  },
  webStatValue: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  webStatLabel: {
    fontSize: 13,
    lineHeight: 19,
  },
  webTabsWrap: {
    display: 'none',
  },
  webTabPill: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webTabText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  webAppShell: {
    width: '100%',
    maxWidth: 1240,
    alignSelf: 'center',
    gap: 16,
  },
  webMenuPanel: {
    position: 'absolute',
    top: 108,
    right: '50%',
    marginRight: -620,
    width: 320,
    borderWidth: 1,
    borderRadius: 24,
    padding: 14,
    gap: 10,
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.18,
    shadowRadius: 26,
  },
  webMenuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 15,
  },
  webDrawerItem: {
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  webDrawerThemeWrap: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 10,
  },
  webDrawerItemText: {
    fontSize: 14,
    fontWeight: '800',
  },
  webAppContent: {
    flex: 1,
    minWidth: 0,
  },
  webPortalHeader: {
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 24,
    paddingVertical: 22,
    paddingHorizontal: 24,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  webPortalEyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  webPortalTitle: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '800',
    maxWidth: 760,
  },
  webPortalBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  webPortalBadgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  webContentFrame: {
    borderWidth: 1,
    borderRadius: 28,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.12,
    shadowRadius: 26,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  modalBackdropHalo: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: 999,
    borderWidth: 1,
    top: '10%',
    left: -110,
  },
  modalBackdropHaloSmall: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 999,
    borderWidth: 1,
    bottom: '18%',
    right: -20,
  },
  modalBackdropGrid: {
    position: 'absolute',
    width: '120%',
    height: '120%',
    borderWidth: 1,
    borderRadius: 28,
    transform: [{ rotate: '-8deg' }],
  },
  modalBackdropBeam: {
    position: 'absolute',
    width: 420,
    height: 120,
    borderRadius: 999,
    top: '28%',
    left: -80,
    transform: [{ rotate: '-24deg' }],
  },
  modalBackdropGlow: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 999,
    top: '16%',
    right: -80,
  },
  modalBackdropAccent: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 999,
    bottom: '14%',
    left: -60,
  },
  modalBackdropLineOne: {
    position: 'absolute',
    width: 280,
    height: 2,
    borderRadius: 999,
    top: '24%',
    right: -30,
    transform: [{ rotate: '35deg' }],
  },
  modalBackdropLineTwo: {
    position: 'absolute',
    width: 180,
    height: 2,
    borderRadius: 999,
    bottom: '26%',
    left: -10,
    transform: [{ rotate: '-32deg' }],
  },
  modalBackdropOrb: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 999,
    top: '42%',
    right: 24,
  },
  modalCard: {
    width: '88%',
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
  },
  modalCardWeb: {
    width: '100%',
    maxWidth: 520,
    paddingVertical: 28,
    paddingHorizontal: 32,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.22,
    shadowRadius: 30,
  },
  modalCloseButton: {
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  modalCloseButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  modalEyebrow: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'ElectroFont1',
  },
  modalTitleWeb: {
    fontSize: 34,
    marginBottom: 12,
  },
  modalIntro: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 22,
  },
  inputModern: {
    marginBottom: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  passwordInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 12,
  },
  passwordInputField: {
    flex: 1,
    paddingVertical: 12,
  },
  passwordToggle: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  passwordToggleText: {
    fontSize: 12,
    fontWeight: '700',
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
