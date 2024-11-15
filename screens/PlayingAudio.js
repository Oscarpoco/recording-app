
import { StyleSheet, TextInput, View, ScrollView } from 'react-native';

// ICONS
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';

export default function Play() {
  return (
    <View style={styles.allRecordingsParent}>

        {/* TOP NAVIGATION */}
        <View style={styles.searchParent}>
            <Octicons name="search" size={25} color="#fff" />
            <TextInput 
            placeholder='Search your recordings' 
            placeholderTextColor="#fff" 
            selectionColor="#333" 
            style={styles.searchInput}>
            </TextInput>
        </View>
        {/* TOP NAVIGATION ENDS */}

        {/* ALL RECORDINGS */}

        <View style={styles.myRecordings}>
            <ScrollView>

            </ScrollView>
        </View>
        {/* ENDS */}

        {/* RECORD BUTTON */}
        <View style = {styles.navSibling}>
            <MaterialCommunityIcons name="record-circle" size={50} color="#FF0000" />
        </View>
        {/* ENDS */}
    </View>
  );
}


// STYLING
const styles = StyleSheet.create({

    // PARENT CONTAINER
  allRecordingsParent: 
  {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    backgroundColor: '#000',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
    //   ENDS

    // NAV SIBLING
  navSibling:
  {
    width: 60 , height: 60,
    borderRadius: 50,
    backgroundColor: '#079AE9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  //   SEARCH
  searchParent:
  {
    width: '100%',
    backgroundColor: '#333',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
    paddingVertical: 0,
    borderRadius: 10,
    gap: 10
  },

  searchInput:
  {
    fontSize:16,
    width: '85%', height: 40,
    textAlignVertical: 'center',
  },
  
  myRecordings:
  {
    height: '80%',
    width: '100%',
    backgroundColor: '#333',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 5,
    borderRadius: 10,
  }

});

