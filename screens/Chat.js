import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  doc,
  addDoc,
  getDocs,
  setDoc,
  onSnapshot,
  collection,
  query,
} from 'firebase/firestore';
import firebase from 'firebase/compat';
import { auth, db } from '../App';
import { GiftedChat } from 'react-native-gifted-chat';
import { onAuthStateChanged } from 'firebase/auth';

const Chat = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const [uid, setUid] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {

    const unsub = onSnapshot(
      doc(db, 'chats', `${route.params.chatId}`),
      (doc) => {
        setMessages(doc.data()?.messages ?? []);
      }
    );
  }, [route.params.chatId]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUid(user?.uid ?? '');
      setName(user?.displayName ?? '');
    });
  }, []);

  async function onSend(m = []) {
    await setDoc(
      doc(db, 'chats', `${route.params.chatId}`),
      {
        messages: GiftedChat.append(messages, m),
      },
      { merge: true }
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <GiftedChat
        messages={messages.map((x) => ({
          ...x,
          createdAt: x.createdAt?.toDate(),
        }))}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: uid,
          name: name,
        }}
      />
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({});
