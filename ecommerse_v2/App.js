import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Modal,
  TextInput,
  Button,
  Animated,
  Dimensions,
} from 'react-native';

import Dashboard from './components/Dashboard';
import UsageSection from './components/UsageSection';
import PaymentSection from './components/PaymentSection';
import CompanyInfo from './components/CompanyInfo';

const COLORS = {
  primary: '#ADD8E6',
  accent: '#FFD700',
  darkBlue: '#87CEEB',
  white: '#FFFFFF',
  darkBg: '#0B1E2E',
};

export default function App() {
  const [activeTab, setActiveTab] = useState('company');
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const tabIndicatorAnim = useRef(new Animated.Value(0)).current;

  const tabs = ['company', 'payment', 'usage', 'dashboard'];
  const screenWidth = Dimensions.get('window').width;
  const tabWidth = screenWidth / tabs.length;

  useEffect(() => {
    const index = tabs.indexOf('company');
    tabIndicatorAnim.setValue(index);
  }, []);

  const handleLogin = () => {
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

      {/* ⚡ LOGIN MODAL */}
      <Modal
        visible={showLoginModal && !isLoggedIn}
        animationType="fade"
        transparent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>

            <Text style={styles.modalTitle}>⚡ Electripay</Text>
            <Text style={styles.modalSubtitle}>
              Secure Client Access
            </Text>

            <TextInput
              style={styles.inputModern}
              placeholder="Username"
              placeholderTextColor="#aaa"
              value={username}
              onChangeText={setUsername}
            />

            <TextInput
              style={styles.inputModern}
              placeholder="Password"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            {/* SIGN UP */}
            <TouchableOpacity>
              <Text style={styles.signupText}>
                Don’t have an account?{' '}
                <Text style={styles.signupLink}>Sign up</Text>
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      {/* HEADER */}
      <ScrollView style={styles.scrollView}>
        <View style={[styles.header, { backgroundColor: COLORS.darkBlue }]}>
          <Text style={[styles.headerTitle, { color: COLORS.accent }]}>
            ELECTRIPAY
          </Text>
          <Text style={[styles.headerSubtitle, { color: COLORS.accent }]}>
            Client Dashboard
          </Text>
        </View>

        <View style={styles.content}>{renderContent()}</View>
      </ScrollView>

      {/* TABS */}
      <View style={[styles.tabBar, { backgroundColor: COLORS.darkBg }]}>
        <Animated.View
          style={[
            styles.tabIndicator,
            {
              transform: [
                {
                  translateX: tabIndicatorAnim.interpolate({
                    inputRange: tabs.map((_, i) => i),
                    outputRange: tabs.map((_, i) => i * tabWidth),
                  }),
                },
              ],
            },
          ]}
        />

        {tabs.map((tab) => (
          <TabButton
            key={tab}
            label={tab.toUpperCase()}
            isActive={activeTab === tab}
            onPress={() => handleTabPress(tab)}
            colors={COLORS}
          />
        ))}
      </View>
    </View>
  );
}

function TabButton({ label, isActive, onPress, colors }) {
  return (
    <TouchableOpacity style={styles.tabButton} onPress={onPress}>
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
    fontSize: 45,
    fontWeight: '900',
    marginBottom: 8,
  },

  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    minHeight: 500,
  },

  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#ADD8E6',
    paddingBottom: 20,
    marginBottom: 25,
  },

  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },

  tabButtonText: {
    fontSize: 12,
  },

  tabIndicator: {
    position: 'absolute',
    bottom: 20,
    height: 3,
    width: '25%',
    backgroundColor: '#FFD700',
  },

  /* ⚡ LOGIN MODAL STYLES */

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 15, 25, 0.88)', // electric dim
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalCard: {
    width: '85%',
    backgroundColor: '#0F2A3D',
    borderRadius: 22,
    padding: 25,
    elevation: 10,
    shadowColor: '#FFD700',
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },

  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
  },

  modalSubtitle: {
    fontSize: 13,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
  },

  inputModern: {
    backgroundColor: '#1A3C52',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    color: '#fff',
  },

  loginButton: {
    backgroundColor: '#FFD700',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  loginButtonText: {
    color: '#0B1E2E',
    fontWeight: 'bold',
    fontSize: 16,
  },

  signupText: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 12,
  },

  signupLink: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
});