import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import axios from 'axios';

export default function UsageSection({ colors, apiBaseUrl, user, isActive, onScroll }) {
  const [usageData, setUsageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllMonths, setShowAllMonths] = useState(false);
  const scrollRef = useRef(null);
  const apiHeaders = { headers: { 'ngrok-skip-browser-warning': 'true' } };

  useEffect(() => {
    const fetchUsage = async () => {
      if (!apiBaseUrl || !user?._id) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${apiBaseUrl}/users/${user._id}/usage`, apiHeaders);
        if (
          typeof response.data === 'string' &&
          (response.data.startsWith('Tunnel') ||
            response.data.includes('ngrok') ||
            response.data.startsWith('<!DOCTYPE') ||
            response.data.startsWith('<html'))
        ) {
          throw new Error('Tunnel is inactive or API URL is stale. Start a fresh tunnel and reload the app.');
        }
        setUsageData(response.data);
      } catch (error) {
        console.error('Error fetching usage:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();
  }, [apiBaseUrl, user?._id]);

  useEffect(() => {
    if (isActive) {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }
  }, [isActive]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: colors.text }}>Loading usage data...</Text>
      </View>
    );
  }

  if (!user?._id || !usageData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: colors.text }}>Log in to view usage data.</Text>
      </View>
    );
  }

  const weekly = usageData.weekly || [];
  const monthly = usageData.monthly || [];
  const visibleMonthly = showAllMonths ? monthly : monthly.slice(-3);
  const maxUsage = Math.max(...weekly.map((item) => item.usage), 1);

  return (
    <Animated.ScrollView
      ref={scrollRef}
      style={styles.container}
      showsVerticalScrollIndicator={false}
      bounces={false}
      alwaysBounceVertical={false}
      overScrollMode="never"
      onScroll={onScroll}
      scrollEventThrottle={16}
    >
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Weekly Usage Pattern</Text>
        <View style={styles.chartContainer}>
          {weekly.map((item) => (
            <View key={item.day} style={styles.barWrapper}>
              <View
                style={[
                  styles.bar,
                  {
                    height: (item.usage / maxUsage) * 150,
                    backgroundColor: colors.accent,
                  },
                ]}
              />
              <Text style={[styles.barLabel, { color: colors.text }]}>{item.day}</Text>
              <Text style={[styles.barValue, { color: colors.mutedText }]}>{item.usage}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Current Week Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statsItem}>
            <Text style={[styles.statsLabel, { color: colors.mutedText }]}>Total Usage</Text>
            <Text style={[styles.statsValue, { color: colors.accent }]}>
              {usageData.summary.totalUsage} kWh
            </Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={[styles.statsLabel, { color: colors.mutedText }]}>Daily Avg</Text>
            <Text style={[styles.statsValue, { color: colors.accent }]}>
              {usageData.summary.dailyAverage} kWh
            </Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={[styles.statsLabel, { color: colors.mutedText }]}>Peak Day</Text>
            <Text style={[styles.statsValue, { color: colors.accent }]}>
              {usageData.summary.peakDay.day} ({usageData.summary.peakDay.usage})
            </Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={[styles.statsLabel, { color: colors.mutedText }]}>Low Day</Text>
            <Text style={[styles.statsValue, { color: colors.accent }]}>
              {usageData.summary.lowDay.day} ({usageData.summary.lowDay.usage})
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.headerRow}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Monthly Comparison</Text>
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]} onPress={() => setShowAllMonths((value) => !value)}>
            <Text style={[styles.buttonText, { color: colors.text }]}>{showAllMonths ? 'show less' : 'see more'}</Text>
          </TouchableOpacity>
        </View>

        {visibleMonthly.map((item) => (
          <View key={item.month} style={[styles.monthRow, { borderBottomColor: colors.border }]}>
            <View>
              <Text style={[styles.monthName, { color: colors.text }]}>{item.month}</Text>
              <Text style={[styles.monthUsage, { color: colors.mutedText }]}>
                {item.usage} kWh
              </Text>
            </View>
            <Text style={[styles.monthCost, { color: colors.accent, fontWeight: 'bold' }]}>
              PHP {item.cost}
            </Text>
          </View>
        ))}
      </View>

      <View style={[styles.card, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Efficiency Tips</Text>
        {usageData.tips.map((tip) => (
          <Text key={tip} style={[styles.tipText, { color: colors.text }]}>
            - {tip}
          </Text>
        ))}
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 12,
  },
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 200,
    paddingVertical: 16,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 30,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  barLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 8,
  },
  barValue: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statsItem: {
    width: '48%',
    marginBottom: 12,
    paddingVertical: 8,
  },
  statsLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
    opacity: 0.8,
  },
  statsValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  monthName: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  monthUsage: {
    fontSize: 11,
  },
  monthCost: {
    fontSize: 14,
  },
  tipText: {
    fontSize: 12,
    lineHeight: 20,
    marginBottom: 8,
  },
});
