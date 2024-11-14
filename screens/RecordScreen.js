
import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native';

// ICONS
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Record() {

  return (
    <View style={styles.recordParent}>

      {/* TITLE */}
            <TextInput 
            placeholder='Add title' 
            placeholderTextColor="#B0B0B0" 
            selectionColor="#000"   
            style={styles.title}>
            </TextInput>
      {/* TITLE ENDS*/}
    
      {/* VISUALIZATION */}

            <View style = {styles.visualization}>
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
            <View>
                <Text style={styles.time}>00:00:00</Text>
            </View>
      {/* ENDS */}

      {/* BOTTOM NAV */}
            <View style = {styles.navParent}>

                <View style = {styles.navChild}>
                    <Entypo name="cross" size={30} color="#333" />
                </View>

                <View style = {styles.navSibling}>
                    <MaterialCommunityIcons name="record-circle" size={50} color="#FF0000" />
                </View>

                <View style = {styles.navChild}>
                    <MaterialIcons name="done" size={30} color="#333" />
                </View>

            </View>
      {/* ENDS */}


    </View>
  );
}

const styles = StyleSheet.create({

    // PARENT 
    recordParent: 
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
        // backgroundColor: '#333',
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
        width: 50 , height: 50,
        borderRadius: 50,
        backgroundColor: '#079AE9',
        justifyContent: 'center',
        alignItems: 'center',
    },

    navSibling:
    {
        width: 80 , height: 80,
        borderRadius: 50,
        backgroundColor: '#079AE9',
        justifyContent: 'center',
        alignItems: 'center',
    },

    time:
    {
        fontSize: 50,
        fontWeight: 'bold',
        letterSpacing: 5,
        marginBottom: 50,
        color: '#fff'
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
        gap: 3
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
        gap: 1
    },

    title:
    {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
        letterSpacing: 5,
        marginBottom: 30,
        borderWidth: 2,
        borderColor: '#333',
        borderRadius: 10,
        paddingHorizontal: 80
    }
    // ENDS

});
