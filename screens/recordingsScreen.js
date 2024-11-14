
import { StyleSheet, Text, View, Pressable} from 'react-native';

// REACT
import { useState, useEffect } from 'react';


// ICONS
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// PROGRESS
import MusicPlayer from './ProgressBar';



export default function Recordings() {



    return (
        <View style={styles.recordingParent}>

            {/* TOP NAVIGATION */}
                <View style={styles.topNav}>
                    <Ionicons name="chevron-back" size={30} color="#03FF3E" />
                    <Octicons name="share" size={30} color="#03FF3E" />
                </View>
            {/* TOP NAVIGATION ENDS */}

            {/* TITLE */}
            <Text
                
                style={styles.title}>
                    Meeting rec
            </Text>
            {/* TITLE ENDS*/}

            {/* VISUALIZATION */}

            <View style={styles.visualization}>
                <MaterialCommunityIcons name="waveform" size={90} color="#03FF3E" />
                <MaterialCommunityIcons name="waveform" size={150} color="#B600FF" />
                <MaterialCommunityIcons name="waveform" size={90} color="#FF0000" />
            </View>

            {/* VISUALIZATION ENDS*/}

            {/* BUTTON */}
            <Pressable style={styles.button}>
                <MaterialCommunityIcons name="waveform" size={30} color="#B600FF" />
                <Text style={styles.buttonText}>Audio</Text>
            </Pressable>
            {/* ENDS */}


            {/* TIME */}
            <View style ={styles.progress}>
                <MusicPlayer/>
                <View style={styles.duration}>
                    <Text style ={styles.durationText}>02:30</Text>
                    <Text style ={styles.durationText}>05:55</Text>
                </View>
            </View>
            {/* ENDS */}

            {/* BOTTOM NAV */}
            <View style={styles.navParent}>

                <View style={styles.navChild}>
                    <AntDesign name="stepbackward" size={30} color="#000" />
                </View>

                <View style={styles.navSibling}>
                    <FontAwesome5 name="play" size={40} color="#03FF3E" />
                </View>

                <View style={styles.navChild}>
                    <AntDesign name="stepforward" size={30} color="#000" />
                </View>

            </View>
            {/* ENDS */}

        </View>
    );
}

const styles = StyleSheet.create({

    // PARENT 
    recordingParent:
    {
        flex: 1,
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: 'column',
        backgroundColor: '#000',
        paddingVertical: 20,
        paddingHorizontal: 10,
        gap: 30
    },
    // ENDS

    // NAVIGATION
    navParent:
    {
        backgroundColor: '#333',
        width: '100%',
        paddingVertical: 7,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 30,
        elevation: 5
    },
    // ENDS

    navChild:
    {
        width: 60, height: 60,
        borderRadius: 50,
        backgroundColor: '#079AE9',
        justifyContent: 'center',
        alignItems: 'center',
    },

    navSibling:
    {
        width: 80, height: 80,
        borderRadius: 50,
        backgroundColor: '#079AE9',
        justifyContent: 'center',
        alignItems: 'center',
    },

    progress:
    {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
        marginBottom: 50
    },

    duration:
    {
        width: 325,
        justifyContent: 'space-between',
        alignSelf: 'center',
        flexDirection: 'row'
    },

    durationText:
    {
        fontSize: 16,
        color: '#fff',
        fontWeight: 900
    },

    button:
    {
        backgroundColor: '#83888E45',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 3,
        marginBottom: 10
    },

    buttonText:
    {
        fontWeight: 'bold',
        fontSize: 20,
        letterSpacing: 2,
        color: '#fff'
    },

    visualization:
    {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 1,
        marginBottom: 20
    },

    title:
    {
        color: '#B0B0B0',
        fontSize: 30,
        fontWeight: 'bold',
        letterSpacing: 5,
        marginBottom: 30,
        borderRadius: 10,
    },
    // ENDS

    topNav:
    {
        width: '100%',
        backgroundColor: '#333',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
});
