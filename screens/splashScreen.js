
import { StyleSheet, Text, View } from 'react-native';

export default function Splash() {


  return (
    <View style={styles.splashParent}>

        {/* FIRST CHILD */}
            <View style = {styles.firstChild}>
                    
            </View>
        {/* ENDS */}

        {/* SECOND CHILD */}
            <View style = {styles.secondChild}>

                <View style = {styles.secondChildSibling}>
                    <Text style = {styles.text}>Recording</Text>
                </View>

            </View>
        {/* ENDS */}
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
    justifyContent: 'flex-start',
    position: 'relative',
  },
    //   ENDS

    //   FIRST CHILD

    firstChild: 
    {
        width: '100%',
        height: '60%',
        backgroundColor: '#fff',
    },

     // Text style inside the firstChild
    text: 
    {
        color: '#079AE9',
        fontSize: 34,
        textAlign: 'center',
        fontWeight: 900
    },

    // ENDS

    // SECOND CHILD
    secondChild: 
    {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '50%',
        backgroundColor: '#ADD8E6',
        borderRadius: 40,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Second child sibling
    secondChildSibling:
    {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 10,
        backgroundColor: '#000',
        width: '70%',
        height: '50%',
        borderRadius: 40,
    }
    // ENDS

});
