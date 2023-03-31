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
export default function Chat() {
    
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
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
    onSend={messages =>onSend(messages)}
    user={{

        _id:auth?.currentUser?.email,
        avatar:'https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-6/307095126_1987446148259547_7169112336924064042_n.jpg?stp=cp6_dst-jpg&_nc_cat=105&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=od1rqPfbIx8AX97VMXW&_nc_ht=scontent.fhan2-4.fna&oh=00_AfCgruLebY1teP7mVGwwcLXve2RMwqgYrazxSiJr-n_UgQ&oe=642C82A7'
    }}
    messagesContainerStyle={{
        backgroundColor:'#fff'
    }}
     />
     );
}
