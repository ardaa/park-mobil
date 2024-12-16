import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../../../components/Header';
import SearchableDropdown from '../../../components/SearchableDropdown';
import { vehicleDataService } from '../../../services/vehicleData';

const AddVehicleDetailsScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { licensePlate } = useLocalSearchParams();
  
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMakes();
  }, []);

  useEffect(() => {
    if (make) {
      loadModels(make);
    } else {
      setModels([]);
      setModel('');
    }
  }, [make]);

  const loadMakes = async () => {
    try {
      const makesList = await vehicleDataService.getMakes();
      setMakes(makesList);
    } catch (error) {
      console.error('Error loading makes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadModels = async (selectedMake: string) => {
    try {
      const modelsList = await vehicleDataService.getModels(selectedMake);
      setModels(modelsList);
    } catch (error) {
      console.error('Error loading models:', error);
    }
  };

  const handleSave = () => {
    if (make && model) {
      Alert.alert(
        t('vehicles.success'),
        t('vehicles.vehicleAdded'),
        [
          {
            text: 'OK',
            onPress: () => router.push('/vehicles'),
          },
        ]
      );
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={["#1C0CCE", "#1d3461"]}
        style={StyleSheet.absoluteFill}
      />
      <Header showBackButton={true} />
      <ScrollView 
        style={[styles.content, { marginTop: 20 }]}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>{t('vehicles.addVehicle')}</Text>
        <Text style={styles.step}>{t('vehicles.step')} 2/2</Text>
        
        <View style={styles.section}>
          <View style={styles.form}>
            <SearchableDropdown
              label={t('vehicles.make')}
              placeholder={t('vehicles.selectMake')}
              value={make}
              onSelect={setMake}
              options={makes}
              loading={loading}
            />

            <SearchableDropdown
              label={t('vehicles.model')}
              placeholder={t('vehicles.selectModel')}
              value={model}
              onSelect={setModel}
              options={models}
              loading={!!make && models.length === 0}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, !(make && model) && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={!(make && model)}
          >
            <Text style={styles.buttonText}>{t('common.save')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  },
  scrollContent: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24, // Extra padding for iOS
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C0CCE',
    marginBottom: 8,
  },
  section: {
    marginBottom: 32,
  },
  step: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1C0CCE',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddVehicleDetailsScreen; 