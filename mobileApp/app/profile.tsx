import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth'; 
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore'; 
import { db } from '../config/firebase'; 

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>({
    name: '',
    email: '',
    phone: '',
    profilePicture: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        
        try {
          const userRef = doc(db, 'users', user.uid); 
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userDataFromFirestore = userDoc.data();
            setUserData({
              name: userDataFromFirestore.username || user.displayName || 'username',
              email: user.email || 'email@example.com',
              phone: userDataFromFirestore.phone || user.phoneNumber || '+267 7XXXXXXX',
              profilePicture: userDataFromFirestore.photoUrl || '', 
            });
          } else {
            Alert.alert('Error', 'User data not found in Firestore.');
          }
        } catch (error) {
          console.error(error);
          Alert.alert('Error', 'Failed to fetch user data.');
        }
      } else {
        Alert.alert('Error', 'No user is logged in');
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    const auth = getAuth();
    auth.signOut()
      .then(() => {
        router.replace('/login');
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Error', 'Failed to log out');
      });
  };

  const getInitials = (name: string) => {
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
    return initials.substring(0, 2); 
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backArrow} onPress={() => router.push('/home')}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.heading}>MY PROFILE</Text>

      <View style={styles.card}>
        {userData.profilePicture ? (
          <Image
            source={{ uri: userData.profilePicture }}
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.initialsCircle}>
            <Text style={styles.initialsText}>{getInitials(userData.name)}</Text>
          </View>
        )}
        <Text style={styles.name}>{userData.name || 'username'}</Text>
        <Text style={styles.email}>{userData.email || 'email@example.com'}</Text>
        <Text style={styles.phone}>{userData.phone || '+267 7XXXXXXX'}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/edit')}
        >
          <Text>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, alignItems: 'center' },
  backArrow: { alignSelf: 'flex-start', marginTop: 40, marginBottom: 10 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 15,
    backgroundColor: '#eee',
  },
  initialsCircle: {
    width: 100,
    height: 100,
    borderRadius: 40,
    backgroundColor: '#1877F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  initialsText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  email: { fontSize: 14, color: '#555' },
  phone: { fontSize: 14, color: '#555', marginBottom: 20 },
  button: {
    backgroundColor: '#1877F2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 2,
  },
  logout: {
    marginTop: 300,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#1877F2',
    borderRadius: 30,
  },
});
