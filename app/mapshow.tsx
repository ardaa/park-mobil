import { View, ScrollView, Text, StyleSheet, Pressable, Dimensions, Modal, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useRef, useEffect } from 'react';
import { PanGestureHandler, PinchGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDecay,
  cancelAnimation,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ParkingApi } from '../services/parkingApi';
import { MallInfo, FloorData, ParkingDataType } from '../types/parking';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

const GRID_SIZE = 40;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const INITIAL_SCALE = 0.6;
const INITIAL_X = -SCREEN_WIDTH * 0.5;
const INITIAL_Y = -SCREEN_WIDTH * 0.3;
const GRID_CELL_SIZE = SCREEN_WIDTH * 4 / GRID_SIZE;
const START_POSITION = { x: 2, y: 2 };
const GRID_COLOR = 'rgba(224, 224, 224, 0.3)'; // Very light gray with transparency
const MAJOR_GRID_COLOR = 'rgba(224, 224, 224, 0.5)'; // Slightly darker for major grid lines
const MAJOR_GRID_INTERVAL = 5; // Show darker lines every 5 cells

type Point = { x: number; y: number };
type Node = { point: Point; f: number; g: number; parent?: Node };
type Direction = 'up' | 'down' | 'left' | 'right';
type NavigationInstruction = {
  direction: Direction;
  distance: number;
};

type FloorData = {
  floorNumber: number | string;
  capacity: number;
  occupied: number;
  title: string;
};

type MallInfo = {
  name: string;
  address: string;
  openHours: string;
  totalSpots: number;
  availableSpots: number;
  image: string; // URL to mall image
};

type ParkingSpot = {
  id: string;
  x: number;
  y: number;
  occupied: boolean;
  licensePlate?: string;
  entryTime?: Date;
  image?: string;
};

type SectionBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type ParkingSection = {
  title: string;
  color: string;
  spots: ParkingSpot[];
  bounds: SectionBounds;
  isMarker?: boolean;
  markers?: {
    stairs?: StairMarker[];
    entrance?: { x: number; y: number }[];
  };
};

type FloorSection = {
  title: string;
  sections: {
    [key: string]: ParkingSection;
  };
};

type ParkingDataType = {
  [key: number]: FloorSection;
};

const getRandomSpot = (parkingData: ParkingDataType, currentLevel: number): ParkingSpot | null => {
  const sections = parkingData[currentLevel].sections;
  const occupiedSpots: ParkingSpot[] = [];

  // Collect all occupied spots
  Object.values(sections).forEach(section => {
    if (section.spots) {
      section.spots
        .filter(spot => spot.occupied)
        .forEach(spot => occupiedSpots.push(spot));
    }
  });

  // Return a random occupied spot or null if none found
  return occupiedSpots.length > 0 
    ? occupiedSpots[Math.floor(Math.random() * occupiedSpots.length)]
    : null;
};

const FloorButton = ({ 
  floor, 
  isSelected = false,
  onPress 
}: { 
  floor: FloorData, 
  isSelected?: boolean,
  onPress: () => void
}) => {
  const { t } = useTranslation();
  const occupancyPercentage = (floor.occupied / floor.capacity) * 100;
  
  // Calculate color based on occupancy
  const getOccupancyColor = () => {
    if (occupancyPercentage <= 50) return '#4CAF50'; // Green for low occupancy
    if (occupancyPercentage <= 80) return '#FFA726'; // Orange for medium occupancy
    return '#EF5350'; // Red for high occupancy
  };

  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[
        styles.floorButtonContainer,
        isSelected && styles.floorButtonContainerSelected
      ]}
    >
      <View style={styles.floorButton}>
        <Text style={[
          styles.floorNumber,
          isSelected && styles.floorNumberSelected
        ]}>{floor.floorNumber}</Text>
        <Text style={[
          styles.floorTitle,
          isSelected && styles.floorTitleSelected
        ]}>{floor.title}</Text>
      </View>
      <View style={[
        styles.capacityBar,
        isSelected && styles.capacityBarSelected
      ]}>
        <View 
          style={[
            styles.capacityFill,
            { 
              width: `${occupancyPercentage}%`,
              backgroundColor: getOccupancyColor(),
            },
            isSelected && {
              opacity: 0.9 // Slightly reduce opacity when selected for better contrast
            }
          ]} 
        />
      </View>
      <Text style={[
        styles.capacityText,
        isSelected && styles.capacityTextSelected
      ]}>{t('findParking.occupancyPercentage', { percentage: Math.round(occupancyPercentage) })}</Text>
    </TouchableOpacity>
  );
};

