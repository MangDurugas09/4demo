import React, { useState, useRef } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, Modal, TextInput, Button, Animated, Dimensions } from 'react-native';
import Dashboard from './components/Dashboard';
import UsageSection from './components/UsageSection';
import PaymentSection from './components/PaymentSection';
import CompanyInfo from './components/CompanyInfo';

const COLORS = {
  primary: '#ADD8E6',      // Light Blue
  accent: '#FFD700',       // Yellow
  darkBlue: '#87CEEB',     // Sky Blue
  white: '#FFFFFF',
  darkBg: '#0B1E2E',       // Dark background
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLoginModal, setShowLoginModal] = useState(true); // Show modal initially
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const tabIndicatorAnim = useRef(new Animated.Value(0)).current; // For tab animation

  const tabs = ['dashboard', 'usage', 'payment', 'company'];
  const screenWidth = Dimensions.get('window').width;
  const tabWidth = screenWidth / 4;

  const handleLogin = () => {
    // Simple login logic, in real app use proper auth
    if (username && password) {
      setIsLoggedIn(true);
      setShowLoginModal(false);
    }
  };

  const handleTabPress = (tab) => {
    const index = tabs.indexOf(tab);
    Animated.spring(tabIndicatorAnim, {
      toValue: index,
      useNativeDriver: false,
    }).start();
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard colors={COLORS} />;
      case 'usage':
        return <UsageSection colors={COLORS} />;
      case 'payment':
        return <PaymentSection colors={COLORS} />;
      case 'company':
        return <CompanyInfo colors={COLORS} />;
      default:
        return <Dashboard colors={COLORS} />;
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        visible={showLoginModal && !isLoggedIn}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Login</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <Button title="Login" onPress={handleLogin} />
          </View>
        </View>
      </Modal>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: COLORS.darkBlue }]}>
          <Text style={[styles.headerTitle, { color: COLORS.black }]}>
           ELECTRIPAY
          </Text>
          <Text style={[styles.headerSubtitle, { color: COLORS.accent }]}>
            Client Dashboard
          </Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {renderContent()}
        </View>
      </ScrollView>

      {/* Navigation Tabs */}
      <View style={[styles.tabBar, { backgroundColor: COLORS.darkBg }]}>
        <Animated.View
          style={[
            styles.tabIndicator,
            {
              transform: [{
                translateX: tabIndicatorAnim.interpolate({
                  inputRange: [0, 1, 2, 3],
                  outputRange: [0, tabWidth, 2 * tabWidth, 3 * tabWidth],
                }),
              }],
            },
          ]}
        />
        <TabButton
          label="Dashboard"
          isActive={activeTab === 'dashboard'}
          onPress={() => handleTabPress('dashboard')}
          colors={COLORS}
        />
        <TabButton
          label="Usage"
          isActive={activeTab === 'usage'}
          onPress={() => handleTabPress('usage')}
          colors={COLORS}
        />
        <TabButton
          label="Payment"
          isActive={activeTab === 'payment'}
          onPress={() => handleTabPress('payment')}
          colors={COLORS}
        />
        <TabButton
          label="Company"
          isActive={activeTab === 'company'}
          onPress={() => handleTabPress('company')}
          colors={COLORS}
        />
      </View>
    </View>
  );
}

function TabButton({ label, isActive, onPress, colors }) {
  return (
    <TouchableOpacity
      style={styles.tabButton}
      onPress={onPress}
    >
      <Text
        style={[
          styles.tabButtonText,
          {
            color: isActive ? colors.accent : colors.white,
            fontWeight: isActive ? 'bold' : '600',
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1E2E',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 45,
    fontWeight: '900',
    marginBottom: 8,
    boxShadowColor: '#fdb334',
    boxShadowOffset: { width: 4, height: 4 },
    boxShadowOpacity: 1,
    boxShadowRadius: 10,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  _content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    minHeight: 500,
  },
  get content() {
    return this._content;
  },
  set content(value) {
    this._content = value;
  },
  tabBar: {
    marginBottom: 30,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#ADD8E6',
    paddingBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonText: {
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 20,
    height: 3,
    backgroundColor: COLORS.accent,
    width: '25%', // Since 4 tabs
  },
});
