import { StyleSheet, Text, View, Pressable, StatusBar } from 'react-native';

// REACT
import { useState, useEffect } from 'react';

// ICONS
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// PROGRESS
import MusicPlayer from './ProgressBar';

export default function Recordings({ changeView }) {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <View style={styles.recordingParent}>
            <StatusBar barStyle="light-content" />

            {/* TOP NAVIGATION */}
            <View style={styles.topNav}>
                <Pressable style={styles.iconButton}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </Pressable>
                <View style={styles.topNavRight}>
                    <Pressable style={styles.iconButton}>
                        <FontAwesome5 name="heart" size={20} color="#fff" />
                    </Pressable>
                    <Pressable style={styles.iconButton}>
                        <Ionicons name="share-outline" size={24} color="#fff" />
                    </Pressable>
                </View>
            </View>
            {/* TOP NAVIGATION ENDS */}

            {/* TITLE */}
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Meeting Recording</Text>
                <Text style={styles.subtitle}>December 24, 2024</Text>
            </View>
            {/* TITLE ENDS*/}

            {/* VISUALIZATION */}
            <View style={styles.visualization}>
                <MaterialCommunityIcons name="waveform" size={80} color="rgba(3, 255, 62, 0.6)" />
                <MaterialCommunityIcons name="waveform" size={160} color="rgba(182, 0, 255, 0.8)" />
                <MaterialCommunityIcons name="waveform" size={80} color="rgba(255, 0, 0, 0.6)" />
            </View>
            {/* VISUALIZATION ENDS*/}

            {/* AUDIO TYPE BADGE */}
            <Pressable style={styles.badge}>
                <MaterialCommunityIcons name="waveform" size={20} color="#fff" />
                <Text style={styles.badgeText}>High Quality Audio</Text>
            </Pressable>
            {/* ENDS */}

            {/* TIME */}
            <View style={styles.progress}>
                <MusicPlayer />
                <View style={styles.duration}>
                    <Text style={styles.durationText}>02:30</Text>
                    <Text style={styles.durationText}>05:55</Text>
                </View>
            </View>
            {/* ENDS */}

            {/* BOTTOM NAV */}
            <View style={styles.controls}>
                <Pressable style={styles.secondaryButton}>
                    <Ionicons name="reload" size={24} color="#fff" />
                </Pressable>

                <Pressable 
                    style={styles.primaryButton}
                    onPress={() => setIsPlaying(!isPlaying)}
                >
                    <Ionicons 
                        name={isPlaying ? "pause" : "play"} 
                        size={32} 
                        color="#000" 
                    />
                </Pressable>

                <Pressable style={styles.secondaryButton}>
                    <Ionicons name="forward" size={24} color="#fff" />
                </Pressable>
            </View>
            {/* ENDS */}

        </View>
    );
}

const styles = StyleSheet.create({
    recordingParent: {
        flex: 1,
        backgroundColor: '#111',
        padding: 20,
        gap: 25,
    },

    topNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },

    topNavRight: {
        flexDirection: 'row',
        gap: 15,
    },

    iconButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },

    titleContainer: {
        alignItems: 'center',
        marginTop: 20,
    },

    title: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '600',
        letterSpacing: 1,
    },

    subtitle: {
        color: '#666',
        fontSize: 16,
        marginTop: 8,
    },

    visualization: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        marginVertical: 40,
    },

    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        gap: 8,
    },

    badgeText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },

    progress: {
        marginTop: 40,
    },

    duration: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
        marginTop: 8,
    },

    durationText: {
        color: '#888',
        fontSize: 14,
        fontWeight: '500',
    },

    controls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        marginTop: 40,
    },

    primaryButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#03FF3E',
        justifyContent: 'center',
        alignItems: 'center',
    },

    secondaryButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});