const MallInfoModal = ({ 
  visible, 
  onClose,
  floors,
  mallInfo,
  currentLevel,
  onFloorSelect 
}: { 
  visible: boolean;
  onClose: () => void;
  floors: FloorData[];
  mallInfo: MallInfo;
  currentLevel: number | string;
  onFloorSelect: (floorNumber: number | string) => void;
}) => {
  const { t } = useTranslation();
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.mallInfoContainer}>
        <View style={styles.mallInfoContent}>
          <View style={styles.modalHandle} />
          
          {/* Mall Info Section */}
          <View style={styles.mallHeaderSection}>
            <Text style={styles.mallName}>{mallInfo.name}</Text>
            <View style={styles.mallDetailsRow}>
              <MaterialIcons name="access-time" size={16} color="#666" />
              <Text style={styles.mallDetailText}>{mallInfo.openHours}</Text>
            </View>
            <View style={styles.mallDetailsRow}>
              <MaterialIcons name="location-on" size={16} color="#666" />
              <Text style={styles.mallDetailText}>{mallInfo.address}</Text>
            </View>
            <View style={styles.spotsSummary}>
              <View style={styles.spotsSummaryItem}>
                <Text style={styles.spotsNumber}>{mallInfo.availableSpots}</Text>
                <Text style={styles.spotsLabel}>{t('findParking.available')}</Text>
              </View>
              <View style={styles.spotsDivider} />
              <View style={styles.spotsSummaryItem}>
                <Text style={styles.spotsNumber}>{mallInfo.totalSpots}</Text>
                <Text style={styles.spotsLabel}>{t('findParking.total')}</Text>
              </View>
            </View>
          </View>

          {/* Floor Selection Section */}
          <View style={styles.floorSectionContainer}>
            <Text style={styles.floorSectionTitle}>{t('findParking.floors')}</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.floorsScrollContainer}
            >
              {floors.map((floor) => (
                <View key={floor.floorNumber}>
                  <FloorButton 
                    floor={floor} 
                    isSelected={floor.floorNumber === currentLevel}
                    onPress={() => {
                      onFloorSelect(floor.floorNumber);
                    }}
                  />
                </View>
              ))}
            </ScrollView>
          </View>

          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>{t('common.ok')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const SearchBar = ({ 
  onPress, 
  visible, 
  onFindMyCar, 
  onFindEmptySpot,
  isCarParked 
}: { 
  onPress: () => void, 
  visible: boolean,
  onFindMyCar?: () => void,
  onFindEmptySpot?: () => void,
  isCarParked: boolean
}) => {
  const { t } = useTranslation();
  
  return visible ? (
    <View style={styles.searchBarWrapper}>
      <TouchableOpacity 
        style={[styles.findMyCarButton, !isCarParked && styles.findEmptySpotButton]}
        onPress={isCarParked ? onFindMyCar : onFindEmptySpot}
      >
        <MaterialIcons 
          name={isCarParked ? "directions-car" : "local-parking"} 
          size={20} 
          color="white" 
        />
        <Text style={styles.findMyCarText}>
          {isCarParked ? t('findParking.goToCar') : t('home.menu.findParking')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.searchBarContainer}
        onPress={onPress}
      >
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={24} color="#666" />
          <Text style={styles.searchPlaceholder}>{t('findParking.searchPlaceholder')}</Text>
        </View>
      </TouchableOpacity>
    </View>
  ) : null;
};

const MapControls = () => (
  <View style={styles.mapControls}>
    <TouchableOpacity style={styles.mapControlButton}>
      <MaterialIcons name="add" size={24} color="#666" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.mapControlButton}>
      <MaterialIcons name="remove" size={24} color="#666" />
    </TouchableOpacity>
  </View>
);

const RoutePreview = ({ 
  distance, 
  estimatedTime, 
  onStartNavigation, 
  onCancel,
  floorNumber,
  spotId
}: { 
  distance: number;
  estimatedTime: number;
  onStartNavigation: () => void;
  onCancel: () => void;
  floorNumber: number | string;
  spotId: string;
}) => (
  <View style={styles.routePreviewContainer}>
    <View style={styles.routePreviewHeader}>
      <TouchableOpacity onPress={onCancel} style={styles.backButton}>
        <MaterialIcons name="arrow-back" size={24} color="#666" />
      </TouchableOpacity>
      <View style={styles.routeInfo}>
        <Text style={styles.routeDistance}>{distance}m</Text>
        <Text style={styles.routeTime}>{estimatedTime} saniye</Text>
        <View style={styles.spotInfo}>
          <Text style={styles.spotInfoText}>
            Kat {floorNumber} • Park Yeri {spotId}
          </Text>
        </View>
      </View>
    </View>
    <TouchableOpacity 
      style={styles.startNavigationButton}
      onPress={onStartNavigation}
    >
      <MaterialIcons name="navigation" size={24} color="white" />
      <Text style={styles.startNavigationText}>Navigasyonu Başlat</Text>
    </TouchableOpacity>
  </View>
);

const ArrivalPanel = ({ onClose }: { onClose: () => void }) => (
  <View style={styles.arrivalPanelContainer}>
    <View style={styles.arrivalPanelHeader}>
      <TouchableOpacity onPress={onClose} style={styles.backButton}>
        <MaterialIcons name="arrow-back" size={24} color="#666" />
      </TouchableOpacity>
      <View style={styles.arrivalInfo}>
        <View style={styles.arrivalIconRow}>
          <View style={styles.arrivalIconContainer}>
            <MaterialIcons name="check-circle" size={32} color="#4CAF50" />
          </View>
          <Text style={styles.arrivalTitle}>Hedefe Ulaştınız!</Text>
        </View>
        <Text style={styles.arrivalSubtitle}>Park yerinize hoş geldiniz</Text>
      </View>
    </View>
    <TouchableOpacity 
      style={styles.arrivalButton}
      onPress={onClose}
    >
      <MaterialIcons name="done" size={24} color="white" />
      <Text style={styles.arrivalButtonText}>Navigasyonu Bitir</Text>
    </TouchableOpacity>
  </View>
);

