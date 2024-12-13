'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StatBar from '@/app/components/StatBar';
import Sidebar from '@/app/components/SidebarDashboard';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Image from 'next/image';
import TopBar from '@/app/components/TopBar';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { FiSearch, FiCalendar, FiFilter, FiBox } from 'react-icons/fi';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Register Turkish locale
registerLocale('tr', tr);

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  /*
    licensePlate: carData.plate,
          entryTime: carData.entryTime,
          image: carData.image,
          brand: carData.brand,
          model: carData.model,
          color: carData.color,
          owner: carData.owner,
          phone: carData.phone,
          type: carData.type,
          history: carData.history
  */
  const [mockCarData, setMockCarData] = useState({
    "A1": {
      licensePlate: "34 ABC 123",
      entryTime: new Date(2024, 2, 10, 14, 30),
      image: "/cctv-1.jpg",
      brand: "Toyota",
      model: "Corolla",
      color: "Red",
      owner: "John Doe",
      phone: "1234567890",
      type: "car",
      history: []
    },
    "A3": {
      licensePlate: "34 ABC 123",
      entryTime: new Date(2024, 2, 10, 14, 30),
      image: "/cctv-1.jpg",
      brand: "Toyota",
      model: "Corolla",
      color: "Red",
      owner: "John Doe",
      phone: "1234567890",
      type: "car",
      history: []
    },
    "A5": {
      licensePlate: "34 ABC 123",
      entryTime: new Date(2024, 2, 10, 14, 30),
      image: "/cctv-1.jpg",
      brand: "Toyota",
      model: "Corolla",
      color: "Red",
      owner: "John Doe",
      phone: "1234567890",
      type: "car",
      history: []
    }
  });
  const [parkingLevels, setParkingLevels] = useState({
    1: {
      title: "1. Kat",
      sections: {
        "zone-a": {
          title: "A Bölgesi",
          color: "bg-blue-50",
          spots: [
            { 
              id: "A1", 
              occupied: true,
              licensePlate: "34 ABC 123",
              entryTime: new Date(2024, 2, 10, 14, 30),
              image: "/cctv-1.jpg"
            },
            { id: "A2", occupied: false },
            { 
              id: "A3", 
              occupied: true,
              licensePlate: "34 DEF 456",
              entryTime: new Date(2024, 2, 11, 9, 15),
              image: "/cctv-1.jpg"
            },
            { id: "A4", occupied: false },
            { id: "A5", occupied: true },
            { id: "A6", occupied: false },
            { id: "A7", occupied: true },
            { id: "A8", occupied: false },
          ],
          x: 1,
          y: 1,
          width: 8,
          height: 4
        },
        "zone-b": {
          title: "B Bölgesi",
          color: "bg-green-50",
          spots: [
            { id: "B1", occupied: false },
            { id: "B2", occupied: true },
            { id: "B3", occupied: false },
            { id: "B4", occupied: true },
            { id: "B5", occupied: false },
            { id: "B6", occupied: true },
            { id: "B7", occupied: false },
            { id: "B8", occupied: true },
          ],
          x: 1,
          y: 6,
          width: 8,
          height: 4
        },
        "zone-c": {
          title: "C Bölgesi",
          color: "bg-purple-50",
          spots: [
            { id: "C1", occupied: false },
            { id: "C2", occupied: true },
            { id: "C3", occupied: false },
            { id: "C4", occupied: true },
            { id: "C5", occupied: false },
            { id: "C6", occupied: true },
            { id: "C7", occupied: false },
            { id: "C8", occupied: true },
          ],
          x: 1,
          y: 11,
          width: 8,
          height: 4
        },
        "zone-d": {
          title: "D Bölgesi",
          color: "bg-yellow-50",
          spots: [
            { id: "D1", occupied: false },
            { id: "D2", occupied: true },
            { id: "D3", occupied: false },
            { id: "D4", occupied: true },
            { id: "D5", occupied: false },
            { id: "D6", occupied: true },
            { id: "D7", occupied: false },
            { id: "D8", occupied: true },
          ],
          x: 1,
          y: 16,
          width: 8,
          height: 4
        },
        "vip-zone": {
          title: "VIP Bölgesi",
          color: "bg-red-50",
          spots: [
            { id: "V1", occupied: false },
            { id: "V2", occupied: true },
            { id: "V3", occupied: false },
            { id: "V4", occupied: true },
            { id: "V5", occupied: false },
          ],
          x: 15,
          y: 1,
          width: 6,
          height: 4
        },
        "handicap-zone": {
          title: "Engelli Parkı",
          color: "bg-indigo-50",
          spots: [
            { id: "H1", occupied: false },
            { id: "H2", occupied: true },
            { id: "H3", occupied: false },
            { id: "H4", occupied: true },
          ],
          x: 15,
          y: 6,
          width: 6,
          height: 4
        },
        "ev-charging": {
          title: "Elektrikli Araç Şarj",
          color: "bg-emerald-50",
          spots: [
            { id: "E1", occupied: false },
            { id: "E2", occupied: true },
            { id: "E3", occupied: false },
            { id: "E4", occupied: true },
            { id: "E5", occupied: false },
            { id: "E6", occupied: true },
          ],
          x: 15,
          y: 11,
          width: 6,
          height: 4
        },
        "motorcycle": {
          title: "Motosiklet Parkı",
          color: "bg-orange-50",
          spots: [
            { id: "M1", occupied: false },
            { id: "M2", occupied: true },
            { id: "M3", occupied: false },
            { id: "M4", occupied: true },
            { id: "M5", occupied: false },
            { id: "M6", occupied: true },
            { id: "M7", occupied: false },
            { id: "M8", occupied: true },
          ],
          x: 15,
          y: 16,
          width: 6,
          height: 4
        },
        "staff-parking": {
          title: "Personel Parkı",
          color: "bg-cyan-50",
          spots: [
            { id: "S1", occupied: false },
            { id: "S2", occupied: true },
            { id: "S3", occupied: false },
            { id: "S4", occupied: true },
            { id: "S5", occupied: false },
            { id: "S6", occupied: true },
          ],
          x: 25,
          y: 1,
          width: 8,
          height: 4
        },
        "visitor-parking": {
          title: "Misafir Parkı",
          color: "bg-teal-50",
          spots: [
            { id: "T1", occupied: false },
            { id: "T2", occupied: true },
            { id: "T3", occupied: false },
            { id: "T4", occupied: true },
            { id: "T5", occupied: false },
            { id: "T6", occupied: true },
          ],
          x: 25,
          y: 6,
          width: 8,
          height: 4
        },
        "entrance": {
          title: "Giriş",
          color: "bg-blue-100",
          isMarker: true,
          x: 0,
          y: 20,
          width: 2,
          height: 3,
          icon: "→"
        },
        "exit": {
          title: "Çıkış",
          color: "bg-orange-100",
          isMarker: true,
          x: 38,
          y: 20,
          width: 2,
          height: 3,
          icon: "←"
        },
        "store-entrance": {
          title: "Mağaza Girişi",
          color: "bg-purple-100",
          isMarker: true,
          x: 10,
          y: 0,
          width: 4,
          height: 2,
            icon: "⌂"
          }
        }
      },
      2: {
        title: "2. Kat",
        sections: {
          "zone-2a": {
            title: "2A Bölgesi",
            color: "bg-blue-50",
            spots: [
              { id: "2A1", occupied: false },
              { id: "2A2", occupied: true },
              { id: "2A3", occupied: false },
              { id: "2A4", occupied: true },
              { id: "2A5", occupied: false },
              { id: "2A6", occupied: true },
              { id: "2A7", occupied: false },
              { id: "2A8", occupied: true },
            ],
            x: 1,
            y: 1,
            width: 8,
            height: 4
          },
        }
      },
      3: {
        title: "3. Kat",
        sections: {
          "zone-3a": {
            title: "3A Bölgesi",
            color: "bg-blue-50",
            spots: [
              { id: "3A1", occupied: true },
              { id: "3A2", occupied: false },
              { id: "3A3", occupied: true },
              { id: "3A4", occupied: false },
              { id: "3A5", occupied: true },
              { id: "3A6", occupied: false },
              { id: "3A7", occupied: true },
              { id: "3A8", occupied: false },
            ],
            x: 1,
            y: 1,
            width: 8,
            height: 4
          },
        }
      }
   
  });
  
  const router = useRouter();

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token);
    if (!token) {
      //router.push('/dashboard/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Fetch parking levels
  useEffect(() => {
    const fetchParkingLevels = async () => {
      try {
        const response = await fetch('/api/parking-levels');
        if (!response.ok) {
          throw new Error('Failed to fetch parking levels');
        }
        const data = await response.json();
        setParkingLevels(data);
      } catch (error) {
        console.error('Error fetching parking levels:', error);
        // Keep using default parkingLevels as fallback
      }
    };

    fetchParkingLevels();
  }, []);

  const [selectedSpot, setSelectedSpot] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleParkingSpotClick = (spot) => {
    console.log('Spot clicked:', spot);
    if (spot.occupied) {
      // Find the car data for this spot
      const carData = Object.values(mockCarData).find(car => car.currentSpot === spot.id);
      if (carData) {
        const spotWithCarData = {
          ...spot,
          licensePlate: carData.plate,
          entryTime: carData.entryTime,
          image: carData.image,
          brand: carData.brand,
          model: carData.model,
          color: carData.color,
          owner: carData.owner,
          phone: carData.phone,
          type: carData.type,
          history: carData.history
        };
        setSelectedSpot(spotWithCarData);
        setShowPopup(true);
      } else {
        // Fallback for spots without detailed data
        const spotWithDefaults = {
          ...spot,
          licensePlate: 'Plaka Bilgisi Yok',
          entryTime: new Date(),
          image: '/stream.jpeg'
        };
        setSelectedSpot(spotWithDefaults);
        setShowPopup(true);
      }
    }
  };

  const GridItem = ({ section }) => {
    const getGridCols = (width) => {
      if (width <= 4) return 'grid-cols-1';
      if (width <= 6) return 'grid-cols-2';
      if (width <= 8) return 'grid-cols-4';
      return 'grid-cols-4';
    };

    const style = {
      position: 'absolute',
      left: `${(section.x / 40) * 100}%`,
      top: `${(section.y / 40) * 100}%`,
      width: `${(section.width / 40) * 100}%`,
      height: `${(section.height / 40) * 100}%`,
      display: 'flex',
      flexDirection: 'column',
      padding: '8px',
      borderRadius: '8px',
      border: '1px solid rgba(0,0,0,0.1)',
    };

    if (section.isMarker) {
      return (
        <div 
          className={`
            ${section.color} 
            transition-colors 
            hover:bg-opacity-75 
            flex 
            flex-col 
            items-center 
            justify-center
            shadow-sm
            border-2 
            border-gray-300
          `} 
          style={style}
        >
          <div className="text-2xl mb-1">{section.icon}</div>
          <div className="text-xs font-medium text-gray-700 text-center">
            {section.title}
          </div>
        </div>
      );
    }

    const availableSpots = section.spots.filter(spot => !spot.occupied).length;

    return (
      <div className={`${section.color} transition-colors hover:bg-opacity-75`} style={style}>
        <div className="text-sm font-medium text-gray-700 mb-1">{section.title}</div>
        <div className={`flex-1 grid ${getGridCols(section.width)} gap-1`}>
          {section.spots.map((spot) => (
            <div
              key={spot.id}
              className={`
                rounded-md flex items-center justify-center text-xs font-medium
                ${spot.occupied 
                  ? 'bg-red-100 text-red-800 border border-red-200' 
                  : 'bg-green-100 text-green-800 border border-green-200'
                }
                hover:opacity-75 cursor-pointer transition-colors
              `}
              onClick={() => {
                console.log('Clicking spot:', spot);
                handleParkingSpotClick(spot);
              }}
            >
              <div className={`flex items-center justify-center p-1 bg-white rounded-md border border-gray-300 ${spot.occupied ? 'border-red-400' : 'border-green-400'}`}>
                {spot.id}
              </div>
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Boş Park Yeri: {availableSpots}/{section.spots.length}
        </div>
      </div>
    );
  };

  const Grid = ({ children }) => {
    return (
      <div className="relative w-full h-full">
        <div className="absolute inset-0">
          {/* Vertical lines */}
          {Array.from({ length: 41 }).map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute h-full w-[1px] bg-gray-200"
              style={{ left: `${(i / 40) * 100}%` }}
            />
          ))}
          {/* Horizontal lines */}
          {Array.from({ length: 41 }).map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute w-full h-[1px] bg-gray-200"
              style={{ top: `${(i / 40) * 100}%` }}
            />
          ))}
        </div>
        {children}
      </div>
    );
  };

  const getCurrentLevelStats = () => {
    const sections = parkingLevels[currentLevel].sections;
    let total = 0;
    let available = 0;

    Object.values(sections).forEach(section => {
      if (section.spots) {
        total += section.spots.length;
        available += section.spots.filter(spot => !spot.occupied).length;
      }
    });

    return { total, available };
  };

  const ParkingSpotPopup = ({ spot, onClose }) => {
    const defaultData = {
      licensePlate: 'Plaka Bilgisi Yok',
      entryTime: new Date(),
      image: '/stream.jpeg',
      brand: '-',
      model: '-',
      color: '-',
      owner: 'Üye Değil',
      phone: '-',
      type: 'regular'
    };

    const spotData = {
      ...defaultData,
      ...spot
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
        <div className="bg-white rounded-lg max-w-2xl w-full mx-4 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Park Yeri Detayları - {spot.id}</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              ✕
            </button>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                {/* Vehicle Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Plaka</label>
                    <div className="mt-1 text-lg font-semibold">{spotData.licensePlate}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Araç Tipi</label>
                    <div className="mt-1">{spotData.brand} {spotData.model}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Renk</label>
                    <div className="mt-1">{spotData.color}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Üyelik</label>
                    <div className="mt-1">{spotData.type === 'regular' ? 'Normal' : spotData.type.toUpperCase()}</div>
                  </div>
                </div>

                {/* Owner Details */}
                <div className="pt-2 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Araç Sahibi</label>
                      <div className="mt-1">{spotData.owner}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Telefon</label>
                      <div className="mt-1">{spotData.phone}</div>
                    </div>
                  </div>
                </div>

                {/* Parking Details */}
                <div className="pt-2 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Giriş Zamanı</label>
                      <div className="mt-1">
                        {spotData.entryTime.toLocaleString('tr-TR', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Park Süresi</label>
                      <div className="mt-1">
                        {formatDistanceToNow(spotData.entryTime, { 
                          addSuffix: true,
                          locale: tr 
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* History Section */}
                {spotData.history && (
                  <div className="pt-2 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Araç Geçmişi</label>
                    <div className="bg-gray-50 rounded-md p-2 max-h-40 overflow-y-auto">
                      <div className="space-y-2">
                        {spotData.history.map((record, index) => (
                          <div 
                            key={index} 
                            className="flex items-center text-sm border-b border-gray-200 last:border-0 py-1"
                          >
                            <span className={`
                              w-20 font-medium
                              ${record.type === 'entry' ? 'text-green-600' : 'text-red-600'}
                            `}>
                              {record.type === 'entry' ? 'Giriş' : 'Çıkış'}
                            </span>
                            <span className="text-gray-600 ml-2">
                              {new Date(record.date).toLocaleString('tr-TR', {
                                dateStyle: 'short',
                                timeStyle: 'short'
                              })}
                            </span>
                            <span className="text-gray-500 ml-2">
                              ({record.spot})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* CCTV Image */}
              <div className="relative h-48 md:h-full">
                <Image
                  src={spotData.image}
                  alt="CCTV Görüntüsü"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-md text-sm font-medium"
            >
              Kapat
            </button>
            <button
              onClick={() => {
                console.log('Çıkış işlemi başlatıldı', spotData.licensePlate);
                onClose();
              }}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md text-sm font-medium"
            >
              Çıkış İşlemi
            </button>
          </div>
        </div>
      </div>
    );
  };

  const styles = `
    .custom-datepicker {
      font-family: inherit;
    }
    
    .react-datepicker {
      font-family: inherit;
      border-radius: 0.5rem;
      border: none;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    
    .react-datepicker__header {
      background-color: white;
      border-bottom: 1px solid #e5e7eb;
      border-top-left-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
      padding-top: 0.5rem;
    }
    
    .react-datepicker__day--selected {
      background-color: #2563eb !important;
      border-radius: 0.375rem;
    }
    
    .react-datepicker__day:hover {
      border-radius: 0.375rem;
    }
    
    .react-datepicker__day--keyboard-selected {
      background-color: #93c5fd !important;
      border-radius: 0.375rem;
    }
    
    .react-datepicker__month-select,
    .react-datepicker__year-select {
      padding: 0.25rem;
      border-radius: 0.375rem;
      border: 1px solid #e5e7eb;
    }
  `;

  return (
    <div className="flex h-screen text-gray-900" style={{backgroundColor: "#F3F4F6"}}>
      <Sidebar selectedItem={1} />
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center flex-row justify-between mx-8 my-8">
          <h2 className="text-2xl font-semibold">Otopark Haritası</h2>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Boş Park Yeri: {getCurrentLevelStats().available} / {getCurrentLevelStats().total}
            </div>
            <select 
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={currentLevel}
              onChange={(e) => setCurrentLevel(Number(e.target.value))}
            >
              {Object.keys(parkingLevels).map((level) => (
                <option key={level} value={level}>
                  {parkingLevels[level].title}
                </option>
              ))}
            </select>
          </div>
        </div>


        <div className="px-8 py-4">
          <div className="mr-8 bg-white bg-opacity-50 rounded-lg shadow p-4 border-gray-100 border">
            <div className="w-full aspect-square">
              <Grid>
                {Object.entries(parkingLevels[currentLevel].sections).map(([key, section]) => (
                  <GridItem key={key} section={section} />
                ))}
              </Grid>
            </div>
          </div>
        </div>
        
        {/* Parking Spot Popup */}
        {showPopup && selectedSpot && (
          <ParkingSpotPopup 
            spot={selectedSpot} 
            onClose={() => setShowPopup(false)} 
          />
        )}
      </div>
      <style jsx global>
        {styles}
      </style>
    </div>
  );
}