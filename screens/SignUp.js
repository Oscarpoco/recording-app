import 
{
    View,
    StyleSheet,
    Text,
    Pressable,
    Image,
    TextInput,
    TouchableOpacity
}
from 'react-native';

// ICONS
import Feather from 'react-native-vector-icons/Feather';


export default function SignUp({changeView}){


    return(
        <View style={styles.signParent}>
            {/* BACKGROUND */}
                <Image
                source={require('../assets/splashScreen.jpg')} 
                style={styles.Backgroundimage}
                />
            {/* ENDS */}

            <View style={[styles.signChild, styles.blurOverlay]}>

                {/* LOGO */}
                <View style={styles.signLogo}>
                    <Image
                    source={require('../assets/download.jpg')} 
                    style={styles.image}
                    />
                </View>
                {/* ENDS */}

                {/* FORM WRAPPER*/}
                <View style={styles.signForm}>
                    <Text style={styles.signTextTitle}>Get started</Text>

                    {/* FORM */}
                    <View>

                        {/* EMAIL */}
                        <View style={styles.signInputContainer}>
                            <Text style={styles.signText}>Email</Text>
                            <TextInput
                            style={styles.signInput}
                            placeholder="Enter your email"
                            />
                        </View>
                        {/* ENDS */}

                        {/* FULLNAMES */}
                        <View style={[styles.signInputContainer, {marginTop: 20,}]}>
                            <Text style={styles.signText}>Fullnames</Text>
                            <TextInput
                            style={styles.signInput}
                            placeholder="Enter your fullnames"
                            />
                        </View>
                        {/* ENDS */}

                        {/* PASSWORD */}
                        <View style={[styles.signInputContainer, {marginTop:25}]}>
                            <Text style={styles.signText}>Password</Text>
                            <TextInput
                            style={styles.signInput}
                            placeholder="Enter your password"
                            />
                        </View>

                        <View style={[styles.signInputContainer, {marginTop:25}]}>
                            <Text style={styles.signText}>Confirm Password</Text>
                            <TextInput
                            style={styles.signInput}
                            placeholder="Re-enter your password"
                            />
                        </View>
                        {/* ENDS */}

                        {/* BUTTON */}
                        <TouchableOpacity style={styles.signButton} onPress={()=> changeView('play')}>
                            <Text style={styles.signButtonText}>Register</Text>
                        </TouchableOpacity>

                        {/* ENDS */}
                    </View>
                    {/* ENDS */}

                    {/* FORGOT PASSWORD */}
                    <View style={styles.signUpParent}>

                        <TouchableOpacity style={[styles.signUp, {marginBottom: 20,}]} onPress={()=> changeView('sign')}>
                            <Text style={[styles.signForgotText, {fontSize: 15}]}>Sign In</Text>
                            <Feather name="arrow-right-circle" size={30} color="rgba(0, 0, 0, .5)" />
                        </TouchableOpacity>

                    </View>
                    {/* ENDS */}
                </View>
                {/* ENDS */}
            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({

    signParent:
    {
        flex: 1,
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        backgroundColor: '#000',
    },

    signChild:
    {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'absolute',
    },

    blurOverlay: 
    {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 1)', 
        backdropFilter: 'blur(100px)',
      
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

    signLogo:
    {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, .1)',
        borderRadius: 100,
        marginTop: 40
    },

    image:
    {
        width: 70,
        height: 70,
        justifyContent: 'center',
        resizeMode: 'cover',
        borderRadius: 100
    },

    signForm:
    {
        width: '100%',
        height: '80%',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, .8)',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        gap: 30
    },

    signTextTitle:
    {
        fontSize: 24,
        color: 'rgba(0, 0, 0, 5)',
        fontWeight: 900,
        marginTop: 20,
    },

    signInputContainer:
    {
        width: 300,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 5,
    },

    signText:
    {
        fontSize: 16,
        fontWeight: 900,
        color: '#333',
        letterSpacing: 1,
        marginLeft: 10
    },

    signInput:
    {
        backgroundColor: 'rgba(0, 0, 0, .1)',
        width: '100%',
        height: 50,
        borderRadius: 10,
        paddingHorizontal: 20
    },

    signButton:
    {
        backgroundColor: 'rgba(0, 0, 0, 1)',
        width: 300,
        height: 50,
        borderRadius: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20

    },

    signButtonText:
    {
        fontSize: 16,
        color: '#fff',
        fontWeight: 900,
        textAlign: 'center',
    },

    signUpParent:
    {
        flexDirection: 'column',
        alignItems: 'flex-end',
        width: 310,
    },

    signForgot:
    {
        marginLeft: 5,
        marginTop: 15,
    },

    signForgotText:
    {
        fontSize: 13,
        letterSpacing: 1,
        fontWeight: 900,
    },

    signUp:
    {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },


})