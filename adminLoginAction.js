import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const AdminLoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleAdminLogin = async () => {
    try {
      // Authenticate admin using Firebase Authentication
      const userCredential = await auth().signInWithEmailAndPassword(username, password);

      // Retrieve additional user information from Firestore
      const userDoc = await firestore().collection('users').doc(userCredential.user.uid).get();
      const userRole = userDoc.data()?.role;

      // Check if the user is an admin
      if (userRole === 'admin') {
        navigation.navigate('AdminDashboard'); // Navigate to the admin dashboard
      } else {
        navigation.navigate('UserDashboard'); // Navigate to the user dashboard
      }
    } catch (error) {
      // Handle authentication errors
      console.error('Error during admin login:', error);
      Alert.alert('Invalid Credentials', 'Username or password is incorrect.');
    }
  };

  return (
    <View>
      <Text>Username:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setUsername(text)}
        value={username}
      />
      <Text>Password:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
      />
      <Button title="Login" onPress={handleAdminLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
  },
});

export default AdminLoginScreen;
