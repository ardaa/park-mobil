import { View, StyleSheet } from 'react-native';

export default function Logo() {
  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <View style={styles.letter}>
          <View style={styles.letterP} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  letter: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterP: {
    width: 12,
    height: 16,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 6,
    borderRightWidth: 0,
  },
}); 