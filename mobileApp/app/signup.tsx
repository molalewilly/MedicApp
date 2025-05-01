import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { auth, db } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { styles } from '../styles/style';
import { errors } from '../util/errors';  // Import error messages

export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleSignup = async () => {
    // Check for empty fields
    if (!username || !email || !phone || !password || !confirmPassword) {
      setError(errors.missingFields);
      setModalVisible(true);
      return;
    }

    // Check if passwords match (case-sensitive comparison)
    if (password !== confirmPassword) {
      setError(errors.passwordMismatch);
      setModalVisible(true);
      return;
    }

    // Check for password length
    if (password.length < 6) {
      setError(errors.weakPassword);
      setModalVisible(true);
      return;
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      setError(errors.invalidEmail);
      setModalVisible(true);
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username,
        email,
        phone,
        createdAt: new Date().toISOString(),
      });

      setSuccessMessage("User created successfully! You can now log in.");
      setModalVisible(true);

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setError(errors.emailInUse);
      } else {
        setError(errors.userCreationFailed);
      }
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create an account</Text>

      <TextInput
        placeholder="Enter Your Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Enter Your Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Enter Your Phone Number"
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        placeholder="Enter Your Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        placeholder="Confirm Your Password"
        secureTextEntry
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.or}>────────  Or With  ────────</Text>

      {/* Removed Facebook and Google Buttons */}

      <TouchableOpacity onPress={() => router.push('/home')}>
        <Text style={styles.guestText}>Continue as Guest</Text>
      </TouchableOpacity>

      <Text style={styles.loginText}>
        Already have an account?{' '}
        <Text style={styles.loginLink} onPress={() => router.push('/login')}>Login</Text>
      </Text>

      {/* Modal for error/success messages */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.errorText}>{error || successMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
