import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity} from 'react-native';

export default function UsageSection({ colors }) {
  const usageData = [
    { day: 'Mon', usage: 8.5, unit: 'kWh' },
    { day: 'Tue', usage: 9.2, unit: 'kWh' },
    { day: 'Wed', usage: 7.8, unit: 'kWh' },
    { day: 'Thu', usage: 10.1, unit: 'kWh' },
    { day: 'Fri', usage: 11.5, unit: 'kWh' },
    { day: 'Sat', usage: 13.2, unit: 'kWh' },
    { day: 'Sun', usage: 14.8, unit: 'kWh' },
  ];

  const MyButton = () => {
  };

  const monthlyData = [
    {month: 'December', usage: 195, cost: 1950 },
    { month: 'November', usage: 210, cost: 2100 },
    { month: 'January', usage: 245, cost: 2205 },
    { month: 'February', usage: 198, cost: 1782 },
    { month: 'March (Current)', usage: 245, cost: 2450 },
  ];

  const maxUsage = Math.max(...usageData.map(item => item.usage));

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Weekly Usage Chart */}
      <View style={[styles.card, { backgroundColor: colors.primary, opacity: 0.95 }]}>
        <Text style={[styles.cardTitle, { color: colors.darkBg }]}>
          Weekly Usage Pattern
        </Text>
        <View style={styles.chartContainer}>
          {usageData.map((item, index) => (
            <View key={index} style={styles.barWrapper}>
              <View
                style={[
                  styles.bar,
                  {
                    height: (item.usage / maxUsage) * 150,
                    backgroundColor: colors.accent,
                  },
                ]}
              />
              <Text style={[styles.barLabel, { color: colors.darkBg, marginTop: 8 }]}>
                {item.day}
              </Text>
              <Text style={[styles.barValue, { color: colors.darkBg }]}>
                {item.usage}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Usage Details */}
      <View style={[styles.card, { backgroundColor: colors.darkBlue }]}>
        <Text style={[styles.cardTitle, { color: colors.white }]}>
          Current Week Overview
        </Text>
        <View style={styles.statsGrid}>
          <View style={styles.statsItem}>
            <Text style={[styles.statsLabel, { color: colors.white }]}>
              Total Usage
            </Text>
            <Text style={[styles.statsValue, { color: colors.accent }]}>
              74.1 kWh
            </Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={[styles.statsLabel, { color: colors.white }]}>
              Daily Avg
            </Text>
            <Text style={[styles.statsValue, { color: colors.accent }]}>
              10.6 kWh
            </Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={[styles.statsLabel, { color: colors.white }]}>
              Peak Day
            </Text>
            <Text style={[styles.statsValue, { color: colors.accent }]}>
              Sun (14.8)
            </Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={[styles.statsLabel, { color: colors.white }]}>
              Low Day
            </Text>
            <Text style={[styles.statsValue, { color: colors.accent }]}>
              Wed (7.8)
            </Text>
          </View>
        </View>
      </View>

      {/* Monthly Comparison */}
      <View style={[styles.card, { backgroundColor: colors.primary, opacity: 0.95 }]}>
        
        <View style={styles.headerRow}>
          <Text style={[styles.cardTitle, { color: colors.darkBg }]}>
          Monthly Comparison 
        </Text> 
        
        <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>see more</Text>
    </TouchableOpacity>
        </View>

        {monthlyData.map((item, index) => (
          <View key={index} style={styles.monthRow}>
            <View>
              <Text style={[styles.monthName, { color: colors.darkBg }]}>
                {item.month}
              </Text>
              <Text style={[styles.monthUsage, { color: colors.darkBg, opacity: 0.7 }]}>
                {item.usage} kWh
              </Text>
            </View>
            <Text style={[styles.monthCost, { color: colors.accent, fontWeight: 'bold' }]}>
              ₱{item.cost}
            </Text>
          </View>
        ))}
      </View>

      {/* Efficiency Tips */}
      <View style={[styles.card, { backgroundColor: colors.accent, opacity: 0.9 }]}>
        <Text style={[styles.cardTitle, { color: colors.darkBg }]}>
          💡 Efficiency Tips
        </Text>
        <Text style={[styles.tipText, { color: colors.darkBg }]}>
          • Use LED bulbs to save up to 75% energy
        </Text>
        <Text style={[styles.tipText, { color: colors.darkBg }]}>
          • Set AC temperature to 24-26°C
        </Text>
        <Text style={[styles.tipText, { color: colors.darkBg }]}>
          • Unplug devices when not in use
        </Text>
        <Text style={[styles.tipText, { color: colors.darkBg }]}>
          • Use appliances during off-peak hours
        </Text>
      </View>
    </ScrollView>
  );
}



const styles = StyleSheet.create({
  headerRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center'
},
  button: {
    marginLeft: '',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
    color: 'gray',
    fontSize: 14,
  },
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  card: {
    borderRadius: 12,
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
    fontSize: 16,
    fontWeight: 'bold',
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
    marginTop: 4,
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

