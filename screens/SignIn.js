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


export default function SignIn({changeView, showPassword, setShowPassword, login}){


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
                    <Text style={styles.signTextTitle}>Welcome back</Text>

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

                        {/* PASSWORD */}
                        <View style={[styles.signInputContainer, {marginTop:25}]}>
                            <Text style={styles.signText}>Password</Text>
                            <TextInput
                            style={styles.signInput}
                            placeholder="Enter your password"
                            secureTextEntry={!showPassword}
                            />

                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}
                            >
                                <Feather
                                    name={showPassword ? 'eye' : 'eye-off'}
                                    size={20}
                                    color="gray"
                                />
                            </TouchableOpacity>

                        </View>
                        {/* ENDS */}

                        {/* BUTTON */}
                        <TouchableOpacity style={styles.signButton} onPress={()=> login()}>
                            <Text style={styles.signButtonText}>Login</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.signForgot}>
                            <Text style={styles.signForgotText}>Forgot Password?</Text>
                        </TouchableOpacity>
                        {/* ENDS */}
                    </View>
                    {/* ENDS */}

                    {/* FORGOT PASSWORD */}
                    <View style={styles.signUpParent}>

                        <TouchableOpacity style={styles.signUp} onPress={()=> changeView('signUp')}>
                            <Text style={[styles.signForgotText, {fontSize: 15}]}>New Account</Text>
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
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, .1)',
        borderRadius: 150,
        marginTop: 50
    },

    image:
    {
        width: 150,
        height: 150,
        justifyContent: 'center',
        resizeMode: 'cover',
        borderRadius: 100
    },

    signForm:
    {
        width: '100%',
        height: '65%',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, .8)',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 20,
        gap: 50
    },

    signTextTitle:
    {
        fontSize: 24,
        color: 'rgba(0, 0, 0, 5)',
        fontWeight: 900
    },

    signInputContainer:
    {
        width: 300,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 5,
        position: 'relative'
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
        paddingHorizontal: 20,
        fontSize: 14,
        fontWeight: 900,
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
        marginTop: 30

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
        marginTop: 20,
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

    eyeIcon: {
        bottom: 15,
        right: 15,
        position: 'absolute'

    },


})