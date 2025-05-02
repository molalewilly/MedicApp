import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth, db } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dwnndpmml/upload';
const UPLOAD_PRESET = 'userspic';

const EditDetailsScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
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
        setPhotoUrl(data.photoUrl || '');
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
        photoUrl,
      });
      Alert.alert('Success', 'Successfully updated details!');
    } catch (error) {
      console.error('Error updating user details:', error);
      Alert.alert('Error', 'Failed to update details.');
    }
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const image = result.assets[0];
      const formData = new FormData();
      formData.append('file', {
        uri: image.uri,
        name: 'profile.jpg',
        type: 'image/jpeg',
      } as any);
      formData.append('upload_preset', UPLOAD_PRESET);

      try {
        const response = await fetch(CLOUDINARY_URL, {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        if (data.secure_url) {
          setPhotoUrl(data.secure_url);
        } else {
          Alert.alert('Upload failed', 'Could not upload image');
        }
      } catch (error) {
        console.error('Upload error:', error);
        Alert.alert('Upload failed', 'Something went wrong');
      }
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

      <TouchableOpacity onPress={handleImagePick} style={styles.pictureContainer}>
        <Image
          source={{ uri: photoUrl || 'https://via.placeholder.com/100' }}
          style={styles.profileImage}
        />
        <Text style={styles.editPicText}>Edit Picture</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Username</Text>
      <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="Enter username" />

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
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  backArrow: { marginTop: 40, marginBottom: 10, alignSelf: 'flex-start' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  pictureContainer: { alignItems: 'center', marginBottom: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#eee' },
  editPicText: { marginTop: 8, color: '#1877F2', fontSize: 14 },
  label: { fontSize: 16, marginTop: 12 },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, paddingHorizontal: 10, borderRadius: 6, marginTop: 4 },
  editButton: {
    marginTop: 20,
    backgroundColor: '#1877F2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  disabledButton: { backgroundColor: '#ccc' },
});

export default EditDetailsScreen;
