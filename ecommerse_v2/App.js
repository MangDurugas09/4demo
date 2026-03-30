import React, { useState, useRef, useEffect } from 'react';
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
} from 'react-native';

import Dashboard from './components/Dashboard';
import UsageSection from './components/UsageSection';
import PaymentSection from './components/PaymentSection';
import CompanyInfo from './components/CompanyInfo';

const API_URL = "http://10.0.67.191:5000"; // ⚠️ CHANGE THIS

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

  // ======================
  // 🔐 LOGIN FUNCTION
  // ======================
  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsLoggedIn(true);
        setShowLoginModal(false);
        Alert.alert("Success", "Login successful!");
      } else {
        Alert.alert("Error", data.message || "Login failed");
      }

    } catch (err) {
      Alert.alert("Error", "Server not reachable");
      console.log(err);
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

      {/* LOGIN MODAL */}
      <Modal visible={showLoginModal && !isLoggedIn} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>

            <Text style={styles.modalTitle}>⚡ Electripay</Text>

            <TextInput
              style={styles.inputModern}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              placeholderTextColor="#aaa"
            />

            <TextInput
              style={styles.inputModern}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#aaa"
            />

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      {/* HEADER */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>ELECTRIPAY</Text>
        </View>

        <View style={styles.content}>
          {renderContent()}
        </View>
      </ScrollView>

      {/* TABS */}
      <View style={styles.tabBar}>
        <Animated.View
          style={[
            styles.tabIndicator,
            {
              transform: [{
                translateX: tabIndicatorAnim.interpolate({
                  inputRange: tabs.map((_, i) => i),
                  outputRange: tabs.map((_, i) => i * tabWidth),
                })
              }]
            }
          ]}
        />

        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.tabButton}
            onPress={() => handleTabPress(tab)}
          >
            <Text style={styles.tabText}>{tab.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1E2E' },
  scrollView: { flex: 1 },

  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 30,
    color: '#FFD700',
    fontWeight: 'bold',
  },

  content: {
    padding: 16,
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
    bottom: 4,
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
    width: '85%',
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
});