import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth, db } from '../config/firebase'; // make sure this is the correct path
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const EditDetailsScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUserDetails = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUsername(data.username || '');
        setEmail(data.email || '');
        setPhone(data.phone || '');
      }
    } catch (error) {
      console.error('Failed to load user details:', error);
      Alert.alert('Error', 'Could not fetch user details');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      await updateDoc(doc(db, 'users', uid), {
        username,
        email,
        phone,
      });
      Alert.alert('Success', 'Successfully updated details!');
    } catch (error) {
      console.error('Error updating user details:', error);
      Alert.alert('Error', 'Failed to update details.');
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backArrow} onPress={() => router.push('/profile')}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Edit Details</Text>

      <TouchableOpacity onPress={() => Alert.alert('Edit Picture', 'Not implemented')} style={styles.pictureContainer}>
        <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.profileImage} />
        <Text style={styles.editPicText}>Edit Picture</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Enter username"
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

<TouchableOpacity
  style={[styles.editButton, loading && styles.disabledButton]}
  onPress={handleEdit}
  disabled={loading}
>
  <Text style={styles.editButtonText}>{loading ? 'Loading...' : 'Edit'}</Text>
</TouchableOpacity>

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
  editButton: {
    marginTop: 20,
    backgroundColor: '#1877F2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  
});

export default EditDetailsScreen;
