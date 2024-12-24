// IMPORTS
import { StyleSheet, Text, View, Pressable, TextInput, StatusBar } from 'react-native';

// ICONS
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function Record({
    changeView, 
    title, 
    setTitle, 
    saveRecording, 
    isRecording, 
    stopRecording, 
    startRecording, 
    cancelRecording, 
    formatTime, 
    time
}) {
    return (
        <View style={styles.recordParent}>
            <StatusBar barStyle="light-content" />

            {/* TOP BAR */}
            <View style={styles.topBar}>
                <Pressable 
                    style={styles.backButton} 
                    onPress={() => changeView('play')}
                >
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </Pressable>

                {/* TITLE INPUT */}
                <TextInput
                    placeholder="Recording title"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    selectionColor="#fff"
                    maxLength={20}
                    style={styles.titleInput}
                    value={title}
                    onChangeText={setTitle}
                />
            </View>
            {/* TOP BAR ENDS */}

            {/* MAIN CONTENT */}
            <View style={styles.contentContainer}>
                {/* HEADER */}
                <View style={styles.header}>
                    <Text style={styles.headerText}>Voice Recorder</Text>
                    {isRecording && (
                        <View style={styles.recordingIndicator}>
                            <View style={styles.recordingDot} />
                            <Text style={styles.recordingText}>Recording</Text>
                        </View>
                    )}
                </View>
                {/* HEADER ENDS */}

                {/* VISUALIZATION */}
                <View style={styles.visualization}>
                    <MaterialCommunityIcons 
                        name="waveform" 
                        size={90} 
                        color="rgba(0,0,0,0.4)" 
                    />
                    <MaterialCommunityIcons 
                        name="waveform" 
                        size={160} 
                        color="rgba(0,0,0,0.7)" 
                    />
                    <MaterialCommunityIcons 
                        name="waveform" 
                        size={90} 
                        color="rgba(0,0,0,0.4)" 
                    />
                </View>
                {/* VISUALIZATION ENDS */}

                {/* TIMER */}
                <Text style={styles.timer}>{formatTime(time)}</Text>
                {/* TIMER ENDS */}

                {/* CONTROLS */}
                <View style={styles.controls}>
                    <Pressable 
                        style={styles.secondaryButton} 
                        onPress={cancelRecording}
                    >
                        <Ionicons name="close" size={24} color="#fff" />
                    </Pressable>

                    <Pressable 
                        style={styles.primaryButton} 
                        onPress={isRecording ? stopRecording : startRecording}
                    >
                        <FontAwesome5 
                            name={isRecording ? "pause" : "microphone"} 
                            size={28} 
                            color="#fff" 
                        />
                    </Pressable>

                    {!isRecording ? (
                        <Pressable 
                            style={styles.secondaryButton} 
                            onPress={saveRecording}
                        >
                            <Ionicons name="checkmark" size={24} color="#fff" />
                        </Pressable>
                    ) : (
                        <View style={styles.placeholderButton} />
                    )}
                </View>
                {/* CONTROLS END */}
            </View>
            {/* MAIN CONTENT ENDS */}
        </View>
    );
}

// STYLES
const styles = StyleSheet.create({

    // PARENT STYLES
    recordParent: 
    {
        flex: 1,
        backgroundColor: '#111',
    },

    // TOP BAR STYLES
    topBar: 
    {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 16,
        marginTop: 40,
        paddingLeft: 30
    },

    backButton: 
    {
        padding: 8,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },

    titleInput: 
    {
        flex: 1,
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.2)',
    },

    // CONTENT STYLES
    contentContainer: 
    {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, .4)',
        marginTop: 24,
        padding: 24,
        alignItems: 'center',
    },

    // HEADER STYLES
    header: 
    {
        alignItems: 'center',
        marginBottom: 48,
    },

    headerText: 
    {
        fontSize: 24,
        fontWeight: '600',
        color: '#111',
        marginBottom: 8,
        letterSpacing: 1
    },

    // RECORDING INDICATOR STYLES
    recordingIndicator: 
    {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,0,0,0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 8,
    },

    recordingDot: 
    {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF0000',
    },

    recordingText: 
    {
        color: '#FF0000',
        fontSize: 14,
        fontWeight: '500',
    },

    // VISUALIZATION STYLES
    visualization: 
    {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        marginBottom: 48,
    },

    // TIMER STYLES
    timer: 
    {
        fontSize: 48,
        fontWeight: '700',
        color: '#111',
        letterSpacing: 2,
        marginBottom: 48,
    },

    // CONTROL STYLES
    controls: 
    {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24,
        marginTop: 'auto',
        marginBottom: 24,
    },

    primaryButton: 
    {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#FF0000',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FF0000',
        shadowOffset: 
        {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },

    secondaryButton: 
    {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    placeholderButton: 
    {
        width: 48,
        height: 48,
    },
});