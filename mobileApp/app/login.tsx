import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { styles } from '../styles/style';
import { errors } from '../util/errors';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError(errors.missingFields);
      setModalVisible(true);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/home');
    } catch (error: any) {
      switch (error.code) {
        case 'auth/invalid-email':
          setError(errors.invalidEmail);
          break;
        case 'auth/user-not-found':
          setError(errors.emailNotRegistered);
          break;
        case 'auth/wrong-password':
          setError(errors.passwordIncorrect);
          break;
        default:
          setError(errors.loginFailed);
      }
      setModalVisible(true);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError(errors.missingEmail);
      setModalVisible(true);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert('Password reset email sent');
    } catch (error: any) {
      setError(errors.invalidEmail);
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Hi, Welcome Back! 👋</Text>

      <TextInput
        placeholder="example@gmail.com"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        accessibilityLabel="Email Input"
        accessibilityHint="Enter your email address"
      />
      <TextInput
        placeholder="Enter Your Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        accessibilityLabel="Password Input"
        accessibilityHint="Enter your password"
      />

      <View style={styles.inlineRow}>
        <View />
        <TouchableOpacity onPress={handlePasswordReset} disabled={!email}>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.or}>────────  Or  ────────</Text>

      <TouchableOpacity onPress={() => router.push('/home')}>
        <Text style={styles.guestText}>Continue as Guest</Text>
      </TouchableOpacity>

      <Text style={styles.signupText}>
        Don’t have an account?{' '}
        <Text style={styles.signupLink} onPress={() => router.push('/signup')}>Sign Up</Text>
      </Text>

      {/* Modal for error messages */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.errorText}>{error}</Text>
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
