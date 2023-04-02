import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal } from 'react-native';
import { auth, database } from "../config/firebase";

const UpdateProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showModal, setShowModal] = useState(false);
  // Lấy thông tin người dùng đăng nhập
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const updateProfile = async () => {
    // Kiểm tra xem UID của người dùng đã có đủ thông tin trong database hay chưa
    const userRef = database.collection('users').doc(auth.currentUser.uid);
    const userSnapshot = await userRef.get();

    if (userSnapshot.exists && userSnapshot.data().displayName && userSnapshot.data().phoneNumber) {
      // Nếu đã có đủ thông tin, hiển thị modal để người dùng cập nhật thông tin
      setDisplayName(userSnapshot.data().displayName);
      setPhoneNumber(userSnapshot.data().phoneNumber);
      setShowModal(true);
    } else {
      // Nếu chưa đủ thông tin, hiển thị thông báo lỗi
      alert('Please provide your name and phone number to update your profile.');
    }
  };

  const saveProfile = async () => {
    // Cập nhật thông tin vào database
    await database.collection('users').doc(auth.currentUser.uid).update({
      displayName,
      phoneNumber,
    });
    // Đóng modal
    setShowModal(false);
  };
  return (
    <View>
      <Text>Display Name:</Text>
      <TextInput value={displayName} onChangeText={setDisplayName} />
      <Text>Phone Number:</Text>
      <TextInput value={phoneNumber} onChangeText={setPhoneNumber} />
      <Button title="Update Profile" onPress={updateProfile} />

      {/* Modal */}
      <Modal visible={showModal}>
        <View>
          <Text>Update your profile:</Text>
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
