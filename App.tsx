import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';


import LoginPage from './components/loginpage';
import ParkingVerification from './components/parkingverification';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true); // Set login state to true
  };

  const handleLogout = (navigation) => {
    setIsLoggedIn(false); // Set login state to false
    navigation.navigate('Login'); // Navigate to Login page
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isLoggedIn ? (
          <Stack.Screen
            name="Login"
            options={{ headerShown: false }}
          >
            {/* Pass onLoginSuccess directly as a prop */}
            {() => <LoginPage onLoginSuccess={handleLogin} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen
            name="ParkingVerification"
            component={ParkingVerification}
            options={({ navigation }) => ({
              headerTitle: 'Parking Verification',
              headerStyle: { backgroundColor: '#9ff507' , paddingRight: 20,},
              headerRight: () => (
                <TouchableOpacity onPress={() => handleLogout(navigation)} style={{ marginRight: 15, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                  <Ionicons name="log-out-outline" size={24} color="black" />
                </TouchableOpacity>
              ),
            })}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

