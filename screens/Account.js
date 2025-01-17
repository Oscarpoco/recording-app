import 
{
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ActivityIndicator
}
from 'react-native';

import { useState, useEffect  } from 'react';

// ICONS
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import UserDetailsScreen from './UserDetailsScreen';



export default function Account(
    {
        changeView, 
        setSettings, 
        isToggled, 
        toggleButton, 
        logout, 
        userInformation, 
        sendPasswordReset,
        setIsProfile, 
        isProfile,
        updateUserDetails,
        loadSavedPhotos,
        handleProfilePhotoUpdate,
        handleCoverPhotoUpdate,
        userDetails,
        loading
    }){

        const [profileImage, setProfileImage] = useState(null);
        const [coverImage, setCoverImage] = useState(null);
        const [isLoading, setIsLoading] = useState(true);
        const userEmail = userInformation.email || '';

        useEffect(() => {
            const loadPhotos = async () => {
            try {
                const savedPhotos = await loadSavedPhotos(userInformation);
                
                if (savedPhotos.profilePhoto) {
                setProfileImage({ uri: savedPhotos.profilePhoto });
                }
                
                if (savedPhotos.coverPhoto) {
                setCoverImage({ uri: savedPhotos.coverPhoto });
                }
            } catch (error) {
                console.error("Error loading photos:", error);
            } finally {
                setIsLoading(false);
            }
            };

            loadPhotos();
        }, [userInformation]);

        const onProfilePhotoUpdate = async () => {

            setIsLoading(true)
            try {
            const photoURL = await handleProfilePhotoUpdate(userInformation);
            if (photoURL) {
                setProfileImage({ uri: photoURL });
            }
            } catch (error) {
            console.error("Error in onProfilePhotoUpdate:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const onCoverPhotoUpdate = async () => {

            setIsLoading(true)
            try {
            const coverURL = await handleCoverPhotoUpdate(userInformation);
            if (coverURL) {
                setCoverImage({ uri: coverURL });
            }
            } catch (error) {
            console.error("Error in onCoverPhotoUpdate:", error);
            } finally {
                setIsLoading(false);
            }
        };


    return(
        <View style={styles.accountParent}>
            
            {/* HEADER */}
            <View style={styles.accountChild}>

                <TouchableOpacity style={styles.accountHeaderButton} onPress={()=> changeView('play')}>
                    <MaterialCommunityIcons name="keyboard-backspace" size={35} color="#fff" />
                </TouchableOpacity>

            </View>
            {/* ENDS */}

            <View style={styles.secondAccountChild}>

                {/* COVER */}
                <View syle={styles.accountChildCover}>    

                    {
                    isLoading ? 
                        <ActivityIndicator size={'large'} color={'#000'}/> 
                        : 

                        <Image 
                         source={coverImage || require("../assets/cover.jpg")}  
                        style={styles.BackgroundCover}
                        />
                    }

                        <TouchableOpacity style={styles.accountChildBackgroundCoverButton} onPress={()=> onCoverPhotoUpdate()}>
                            <MaterialCommunityIcons name="camera" size={25} color="#000" />
                        </TouchableOpacity>

                </View>
                {/* ENDS */}

                {/* PROFILE PICTURE */}
                <View style={styles.accountChildProfilePicture}>

                    

                    {
                    isLoading ? 
                        <ActivityIndicator size={'small'} color={'#000'}/> 
                        : 

                        <Image 
                        source={ profileImage || require("../assets/user.jpg")} 
                        style={styles.BackgroundProfile}
                        />
                    }

                    <TouchableOpacity style={styles.accountChildProfilePictureButton} onPress={()=> onProfilePhotoUpdate()}>
                        <MaterialCommunityIcons name="camera" size={25} color="#000" />
                    </TouchableOpacity>

                </View>
                {/* ENDS */}
            </View>

            {/* ACCOUNT CONTENT */}
            <View style={styles.thirdAccountChild}>
                <View style={styles.thirdAccountChildContent}>

                    <View style={styles.accountChildContentAbout}>
                        <Text style={styles.accountText}>{userInformation.displayName || 'User'}</Text>
                        <Text style={styles.accountTextBio}>{userDetails.bio || 'User'}</Text>
                    </View>

                    {/* FIRST SECTION */}
                    
                    <View style={styles.accountChildContentItem}>

                        <TouchableOpacity style={styles.accountChildContentItemButtonWrap} onPress={()=> setIsProfile(true)}>
                            <View style={styles.accountChildContentItemButtonIcon}>
                                <AntDesign name="profile" size={15} color="#000" />
                            </View>
                            <Text style={styles.accountChildContentItemButtonText}>Edit profile</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.accountChildContentItemButtonWrap} onPress={()=> sendPasswordReset(userEmail)}>
                            <View style={styles.accountChildContentItemButtonIcon}>
                                <MaterialIcons name="password" size={15} color="#000" />
                            </View>
                            <Text style={styles.accountChildContentItemButtonText}>Change password</Text>
                        </TouchableOpacity>

                    </View>

                    {/* SECOND SECTION */}

                    <View style={[styles.accountChildContentItem, {position: 'relative'}]}>

                        <TouchableOpacity style={styles.accountChildContentItemButtonWrap}>
                            <View style={styles.accountChildContentItemButtonIcon}>
                                <MaterialIcons name="backup" size={15} color="#000" />
                            </View>
                            <Text style={styles.accountChildContentItemButtonText}>Backup</Text>
                        </TouchableOpacity>

                        <View style={styles.accountToggle}>
                            <TouchableOpacity
                                onPress={toggleButton}
                                style={[styles.toggleButton, isToggled ? styles.active : styles.inactive]}
                            >
                                    <Text style={styles.buttonText}>{isToggled ? 
                                        'ON'
                                        : 
                                        'OFF'}
                                    </Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                    {/* SECOND SECTION */}

                    <View style={[styles.accountChildContentItem, {position: 'relative'}]}>

                        <TouchableOpacity style={styles.accountChildContentItemButtonWrap}>
                            <View style={styles.accountChildContentItemButtonIcon}>
                                <MaterialIcons name="sync" size={15} color="#000" />
                            </View>
                            <Text style={styles.accountChildContentItemButtonText}>Sync</Text>
                        </TouchableOpacity>

                        <View style={styles.accountToggle}>
                            <TouchableOpacity
                                onPress={toggleButton}
                                style={[styles.toggleButton, isToggled ? styles.active : styles.inactive]}
                            >
                                    <Text style={styles.buttonText}>{isToggled ? 
                                        'ON'
                                        : 
                                        'OFF'}
                                    </Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                    {/* THIRD SECTION */}
                    <View style={styles.accountChildContentItem}>
                        
                        <TouchableOpacity style={styles.accountChildContentItemButtonWrap} 
                        onPress={()=> {
                            setSettings(true);
                            changeView('play');
                        }
                        }>
                            <View style={styles.accountChildContentItemButtonIcon}>
                                <MaterialIcons name="feedback" size={15} color="#000" />
                            </View>
                            <Text style={styles.accountChildContentItemButtonText}>Feedback</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.accountChildContentItemButtonWrap} onPress={()=> logout()}>
                            <View style={styles.accountChildContentItemButtonIcon}>
                                <MaterialCommunityIcons name="logout" size={15} color="#000" />
                            </View>
                            <Text style={styles.accountChildContentItemButtonText}>Logout</Text>
                        </TouchableOpacity>

                    </View>

                </View>
            </View>
            {/* ENDS */}

            {/* EDIT PROFILE */}
            {isProfile && (
                <View style={styles.editProfileParent}>

                    <TouchableOpacity
                    style={styles.editingOverlay}
                    onPress={() => setIsProfile(false)} 
                    />

                    <View style={styles.editProfileChild}>
                            <UserDetailsScreen 
                                setIsProfile={setIsProfile}
                                updateUserDetails={updateUserDetails}
                                userInformation={userInformation}
                                userDetails={userDetails}
                                loading = {loading}

                            />
                    </View>
                </View>
            )}
            {/* ENDS */}

        </View>
    )
}

