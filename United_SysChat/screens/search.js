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
  setDoc,
  docs,
  deleteDoc,

} from "firebase/firestore";
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../colors';
const Search = () => {

  //get user infor
  const [user, setUser] = useState();
  const [userUid, setUserUid] = useState(null);
  const [docId, setDocId] = useState(null);
  const [from_user_id, setFromUserId] = useState('');
  const [to_user_id,setToUserID] = useState('');
  const [status,setStatus]=useState(null)
  const [renderKey, setRenderKey] = useState(0);
 // const [selectedUserId, setSelectedUserId] = useState(null);
  //
  //database access
  const friendsrequest = collection(database, "friends");
  const usersRef = collection(database, "users");
  //
  //firestore api
  //
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [displayName, setDisplayName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [backGrUrl, setBackgroundUrl] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [avatarUrl, setAvatarurl] = useState("");
  const [nickname, setnickName] = useState("");
  const currentUser = auth.currentUser;

  const handleSearchTextChange = (text) => {
    setSearchText(text);
  };

  useEffect(() => {
    if (user) {
      setUserUid(user.uid);
    }
  }, [user]);
  useEffect(() => {
    if (currentUser) {
      const uid = currentUser.uid;
      const userDocRef = doc(collection(database, "users"), uid);
      const friends = doc(collection(database, "friends"));
      getDoc(userDocRef,friends)
      
        .then((doc) => {
          if (doc.exists()) {
            const data = doc.data();
            setDisplayName(data.displayName);
            setAvatarurl(data.avatarUrl);
            setBackgroundUrl(data.backGrUrl);
            setnickName(data.nickname);
            setStatus(data.status);
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
    const getStatus = async () => {
      if (currentUser) {
        const uid = currentUser.uid;
        const q = query(
          collection(database, "friends"),
          where("from_user_id", "==", uid)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          setStatus(data.status);
         
        });
      }
    };
  
    getStatus();
  }, [currentUser]);

  useEffect(() => {
    const getUsers = async () => {
      const nicknamesearch = searchText;
      try {
        const q = query(
          collection(database, "users"),
          where("nickname", "==", nicknamesearch)
        );
        const querySnapshot = await getDocs(q);
        const users = [];
        querySnapshot.forEach((doc) => {
          users.push(doc.data());
          setDocId(doc.id);
        });
        setData(users);
      } catch (error) {
        console.log(error);
      }
    };
   
    

    getUsers();
  }, [searchText]);
  const cancelRequest = async () => {
    try {
      const currentUserUid = currentUser.uid;
      const selectedUserId = docId;
      const docRef = collection(database, "friends");
      const querySnapshot = await getDocs(
        query(docRef, where("from_user_id", "==", currentUserUid), where("to_user_id", "==", selectedUserId))
      );
  
      if (querySnapshot.size > 0) {
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
      } else {
        console.log("Không tìm thấy dữ liệu phù hợp");
      }
    } catch (e) {
      console.error("Lỗi khi xóa tài liệu: ", e);
    }
  };
  
  const friendsRequest = async () => {
    try {
      const currentUserUid = currentUser.uid;
      const selectedUserId = docId;
      const docRef = collection(database, "friends");
      const querySnapshot = await getDocs(
        query(docRef, where("from_user_id", "==", currentUserUid), where("to_user_id", "==", selectedUserId))
      );
  
      if (querySnapshot.size > 0) {
        console.log("Friend request already exists");
      } else {
        console.log("Creating new friend request");
        await addDoc(docRef, {
          status: "pending",
          from_user_id: currentUserUid,
          to_user_id: selectedUserId,
        });
      }
    } catch (e) {
      console.error("Error saving document: ", e);
    }
  };
  
  
  
  useEffect(() => {
    // Khi trạng thái của status thay đổi, tăng giá trị của state renderKey để cập nhật lại renderItem
    setRenderKey(renderKey + 1);
  }, [status]);
  const renderItem = ({ item }) => (
  
    <TouchableOpacity
    key={renderKey}
      style={{
        justifyContent:'center',
        flexDirection: 'row',
        width: '100%',
        borderRadius: 5,
        borderWidth: 1,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          setSelectedItem(item);
          setShowModal(true);
          setAvatarurl(item.avatarUrl);
          setBackgroundUrl(item.backGrUrl);
          setDisplayName(item.displayName);
          setStatus(item.status);
        }}
      >
        <View style={{ padding: 10, flexDirection: 'row' }}>
          <Image
            source={{ uri: item.avatarUrl }}
            style={{ height: 40, width: 40, borderRadius: 40 }}
          />
          <View style={{ marginTop: 3 }}>
            <Text style={{ marginLeft: 5, fontWeight: 'bold' }}>
              {item.displayName}
            </Text>
            <Text style={{ marginLeft: 9, fontSize: 11 }}>
              {item.nickname}
            </Text>
        
          </View>
        </View>
      </TouchableOpacity>
      <View style={{ width: '17%' }}>
   
    
  </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          style={{
            marginRight: 10,
            backgroundColor: '#1E90FF',
            padding: 10,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: 'white' }}>Message</Text>
        </TouchableOpacity>
  
       {status === 'undefined' || !status && (
        <TouchableOpacity
            style={{
              backgroundColor: 'white',
              padding: 10,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: '#1E90FF',
            }}
            onPress={() => friendsRequest()}
          >
            <Text style={{ color: '#1E90FF' }}>Add Friend</Text>
          </TouchableOpacity>
       )}
          
        
        {status === 'pending' && (
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              padding: 10,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: 'gray',
            }}
            onPress={() => cancelRequest()}
          >
            <Text style={{ color: 'gray' }}>Cancel Request</Text>
          </TouchableOpacity>
        )}
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
