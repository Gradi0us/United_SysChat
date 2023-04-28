import React, {
  useCallback,
  useState,
  useLayoutEffect,
  useEffect,
} from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { View, Text, TouchableOpacity, } from "react-native";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
  Timestamp
} from "firebase/firestore";
import DocumentPicker from 'react-native-document-picker';

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
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log(
        result.uri,
        result.type, // MIME type của tệp tin
        result.name,
        result.size
      );
      // Tại đây, bạn có thể gửi tệp tin đến máy chủ hoặc làm bất cứ điều gì bạn muốn với n
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // Người dùng hủy chọn tệp tin
      } else {
        // Xảy ra lỗi khi chọn tệp tin
        console.log(err);
      }
    }
  };
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        console.log(result.uri);
        // Tại đây, bạn có thể gửi hình ảnh đến máy chủ hoặc làm bất cứ điều gì bạn muốn với nó
      }
    } catch (err) {
      console.log(err);
    }
  };
  
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
        createdAt:doc.data().createdAt.toDate(), // định dạng lại thời gian
        text:doc.data().text,
        user:doc.data().user
      })))
    });
    return () => unsubcribe();
  }, [])
  
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

    renderActions={() => (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          onPress={() => {
           pickDocument()
          }}
          style={{ paddingHorizontal: 8 }}
        >
          <AntDesign name="picture" size={28} color={colors.gray} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
           pickImage()
          }}
          style={{ paddingHorizontal: 8 }}
        >
          <AntDesign name="folder1" size={28} color={colors.gray} />
        </TouchableOpacity>
      </View>
    )}
  />
  
     );
}
