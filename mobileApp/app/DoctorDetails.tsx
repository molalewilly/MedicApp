import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { styles } from '../styles/style';
import { Ionicons } from '@expo/vector-icons';

const DoctorDetails: React.FC = () => {
  const { doctor } = useLocalSearchParams();
  const router = useRouter();

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

  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity onPress={() => router.back()} style={{ position: 'absolute', top: 50, left: 20, zIndex: 10 }}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 80 }}>
        {/* Profile Circle */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          {isValidImageUrl(parsedDoctor.profileImage) ? (
            <Image
              source={{ uri: parsedDoctor.profileImage }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
          ) : (
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: '#ccc',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white' }}>
                {getInitials(parsedDoctor.name)}
              </Text>
            </View>
          )}
        </View>

        {/* Doctor Info */}
        <Text style={styles.name}>{parsedDoctor.name}</Text>
        <Text style={{ marginVertical: 4 }}>{parsedDoctor.specialty}</Text>
        <Text style={{ marginVertical: 4 }}>Phone: {parsedDoctor.phone}</Text>
        <Text style={{ marginVertical: 4 }}>Email: {parsedDoctor.email}</Text>
        <Text style={{ marginVertical: 4 }}>Experience: {parsedDoctor.experience}</Text>
        <Text style={{ marginVertical: 4 }}>Location: {parsedDoctor.location?.address || 'Not provided'}</Text>
        <Text style={{ marginTop: 10 }}>{parsedDoctor.bio}</Text>
      </ScrollView>

      {/* Book Appointment Button */}
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: '/BookAppointment',
            params: {
              email: parsedDoctor.email,
              name: parsedDoctor.name,
            },
          })
        }
        style={{
          backgroundColor: '#3b82f6',
          padding: 15,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 30,
          margin: 20,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Book Appointment</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DoctorDetails;
