import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as MailComposer from 'expo-mail-composer';
import { Ionicons } from '@expo/vector-icons';

const BookAppointment = () => {
  const { email, name } = useLocalSearchParams();
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [description, setDescription] = useState('');

  const sendEmail = async () => {
    const result = await MailComposer.composeAsync({
      recipients: [email as string],
      subject: `Appointment Request - ${date.toDateString()}`,
      body: `Dear Dr. ${name},\n\nI would like to book an appointment on ${date.toDateString()}.\n\nProblem Description:\n${description}\n\nThank you.`,
    });

    if (result.status === 'sent') {
      alert('Appointment email sent successfully!');
      setDescription('');
    } else {
      alert('Email not sent.');
    }
  };

  return (
    <View style={{ paddingTop: 60, paddingHorizontal: 20, flex: 1 }}>
      {/* Back Arrow */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ position: 'absolute', top: 40, left: 20, zIndex: 10 }}
      >
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, marginTop: 10 }}>
        Book Appointment with Dr. {name}
      </Text>

      <Text style={{ marginBottom: 5 }}>Select Date</Text>
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={{ borderWidth: 1, borderRadius: 6, padding: 10, marginBottom: 10 }}
      >
        <Text>{date.toDateString()}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate && event.type !== 'dismissed') {
              setDate(selectedDate);
            }
          }}
        />
      )}

      <Text style={{ marginBottom: 5 }}>Describe your problem</Text>
      <TextInput
        placeholder="Enter your concern here..."
        value={description}
        onChangeText={setDescription}
        multiline
        style={{
          height: 100,
          borderWidth: 1,
          borderRadius: 6,
          padding: 10,
          textAlignVertical: 'top',
          marginBottom: 20,
        }}
      />

      <Button title="Send Appointment Request" onPress={sendEmail} color="#3b82f6" />
    </View>
  );
};

export default BookAppointment;
