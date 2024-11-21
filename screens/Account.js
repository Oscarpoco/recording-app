import 
{
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity
}
from 'react-native';

// ICONS
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


export default function Account({changeView}){


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
                        source={require('../assets/cover.jpg')} 
                        style={styles.BackgroundCover}
                        />
                </View>
                {/* ENDS */}

                {/* PROFILE PICTURE */}
                <View style={styles.accountChildProfilePicture}>
                    <Image 
                    source={require('../assets/user.jpg')} 
                    style={styles.BackgroundProfile}
                    />
                </View>
                {/* ENDS */}
            </View>

            {/* ACCOUNT CONTENT */}
            <View style={styles.thirdAccountChild}>
                <View style={styles.thirdAccountChildContent}>

                    <View style={styles.accountChildContentAbout}>
                        <Text style={styles.accountText}>Oscar Poco</Text>
                        <Text style={styles.accountTextBio}>I am a Software developer</Text>
                    </View>

                    {/* FIRST SECTION */}
                    
                    <View style={styles.accountChildContentItem}>

                        <TouchableOpacity style={styles.accountChildContentItemButtonWrap}>
                            <View style={styles.accountChildContentItemButtonIcon}>
                                <AntDesign name="profile" size={15} color="#333" />
                            </View>
                            <Text style={styles.accountChildContentItemButtonText}>Edit profile</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.accountChildContentItemButtonWrap}>
                            <View style={styles.accountChildContentItemButtonIcon}>
                                <MaterialIcons name="password" size={15} color="#333" />
                            </View>
                            <Text style={styles.accountChildContentItemButtonText}>Change password</Text>
                        </TouchableOpacity>

                    </View>

                    {/* SECOND SECTION */}

                    <View style={styles.accountChildContentItem}>

                        <TouchableOpacity style={styles.accountChildContentItemButtonWrap}>
                            <View style={styles.accountChildContentItemButtonIcon}>
                                <MaterialIcons name="backup" size={15} color="#333" />
                            </View>
                            <Text style={styles.accountChildContentItemButtonText}>Backup</Text>
                        </TouchableOpacity>

                    </View>

                    {/* THIRD SECTION */}
                    <View style={styles.accountChildContentItem}>
                        <TouchableOpacity style={styles.accountChildContentItemButtonWrap}>
                            <View style={styles.accountChildContentItemButtonIcon}>
                                <MaterialCommunityIcons name="lock" size={15} color="#333" />
                            </View>
                            <Text style={styles.accountChildContentItemButtonText}>Security & privacy</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.accountChildContentItemButtonWrap}>
                            <View style={styles.accountChildContentItemButtonIcon}>
                                <MaterialIcons name="feedback" size={15} color="#333" />
                            </View>
                            <Text style={styles.accountChildContentItemButtonText}>Feedback</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.accountChildContentItemButtonWrap} onPress={()=> changeView('signUp')}>
                            <View style={styles.accountChildContentItemButtonIcon}>
                                <MaterialCommunityIcons name="logout" size={15} color="#333" />
                            </View>
                            <Text style={styles.accountChildContentItemButtonText}>Logout</Text>
                        </TouchableOpacity>

                    </View>

                </View>
            </View>
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
        // backgroundColor: '#000',
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
        borderRadius: 40,
    },

    thirdAccountChildContent:
    {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, .6)',
        borderRadius: 40,
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
        gap: 1,
        marginBottom: 40
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
        letterSpacing: 2,
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
    }


})