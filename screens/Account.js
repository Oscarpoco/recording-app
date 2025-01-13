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
            try {
            const photoURL = await handleProfilePhotoUpdate(userInformation);
            if (photoURL) {
                setProfileImage({ uri: photoURL });
            }
            } catch (error) {
            console.error("Error in onProfilePhotoUpdate:", error);
            }
        };

        const onCoverPhotoUpdate = async () => {
            try {
            const coverURL = await handleCoverPhotoUpdate(userInformation);
            if (coverURL) {
                setCoverImage({ uri: coverURL });
            }
            } catch (error) {
            console.error("Error in onCoverPhotoUpdate:", error);
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
                        <Image 
                         source={coverImage || require("../assets/cover.jpg")}  
                        style={styles.BackgroundCover}
                        />

                        <TouchableOpacity style={styles.accountChildBackgroundCoverButton} onPress={()=> onCoverPhotoUpdate()}>
                            <MaterialCommunityIcons name="camera" size={25} color="#000" />
                        </TouchableOpacity>

                </View>
                {/* ENDS */}

                {/* PROFILE PICTURE */}
                <View style={styles.accountChildProfilePicture}>

                    <Image 
                     source={profileImage || require("../assets/user.jpg")} 
                    style={styles.BackgroundProfile}
                    />

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
                                <AntDesign name="profile" size={15} color="#333" />
                            </View>
                            <Text style={styles.accountChildContentItemButtonText}>Edit profile</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.accountChildContentItemButtonWrap} onPress={()=> sendPasswordReset(userEmail)}>
                            <View style={styles.accountChildContentItemButtonIcon}>
                                <MaterialIcons name="password" size={15} color="#333" />
                            </View>
                            <Text style={styles.accountChildContentItemButtonText}>Change password</Text>
                        </TouchableOpacity>

                    </View>

                    {/* SECOND SECTION */}

                    <View style={[styles.accountChildContentItem, {position: 'relative'}]}>

                        <TouchableOpacity style={styles.accountChildContentItemButtonWrap}>
                            <View style={styles.accountChildContentItemButtonIcon}>
                                <MaterialIcons name="backup" size={15} color="#333" />
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
                                <MaterialIcons name="sync" size={15} color="#333" />
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
                        <TouchableOpacity style={styles.accountChildContentItemButtonWrap}>
                            <View style={styles.accountChildContentItemButtonIcon}>
                                <MaterialCommunityIcons name="lock" size={15} color="#333" />
                            </View>
                            <Text style={styles.accountChildContentItemButtonText}>Security & privacy</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.accountChildContentItemButtonWrap} 
                        onPress={()=> {
                            setSettings(true);
                            changeView('play');
                        }
                        }>
                            <View style={styles.accountChildContentItemButtonIcon}>
                                <MaterialIcons name="feedback" size={15} color="#333" />
                            </View>
                            <Text style={styles.accountChildContentItemButtonText}>Feedback</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.accountChildContentItemButtonWrap} onPress={()=> logout()}>
                            <View style={styles.accountChildContentItemButtonIcon}>
                                <MaterialCommunityIcons name="logout" size={15} color="#333" />
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

const styles = StyleSheet.create({

    accountParent:
    {
        flex: 1,
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'relative',
        backgroundColor: '#000',
        paddingTop: 0,
        position: 'relative'
    },

    // PROFILE
    editProfileParent:
    {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'absolute',
        bottom: 0,
        right: 0,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, .9)',
        zIndex: 19,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },

    editProfileChild:
    {
        width: '100%',
        height: '70%',
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    // ENDS


    accountChild:
    {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 5,
        paddingHorizontal: 15,
        position: 'absolute',
        top: 30,
        zIndex: 11


    },

    // SECOND
    secondAccountChild:
    {
        width: '100%',
        height: '35%',
        position: 'relative',
        backgroundColor: 'rgba(255, 255, 255, .7)',
    },

    accountChildCover:
    {
        width: '100%',
        height: '100%',
    },

    BackgroundCover:
    {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },

    accountChildProfilePicture:
    {
        width: 130,
        height: 130,
        position: 'absolute',
        bottom: -30,
        borderRadius: 150,
        alignSelf: 'center',
        backgroundColor: 'rgba(255, 255, 255, .6)',
        padding: 2,
        zIndex: 10
    },

    BackgroundProfile:
    {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 100
    },

    accountChildProfilePictureButton:
    {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 40,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, .8)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        elevation: 10
    },

    accountChildBackgroundCoverButton:
    {
        position: 'absolute',
        bottom:50,
        right: 30,
        width: 40,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, .9)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        elevation: 10
    },

    // THIRD
    thirdAccountChild:
    {
        width: '100%',
        height: '70%',
        backgroundColor: '#FFFAFA',
        backgroundColor: '#000',
        position: 'absolute',
        bottom: 0,
        zIndex: 9,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },

    thirdAccountChildContent:
    {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, .6)',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 10,
        paddingHorizontal: 15
    },

    accountChildContentAbout:
    {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 3,
        paddingVertical: 10,
        marginTop: 30
    },

    accountText:
    {
        color: '#000',
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 2,
        textAlign: 'center'
    },

    accountTextBio:
    {
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 1,
        textAlign: 'center'
    },

    accountChildContentItem:
    {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: 'rgba(255, 255, 255, .2)',
        borderRadius: 10,
        gap: 5
    },
    
    accountChildContentItemButtonWrap:
    {
        flexDirection: 'row',
        gap: 15,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    accountChildContentItemButtonIcon:
    {
        width: 30,
        height: 30,
        backgroundColor: 'rgba(255, 255, 255, .1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50
    },

    accountChildContentItemButtonText:
    {
        color: '#333',
        fontSize: 16,
        fontWeight: 900
    },

    toggleButton: {
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
      },
      active: {
        backgroundColor: 'green',
        width: 35,
        height: 18,
        alignSelf: 'flex-end'
      },

      inactive: {
        backgroundColor: 'red',
        width: 35,
        height: 18,
        alignSelf: 'flex-start'
      },

      buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 10,
      },

      accountToggle:
      {
        width: 45,
        backgroundColor: 'rgba(0, 0, 0, .2)',
        borderRadius: 40,
        position: 'absolute',
        right: 10,
        padding: 1,
        borderWidth: 2,
        borderColor: 'rgba(0, 0, 0, .2)',
        elevation: 1
      },

      editingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },

    })