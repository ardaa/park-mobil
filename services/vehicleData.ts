import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';

const API_URL = 'https://restcountries.com/v3.1';

export interface Country {
  code: string;
  name: string;
  platePrefix: string;
}

interface ApiCountry {
  cca2: string;
  name: {
    common: string;
  };
  car: {
    signs: string[];
  };
}

interface CarMake {
  make: string;
}

interface CarModel {
  make: string;
  model: string;
}

class VehicleDataService {
  private countries: Country[] = [];
  private makes: string[] = [];
  private models: Map<string, string[]> = new Map();

  constructor() {
    this.loadCarData();
  }

  private async loadCarData() {
    try {
      // Load and parse makes CSV
      const makesContent = await FileSystem.readAsStringAsync(
        require('../assets/car_database/car_make.csv')
      );
      const makesData = Papa.parse<CarMake>(makesContent, { header: true });
      this.makes = [...new Set(makesData.data.map(row => row.make))].sort();

      // Load and parse models CSV
      const modelsContent = await FileSystem.readAsStringAsync(
        require('../assets/car_database/car_model.csv')
      );
      const modelsData = Papa.parse<CarModel>(modelsContent, { header: true });
      
      // Group models by make
      modelsData.data.forEach(row => {
        if (row.make && row.model) {
          const models = this.models.get(row.make) || [];
          models.push(row.model);
          this.models.set(row.make, [...new Set(models)].sort());
        }
      });
    } catch (error) {
      console.error('Error loading car data:', error);
      // Set default data if loading fails
      this.makes = ['Toyota', 'Honda', 'Ford'];
      this.models.set('Toyota', ['Corolla', 'Camry']);
      this.models.set('Honda', ['Civic', 'Accord']);
      this.models.set('Ford', ['Focus', 'Fiesta']);
    }
  }

  async getMakes(): Promise<string[]> {
    return this.makes;
  }

  async getModels(make: string): Promise<string[]> {
    return this.models.get(make) || [];
  }

  async fetchCountries(): Promise<Country[]> {
    try {
      if (this.countries.length > 0) {
        return this.countries;
      }

      const response = await axios.get<ApiCountry[]>(`${API_URL}/all`);
      
      this.countries = response.data
        .map(country => ({
          code: country.cca2,
          name: country.name.common,
          platePrefix: country.car.signs?.[0] || country.cca2
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      // Ensure Turkey is first in the list
      const turkeyIndex = this.countries.findIndex(c => c.code === 'TR');
      if (turkeyIndex > 0) {
        const [turkey] = this.countries.splice(turkeyIndex, 1);
        this.countries.unshift(turkey);
      }

      return this.countries;
    } catch (error) {
      console.error('Error fetching countries:', error);
      // Return default countries if API fails
      return [
        { code: 'TR', name: 'Turkey', platePrefix: 'TR' },
        { code: 'DE', name: 'Germany', platePrefix: 'D' },
        { code: 'FR', name: 'France', platePrefix: 'F' },
      ];
    }
  }
}

export const vehicleDataService = new VehicleDataService(); 