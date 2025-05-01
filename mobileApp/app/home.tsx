import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { styles } from '../styles/style';
import { getAuth } from 'firebase/auth'; // Import Firebase Auth

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
  const [doctors, setDoctors] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const mapViewRef = useRef<MapView | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'doctors'));
        const docs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDoctors(docs);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch doctors');
      }
    };

    fetchDoctors();
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
    const auth = getAuth(); // Get the Firebase authentication instance
    const user = auth.currentUser;

    if (user) {
      // If the user is logged in, navigate to the profile page
      router.push('/profile');
    } else {
      // If the user is not logged in, show an alert
      Alert.alert(
        'Not Logged In',
        'You need to log in to access your profile.',
        [
          {
            text: 'Stay as Guest',
            onPress: () => console.log('Staying as guest'), // You can add logic for staying as guest
            style: 'cancel',
          },
          {
            text: 'Go to Login',
            onPress: () => router.push('/login'), // Navigate to the login page
          },
        ],
        { cancelable: true }
      );
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSpecialty =
      activeSpecialty === 'All' || doctor.specialty.toLowerCase() === activeSpecialty.toLowerCase();
    const matchesSearchQuery =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.location?.address?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearchQuery;
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

  const handleUseCurrentLocation = async () => {
    if (userLocation) {
      mapViewRef.current?.animateToRegion(userLocation, 1000);
    } else {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const newLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setUserLocation(newLocation);
        mapViewRef.current?.animateToRegion(newLocation, 1000);
      } else {
        Alert.alert('Permission denied', 'Location access is needed to use this feature.');
      }
    }
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

      <TouchableOpacity style={styles.locationButton} onPress={handleUseCurrentLocation}>
        <Text style={styles.locationText}>USE CURRENT LOCATION</Text>
      </TouchableOpacity>

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
              router.replace({
                pathname: '/DoctorDetails',
                params: { doctor: encodeURIComponent(JSON.stringify(doctor)) },
              })
            }
          >
            <View style={styles.avatarPlaceholder}>
              {isValidImageUrl(doctor.photo) ? (
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
