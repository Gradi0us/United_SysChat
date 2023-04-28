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

function Notif() {
  const  currentUserUid  = auth.currentUser.uid
  const [notifications, setNotifications] = useState([]);
  console.log(currentUserUid)
  const friendsrequest = collection(database, "friends");
  const usersRef = collection(database, "users");

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const querySnapshot = await getDocs(query(friendsrequest, where( "to_user_id" , "==", currentUserUid)));
        console.log(querySnapshot)

        const notifications = [];

        querySnapshot.forEach(async (doc) => {
          const  from_user_id  = doc.data();
          console.log(querySnapshot)
          const userDoc = await getDoc(doc(usersRef, from_user_id));
          const user = userDoc.data();
          
          notifications.push({
            id: doc.id,
            user: user,
          });
        });

        setNotifications(notifications);
      } catch (error) {
        console.log(error);
      }
    };

    getNotifications();
  }, [currentUserUid]); // Thêm currentUserUid vào mảng dependency của useEffect để khi currentUserUid thay đổi, useEffect được gọi lại
  
  // Render notifications giống như trước

  
    const renderItem = ({ item }) => (
      <TouchableOpacity>
        <View style={styles.notification}>
          <Image style={styles.avatar} source={{ uri: item.user.avatarUrl }} />
          <Text style={styles.text}>{item.user.name} sent you a friend request</Text>
        </View>
      </TouchableOpacity>
    );
  
    return (
      <View style={styles.container}>
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  }
  
  export default Notif;
  
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: Colors.white,
      },
      itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGray,
      },
      avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 16,
      },
      name: {
        fontSize: 16,
        fontWeight: "bold",
      },
    });

