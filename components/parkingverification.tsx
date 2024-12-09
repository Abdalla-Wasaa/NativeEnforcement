import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, TextInput, Alert, Button, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface VehicleType {
  Id: number;
  VehicleTypeName: string;
}

interface ParkingUnit {
  Id: number;
  ParkingUnitName: string;
}


function ParkingVerification() {
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicleType, setSelectedVehicleType] = useState<number | null>(null);
  
  const [parkingZone, setParkingZone] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [parkingUnits, setParkingUnits] = useState<ParkingUnit[]>([]);
  

  useEffect(() => {
    const fetchParkingUnits = async () => {
      setLoading(true);
      try {
        const response = await axios.post('http://197.248.169.226:8085/api/ParkingUnit');
        setParkingUnits(response.data);
      } catch (err) {
       // setError(err.response?.data?.message || err.message || 'Error fetching parking units.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchParkingUnits();
  }, []);

  const fetchVehicleTypes = async (parkingUnitId: number) => {
    setLoading(true);
    try {
      const response = await axios.post(`http://197.248.169.226:8085/api/VehicleTypes?Id=${parkingUnitId}`);
      setVehicleTypes(response.data);
    } catch (err) {
     // setError(err.response?.data?.message || err.message || 'Error fetching vehicle types.');
    } finally {
      setLoading(false);
    }
  };
  

  const parkingZoneHandler = (selectedValue: string) => {
    setParkingZone(selectedValue);
  
    // Find the selected ParkingUnit by Id
    const selectedUnit = parkingUnits.find((unit) => unit.Id === Number(selectedValue));
    if (selectedUnit) {
      fetchVehicleTypes(selectedUnit.Id);
    }
  };



  const vehicleTypeHandler = (enteredValue: number) => {
    setSelectedVehicleType(enteredValue);
  };



  const handleSearch = async () => {
    if (!searchTerm) {
      setError('Please enter a search term.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      const requestBody = {
        EntityToValidate: "parking",    
        EntityNumber :searchTerm,
        ParkingUnit:parkingZone,
        VehicleType:selectedVehicleType,
        EnforcerPhoneNumber:"254716483231"
    
    };
      

      const response = await axios.post(
        'http://197.248.169.226:8085/api/KCGUSSDValidator',
        requestBody,
        { headers }
      );

      const statusCode = response.data.statusCode;
      setResults(statusCode);
    } catch (err) {
      setError('An error occurred while fetching data.');
      // console.error('Error details:', err.response ? err.response.data : err.message);
    } finally {
      setLoading(false);
    }
  };

  const displayMessage = () => {
    if (results === 1) {
      return `Vehicle has not paid.`;
    } else if (results === 0) {
      return 'Vehicle has paid.';
    } else if (results === null) {
      return 'No results yet.';
    }
    return 'Unknown status.';
  };

  return (
    <SafeAreaView style={styles.overallContainer}>
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Kwale Parking Verification</Text>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Enter Vehicle Number</Text>
          <TextInput
            style={styles.picker}
            placeholder="Vehicle Number..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
        <View style={styles.pickerContainer}>
        <Text style={styles.label}>Parking Unit</Text>
        <Picker
    selectedValue={parkingZone}
    style={styles.picker}
    onValueChange={parkingZoneHandler}
  >
    <Picker.Item label="Select a parking unit" value="" />
    {parkingUnits.map((item) => (
      <Picker.Item key={item.Id.toString()} label={item.ParkingUnitName} value={item.Id.toString()} />
    ))}
  </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Vehicle Type</Text>
        <Picker
              selectedValue={selectedVehicleType?.toString() || ''}
              style={styles.picker}
              onValueChange={(value) => vehicleTypeHandler(Number(value))}
            >
              <Picker.Item label="Select a vehicle type" value="" />
              {vehicleTypes.map((item) => (
                <Picker.Item key={item.Id} label={item.VehicleTypeName} value={item.Id} />
              ))}
        </Picker>
      </View>
        <Button title="VERIFY" onPress={handleSearch} color="#ddb52f" />
        {loading && <Text>Loading...</Text>}
        {error && <Text style={styles.error}>{error}</Text>}
        <ScrollView style={styles.resultsContainer}>
          <Text style={styles.resultItem}>{displayMessage()}</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overallContainer: {
    flex: 1,
    backgroundColor: '#2b9930',
  },
  inputContainer: {
    flex: 1,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 24,
    borderRadius: 8,
    elevation: 8,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    shadowOpacity: 0.5,
    marginTop: 30,
    backgroundColor: '#add9b0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  pickerContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  picker: {
    width: 300,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    height: 50,
    color: '#323332',
    backgroundColor: '#f9f9f9',
    borderBottomColor: '#ddb52f',
    borderBottomWidth: 2,
  },
  resultsContainer: {
    width: '100%',
    padding: 25,
    marginTop: 25,
    backgroundColor: '#525452',
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
    fontSize: 18,
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 20,
    marginBottom: 4,
    color: '#323332',
    fontWeight: 'bold',
  },
});

export default ParkingVerification;