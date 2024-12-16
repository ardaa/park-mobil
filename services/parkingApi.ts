import { MallInfo, FloorData, ParkingDataType } from '../types/parking';

export const mockMallInfo: MallInfo = {
  name: "Forum İstanbul AVM",
  address: "Kocatepe, Paşa Cd. No:3/5, 34045 Bayrampaşa/İstanbul",
  openHours: "10:00 - 22:00",
  totalSpots: 250,
  availableSpots: 85,
  image: "/mall-image.jpg"
};

export const mockFloorData: FloorData[] = [
  { floorNumber: 1, capacity: 100, occupied: 85, title: "1. Kat" },
  { floorNumber: 2, capacity: 100, occupied: 58, title: "2. Kat" },
  { floorNumber: 3, capacity: 100, occupied: 22, title: "3. Kat" },
];

export const mockParkingData: ParkingDataType = {
  1: {
    title: "1. Kat",
    sections: {
      "zone-a": {
        title: "A Bölgesi",
        color: "rgba(240, 245, 255, 0.7)",
        spots: [
          { 
            id: "A1", 
            x: 2,
            y: 2,
            occupied: true,
            licensePlate: "34 ABC 123",
            entryTime: new Date(2024, 2, 10, 14, 30),
            image: "/cctv-1.jpg"
          },
          { id: "A2", x: 2, y: 3, occupied: false },
          { 
            id: "A3",
            x: 2,
            y: 4, 
            occupied: true,
            licensePlate: "34 DEF 456",
            entryTime: new Date(2024, 2, 11, 9, 15),
            image: "/cctv-1.jpg"
          },
          { id: "A4", x: 2, y: 5, occupied: false },
          { id: "A5", x: 2, y: 6, occupied: true },
          { id: "A6", x: 2, y: 7, occupied: false },
          { id: "A7", x: 2, y: 8, occupied: true },
          { id: "A8", x: 2, y: 9, occupied: false }
        ],
        bounds: { x: 1, y: 1, width: 3, height: 10 }
      },
      "zone-b": {
        title: "B Bölgesi",
        color: "rgba(240, 255, 245, 0.7)", 
        spots: [
          { id: "B1", x: 6, y: 2, occupied: false },
          { id: "B2", x: 6, y: 3, occupied: true },
          { id: "B3", x: 6, y: 4, occupied: false },
          { id: "B4", x: 6, y: 5, occupied: true },
          { id: "B5", x: 6, y: 6, occupied: false },
          { id: "B6", x: 6, y: 7, occupied: true },
          { id: "B7", x: 6, y: 8, occupied: false },
          { id: "B8", x: 6, y: 9, occupied: true }
        ],
        bounds: { x: 5, y: 1, width: 3, height: 10 }
      },
      "zone-c": {
        title: "C Bölgesi",
        color: "rgba(250, 240, 255, 0.7)",
        spots: [
          { id: "C1", x: 10, y: 2, occupied: false },
          { id: "C2", x: 10, y: 3, occupied: true },
          { id: "C3", x: 10, y: 4, occupied: false },
          { id: "C4", x: 10, y: 5, occupied: true },
          { id: "C5", x: 10, y: 6, occupied: false },
          { id: "C6", x: 10, y: 7, occupied: true },
          { id: "C7", x: 10, y: 8, occupied: false },
          { id: "C8", x: 10, y: 9, occupied: true }
        ],
        bounds: { x: 9, y: 1, width: 3, height: 10 }
      },
      "vip-zone": {
        title: "VIP Bölgesi",
        color: "rgba(255, 240, 240, 0.7)",
        spots: [
          { id: "V1", x: 14, y: 2, occupied: false },
          { id: "V2", x: 14, y: 3, occupied: true },
          { id: "V3", x: 14, y: 4, occupied: false },
          { id: "V4", x: 14, y: 5, occupied: true },
          { id: "V5", x: 14, y: 6, occupied: false }
        ],
        bounds: { x: 13, y: 1, width: 3, height: 7 }
      },
      "handicap-zone": {
        title: "Engelli Parkı",
        color: "rgba(240, 240, 255, 0.7)",
        spots: [
          { id: "H1", x: 18, y: 2, occupied: false },
          { id: "H2", x: 18, y: 3, occupied: true },
          { id: "H3", x: 18, y: 4, occupied: false },
          { id: "H4", x: 18, y: 5, occupied: true }
        ],
        bounds: { x: 17, y: 1, width: 3, height: 6 }
      },
      "entrance": {
        title: "Giriş",
        color: "rgba(230, 240, 255, 0.7)",
        isMarker: true,
        bounds: { x: 0, y: 12, width: 2, height: 2 },
        icon: "→"
      },
      "exit": {
        title: "Çıkış", 
        color: "rgba(255, 240, 230, 0.7)",
        isMarker: true,
        bounds: { x: 20, y: 12, width: 2, height: 2 },
        icon: "←"
      }
    }
  },
  2: {
    title: "2. Kat",
    sections: {
      "zone-a": {
        title: "A Bölgesi",
        color: "rgba(240, 245, 255, 0.7)",
        spots: [
          { id: "2A1", x: 2, y: 2, occupied: false },
          { id: "2A2", x: 2, y: 3, occupied: true },
          { id: "2A3", x: 2, y: 4, occupied: false },
          { id: "2A4", x: 2, y: 5, occupied: true },
          { id: "2A5", x: 2, y: 6, occupied: false },
          { id: "2A6", x: 2, y: 7, occupied: true },
          { id: "2A7", x: 2, y: 8, occupied: false },
          { id: "2A8", x: 2, y: 9, occupied: true }
        ],
        bounds: { x: 1, y: 1, width: 3, height: 10 }
      }
    }
  },
  3: {
    title: "3. Kat",
    sections: {
      "zone-a": {
        title: "A Bölgesi",
        color: "rgba(240, 245, 255, 0.7)",
        spots: [
          { id: "3A1", x: 2, y: 2, occupied: true },
          { id: "3A2", x: 2, y: 3, occupied: false },
          { id: "3A3", x: 2, y: 4, occupied: true },
          { id: "3A4", x: 2, y: 5, occupied: false },
          { id: "3A5", x: 2, y: 6, occupied: true },
          { id: "3A6", x: 2, y: 7, occupied: false },
          { id: "3A7", x: 2, y: 8, occupied: true },
          { id: "3A8", x: 2, y: 9, occupied: false }
        ],
        bounds: { x: 1, y: 1, width: 3, height: 10 }
      }
    }
  },
    "B1": {
    title: "3. Kat",
    sections: {
      "zone-a": {
        title: "A Bölgesi",
        color: "rgba(240, 245, 255, 0.7)",
        spots: [
          { id: "3A1", x: 2, y: 2, occupied: true },
          { id: "3A2", x: 2, y: 3, occupied: false },
          { id: "3A3", x: 2, y: 4, occupied: true },
          { id: "3A4", x: 2, y: 5, occupied: false },
          { id: "3A5", x: 2, y: 6, occupied: true },
          { id: "3A6", x: 2, y: 7, occupied: false },
          { id: "3A7", x: 2, y: 8, occupied: true },
          { id: "3A8", x: 2, y: 9, occupied: false }
        ],
        bounds: { x: 1, y: 1, width: 3, height: 10 }
      }
    }
  },
  "B2": {
  title: "3. Kat",
  sections: {
    "zone-a": {
      title: "A Bölgesi",
      color: "rgba(240, 245, 255, 0.7)",
      spots: [
        { id: "3A1", x: 2, y: 2, occupied: true },
        { id: "3A2", x: 2, y: 3, occupied: false },
        { id: "3A3", x: 2, y: 4, occupied: true },
        { id: "3A4", x: 2, y: 5, occupied: false },
        { id: "3A5", x: 2, y: 6, occupied: true },
        { id: "3A6", x: 2, y: 7, occupied: false },
        { id: "3A7", x: 2, y: 8, occupied: true },
        { id: "3A8", x: 2, y: 9, occupied: false }
      ],
      bounds: { x: 1, y: 1, width: 3, height: 10 }
    }
  }
}
};

export const ParkingApi = {
  getMallInfo: async (): Promise<MallInfo> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockMallInfo;
  },

  getFloorData: async (): Promise<FloorData[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockFloorData;
  },

  getParkingData: async (): Promise<ParkingDataType> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockParkingData;
  }
}; 