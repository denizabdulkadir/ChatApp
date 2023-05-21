import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Avatar, Button, Subheading, Title } from 'react-native-paper';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../App';

//const auth = getAuth();

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setName(user?.displayName ?? '');
      setEmail(user?.email ?? '');
    });
  }, []);
  let avatar = name.split(' ').reduce((prev, curr) => prev + curr[0], ' ');
  return (
    <View
      style={{ justifyContent: 'center', alignItems: 'center', marginTop: 16 }}
    >
      <Avatar.Text label={avatar} />
      <Title>{name}</Title>
      <Subheading>{email} </Subheading>
      <Button
        onPress={() => {
          signOut(auth);
        }}
      >
        Sign Out
      </Button>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});
