import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

interface PingAnimationProps {
    color: string;
  }
  
  const PingAnimation: React.FC<PingAnimationProps> = ({color}) => {
    const scaleValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.ping,
          {
            backgroundColor: color,
            transform: [{ scale: scaleValue }],
            opacity: scaleValue.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [1, 0.5, 0],
            }),
          },
        ]}
      />
      <View style={[styles.dot, {backgroundColor: color}]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ping: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: 'skyblue',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 10,
    backgroundColor: 'skyblue'
  },
});

export default PingAnimation;