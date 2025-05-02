import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { styles } from '../styles/style';
import { getAuth } from 'firebase/auth';

interface Doctor {
  id: string;
  name: string;
  email: string;
  specialty: string;
  phone: string;
  gender: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  experience: string;
  bio: string;
  photo?: string;
  suspended: boolean;  
}

const specialties = [
  'All',
  'Dentist',
  'Cardiologist',
  'Dermatologist',
  'Gynecologist',
  'Psychiatrist',
  'Neurosurgeon',
];

const Home: React.FC = () => {
  const [activeSpecialty, setActiveSpecialty] = useState('All');
  const [region, setRegion] = useState<Region>({
    latitude: -24.6544,
    longitude: 25.9085,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [userLocation, setUserLocation] = useState<Region | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const mapViewRef = useRef<MapView | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'doctors'), (querySnapshot) => {
      const docs = querySnapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            email: data.email,
            specialty: data.specialty,
            phone: data.phone,
            gender: data.gender,
            location: data.location,
            experience: data.experience,
            bio: data.bio,
            photo: data.photo,
            suspended: data.suspended ?? false, 
          } as Doctor;
        })
        .filter((doctor) => !doctor.suspended);

      setDoctors(docs);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Location access is needed to use this feature.');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } catch (error) {
        Alert.alert('Error', 'Unable to get location.');
      }
    };

    getLocation();
  }, []);

  const handleProfileClick = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      router.push('/profile');
    } else {
      Alert.alert(
        'Not Logged In',
        'You need to log in to access your profile.',
        [
          {
            text: 'Stay as Guest',
            onPress: () => console.log('Staying as guest'),
            style: 'cancel',
          },
          {
            text: 'Go to Login',
            onPress: () => router.replace('/login'),
          },
        ],
        { cancelable: true }
      );
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const name = doctor.name?.toLowerCase() || '';
    const specialty = doctor.specialty?.toLowerCase() || '';
    const address = doctor.location?.address?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
  
    const matchesSpecialtyChip =
      activeSpecialty === 'All' || specialty === activeSpecialty.toLowerCase();
  
    const matchesSearch =
      name.includes(query) || specialty.includes(query) || address.includes(query);
  
    return matchesSpecialtyChip && matchesSearch;
  });

  const getInitials = (name: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const isValidImageUrl = (url: string) => {
    return typeof url === 'string' && url.match(/\.(jpeg|jpg|gif|png)$/) !== null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TextInput
          placeholder="Search by name or city..."
          style={styles.searchInput}
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.profileIcon} onPress={handleProfileClick}>
          <View style={styles.profilePlaceholder} />
        </TouchableOpacity>
      </View>

      <View style={styles.specialtyContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {specialties.map((spec, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.chip, activeSpecialty === spec && styles.activeChip]}
              onPress={() => setActiveSpecialty(spec)}
            >
              <Text style={styles.chipText}>{spec}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Text style={styles.heading}>Nearby Doctors</Text>

      <MapView
        ref={mapViewRef}
        style={styles.map}
        region={region}
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
        showsUserLocation={true}      
        showsMyLocationButton={true}   
        showsCompass={true}            
      >
        {userLocation && (
          <Marker coordinate={userLocation} title="You are here" pinColor="blue" />
        )}
        {filteredDoctors.map((doctor) => (
          <Marker
            key={doctor.id}
            coordinate={{
              latitude: doctor.location?.latitude || 0,
              longitude: doctor.location?.longitude || 0,
            }}
            title={doctor.name}
            description={doctor.specialty}
            pinColor="red"
          />
        ))}
      </MapView>

      <ScrollView style={styles.doctorList} showsVerticalScrollIndicator={false}>
        {filteredDoctors.map((doctor) => (
          <TouchableOpacity
            key={doctor.id}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: '/DoctorDetails',
                params: { doctor: encodeURIComponent(JSON.stringify(doctor)) },
              })
            }
          >
            <View style={styles.avatarPlaceholder}>
            {doctor.photo && isValidImageUrl(doctor.photo) ?  (
                <Image source={{ uri: doctor.photo }} style={styles.avatarImage} />
              ) : (
                <View style={styles.initialsCircle}>
                  <Text style={styles.initialsText}>{getInitials(doctor.name)}</Text>
                </View>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{doctor.name}</Text>
              <Text>{doctor.phone || doctor.email || 'No contact info provided'}</Text>
              <Text>{doctor.specialty}</Text>
              <Text>{doctor.location?.address || 'No address provided'}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Home;
