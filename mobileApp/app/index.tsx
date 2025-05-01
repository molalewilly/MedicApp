import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🩺 Welcome to Molale Health App</Text>
      <Text style={styles.subtitle}>Create an account With Molale App and  find trusted doctors near you — fast, easy, and secure.</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
        <Text style={styles.buttonText}>Getting Started</Text>
      </TouchableOpacity>

      
      <View style={styles.footer}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.link}>Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30 },

  title: { 
    fontSize: 28,
    fontWeight: 'bold' ,
    marginBottom: 16},


  subtitle: { 
     fontSize: 16,
     color: '#555', 
     textAlign: 'center', 
     marginVertical: 10,
     marginBottom: 100 },

  button: { backgroundColor: '#4285F4', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 8, marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 16 },
  footer: { marginTop: 20, flexDirection: 'row' }, 
  link: { color: '#4285F4' },
});
