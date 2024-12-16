export type Point = { x: number; y: number };
export type Node = { point: Point; f: number; g: number; parent?: Node };
export type Direction = 'up' | 'down' | 'left' | 'right';
export type NavigationInstruction = {
  direction: Direction;
  distance: number;
};

export type FloorData = {
  floorNumber: number | string;
  capacity: number;
  occupied: number;
  title: string;
};

export type MallInfo = {
  name: string;
  address: string;
  openHours: string;
  totalSpots: number;
  availableSpots: number;
  image: string;
};

export type ParkingSpot = {
  id: string;
  x: number;
  y: number;
  occupied: boolean;
  licensePlate?: string;
  entryTime?: Date;
  image?: string;
};

export type SectionBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ParkingSection = {
  title: string;
  color: string;
  spots: ParkingSpot[];
  bounds: SectionBounds;
  isMarker?: boolean;
  icon?: string;
};

export type FloorSection = {
  title: string;
  sections: {
    [key: string]: ParkingSection;
  };
};

export type ParkingDataType = {
  [key: number]: FloorSection;
}; 