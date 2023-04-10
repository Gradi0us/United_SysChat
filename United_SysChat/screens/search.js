import React, { useState, useEffect } from "react";
import {
  TextInput,
  FlatList,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { auth, database } from "../config/firebase";
import {
  getDocs,
  where,
  query,
  collection,
  doc,
  addDoc,
  getDoc,
} from "firebase/firestore";
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../colors';
const Search = () => {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [displayName, setDisplayName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [backGrUrl, setBackgroundUrl] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [avatarUrl, setAvatarurl] = useState("");
  const [nickname, setnickName] = useState("");
  const currentUser = auth.currentUser;
  const usersRef = collection(database, "users");
  const handleSearchTextChange = (text) => {
    setSearchText(text);
  };

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
            setBackgroundUrl(data.backGrUrl);
            setnickName(data.nickname);
          } else {
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    }
  }, [currentUser]);
  useEffect(() => {
    const getUsers = async () => {
      const email = searchText;
      try {
        const q = query(
          collection(database, "users"),
          where("nickname", "==", email)
        );
        const querySnapshot = await getDocs(q);
        const users = [];
        querySnapshot.forEach((doc) => {
          users.push(doc.data());
        });
        setData(users);
      } catch (error) {
        console.log(error);
      }
    };

    getUsers();
  }, [searchText]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedItem(item);
        setShowModal(true);
        setAvatarurl(item.avatarUrl);
        setBackgroundUrl(item.backGrUrl);
        setDisplayName(item.displayName); 
      }}
    >
      <View style={{ padding: 10, flexDirection: "row" }}>
        <Image
          source={{ uri: item.avatarUrl }}
          style={{ height: 40, width: 40, borderRadius: 40 }}
        ></Image>
        <View style={{ marginTop: 3 }}>
          <Text style={{ marginLeft: 5, fontWeight: "bold" }}>
            {item.displayName}
          </Text>
          <Text style={{ marginLeft: 9, fontSize: 11 }}>{item.nickname}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
 
  const keyExtractor = (item) => item.id;

  return (
    <View>
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1, margin: 10 }}
        onChangeText={handleSearchTextChange}
        value={searchText}
        placeholder="Search nickname"
      />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
      <Modal visible={showModal} animationType="slide">
        {selectedItem && (
            <ImageBackground
            source={{ uri: selectedItem.backGrUrl }}
            style={styles.backgroundImage}
          >
          <View  style={{height:25,width:'100%',backgroundColor:'white',}}>
          <TouchableOpacity onPress={() => setShowModal(false)} style={{flexDirection:'row',alignItems:'center'}}>
          <FontAwesome  
          name="arrow-left"
          size={20}
          color={Colors.gray}
          style={{ marginLeft: 15 }}
        />
          <Text style={{fontSize:12,fontWeight:'bold',color:'gray',marginLeft:10}} >back</Text>
          </TouchableOpacity>
         
          </View>
            
          
              <View style={styles.overlay}>
                <View style={styles.container}>
                  <Image
                    source={{ uri: selectedItem.avatarUrl }}
                    style={styles.image}
                  />
                  <View style={styles.infoContainer}>
                    <Text style={styles.name}>{selectedItem.displayName}</Text>
                    <Text style={styles.id}>United_SysChat</Text>
                  </View>
                </View>
              </View>
            </ImageBackground>
          
        )}
      </Modal>
    </View>
  );
  
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    height: "20%",
  
  },
  overlay: {},
  pressable: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#80EBFD",
  },
  text: {
    color: "white",
    fontSize: 15,
    textAlign: "center",
  },
  container: {
    marginTop: 100,
    flexDirection: "row",
    padding: 20,
  },
  image: {
  
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  infoContainer: {
    marginTop: 30,
    justifyContent: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  id: {
    marginTop: 5,
    fontSize: 16,
    color: "gray",
  },
});
export default Search;
