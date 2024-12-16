import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';

const VehicleDetailsScreen = () => {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  // Mock data - replace with actual data fetching
  const vehicle = {
    id,
    licensePlate: 'ABC123',
    make: 'Toyota',
    model: 'Corolla',
    year: '2020',
    color: 'Silver',
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1C0CCE", "#1d3461"]}
        style={StyleSheet.absoluteFill}
      />
      <Header showBackButton={true} />
      <ScrollView style={styles.content}>
        <Text style={styles.title}>{t('vehicles.details')}</Text>
        
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>{t('vehicles.licensePlate')}</Text>
            <Text style={styles.value}>{vehicle.licensePlate}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>{t('vehicles.make')}</Text>
            <Text style={styles.value}>{vehicle.make}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>{t('vehicles.model')}</Text>
            <Text style={styles.value}>{vehicle.model}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>{t('vehicles.year')}</Text>
            <Text style={styles.value}>{vehicle.year}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>{t('vehicles.color')}</Text>
            <Text style={styles.value}>{vehicle.color}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C0CCE",
    marginBottom: 24,
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});

export default VehicleDetailsScreen; 