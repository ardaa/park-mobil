import { View, ScrollView, Text, StyleSheet, Pressable, Dimensions, Modal, TouchableOpacity, Alert } from 'react-native';
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

const GRID_SIZE = 40;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const INITIAL_SCALE = 0.6;
const INITIAL_X = -SCREEN_WIDTH * 0.5;
const INITIAL_Y = -SCREEN_WIDTH * 0.3;
const GRID_CELL_SIZE = SCREEN_WIDTH * 4 / GRID_SIZE;
const START_POSITION = { x: 2, y: 2 };

type Point = { x: number; y: number };
type Node = { point: Point; f: number; g: number; parent?: Node };
type Direction = 'up' | 'down' | 'left' | 'right';
type NavigationInstruction = {
  direction: Direction;
  distance: number;
};

const ObstacleMarkers = ({ obstacles }: { obstacles: Set<string> }) => (
  <>
    {Array.from(obstacles).map((obstacleKey) => {
      const [x, y] = obstacleKey.split(',').map(Number);
      return (
        <View
          key={obstacleKey}
          style={[
            styles.obstacleMarker,
            {
              left: `${(x / GRID_SIZE) * 100}%`,
              top: `${(y / GRID_SIZE) * 100}%`,
              zIndex: 998,
            },
          ]}
        />
      );
    })}
  </>
);

// Add new component for the search bar overlay
const SearchBar = () => (
  <View style={styles.searchBarContainer}>
    <View style={styles.searchBar}>
      <MaterialIcons name="search" size={24} color="#666" />
      <Text style={styles.searchPlaceholder}>Park yeri ara...</Text>
    </View>
  </View>
);