const colors = {
    primary: '#2563EB',           // Rich blue
    secondary: '#1E293B',         // Dark slate
    accent: '#3B82F6',           // Bright blue
    background: '#0F172A',        // Deep navy
    surface: '#1E293B',          // Slate blue
    text: {
        primary: '#F8FAFC',      // Almost white
        secondary: '#CBD5E1',    // Light gray
        tertiary: '#94A3B8'      // Muted gray
    },
    border: '#334155',           // Medium slate
    success: '#10B981',          // Green
    error: '#EF4444',           // Red
    overlay: 'rgba(15, 23, 42, 0.9)' // Dark overlay
};

export const styles = StyleSheet.create({
    accountParent: {
        flex: 1,
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'relative',
        backgroundColor: colors.background,
        paddingTop: 0,
    },

    accountHeaderButton:
    {
        width: 50,
        height: 50,
        backgroundColor: 'rgba(0, 0, 0, .7)',
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
    },

    editProfileParent: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'absolute',
        bottom: 0,
        right: 0,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: colors.overlay,
        zIndex: 19,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },

    editProfileChild: {
        width: '100%',
        height: '70%',
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
    },

    accountChild: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 5,
        paddingHorizontal: 15,
        position: 'absolute',
        top: 30,
        zIndex: 11,
    },

    secondAccountChild: {
        width: '100%',
        height: '35%',
        position: 'relative',
        backgroundColor: colors.surface,
    },

    accountChildCover: {
        width: '100%',
        height: '100%',
    },

    BackgroundCover: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },

    accountChildProfilePicture: {
        width: 130,
        height: 130,
        position: 'absolute',
        bottom: -30,
        left: 10,
        borderRadius: 150,
        alignSelf: 'left',
        backgroundColor: colors.surface,
        padding: 2,
        zIndex: 10,
        borderWidth: 3,
        borderColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },

    BackgroundProfile: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 100,
    },

    accountChildProfilePictureButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 40,
        height: 40,
        backgroundColor: colors.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        elevation: 10,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },

    accountChildBackgroundCoverButton: {
        position: 'absolute',
        bottom: 50,
        right: 30,
        width: 40,
        height: 40,
        backgroundColor: colors.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        elevation: 10,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },

    thirdAccountChild: {
        width: '100%',
        height: '70%',
        backgroundColor: colors.background,
        position: 'absolute',
        bottom: 0,
        zIndex: 9,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },

    thirdAccountChildContent: {
        width: '100%',
        height: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 10,
        paddingHorizontal: 15,
        backgroundColor: colors.surface,
    },

    accountChildContentAbout: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexDirection: 'column',
        gap: 3,
        paddingVertical: 10,
        marginTop: 10,
    },

    accountText: {
        color: colors.text.primary,
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 1,
    },

    accountTextBio: {
        color: colors.text.secondary,
        fontSize: 16,
        fontWeight: '500',
        letterSpacing: 0.5,
    },

    accountChildContentItem: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: colors.primary,
        borderRadius: 10,
        gap: 5,
        marginTop: 5,
        opacity: 0.9,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },

    accountChildContentItemButtonWrap: {
        flexDirection: 'row',
        gap: 15,
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
    },

    accountChildContentItemButtonIcon: {
        width: 30,
        height: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
    },

    accountChildContentItemButtonText: {
        color: colors.text.primary,
        fontSize: 16,
        fontWeight: '600',
    },

    toggleButton: {
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },

    active: {
        backgroundColor: colors.success,
        width: 35,
        height: 18,
        alignSelf: 'flex-end',
    },

    inactive: {
        backgroundColor: colors.error,
        width: 35,
        height: 18,
        alignSelf: 'flex-start',
    },

    buttonText: {
        color: colors.text.primary,
        fontWeight: 'bold',
        fontSize: 10,
    },

    accountToggle: {
        width: 45,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 40,
        position: 'absolute',
        right: 10,
        padding: 1,
        borderWidth: 2,
        borderColor: colors.border,
        elevation: 1,
    },

    editingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.overlay,
    },
});