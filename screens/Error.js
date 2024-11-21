import 
{
    View,
    StyleSheet,
    Text,
    Pressable,
    ImageBackground,
    Image
}
from 'react-native';

export default function ErrorPage(){


    return(
        <View style={styles.signParent}>
            {/* BACKGROUND */}
                <ImageBackground 
                source={require('../assets/splashScreen.jpg')} 
                style={styles.Backgroundimage}
                />
            {/* ENDS */}

            <View syle={styles.signChild}>

            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({

    signParent:
    {
        flex: 1,
    }

})