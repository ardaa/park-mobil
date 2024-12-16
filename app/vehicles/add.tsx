import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { vehicleDataService, Country } from '../../services/vehicleData';

const AddVehicleScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [licensePlate, setLicensePlate] = React.useState('');
  const [showCountryModal, setShowCountryModal] = React.useState(false);
  const [countries, setCountries] = React.useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = React.useState<Country | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loadCountries = async () => {
      try {
        const fetchedCountries = await vehicleDataService.fetchCountries();
        setCountries(fetchedCountries);
        setSelectedCountry(fetchedCountries[0]); // Set Turkey as default
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading countries:', error);
        setIsLoading(false);
      }
    };

    loadCountries();
  }, []);

  const filteredCountries = React.useMemo(() => {
    const query = searchQuery.toLowerCase();
    return countries.filter(country => 
      country.name.toLowerCase().includes(query) ||
      country.code.toLowerCase().includes(query) ||
      country.platePrefix.toLowerCase().includes(query)
    );
  }, [searchQuery, countries]);

  const handleNext = () => {
    if (licensePlate.trim()) {
      router.push({
        pathname: '/vehicles/add/details',
        params: { 
          licensePlate,
          countryCode: selectedCountry?.code 
        },
      });
    }
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setShowCountryModal(false);
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
        <Text style={styles.step}>{t('vehicles.step')} 1/2</Text>
        
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.countrySelector}
            onPress={() => setShowCountryModal(true)}
          >
            <Text style={styles.countrySelectorText}>
              {isLoading ? t('common.loading') : selectedCountry?.name}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>

          <View style={styles.licensePlatePreview}>
            <View style={styles.plateStrip}>
              <Text style={styles.countryCode}>{selectedCountry?.platePrefix}</Text>
            </View>
            <Text style={styles.plateNumber}>
              {licensePlate || '00 XXX 000'}
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>{t('vehicles.licensePlate')}</Text>
            <TextInput
              style={styles.input}
              value={licensePlate}
              onChangeText={setLicensePlate}
              placeholder={t('vehicles.enterLicensePlate')}
              autoCapitalize="characters"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={handleNext}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, !licensePlate.trim() && styles.buttonDisabled]}
            onPress={handleNext}
            disabled={!licensePlate.trim()}
          >
            <Text style={styles.buttonText}>{t('common.next')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={showCountryModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('vehicles.selectCountry')}</Text>
              <TouchableOpacity 
                onPress={() => setShowCountryModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={t('vehicles.searchCountry')}
                placeholderTextColor="#666"
                autoCapitalize="none"
                clearButtonMode="while-editing"
              />
            </View>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1C0CCE" />
                <Text style={styles.loadingText}>{t('common.loading')}</Text>
              </View>
            ) : (
              <>
                <FlatList
                  data={filteredCountries}
                  keyExtractor={(item) => item.code}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.countryItem}
                      onPress={() => handleCountrySelect(item)}
                    >
                      <View style={styles.countryInfo}>
                        <Text style={styles.countryName}>{item.name}</Text>
                        <Text style={styles.platePrefix}>({item.platePrefix})</Text>
                      </View>
                      {item.code === selectedCountry?.code && (
                        <Ionicons name="checkmark" size={24} color="#1C0CCE" />
                      )}
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    <View style={styles.emptySearch}>
                      <Text style={styles.emptySearchText}>
                        {t('vehicles.noCountriesFound')}
                      </Text>
                    </View>
                  }
                />
              </>
            )}
          </View>
        </View>
      </Modal>
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
  licensePlatePreview: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 24,
    height: 60,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1C0CCE',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  plateStrip: {
    backgroundColor: '#003399',
    height: '100%',
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryCode: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  plateNumber: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
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
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  countrySelectorText: {
    fontSize: 16,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  countryName: {
    fontSize: 16,
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  countryInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  platePrefix: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  emptySearch: {
    padding: 24,
    alignItems: 'center',
  },
  emptySearchText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
});

export default AddVehicleScreen; 