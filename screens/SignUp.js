import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Button, Subheading, TextInput } from 'react-native-paper';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../App';

const SignUp = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoaading] = useState(false);
  const [error, setError] = useState('');

  const createAccount = async () => {
    setIsLoaading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(auth.currentUser, { displayName: name });
      navigation.popToTop();
    } catch (error) {
      setIsLoaading(false);
      setError(error.message);
    }
  };

  return (
    <View style={{ margin: 16 }}>
      {error ? (
        <Subheading
          style={{ color: 'red', textAlign: 'center', marginBottom: 12 }}
        >
          {' '}
          {error}
        </Subheading>
      ) : null}
      <TextInput
        value={name}
        onChangeText={(text) => {
          setName(text);
        }}
        label='Name'
      />
      <TextInput
        value={email}
        onChangeText={(text) => {
          setEmail(text);
        }}
        label={'Email'}
        style={{ marginTop: 12 }}
        keyboardType='email-address'
      />
      <TextInput
        value={password}
        onChangeText={(text) => {
          setPassword(text);
        }}
        label={'Password'}
        style={{ marginTop: 12 }}
        secureTextEntry
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginTop: 16,
        }}
      >
        <Button
          compact
          onPress={() => {
            navigation.navigate('SignIn');
          }}
        >
          Sign In
        </Button>
        <Button onPress={createAccount} loading={isLoading} mode={'contained'}>
          Sign Up
        </Button>
      </View>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({});
