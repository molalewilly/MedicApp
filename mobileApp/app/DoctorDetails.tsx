import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { styles } from '../styles/style';
import { Ionicons } from '@expo/vector-icons';

const DoctorDetails: React.FC = () => {
  const { doctor } = useLocalSearchParams();
  const router = useRouter();

  const auth = getAuth();
  const user = auth.currentUser;

  const parsedDoctor = doctor ? JSON.parse(decodeURIComponent(doctor as string)) : null;

  const getInitials = (name: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const isValidImageUrl = (url: string) => {
    return typeof url === 'string' && url.match(/\.(jpeg|jpg|gif|png)$/) !== null;
  };

  if (!parsedDoctor) return <Text>No doctor details found</Text>;

  const handleBookAppointment = () => {
    if (user) {
      // If logged in, navigate to the BookAppointment screen
      router.push({
        pathname: '/BookAppointment',
        params: {
          email: parsedDoctor.email,
          name: parsedDoctor.name,
        },
      });
    } else {
      // If not logged in, show an alert with two options
      Alert.alert(
        'Login Required',
        'You need to be logged in to book an appointment.',
        [
          { 
            text: 'Stay as Guest', 
            onPress: () => {
              // Stay on the current screen
              console.log('User chose to stay as guest');
            }
          },
          { 
            text: 'Login', 
            onPress: () => router.push('/login') 
          }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity onPress={() => router.replace('/home')} style={{ position: 'absolute', top: 50, left: 20, zIndex: 10 }}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 80 }}>
        {/* Profile Circle */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          {isValidImageUrl(parsedDoctor.photo) ? (
            <Image
              source={{ uri: parsedDoctor.photo }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
          ) : (
            <View style={styles.initialsCircle}>
              <Text style={styles.initialsText}>{getInitials(parsedDoctor.name)}</Text>
            </View>
          )}
        </View>

        {/* Doctor Info Card */}
        <View style={{
          backgroundColor: 'white',
          borderRadius: 10,
          padding: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
          <Text style={[styles.name, { fontSize: 20, textAlign: 'center' }]}>{parsedDoctor.name}</Text>
          <Text style={{ marginVertical: 4, textAlign: 'center', color: '#555' }}>{parsedDoctor.specialty}</Text>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.detailLine}>📞 Phone: {parsedDoctor.phone}</Text>
            <Text style={styles.detailLine}>✉️ Email: {parsedDoctor.email}</Text>
            <Text style={styles.detailLine}>📅 Experience: {parsedDoctor.experience}</Text>
            <Text style={styles.detailLine}>📍 Location: {parsedDoctor.location?.address || 'Not provided'}</Text>
          </View>

          {/* Bio Section */}
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Bio:</Text>
            <View style={{ height: 1, backgroundColor: '#ddd', marginVertical: 10 }} />
            <Text style={{ fontSize: 15, color: '#555', marginTop: 10 }}>{parsedDoctor.bio}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Book Appointment Button */}
      <TouchableOpacity
        onPress={handleBookAppointment}
        style={{
          backgroundColor: '#2563EB',
          padding: 15,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 30,
          marginHorizontal: 30,
          marginBottom: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Book Appointment</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DoctorDetails;
