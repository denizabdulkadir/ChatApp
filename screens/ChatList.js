import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Divider,
  FAB,
  List,
  Portal,
  Dialog,
  TextInput,
} from 'react-native-paper';
import firebase from 'firebase/compat/app';
import {
  doc,
  addDoc,
  getDocs,
  setDoc,
  onSnapshot,
  collection,
  query,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../App';
import { async } from '@firebase/util';

const ChatList = ({ navigation }) => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [myEmail, setMyEmail] = useState('');
  const [otherEmail, setOtherEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [chatId, setChatId] = useState('');

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setMyEmail(user?.email ?? '');
    });
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'chats'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setUsers(querySnapshot.docs);
    });
  }, []);
  async function createChat() {
    let docRef;
    if (!myEmail || !otherEmail) return;
    setIsLoading(true);

    try {
      docRef = await addDoc(collection(db, 'chats'), {
        users: [myEmail, otherEmail],
      });
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
    setIsLoading(false);
    setOtherEmail('');
    setIsDialogVisible(false);
    setChatId(docRef.id);
    navigation.navigate('Chat', { chatId: docRef.id });
  }

  return (
    <View style={{ flex: 1, marginHorizontal: 16 }}>
      {users.map((user) => {
        const userEmail = user.data().users.find((x) => x !== myEmail);
        let avatar = userEmail
          .split(' ')
          .reduce((prev, curr) => prev + curr[0], ' ');
        const messages = user.data().messages;
        const lastM = Array.isArray(messages) ? messages[0].text : null;
        return (
          <React.Fragment>
            <List.Item
              onPress={() => navigation.navigate('Chat', { chatId: user.id })}
              key={userEmail}
              title={userEmail}
              description={lastM}
              left={(props) => <Avatar.Text size={44} label={avatar} />}
            />
            <Divider leftInset />
          </React.Fragment>
        );
      })}
      <Portal>
        <Dialog
          visible={isDialogVisible}
          onDismiss={() => {
            setIsDialogVisible(false);
          }}
        >
          <Dialog.Title>New Chat</Dialog.Title>
          <Dialog.Content>
            <TextInput
              value={otherEmail}
              onChangeText={(text) => setOtherEmail(text)}
              label={'Enter user email'}
              keyboardType='email-address'
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setIsDialogVisible(false);
              }}
            >
              Cancel
            </Button>
            <Button loading={isLoading} onPress={createChat}>
              Done
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <FAB
        icon={'plus'}
        style={{ position: 'absolute', bottom: 16, right: 16 }}
        onPress={() => {
          setIsDialogVisible(true);
        }}
      />
    </View>
  );
};

export default ChatList;

const styles = StyleSheet.create({});
