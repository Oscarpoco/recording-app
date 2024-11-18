import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, Animated, Dimensions } from 'react-native';

export default function Splash() {
  // Screen dimensions
  const { width, height } = Dimensions.get('window');

  // Animation references
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.8)).current;

  // Additional animation values for new elements
  const circleOpacity = useRef(new Animated.Value(0)).current;
  const circleScale = useRef(new Animated.Value(0.5)).current;
  const waveOpacity = useRef(new Animated.Value(0)).current;

  // Animation function
  const animateSplash = () => {
    Animated.sequence([
      // Main image animations
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        })
      ]),
      
      // Additional element animations
      Animated.parallel([
        Animated.timing(circleOpacity, {
          toValue: 0.5,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(circleScale, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.timing(waveOpacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        })
      ]),

      // Fade out sequence
      Animated.timing(opacity, {
        toValue: 0,
        delay: 2000,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  };

  // Trigger the animation when the component mounts
  useEffect(() => {
    animateSplash();
  }, []);

  // Interpolate rotation
  const rotation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={styles.splashParent}>
      {/* Animated Wave Background */}
      <Animated.View 
        style={[
          styles.waveBackground, 
          { 
            opacity: waveOpacity,
            transform: [
              { scale: circleScale },
            ]
          }
        ]}
      />

      {/* Animated Circle */}
      <Animated.View 
        style={[
          styles.animatedCircle, 
          { 
            opacity: circleOpacity,
            transform: [
              { scale: circleScale }
            ]
          }
        ]}
      />

      {/* FIRST CHILD */}
      <Animated.View
        style={[
          styles.firstChild,
          { 
            opacity, 
            transform: [
              { translateY },
              { rotate: rotation },
              { scale: scaleValue }
            ] 
          },
        ]}
      >
        <Image
          source={require('../assets/download.jpg')} 
          style={styles.image}
        />
      </Animated.View>

      {/* SECOND CHILD */}
      <View style={styles.secondChild}>
        <View style={styles.secondChildSibling}>
          <Text style={styles.text}>Recorder</Text>
        </View>
      </View>
    </View>
  );
}


// STYLING
const styles = StyleSheet.create({

    // PARENT CONTAINER
  splashParent: 
  {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    backgroundColor: '#000',
  },
    //   ENDS

    //   FIRST CHILD

    firstChild: 
    {
        width: 300,
        height: 300,
        backgroundColor: 'rgba(255, 255, 255, .3)',
        borderRadius: 150,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        zIndex: 10
    },

    image: 
    {
        width: 300,
        height: 300,
        resizeMode: 'contain',
    },

     // Text style inside the firstChild
    text: 
    {
        color: 'rgba(255, 255, 255, .7)',
        fontSize: 40,
        textAlign: 'center',
        fontWeight: 900
    },

    // ENDS

    // SECOND CHILD
    secondChild: 
    {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '50%',
        backgroundColor: 'rgba(255, 255, 255, .3)',
        borderRadius: 40,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Second child sibling
    secondChildSibling:
    {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 10,
        backgroundColor: 'rgba(0, 0, 0, .9)',
        width: '70%',
        height: '50%',
        borderRadius: 40,    
    },
    // ENDS

    animatedCircle: 
    {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 100,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        top: '30%',
        alignSelf: 'center',
        zIndex: 0,
      },
    
      waveBackground: 
      {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 150,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        top: '24%',
        alignSelf: 'center',
        zIndex: -1,
      }

});
