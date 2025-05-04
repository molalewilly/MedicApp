import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // General Auth Styles
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center', 
  
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 3,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 22,
    marginBottom: 15,
  },
  inlineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  remember: { color: '#555' },
  forgot: { color: '#f65e7e', fontWeight: '500' },
  loginButton: {
    backgroundColor: '#1877F2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  loginText: { textAlign: 'center',color: 'black', fontWeight: 'bold' },
  or: { textAlign: 'center', color: '#aaa', marginVertical: 15 },
 
  guestText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#1877F2',
    marginBottom: 20,
    fontWeight: '600',
  },
  signupText: { textAlign: 'center', color: 'black',fontWeight: 'bold' },
  signupLink: { color: '#1877F2', fontWeight: '600' },
  loginLink: { color: '#1877F2', fontWeight: '600' },
  signupButton: {
    backgroundColor: '#1877F2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBox: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButton: {
    marginTop: 15,
    backgroundColor: '#1877F2',
    padding: 10,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  // Home Screen Specific
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 10,
    paddingLeft: 20,
    flex: 1,
    marginRight: 10,
    borderWidth: 2,  
  borderColor: 'black',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#bbb',
  },
 
  specialtyContainer: {
    marginBottom: 6,
  },
  chip: {
    backgroundColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  activeChip: {
    backgroundColor: '#4e91fc',
  },
  chipText: {
    color: '#000',
  },
  map: {
    height: 210,
    borderRadius: 10,
    marginBottom: 12,
  },
  doctorList: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ddd',
    marginRight: 15,
  },
  placeholderLine: {
    height: 12,
    backgroundColor: '#e0e0e0',
    marginBottom: 6,
    width: '80%',
    borderRadius: 4,
  },
  placeholderLineShort: {
    height: 10,
    backgroundColor: '#e0e0e0',
    marginBottom: 6,
    width: '60%',
    borderRadius: 4,
  },
  placeholderLineShorter: {
    height: 10,
    backgroundColor: '#c4e1ff',
    width: '40%',
    borderRadius: 4,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  
  initialsCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  initialsText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  detailLine: {
    fontSize: 15,
    color: '#333',
    marginBottom: 6,
  },
  profileImageSmall: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: '#ccc',
},

initialsCircleSmall: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: '#1877F2',
  justifyContent: 'center',
  alignItems: 'center',
},

initialsTextSmall: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},
inputContainer: {
  position: 'relative',
},
iconContainer: {
  position: 'absolute',
  right: 10,
  top: '50%',
  transform: [{ translateY: -10 }],
},


  
   
  

});
