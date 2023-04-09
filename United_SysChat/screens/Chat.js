import React, {
  useCallback,
  useState,
  useLayoutEffect,
  useEffect,
} from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { View, Text, TouchableOpacity } from "react-native";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
  Timestamp
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, database } from "../config/firebase";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import colors from "../colors";
import { Avatar } from "react-native-elements";
import { getDoc, doc, updateDoc, setDoc } from "firebase/firestore";
export default function Chat() {
  const [user, setUser] = useState();
    const [displayNamee, setDisplayName] = useState("");
    const [avatarUrl, setAvatarurl] = useState("");
  
    const currentUser = auth.currentUser;  
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    if (user) {
    }
  }, [user]);
useEffect(() => {
    if (currentUser) {
      const uid = currentUser.uid;
      const userDocRef = doc(collection(database, "users"), uid);
      getDoc(userDocRef)
        .then((doc) => {
          if (doc.exists()) {
            const data = doc.data();
            setDisplayName(data.displayNamee);
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
  const onSignOut = () => {
    signOut(auth);
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 10 }} onPress={onSignOut}>
          <AntDesign 
            name="logout"
            size={24}
            color={colors.gray}
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  
useLayoutEffect(() => {
    const collectionRef = collection(database,'chats');
    const q = query(collectionRef,orderBy('createdAt','desc'));
    const unsubcribe = onSnapshot(q,snapshot => {
        console.log('snapshot');
        setMessages(snapshot.docs.map(doc =>({
            _id:doc.id,
            createdAt:doc.data().createdAt,
            text:doc.data().text,
            user:doc.data().user
        }))
        )
    });return()=> unsubcribe();
},[])
const onSend = useCallback((messages = []) =>{
    setMessages(previousMessages => GiftedChat.append(previousMessages,messages));
   
    const {_id,text,user} = messages[0];
    const createdAt = Timestamp.fromDate(new Date());
    addDoc(collection(database,'chats'),{
        _id,
        createdAt,
        text,
        user
    })
},[])
  return (<GiftedChat 
    messages={messages}
    onSend={messages => onSend(messages)}
    user={{
      _id:auth?.currentUser?.email,
      avatar:{uri:avatarUrl},
    }} 
    messagesContainerStyle={{
      backgroundColor: '#fff',
    }}
    renderAvatar={({ currentMessage }) => (
      <Avatar
        size={40}
        rounded
        source={currentMessage.user.avatar}
      />
    )}
    renderUsernameOnMessage
  />
  
     );
}
