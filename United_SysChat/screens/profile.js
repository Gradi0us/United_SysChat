import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal } from 'react-native';
import { auth, database } from "../config/firebase";
import {addDoc, collection } from 'firebase/firestore';

const UpdateProfileScreen = () => {
  const [user, setUser] = useState();
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarurl] = useState('');
  const [backGrUrl, setBackgroundUrl] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [uidExists, setUidExists] = useState(false); 
  const currentUser = auth.currentUser;
  const usersRef = collection(database, 'users');

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
      setUidExists(true);
    }
  }, [currentUser]);

  const handleSave = async () => {
    try {
      const userDocRef = collection(database, 'users').doc(user.userID);
      const doc = await userDocRef.get();
  
      if (doc.exists) {
        // If a document with the same UID already exists, update its fields
        await userDocRef.update({
          displayName: displayName,
          avatarUrl: avatarUrl,
          backGrUrl: backGrUrl
        });
        console.log("Document updated with ID: ", userDocRef.id);
      } else {
        // If no document with the same UID exists, create a new document
        await addDoc(collection(database, 'users'), {
          uid: user.uid,
          displayName: displayName,
          avatarUrl: avatarUrl,
          backGrUrl: backGrUrl
        });
        console.log("New document added with ID: ", userDocRef.id);
      }
  
      setShowModal(false);
    } catch (e) {
      console.error("Error saving document: ", e);
    }
  }

  return (
    <View>
      <Text>Display Name: {displayName}</Text>
      <Text>Avatar Url: {avatarUrl}</Text>
      <Text>Background Url: {backGrUrl}</Text>
      <Button title="Edit Profile" onPress={() => setShowModal(true)} />
      <Modal visible={showModal} animationType="slide">
        <View>
          <TextInput
            placeholder="Display Name"
            value={displayName}
            onChangeText={text => setDisplayName(text)}
          />
          <TextInput
            placeholder="Avatar Url"
            value={avatarUrl}
            onChangeText={text => setAvatarurl(text)}
          />
          <TextInput
            placeholder="Background Url"
            value={backGrUrl}
            onChangeText={text => setBackgroundUrl(text)}
          />
          <Button title="Save" onPress={handleSave} />
        </View>
      </Modal>
    </View>
  );
}
export default UpdateProfileScreen;