import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const EditDetailsScreen = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const router = useRouter();

  const handleEdit = () => {
    Alert.alert('Success', 'Successfully saved!');
  };

  const handleEditPicture = () => {
    Alert.alert('Edit Picture', 'Picture editing not implemented yet.');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backArrow} onPress={() => router.push('/profile')}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Edit Details</Text>

      {/* Edit Picture Placeholder */}
      <TouchableOpacity onPress={handleEditPicture} style={styles.pictureContainer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.profileImage}
        />
        <Text style={styles.editPicText}>Edit Picture</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
        placeholder="Enter full name"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter email"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
      />

      <Button title="Edit" onPress={handleEdit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  backArrow: {
    marginTop: 40,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  pictureContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eee',
  },
  editPicText: {
    marginTop: 8,
    color: '#1877F2',
    fontSize: 14,
  },
  label: {
    fontSize: 16,
    marginTop: 12,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginTop: 4,
  },
});

export default EditDetailsScreen;
