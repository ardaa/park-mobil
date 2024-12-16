import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header';

// This would come from your backend/state management
interface Vehicle {
  id: string;
  licensePlate: string;
  make: string;
  model: string;
}

const VehiclesScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();

  // Mock data - replace with actual data fetching
  const [vehicles, setVehicles] = React.useState<Vehicle[]>([
    {
      id: '1',
      licensePlate: 'ABC123',
      make: 'Toyota',
      model: 'Corolla',
    },
  ]);

  const renderVehicle = ({ item }: { item: Vehicle }) => (
    <TouchableOpacity 
      style={styles.vehicleCard}
      onPress={() => router.push({
        pathname: "/vehicles/[id]",
        params: { id: item.id }
      })}
    >
      <View style={styles.vehicleInfo}>
        <Text style={styles.licensePlate}>{item.licensePlate}</Text>
        <Text style={styles.vehicleDetails}>{`${item.make} ${item.model}`}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#666" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1C0CCE", "#1d3461"]}
        style={StyleSheet.absoluteFill}
      />
      <Header showBackButton={true} />
      <ScrollView style={[styles.content, { marginTop: 20 }]}>
        <Text style={styles.title}>{t('vehicles.title')}</Text>
        
        <View style={styles.section}>
          <FlatList
            data={vehicles}
            renderItem={renderVehicle}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>{t('vehicles.noVehicles')}</Text>
              </View>
            }
          />
          
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/vehicles/add')}
          >
            <Ionicons name="add" size={24} color="white" />
            <Text style={styles.addButtonText}>{t('vehicles.addVehicle')}</Text>
          </TouchableOpacity>
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
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C0CCE",
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  vehicleInfo: {
    flex: 1,
  },
  licensePlate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  vehicleDetails: {
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1C0CCE',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default VehiclesScreen;
