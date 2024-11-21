import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Image, Animated } from 'react-native';

export default function Splash() {

  // Animation references
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.8)).current;


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


      // Fade out sequence
      Animated.timing(opacity, {
        toValue: 0,
        delay: 3000,
        duration: 2000,
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

      

          <Image 
            source={require('../assets/splashScreen.jpg')} 
            style={styles.Backgroundimage}
          />

        <View style={[styles.splashSecondParent, styles.blurOverlay]}>

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
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#000',
    position: 'relative'
  },

  splashSecondParent: 
  {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, .3)',
    position: 'absolute'

  },

  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
    backdropFilter: 'blur(10px)',
  },

  Backgroundimage:
  {
    width: '100%',
    height: '100%',
    position: 'absolute', 
    top: 0,
    left: 0,
    resizeMode: 'cover',
  },
    //   ENDS

    //   FIRST CHILD

    firstChild: 
    {
        width: 200,
        height: 200,
        backgroundColor: 'rgba(255, 255, 255, .5)',
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

