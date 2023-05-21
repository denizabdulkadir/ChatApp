import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Button, Subheading, TextInput } from 'react-native-paper';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../App';

const SignIn = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoaading] = useState(false);
  const [error, setError] = useState('');

  const signIn = async () => {
    setIsLoaading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
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
            navigation.navigate('SignUp');
          }}
        >
          Sign up
        </Button>
        <Button onPress={signIn} loading={isLoading} mode={'contained'}>
          Sign In
        </Button>
      </View>
    </View>
  );
};

export default SignIn;