const Header = ({ mallInfo }: { mallInfo: MallInfo | null }) => {
  const { t } = useTranslation();
  
  return (
    <View style={[styles.headerContainer, { backgroundColor: '#1C0CCE' }]}>
      <View style={styles.headerContent}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: 'white' }]}>{mallInfo?.name}</Text>
          <View style={[styles.headerBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <MaterialIcons name="local-parking" size={16} color="white" />
            <Text style={[styles.headerBadgeText, { color: 'white' }]}>
              {t('findParking.availableSpots', { count: mallInfo?.availableSpots || 0 })}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.headerButton}>
          <MaterialIcons name="notifications-none" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const StairMarker = ({ stair }: { stair: StairMarker }) => {
  return (
    <View
      style={[
        styles.stairMarker,
        {
          left: `${(stair.x / GRID_SIZE) * 100}%`,
          top: `${(stair.y / GRID_SIZE) * 100}%`,
          zIndex: 1000,
        },
      ]}
    >
      <MaterialIcons name="stairs" size={24} color="#5C6BC0" />
    </View>
  );
};

const ParkingSection = ({ 
  section, 
  onSpotPress 
}: { 
  section: ParkingSection;
  onSpotPress: (spotId: string) => void;
}) => {
  const { bounds, spots, title, color, markers } = section;
  
  return (
    <>
      {/* Section Background */}
      <View
        style={[
          styles.section,
          {
            left: `${(bounds.x / GRID_SIZE) * 100}%`,
            top: `${(bounds.y / GRID_SIZE) * 100}%`,
            width: `${(bounds.width / GRID_SIZE) * 100}%`,
            height: `${(bounds.height / GRID_SIZE) * 100}%`,
            backgroundColor: color,
          },
        ]}
      />
      
      {/* Section Title */}
      <View
        style={[
          styles.sectionTitleContainer,
          {
            left: `${(bounds.x / GRID_SIZE) * 100}%`,
            top: `${((bounds.y - 0.8) / GRID_SIZE) * 100}%`,
            width: `${(bounds.width / GRID_SIZE) * 100}%`,
          },
        ]}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>

      {/* Render spots if they exist */}
      {spots?.map((spot) => (
        <Pressable
          key={spot.id}
          style={({ pressed }) => [
            styles.spot,
            spot.occupied ? styles.occupied : styles.available,
            {
              left: `${(spot.x / GRID_SIZE) * 100}%`,
              top: `${(spot.y / GRID_SIZE) * 100}%`,
              width: `${(1 / GRID_SIZE) * 100}%`,
              height: `${(1 / GRID_SIZE) * 100}%`,
              transform: [{ scale: pressed ? 0.95 : 1 }],
              opacity: pressed ? 0.9 : 1,
            },
          ]}
          onPress={() => onSpotPress(spot.id)}
        >
          <Text style={styles.spotText}>{spot.id}</Text>
        </Pressable>
      ))}
      
      {/* Render stairs if present */}
      {markers?.stairs?.map((stair) => (
        <StairMarker key={stair.id} stair={stair} />
      ))}
    </>
  );
};

export default function MapScreen() {
  const { isCarParked: isCarParkedParam } = useLocalSearchParams<{ isCarParked?: string }>();
  // Convert string param to boolean
  const isCarParked = isCarParkedParam === 'true';

  const [currentLevel, setCurrentLevel] = useState(1);
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);
  const translateX = useSharedValue(INITIAL_X);
  const translateY = useSharedValue(INITIAL_Y);
  const scale = useSharedValue(INITIAL_SCALE);
  const savedScale = useSharedValue(INITIAL_SCALE);
  const pinchFocal = useSharedValue({ x: 0, y: 0 });
  const velocityX = useSharedValue(0);
  const velocityY = useSharedValue(0);
  const [userPosition, setUserPosition] = useState<Point>(START_POSITION);
  const [navigationPath, setNavigationPath] = useState<Point[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const [pendingPath, setPendingPath] = useState<Point[]>([]);
  const [remainingDistance, setRemainingDistance] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [currentInstruction, setCurrentInstruction] = useState<NavigationInstruction | null>(null);
  const [showingRoutePreview, setShowingRoutePreview] = useState(false);
  const [showArrivalModal, setShowArrivalModal] = useState(false);
  const [showMallInfo, setShowMallInfo] = useState(false);
  const [mallInfo, setMallInfo] = useState<MallInfo | null>(null);
  const [floorData, setFloorData] = useState<FloorData[]>([]);
  const [parkingData, setParkingData] = useState<ParkingDataType>({});
  const [isLoading, setIsLoading] = useState(true);
  const [userCurrentFloor, setUserCurrentFloor] = useState(1);
  const [navigationPhase, setNavigationPhase] = useState<'to-entrance' | 'change-floor' | 'to-spot' | null>(null);
  const [targetFloor, setTargetFloor] = useState<number | null>(null);

  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [mallInfoData, floorData, parkingData] = await Promise.all([
          ParkingApi.getMallInfo(),
          ParkingApi.getFloorData(),
          ParkingApi.getParkingData()
        ]);

        setMallInfo(mallInfoData);
        setFloorData(floorData);
        setParkingData(parkingData);
      } catch (error) {
        console.error('Error fetching parking data:', error);
        // Handle error appropriately
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      cancelAnimation(translateX);
      cancelAnimation(translateY);
      
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
      
      velocityX.value = event.velocityX;
      velocityY.value = event.velocityY;
    },
    onEnd: () => {
      const maxX = 0;
      const minX = -SCREEN_WIDTH * 3;
      const maxY = 0;
      const minY = -SCREEN_WIDTH * 3;

      translateX.value = withSpring(
        Math.min(Math.max(translateX.value + velocityX.value / 10, minX), maxX)
      );
      
      translateY.value = withSpring(
        Math.min(Math.max(translateY.value + velocityY.value / 10, minY), maxY)
      );
    },
  });
  const pinchGestureHandler = useAnimatedGestureHandler({
    onStart: (event, ctx: any) => {
      cancelAnimation(scale);
      cancelAnimation(translateX);
      cancelAnimation(translateY);
      ctx.startScale = scale.value;
      ctx.startTranslateX = translateX.value;
      ctx.startTranslateY = translateY.value;
      pinchFocal.value = { x: event.focalX, y: event.focalY };
    },
    onActive: (event, ctx) => {
      const newScale = savedScale.value * event.scale;
      scale.value = Math.min(Math.max(newScale, 0.5), 3);

      // Adjust translation to keep map in view
      const maxX = 0;
      const minX = -SCREEN_WIDTH * 3 * scale.value;
      const maxY = 0; 
      const minY = -SCREEN_WIDTH * 3 * scale.value;

      translateX.value = Math.min(Math.max(ctx.startTranslateX, minX), maxX);
      translateY.value = Math.min(Math.max(ctx.startTranslateY, minY), maxY);
    },
    onEnd: () => {
      savedScale.value = scale.value;

      // Final bounds check
      const maxX = 0;
      const minX = -SCREEN_WIDTH * 3 * scale.value;
      const maxY = 0;
      const minY = -SCREEN_WIDTH * 3 * scale.value;

      translateX.value = withSpring(
        Math.min(Math.max(translateX.value, minX), maxX)
      );
      translateY.value = withSpring(
        Math.min(Math.max(translateY.value, minY), maxY)
      );
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  const GridLines = () => {
    return (
      <View style={styles.gridContainer}>
        {/* Vertical lines */}
        {Array.from({ length: GRID_SIZE + 1 }).map((_, i) => (
          <View
            key={`v-${i}`}
            style={[
              styles.gridLine,
              styles.verticalLine,
              { 
                left: `${(i / GRID_SIZE) * 100}%`,
                backgroundColor: i % MAJOR_GRID_INTERVAL === 0 ? MAJOR_GRID_COLOR : GRID_COLOR,
                width: i % MAJOR_GRID_INTERVAL === 0 ? 1.5 : 1,
              },
            ]}
          />
        ))}
        {/* Horizontal lines */}
        {Array.from({ length: GRID_SIZE + 1 }).map((_, i) => (
          <View
            key={`h-${i}`}
            style={[
              styles.gridLine,
              styles.horizontalLine,
              {
                top: `${(i / GRID_SIZE) * 100}%`,
                backgroundColor: i % MAJOR_GRID_INTERVAL === 0 ? MAJOR_GRID_COLOR : GRID_COLOR,
                height: i % MAJOR_GRID_INTERVAL === 0 ? 1.5 : 1,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  const getNeighbors = (point: Point): Point[] => {
    const directions = [
      { x: 0, y: 1 }, { x: 1, y: 0 },
      { x: 0, y: -1 }, { x: -1, y: 0 }
    ];
    
    return directions
      .map(dir => ({
        x: point.x + dir.x,
        y: point.y + dir.y
      }))
      .filter(p => 
        p.x >= 0 && p.x < GRID_SIZE &&
        p.y >= 0 && p.y < GRID_SIZE
      );
  };

  const manhattanDistance = (a: Point, b: Point): number => {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  };

  const findPath = (start: Point, end: Point, sections: any, targetSection: any) => {
    const openSet: Node[] = [{
      point: start,
      g: 0,
      f: manhattanDistance(start, end)
    }];
    const closedSet = new Set<string>();
    const cameFrom = new Map<string, Node>();

    while (openSet.length > 0) {
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift()!;
      const currentKey = `${current.point.x},${current.point.y}`;

      if (current.point.x === end.x && current.point.y === end.y) {
        const path: Point[] = [];
        let currentNode: Node | undefined = current;
        while (currentNode) {
          path.unshift(currentNode.point);
          currentNode = cameFrom.get(`${currentNode.point.x},${currentNode.point.y}`);
        }
        return path;
      }

      closedSet.add(currentKey);

      // Get valid neighbors without obstacle checking
      const neighbors = getNeighbors(current.point);

      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.x},${neighbor.y}`;
        if (closedSet.has(neighborKey)) continue;

        const g = current.g + 1;
        const h = manhattanDistance(neighbor, end);
        const f = g + h;

        const neighborNode: Node = {
          point: neighbor,
          g,
          f,
          parent: current
        };

        const existingOpenNode = openSet.find(
          node => `${node.point.x},${node.point.y}` === neighborKey
        );

        if (!existingOpenNode) {
          openSet.push(neighborNode);
          cameFrom.set(neighborKey, current);
        } else if (g < existingOpenNode.g) {
          existingOpenNode.g = g;
          existingOpenNode.f = f;
          cameFrom.set(neighborKey, current);
        }
      }
    }

    console.log('No path found');
    return null;
  };

  const handleSpotSelection = (spotId: string) => {
    console.log('Spot selected:', spotId);
    setSelectedSpot(spotId);
    
    let targetSpot: ParkingSpot | null = null;
    const targetFloor = currentLevel;

    // Find the target spot
    Object.entries(parkingData[currentLevel].sections).forEach(([_, section]) => {
      if (!section.spots || section.isMarker) return;
      
      const spot = section.spots.find((s) => s.id === spotId);
      if (spot) {
        targetSpot = spot;
      }
    });

    if (!targetSpot) return;

    // Switch to user's current floor when starting navigation
    setCurrentLevel(userCurrentFloor);

    if (targetFloor === userCurrentFloor) {
      // Same floor - direct navigation
      const path = findPath(
        userPosition,
        { x: targetSpot.x, y: targetSpot.y },
        parkingData[userCurrentFloor].sections
      );
      
      if (path) {
        setPendingPath(path);
        setNavigationPath(path);
        setNavigationPhase('to-spot');
        zoomToShowPath();
        setShowingRoutePreview(true);
      }
    } else {
      // Different floor - find nearest stairs
      let stairs: StairMarker | null = null;
      Object.values(parkingData[userCurrentFloor].sections).forEach(section => {
        if (section.markers?.stairs) {
          stairs = section.markers.stairs[0];
        }
      });

      if (stairs) {
        const pathToStairs = findPath(
          userPosition,
          { x: stairs.x, y: stairs.y },
          parkingData[userCurrentFloor].sections
        );
        
        if (pathToStairs) {
          setPendingPath(pathToStairs);
          setNavigationPath(pathToStairs);
          setNavigationPhase('to-stairs');
          setTargetFloor(targetFloor);
          zoomToShowPath();
          setShowingRoutePreview(true);
        }
      }
    }
  };

  const UserMarker = () => {
    // Only render user marker if we're viewing their current floor
    if (currentLevel !== userCurrentFloor) return null;

    return (
      <View
        style={[
          styles.userMarker,
          {
            left: `${(userPosition.x / GRID_SIZE) * 100}%`,
            top: `${(userPosition.y / GRID_SIZE) * 100}%`,
            zIndex: 1000,
          },
        ]}
      />
    );
  };

  const NavigationPath = () => {
    // Only show navigation path on user's current floor
    if (currentLevel !== userCurrentFloor) return null;

    return (
      <>
        {/* Draw path lines between points */}
        {navigationPath.map((point, index) => {
          if (index === navigationPath.length - 1) return null;
          
          const nextPoint = navigationPath[index + 1];
          const x1 = (point.x / GRID_SIZE) * 100;
          const y1 = (point.y / GRID_SIZE) * 100;
          const x2 = (nextPoint.x / GRID_SIZE) * 100;
          const y2 = (nextPoint.y / GRID_SIZE) * 100;
          
          // Calculate line dimensions and position
          const isHorizontal = y1 === y2;
          const width = isHorizontal ? Math.abs(x2 - x1) : 0.2; // Thinner lines
          const height = isHorizontal ? 0.2 : Math.abs(y2 - y1); // Thinner lines
          
          // Calculate the correct position for the line
          const left = isHorizontal ? Math.min(x1, x2) : x1;
          const top = isHorizontal ? y1 : Math.min(y1, y2);
          
          return (
            <View
              key={`line-${index}`}
              style={[
                styles.pathLine,
                {
                  left: `${left}%`,
                  top: `${top}%`,
                  width: `${width}%`,
                  height: `${height}%`,
                  transform: [
                    { translateX: isHorizontal ? 0 : -0.1 }, // Adjust for thinner lines
                    { translateY: isHorizontal ? -0.1 : 0 }  // Adjust for thinner lines
                  ],
                  zIndex: 999,
                }
              ]}
            />
          );
        })}

        {/* Draw all path points */}
        {navigationPath.map((point, index) => (
          <View
            key={`point-${index}`}
            style={[
              styles.pathPoint,
              {
                left: `${(point.x / GRID_SIZE) * 100}%`,
                top: `${(point.y / GRID_SIZE) * 100}%`,
                width: index === navigationPath.length - 1 ? 12 : 6, // Smaller points
                height: index === navigationPath.length - 1 ? 12 : 6, // Smaller points
                transform: [
                  { translateX: index === navigationPath.length - 1 ? -6 : -3 },
                  { translateY: index === navigationPath.length - 1 ? -6 : -3 }
                ],
                zIndex: 1000,
              },
            ]}
          />
        ))}
      </>
    );
  };

  const zoomToUser = () => {
    scale.value = 1.2;
    savedScale.value = 1.2;
    
    const userX = -(userPosition.x / GRID_SIZE) * SCREEN_WIDTH * 4 + SCREEN_WIDTH / 2;
    const userY = -(userPosition.y / GRID_SIZE) * SCREEN_WIDTH * 4 + SCREEN_HEIGHT / 2;
    
    translateX.value = withTiming(userX, {
      duration: 500,
      easing: Easing.linear
    });
    translateY.value = withTiming(userY, {
      duration: 500,
      easing: Easing.linear
    });
  };

  const zoomToShowPath = () => {
    scale.value = withTiming(0.4, {
      duration: 500,
      easing: Easing.linear
    });
    savedScale.value = 0.4;
    
    translateX.value = withTiming(-SCREEN_WIDTH, {
      duration: 500,
      easing: Easing.linear
    });
    translateY.value = withTiming(-SCREEN_WIDTH, {
      duration: 500,
      easing: Easing.linear
    });
  };

  const zoomToUserWithSpring = () => {
    const newScale = 1.2;
    scale.value = withTiming(newScale, {
      duration: 500,
      easing: Easing.linear
    });
    savedScale.value = newScale;
    
    const userX = -(userPosition.x / GRID_SIZE) * SCREEN_WIDTH * 4 + SCREEN_WIDTH / 2;
    const userY = -(userPosition.y / GRID_SIZE) * SCREEN_WIDTH * 4 + SCREEN_HEIGHT / 2;
    
    translateX.value = withTiming(userX, {
      duration: 500,
      easing: Easing.linear
    });
    translateY.value = withTiming(userY, {
      duration: 500,
      easing: Easing.linear
    });
  };

  const startNavigation = () => {
    setIsNavigating(true);
    setCurrentPathIndex(0);
    setNavigationPath(pendingPath);
    zoomToUser();
  };

  const getDirection = (from: Point, to: Point): Direction => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 'right' : 'left';
    }
    return dy > 0 ? 'down' : 'up';
  };

  const NavigationControlPanel = () => {
    if (!isNavigating) return null;

    const getDirectionIcon = (direction: Direction) => {
      switch (direction) {
        case 'up':
          return 'keyboard-arrow-up';
        case 'down':
          return 'keyboard-arrow-down';
        case 'left':
          return 'keyboard-arrow-left';
        case 'right':
          return 'keyboard-arrow-right';
        default:
          return 'location-on';
      }
    };

    const currentDirection = currentPathIndex < navigationPath.length - 1
      ? getDirection(navigationPath[currentPathIndex], navigationPath[currentPathIndex + 1])
      : null;

    const getNavigationMessage = () => {
      if (navigationPhase === 'to-stairs') {
        return t('navigation.headToStairs', { floor: targetFloor });
      } else if (navigationPhase === 'change-floor') {
        return t('navigation.takeStairs', { floor: targetFloor });
      } else if (navigationPhase === 'to-spot') {
        if (userCurrentFloor !== currentLevel) {
          return t('navigation.headToDestination', { floor: currentLevel });
        }
        return remainingDistance > 0 
          ? t('navigation.remainingDistance', { distance: remainingDistance })
          : t('navigation.arrived');
      }
      return '';
    };

    return (
      <View style={styles.navigationPanelContainer}>
        <View style={styles.navigationPanel}>
          <View style={styles.navigationHeader}>
            <View style={styles.navigationInfo}>
              <View style={styles.directionContainer}>
                {currentDirection ? (
                  <MaterialIcons 
                    name={getDirectionIcon(currentDirection)} 
                    size={32} 
                    color="#2196F3" 
                  />
                ) : (
                  <MaterialIcons 
                    name="location-on" 
                    size={32} 
                    color="#4CAF50" 
                  />
                )}
              </View>
              <View style={styles.navigationStats}>
                <Text style={styles.navigationDistance}>
                  {remainingDistance > 0 
                    ? `${remainingDistance}m`
                    : 'Hedefe ulaştınız'}
                </Text>
                <Text style={styles.navigationTime}>
                  {remainingTime > 0 
                    ? `${remainingTime} saniye`
                    : 'Varış noktası'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setIsNavigating(false);
                setNavigationPath([]);
                setCurrentInstruction(null);
                setRemainingDistance(0);
                setRemainingTime(0);
              }}
            >
              <MaterialIcons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(currentPathIndex / Math.max(navigationPath.length - 1, 1)) * 100}%` }
                ]} 
              />
            </View>
          </View>
          <Text style={styles.navigationMessage}>{getNavigationMessage()}</Text>
        </View>
      </View>
    );
  };

  const moveUserSmoothly = (from: Point, to: Point, duration: number = 500) => {
    'worklet';
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const newX = from.x + (to.x - from.x) * progress;
      const newY = from.y + (to.y - from.y) * progress;
      
      setUserPosition({ x: newX, y: newY });
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isNavigating && currentPathIndex < navigationPath.length - 1) {
      const totalDistance = navigationPath.length - currentPathIndex;
      setRemainingDistance(totalDistance);
      setRemainingTime(totalDistance);
      
      const currentPoint = navigationPath[currentPathIndex];
      const nextPoint = navigationPath[currentPathIndex + 1];
      
      moveUserSmoothly(currentPoint, nextPoint);
      
      const moveTimeout = setTimeout(() => {
        setCurrentPathIndex(prev => {
          const newIndex = prev + 1;
          const remainingSteps = navigationPath.length - newIndex;
          setRemainingDistance(remainingSteps);
          setRemainingTime(remainingSteps);
          return newIndex;
        });
        zoomToUser();
      }, 500);
      
      return () => clearTimeout(moveTimeout);
    } else if (isNavigating && currentPathIndex === navigationPath.length - 1) {
      if (navigationPhase === 'to-stairs') {
        // At stairs - simulate floor change after delay
        setTimeout(() => {
          // Change user's floor and position
          setUserCurrentFloor(targetFloor!);
          // Switch map view to new floor
          setCurrentLevel(targetFloor!);
          
          // Find stairs on the new floor
          let stairs: StairMarker | null = null;
          Object.values(parkingData[targetFloor!].sections).forEach(section => {
            if (section.markers?.stairs && section.markers.stairs.length > 0) {
              stairs = section.markers.stairs[0];
            }
          });
          
          // Set user position to stairs
          setUserPosition({ x: stairs?.x || 0, y: stairs?.y || 0 });
          
          // Find target spot
          let targetSpot = null;
          Object.values(parkingData[targetFloor!].sections).forEach(section => {
            if (!section.spots || section.isMarker) return;
            const spot = section.spots.find(s => s.id === selectedSpot);
            if (spot) targetSpot = spot;
          });

          if (targetSpot) {
            const pathToSpot = findPath(
              { x: stairs?.x || 0, y: stairs?.y || 0 },
              { x: targetSpot.x, y: targetSpot.y },
              parkingData[targetFloor!].sections
            );
            
            if (pathToSpot) {
              setPendingPath(pathToSpot);
              setNavigationPath(pathToSpot);
              setCurrentPathIndex(0);
              setNavigationPhase('to-spot');
              setTargetFloor(null); // Clear target floor as we've reached it
              return;
            }
          }
        }, 2000);
      } else if (navigationPhase === 'to-spot') {
        setIsNavigating(false);
        setCurrentInstruction(null);
        setRemainingDistance(0);
        setRemainingTime(0);
        setShowArrivalModal(true);
        setNavigationPhase(null);
        setTargetFloor(null);
      }
    }
  }, [isNavigating, currentPathIndex, navigationPath, navigationPhase]);

  const handleFloorSelect = (floorNumber: number | string) => {
    const newLevel = typeof floorNumber === 'string' ? parseInt(floorNumber) : floorNumber;
    setCurrentLevel(newLevel);
    
    // Reset map position when changing floors
    translateX.value = withSpring(INITIAL_X);
    translateY.value = withSpring(INITIAL_Y);
    scale.value = withSpring(INITIAL_SCALE);
    savedScale.value = INITIAL_SCALE;
    
    // Clear any active navigation but DON'T change user's floor
    setNavigationPath([]);
    setIsNavigating(false);
    setShowingRoutePreview(false);
    setSelectedSpot(null);
  };

  const handleFindMyCar = () => {
    const randomSpot = getRandomSpot(parkingData, currentLevel);
    
    if (randomSpot) {
      handleSpotSelection(randomSpot.id);
    } else {
      Alert.alert(
        t('findParking.noResults'),
        t('activeParking.noActiveParking')
      );
    }
  };

  const findNearestEmptySpot = () => {
    let nearestSpot: ParkingSpot | null = null;
    let minDistance = Infinity;

    // Search all floors
    Object.entries(parkingData).forEach(([floorNum, floorData]) => {
      Object.values(floorData.sections).forEach(section => {
        if (!section.spots || section.isMarker) return;

        section.spots.forEach(spot => {
          if (!spot.occupied) {
            // If on same floor, calculate direct distance
            if (parseInt(floorNum) === userCurrentFloor) {
              const distance = manhattanDistance(userPosition, { x: spot.x, y: spot.y });
              if (distance < minDistance) {
                minDistance = distance;
                nearestSpot = spot;
              }
            } 
            // If on different floor, prioritize spots near stairs
            else {
              let stairs = null;
              Object.values(parkingData[userCurrentFloor].sections).forEach(s => {
                if (s.markers?.stairs && s.markers.stairs.length > 0) {
                  stairs = s.markers.stairs[0];
                }
              });

              if (stairs) {
                const distanceToStairs = manhattanDistance(userPosition, { x: stairs.x, y: stairs.y });
                const distanceFromStairsToSpot = manhattanDistance(
                  { x: stairs.x, y: stairs.y }, 
                  { x: spot.x, y: spot.y }
                );
                const totalDistance = distanceToStairs + distanceFromStairsToSpot;

                if (totalDistance < minDistance) {
                  minDistance = totalDistance;
                  nearestSpot = spot;
                }
              }
            }
          }
        });
      });
    });

    if (nearestSpot) {
      handleSpotSelection(nearestSpot.id);
    } else {
      Alert.alert(
        t('findParking.noResults'),
        t('activeParking.noActiveParking')
      );
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0066FF" />
          </View>
        ) : (
          <>
            <Header mallInfo={mallInfo} />
            <MapControls />
            <SearchBar 
              onPress={() => setShowMallInfo(true)} 
              visible={!showingRoutePreview && !isNavigating && !showArrivalModal}
              onFindMyCar={handleFindMyCar}
              onFindEmptySpot={findNearestEmptySpot}
              isCarParked={isCarParked}
            />
            {mallInfo && (
              <MallInfoModal
                visible={showMallInfo}
                onClose={() => setShowMallInfo(false)}
                floors={floorData}
                mallInfo={mallInfo}
                currentLevel={currentLevel}
                onFloorSelect={handleFloorSelect}
              />
            )}
            <PinchGestureHandler
              onGestureEvent={pinchGestureHandler}
              simultaneousHandlers={[panGestureHandler]}
            >
              <Animated.View>
                <PanGestureHandler
                  onGestureEvent={panGestureHandler}
                  simultaneousHandlers={[pinchGestureHandler]}
                >
                  <Animated.View style={[styles.mapContainer, animatedStyle]}>
                    <GridLines />
                    {Object.entries(parkingData[currentLevel].sections).map(([key, section]) => (
                      <ParkingSection 
                        key={key} 
                        section={section} 
                        onSpotPress={handleSpotSelection}
                      />
                    ))}
                    <NavigationPath />
                    <UserMarker />
                  </Animated.View>
                </PanGestureHandler>
              </Animated.View>
            </PinchGestureHandler>
            {showingRoutePreview && (
              <RoutePreview
                distance={pendingPath.length}
                estimatedTime={pendingPath.length}
                floorNumber={currentLevel}
                spotId={selectedSpot || ''}
                onStartNavigation={() => {
                  setShowingRoutePreview(false);
                  startNavigation();
                }}
                onCancel={() => {
                  setShowingRoutePreview(false);
                  setNavigationPath([]);
                  setSelectedSpot(null);
                }}
              />
            )}
            {isNavigating && <NavigationControlPanel />}
            {showArrivalModal && (
              <ArrivalPanel 
                onClose={() => {
                  setShowArrivalModal(false);
                  setNavigationPath([]);
                }}
              />
            )}
          </>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    textAlign: 'center',
  },
  mapContainer: {
    width: SCREEN_WIDTH * 4,
    height: SCREEN_WIDTH * 4,
    backgroundColor: 'white',
  },
  gridContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF', // Pure white background
  },
  gridLine: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  verticalLine: {
    height: '100%',
  },
  horizontalLine: {
    width: '100%',
  },
  section: {
    position: 'absolute',
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionTitleContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 10,
    transform: [{ translateY: -20 }],
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  spotsContainer: {
    flex: 1,
    gap: 4,
  },
  spotRow: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'flex-start',
  },
  spot: {
    position: 'absolute',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    zIndex: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  available: {
    backgroundColor: 'rgba(232, 245, 233, 0.95)',
    borderColor: '#4CAF50',
  },
  occupied: {
    backgroundColor: 'rgba(255, 235, 238, 0.95)',
    borderColor: '#EF5350',
  },
  selected: {
    borderWidth: 1.5,
    borderColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  spotText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#1a1a1a',
    letterSpacing: 0.2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  levelSelector: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  levelInfo: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  userMarker: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2196F3',
    borderWidth: 3,
    borderColor: 'white',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  pathPoint: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2196F3',
    opacity: 1,
    transform: [{ translateX: -3 }, { translateY: -3 }],
    zIndex: 1000,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  pathLine: {
    position: 'absolute',

    opacity: 0.6, // More transparent lines
    zIndex: 999,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#f3f4f6',
  },
  modalButtonConfirm: {
    backgroundColor: '#2196F3',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  navigationPanelContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  navigationPanel: {
    padding: 26,
  },
  navigationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navigationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  directionContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  navigationStats: {
    flex: 1,
  },
  navigationDistance: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1976D2',
    marginBottom: 4,
  },
  navigationTime: {
    fontSize: 16,
    color: '#666',
  },
  progressBarContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 2,
  },
  cancelButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EF5350',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  searchBarWrapper: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    zIndex: 1000,
    gap: 12,
  },
  searchBarContainer: {
    width: '100%',
  },
  searchBar: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchPlaceholder: {
    marginLeft: 12,
    color: '#666',
    fontSize: 16,
  },
  findMyCarButton: {
    backgroundColor: '#0066FF',
    borderRadius: 24,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  findMyCarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  mapControls: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -50 }],
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  mapControlButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  routePreviewContainer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  routePreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  routeInfo: {
    flex: 1,
  },
  routeDistance: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1976D2',
    marginBottom: 4,
  },
  routeTime: {
    fontSize: 16,
    color: '#666',
  },
  startNavigationButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startNavigationText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  arrivalPanelContainer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 12,      "goToCar": "Go to Car",
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  arrivalPanelHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  arrivalInfo: {
    flex: 1,
  },
  arrivalIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  arrivalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  arrivalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  arrivalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginLeft: 60,
  },
  arrivalButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrivalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  mallInfoContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  mallInfoContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },
  modalHandle: {
    width: 36,
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 20,
  },
  mallInfoTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1a1a1a',
  },
  floorsScrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  floorButtonContainer: {
    width: 140,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  floorButton: {
    alignItems: 'center',
    marginBottom: 8,
  },
  floorNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  floorTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  capacityBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  capacityFill: {
    height: '100%',
    borderRadius: 2,
  },
  capacityText: {
    fontSize: 12,
    color: '#666',
  },
  closeButton: {
    backgroundColor: '#0066FF',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 8,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  mallHeaderSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  mallName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  mallDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  mallDetailText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  spotsSummary: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  spotsSummaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  spotsDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e0e0e0',
  },
  spotsNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  spotsLabel: {
    fontSize: 13,
    color: '#666',
  },
  floorButtonContainerSelected: {
    backgroundColor: '#0066FF',
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  floorNumberSelected: {
    color: '#FFFFFF',
  },
  floorTitleSelected: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  capacityBarSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  capacityFillSelected: {
    backgroundColor: '#FFFFFF',
  },
  capacityTextSelected: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: 60, // Adjust based on safe area
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f51f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  headerBadgeText: {
    fontSize: 13,
    color: '#0066FF',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floorSectionContainer: {
    paddingHorizontal: 20,
  },
  floorSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'left', // Align text to left
  },
  floorsScrollContainer: {
    paddingBottom: 20,
    gap: 12,
  },
  spotInfo: {
    marginTop: 4,
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  spotInfoText: {
    color: '#1976D2',
    fontSize: 14,
    fontWeight: '500',
  },
  navigationMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  stairMarker: {
    position: 'absolute',
    width: GRID_CELL_SIZE,
    height: GRID_CELL_SIZE,
    backgroundColor: '#E8EAF6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#5C6BC0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    transform: [
      { translateX: -GRID_CELL_SIZE / 2 },
      { translateY: -GRID_CELL_SIZE / 2 }
    ],
  },
  findEmptySpotButton: {
    backgroundColor: '#4CAF50', // Different color for find empty spot
  },
});