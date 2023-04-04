import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal } from 'react-native';
import { auth, database } from "../config/firebase";

const UpdateProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [uidExists, setUidExists] = useState(false); // Thêm state để theo dõi xem UID đã có trong database hay chưa

  // Lấy thông tin người dùng đăng nhập
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const checkUidExists = async () => {
      // Kiểm tra xem UID của người dùng đã có đủ thông tin trong database hay chưa
      const userRef = database.collection('users').doc(auth.currentUser.uid);
      const userSnapshot = await userRef.get();

      if (userSnapshot.exists && userSnapshot.data().displayName && userSnapshot.data().phoneNumber) {
        // Nếu đã có đủ thông tin, lấy thông tin và đánh dấu là đã có trong database
        setDisplayName(userSnapshot.data().displayName);
        setPhoneNumber(userSnapshot.data().phoneNumber);
        setUidExists(true);
      } else {
        // Nếu chưa đủ thông tin, đánh dấu là chưa có trong database
        setUidExists(false);
      }
    };

    if (auth.currentUser) {
      checkUidExists();
    }
  }, [auth.currentUser]);

  const updateProfile = async () => {
    setShowModal(true);
  };

  const saveProfile = async () => {
    // Cập nhật thông tin vào database
    await database.collection('users').doc(auth.currentUser.uid).update({
      displayName,
      phoneNumber,
    });

    // Lấy thông tin người dùng sau khi đã cập nhật
    const userRef = database.collection('users').doc(auth.currentUser.uid);
    const userSnapshot = await userRef.get();

    // Cập nhật thông tin hiển thị trên màn hình
    setDisplayName(userSnapshot.data().displayName);
    setPhoneNumber(userSnapshot.data().phoneNumber);

    // Đóng modal
    setShowModal(false);
  };

  return (
    <View>
      <Text>UID: {auth.currentUser?.uid}</Text>
      <Text>Display Name: {displayName} </Text>
      <Text>Phone Number: {phoneNumber} </Text>
      <Button title="Update Profile" onPress={updateProfile} />

      {/* Modal */}
      <Modal visible={showModal}>
        <View>
          <Text>{uidExists ? 'Update your profile:' : 'Please provide your name and phone number to update your profile:'}</Text>
          <Text>Display Name:</Text>
          <TextInput value={displayName} onChangeText={(text) => setDisplayName(text)} />
          <Text>Phone Number:</Text>
          <TextInput value={phoneNumber} onChangeText={(text) => setPhoneNumber(text)} />
          <Button title="Save" onPress={saveProfile} />
          <Button title="Cancel" onPress={() => setShowModal(false)} />
        </View>
      </Modal>
      </View>
  );
};

export default UpdateProfileScreen;