import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, Keyboard } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Link,  } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { BottomSheetContext } from '../../app/_layout';
import ErrorBottomSheet from '../../components/bottomSheets/errorBottomSheet';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { openBottomSheet, setCustomSnapPoints } = useContext(BottomSheetContext);

  const getErrorMessage = (errorCode) => {
    switch(errorCode) {
      case 'auth/user-not-found':
        return 'No account exists with this email. Would you like to create an account?';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again or reset your password.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed login attempts. Please try again later or reset your password.';
      default:
        return 'Failed to sign in. Please check your credentials and try again.';
    }
  };

  const handleSignIn = async () => {
    Keyboard.dismiss();
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await signIn(email, password);
      
      // If sign-in was not successful, handle the error
      if (!result.success) {
        console.log('Sign in error:', result);  // Log for debugging
        
        
          setCustomSnapPoints(['50%']);
          
          // Open the error bottom sheet
          openBottomSheet(
            <ErrorBottomSheet 
              message="No account exists with this email. Would you like to create one?"
              actionText="Create Account"
              navigateTo="/(auth)/sign-up"
            />,
            0
          );
        setLoading(false);  // Make sure to reset loading state for errors
      }else{
        
      }
      // Note: If sign-in is successful, the loading state will be handled by the auth state listener
      // We don't need to explicitly set loading to false here
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }
    
    // Navigate to password reset or trigger password reset email
    Alert.alert(
      'Reset Password',
      'We will send a password reset link to your email address.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send Email', 
          onPress: async () => {
            try {
              // This assumes you have a passwordReset function in your auth context
              // If not, you need to implement it using Firebase
              // await auth().sendPasswordResetEmail(email);
              Alert.alert(
                'Email Sent',
                'Check your email for password reset instructions'
              );
            } catch (error) {
              setError('Failed to send reset email: ' + error.message);
            }
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      
      {error ? (
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={18} color="red" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity 
        style={styles.forgotPasswordLink}
        onPress={handleForgotPassword}
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={handleSignIn}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>
      
      <View style={styles.footer}>
        <Text style={{color: 'white'}}>Don't have an account? </Text>
        <Link href="/(auth)/sign-up" asChild>
          <TouchableOpacity>
            <Text style={styles.link}>Sign Up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  input: {
    color: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  footer: {
    color: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  link: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#007BFF',
    fontSize: 14,
  },
});