// Add new component for zoom controls
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
  onCancel 
}: { 
  distance: number;
  estimatedTime: number;
  onStartNavigation: () => void;
  onCancel: () => void;
}) => (
  <View style={styles.routePreviewContainer}>
    <View style={styles.routePreviewHeader}>
      <TouchableOpacity onPress={onCancel} style={styles.backButton}>
        <MaterialIcons name="arrow-back" size={24} color="#666" />
      </TouchableOpacity>
      <View style={styles.routeInfo}>
        <Text style={styles.routeDistance}>{distance}m</Text>
        <Text style={styles.routeTime}>{estimatedTime} saniye</Text>
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

// Replace the ArrivalModal component with this new bottom sheet style component
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

export default function MapScreen() {
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
  const [obstacles, setObstacles] = useState<Set<string>>(new Set());
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const [pendingPath, setPendingPath] = useState<Point[]>([]);
  const [remainingDistance, setRemainingDistance] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [currentInstruction, setCurrentInstruction] = useState<NavigationInstruction | null>(null);
  const [showingRoutePreview, setShowingRoutePreview] = useState(false);
  const [showArrivalModal, setShowArrivalModal] = useState(false);

  const parkingData = {
    1: {
      title: "1. Kat",
      sections: {
        "zone-a": {
          title: "A Bölgesi", 
          color: "#EBF5FF",
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
          x: 5,
          y: 5,
          width: 10,
          height: 5
        },
        "zone-b": {
          title: "B Bölgesi",
          color: "#F0FDF4",
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
          x: 5,
          y: 12,
          width: 10,
          height: 5
        },
        "vip-zone": {
          title: "VIP Bölgesi",
          color: "#FEF2F2", 
          spots: [
            { id: "V1", occupied: false },
            { id: "V2", occupied: true },
            { id: "V3", occupied: false },
            { id: "V4", occupied: true },
            { id: "V5", occupied: false },
          ],
          x: 17,
          y: 5,
          width: 8,
          height: 5
        },
        "handicap-zone": {
          title: "Engelli Parkı",
          color: "#EEF2FF",
          spots: [
            { id: "H1", occupied: false },
            { id: "H2", occupied: true },
            { id: "H3", occupied: false },
            { id: "H4", occupied: true },
          ],
          x: 17,
          y: 12,
          width: 8,
          height: 5
        }
      }
    }
  };

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
      ctx.startScale = scale.value;
      pinchFocal.value = { x: event.focalX, y: event.focalY };
    },
    onActive: (event) => {
      const newScale = savedScale.value * event.scale;
      scale.value = Math.min(Math.max(newScale, 0.5), 3);
    },
    onEnd: () => {
      savedScale.value = scale.value;
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
              { left: `${(i / GRID_SIZE) * 100}%` },
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
              { top: `${(i / GRID_SIZE) * 100}%` },
            ]}
          />
        ))}
      </View>
    );
  };

  const ParkingSection = ({ section, onSpotPress }: { section: any, onSpotPress: (spotId: string) => void }) => {
    const left = (section.x / GRID_SIZE) * 100;
    const top = (section.y / GRID_SIZE) * 100;
    const width = (section.width / GRID_SIZE) * 100;
    const height = (section.height / GRID_SIZE) * 100;

    const spotsPerRow = Math.ceil(section.spots.length / 2);

    return (
      <View
        style={[
          styles.section,
          {
            left: `${left}%`,
            top: `${top}%`,
            width: `${width}%`,
            height: `${height}%`,
            backgroundColor: section.color,
          },
        ]}
      >
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <View style={styles.spotsContainer}>
          {Array.from({ length: 2 }).map((_, rowIndex) => (
            <View key={rowIndex} style={styles.spotRow}>
              {section.spots
                .slice(rowIndex * spotsPerRow, (rowIndex + 1) * spotsPerRow)
                .map((spot: any) => (
                  <Pressable
                    key={spot.id}
                    style={[
                      styles.spot,
                      spot.occupied ? styles.occupied : styles.available,
                      selectedSpot === spot.id && styles.selected,
                    ]}
                    onPress={() => {
                      console.log('Spot pressed:', spot.id);
                      onSpotPress(spot.id);
                    }}
                  >
                    <Text style={styles.spotText}>{spot.id}</Text>
                  </Pressable>
                ))}
            </View>
          ))}
        </View>
      </View>
    );
  };

  const getNeighbors = (point: Point, obstacles: Set<string>): Point[] => {
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
        p.y >= 0 && p.y < GRID_SIZE &&
        !obstacles.has(`${p.x},${p.y}`)
      );
  };

  const manhattanDistance = (a: Point, b: Point): number => {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  };

  const findPath = (start: Point, end: Point, sections: any, targetSection: any) => {
    // Create obstacles set from section borders, excluding target section and current section
    const obstacles = new Set<string>();
    
    // Helper function to check if a point is inside a section
    const isPointInSection = (point: Point, section: any) => {
      return point.x >= section.x && 
             point.x < section.x + section.width &&
             point.y >= section.y && 
             point.y < section.y + section.height;
    };

    // Find the section containing the start point
    let startSection = null;
    Object.values(sections).forEach((section: any) => {
      if (isPointInSection(start, section)) {
        startSection = section;
      }
    });

    Object.values(sections).forEach((section: any) => {
      // Skip the target section's obstacles and the section containing the start point
      if (section === targetSection || section === startSection) return;

      // Add borders for other sections
      for (let x = section.x; x < section.x + section.width; x++) {
        obstacles.add(`${x},${section.y}`);
        obstacles.add(`${x},${section.y + section.height - 1}`);
      }
      for (let y = section.y; y < section.y + section.height; y++) {
        obstacles.add(`${section.x},${y}`);
        obstacles.add(`${section.x + section.width - 1},${y}`);
      }
    });

    setObstacles(obstacles);

    console.log('Start position:', start);
    console.log('End position:', end);
    console.log('Obstacles:', Array.from(obstacles));

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

      for (const neighbor of getNeighbors(current.point, obstacles)) {
        const neighborKey = `${neighbor.x},${neighbor.y}`;
        if (closedSet.has(neighborKey)) continue;

        const g = current.g + 1;
        const f = g + manhattanDistance(neighbor, end);

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
    
    Object.entries(parkingData[currentLevel].sections).forEach(([_, section]) => {
      const spot = section.spots.find((s: any) => s.id === spotId);
      if (spot) {
        const spotIndex = section.spots.indexOf(spot);
        const spotsPerRow = Math.ceil(section.spots.length / 2);
        const row = Math.floor(spotIndex / spotsPerRow);
        const col = spotIndex % spotsPerRow;
        
        const targetX = section.x + 2 + (col * 2);
        const targetY = section.y + 2 + (row * 2);
        
        const path = findPath(userPosition, { x: targetX, y: targetY }, parkingData[currentLevel].sections, section);
        if (path) {
          setPendingPath(path);
          setNavigationPath(path);
          zoomToShowPath();
          setShowingRoutePreview(true);
        }
      }
    });
  };

  const UserMarker = () => (
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

  const NavigationPath = () => (
    <>
      {navigationPath.map((point, index) => (
        <View
          key={index}
          style={[
            styles.pathPoint,
            {
              left: `${(point.x / GRID_SIZE) * 100}%`,
              top: `${(point.y / GRID_SIZE) * 100}%`,
              zIndex: 999,
            },
          ]}
        />
      ))}
    </>
  );

  // Function to zoom in on user - for automated movement
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

  // Function to zoom out and show full path
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

  // Update manual zoom function
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

  // Start navigation function
  const startNavigation = () => {
    setIsNavigating(true);
    setCurrentPathIndex(0);
    setNavigationPath(pendingPath);
    zoomToUser();
  };

  // Update the getDirection function to be more accurate
  const getDirection = (from: Point, to: Point): Direction => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    
    // Use absolute values to compare which direction is more dominant
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 'right' : 'left';
    }
    return dy > 0 ? 'down' : 'up';
  };

  // Update the NavigationControlPanel component
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

    // Calculate current direction if we have a next point in the path
    const currentDirection = currentPathIndex < navigationPath.length - 1
      ? getDirection(navigationPath[currentPathIndex], navigationPath[currentPathIndex + 1])
      : null;

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
        </View>
      </View>
    );
  };

  // Add this new function near the top of the MapScreen component
  const moveUserSmoothly = (from: Point, to: Point, duration: number = 500) => {
    'worklet';
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Linear interpolation between points
      const newX = from.x + (to.x - from.x) * progress;
      const newY = from.y + (to.y - from.y) * progress;
      
      setUserPosition({ x: newX, y: newY });
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  };

  // Replace the existing navigation useEffect with this updated version
  useEffect(() => {
    if (isNavigating && currentPathIndex < navigationPath.length - 1) {
      // Calculate initial values
      const totalDistance = navigationPath.length - currentPathIndex;
      setRemainingDistance(totalDistance);
      setRemainingTime(totalDistance);
      
      const currentPoint = navigationPath[currentPathIndex];
      const nextPoint = navigationPath[currentPathIndex + 1];
      
      // Move smoothly to next point
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
      }, 500); // Match this with the duration in moveUserSmoothly
      
      return () => clearTimeout(moveTimeout);
    } else if (isNavigating && currentPathIndex === navigationPath.length - 1) {
      // Navigation completed
      setIsNavigating(false);
      setCurrentInstruction(null);
      setRemainingDistance(0);
      setRemainingTime(0);
      setShowArrivalModal(true); // Show the modal instead of Alert
    }
  }, [isNavigating, currentPathIndex, navigationPath]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <SearchBar />
        <MapControls />
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
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: '#e5e7eb',
  },
  verticalLine: {
    width: 1,
    height: '100%',
  },
  horizontalLine: {
    width: '100%',
    height: 1,
  },
  section: {
    position: 'absolute',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#4B5563',
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
    width: 45,
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    margin: 2,
  },
  available: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  occupied: {
    backgroundColor: '#FFEBEE',
    borderColor: '#EF5350',
  },
  selected: {
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  spotText: {
    fontSize: 16,
    fontWeight: '500',
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
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2196F3',
    opacity: 0.8,
    transform: [{ translateX: -5 }, { translateY: -5 }],
    zIndex: 999,
  },
  pathLine: {
    position: 'absolute',
    height: 3,
    backgroundColor: '#2196F3',
    opacity: 0.6,
    zIndex: 998,
  },
  obstacleMarker: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.5)', // Semi-transparent red
    transform: [{ translateX: -5 }, { translateY: -5 }],
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
    padding: 16,
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
  searchBarContainer: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 1000,
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
    borderRadius: 12,
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
    marginLeft: 60, // Aligns with the title after the icon
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
});