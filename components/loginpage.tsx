import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

function LoginPage({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Username and Password cannot be empty.');
      return;
    }
  
    try {
      const url = 'https://kwale-hris-api.onrender.com/proxy/authenticate';
  
      // Send a POST request to the proxy API
      const response = await axios.post(
        url,
        { username, password }, // Pass the username and password in the request body
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
  
      const data = response.data;
  
      // Handle success and failure responses
      if (data.responsecode === '1111') {
        console.log('Login successful:', data);
        onLoginSuccess();
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid username or password');
      }
    } catch (error) {
     // console.error('Error:', error.response?.data || error.message);
      Alert.alert(
        'Login Failed',
       // error.response?.data?.error || 'An error occurred. Please try again.'
      );
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} color="#2b9930" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#add9b0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    width: '80%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});

export default LoginPage;

