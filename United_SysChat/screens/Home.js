import React,{ useEffect,useState } from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet} from "react-native"
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../colors';
import { Entypo } from '@expo/vector-icons';

import { auth, database } from "../config/firebase";
import { addDoc, collection } from "firebase/firestore";
import { getDoc, doc, updateDoc, setDoc } from "firebase/firestore";
function MyHeader(props) {
  const { displayName, avatarUrl } = props;
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={{flexDirection:"row"}}>

        <TouchableOpacity  onPress={() => navigation.navigate('search') }>
        <FontAwesome
          name="search"
          size={24}
          color={Colors.gray}
          style={{ marginLeft: 15 }}
        />
        </TouchableOpacity>
        
        <FontAwesome
        name="bell"
        size={24}
        color={Colors.gray}
        style={{ marginLeft: 15 }}
      />
      <FontAwesome
      name="users"
      size={24}
      color={Colors.gray}
      style={{ marginLeft: 15 }}
    />
        </View>
        
        
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('profile')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              marginRight: 15,
              fontWeight: 'bold',
            }}
          >
            Hi: {displayName}
          </Text>
          <Image
            source={{ uri: avatarUrl }}
            style={{
              width: 40,
              height: 40,
              marginRight: 15,
              borderRadius: 40,
            }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, displayName, avatarUrl]);

  return (
   <View></View>
  );
}
   const Home = () =>{
    const [displayName, setDisplayName] = useState("");
    const [avatarUrl, setAvatarurl] = useState("");
    const navigation = useNavigation();
    const currentUser = auth.currentUser;
    // useEffect(() =>{
    //     navigation.setOptions({
    //         headerLeft: () =>(
    //             <FontAwesome name="search" size={24} color={Colors.gray} style={{marginLeft:15}}/>
    //         ),
    //         headerRight: () =>(
                
    //             <TouchableOpacity  onPress={() => navigation.navigate("profile")} style={{
    //                 flexDirection: 'row',
    //                 alignItems: 'center',
    //               }}>
    //             <Text  style={{
    //             marginRight:15,
    //             fontWeight:"bold",
    //             }}>Hi:{displayName}</Text>
    //             <Image source={{uri:avatarUrl}}
    //             style={{
    //                 width:40,
    //                 height:40,
    //                 marginRight:15,
    //                 borderRadius: 40,
    //             }}
    //             />
    //             </TouchableOpacity>
               
    //         ),
        
            
    //     });
    // },[navigation]);

    useEffect(() => {
      if (currentUser) {
        const uid = currentUser.uid;
        const userDocRef = doc(collection(database, "users"), uid);
        getDoc(userDocRef)
          .then((doc) => {
            if (doc.exists()) {
              const data = doc.data();
              setDisplayName(data.displayName);
              setAvatarurl(data.avatarUrl);
            
            } else {
              console.log("No such document!");
            }
          })
          .catch((error) => {
            console.log("Error getting document:", error);
          });
      }
    }, [currentUser]);
return(
  <> 
  <MyHeader displayName={displayName} avatarUrl={avatarUrl} />
    <View style={styles.container}>
    <TouchableOpacity onPress={() => navigation.navigate("Chat")} style={styles.chatButton}>
    <Entypo name="chat" size={24} color={Colors.lightGray} />
    </TouchableOpacity>
    </View>
    </>
)
   }
   const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      backgroundColor: '#fff'
    },
    chatButton: {
      backgroundColor: Colors.primary,
      height: 50,
      width: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: Colors.primary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.9,
      shadowRadius: 8,
      marginRight: 20,
      marginBottom: 50,
    }
  
})
   export default Home;

   