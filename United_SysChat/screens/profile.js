import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  StyleSheet,
  ImageBackground,
  Image,
} from "react-native";
import { auth, database } from "../config/firebase";
import { addDoc, collection } from "firebase/firestore";
import { getDoc, doc, updateDoc, setDoc } from "firebase/firestore";

const UpdateProfileScreen = () => {
  const [user, setUser] = useState();
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarurl] = useState("");
  const [nickname, setnickName] = useState("");
  const [backGrUrl, setBackgroundUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [uidExists, setUidExists] = useState(false);
  const [userUid, setUserUid] = useState(null);
  const currentUser = auth.currentUser;
  const usersRef = collection(database, "users");
  useEffect(() => {
    if (user) {
      setUserUid(user.uid);
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

  const handleSave = async () => {
    try {
      const docRef = doc(usersRef, currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Updating existing document with ID: ", docSnap.id);
        await updateDoc(docRef, {
          displayName: displayName,
          avatarUrl: avatarUrl,
          backGrUrl: backGrUrl,
          nickname: nickname,
        });
      } else {
        console.log("Creating new document for UID: ", user.uid);
        const userUid = user.uid;
        console.log(userUid);
        const userDocRef = doc(usersRef, userUid);
        await setDoc(userDocRef, {
          displayName: displayName,
          avatarUrl: avatarUrl,
          backGrUrl: backGrUrl,
          nickname: nickname,
        });
      }
      setShowModal(false);
    } catch (e) {
      console.error("Error saving document: ", e);
    }
  };

  return (
      <ImageBackground
        source={{uri: backGrUrl}}  
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <Image
              source={{uri: avatarUrl}}
              style={styles.image}
            />
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{displayName}</Text>
              <Text style={styles.id}>United_SysChat</Text>
            </View>
          </View>
        </View>
     
      <Button title="Edit Profile" onPress={() => setShowModal(true)} />
      <Modal visible={showModal} animationType="slide">
        <View>
          <TextInput
            placeholder="Display Name"
            value={displayName}
            onChangeText={(text) => setDisplayName(text)}
          />
          <TextInput
            placeholder="Avatar Url"
            value={avatarUrl}
            onChangeText={(text) => setAvatarurl(text)}
          />
          <TextInput
          placeholder="nickname"
          value={nickname}
          onChangeText={(text) => setnickName(text)}
        />
          <TextInput
            placeholder="Background Url"
            value={backGrUrl}
            onChangeText={(text) => setBackgroundUrl(text)}
          />
          <Button title="Save" onPress={handleSave} />
        </View>
      </Modal>
      </ImageBackground>
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
    marginTop: 10,
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  infoContainer: {
    marginTop: 40,
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

export default UpdateProfileScreen;
