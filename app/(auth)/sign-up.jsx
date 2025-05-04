import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useRouter } from 'expo-router';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    form: {
        padding: 20,
        flex: 1,
        justifyContent: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        marginBottom: 15,
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    }
});

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignUp = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        setLoading(true);
        try {
            // Create the account
            await auth().createUserWithEmailAndPassword(email, password);
            
            // Redirect to profile instead of tabs
            router.replace('/profile');
            
            // Optional: Show welcome message
            Alert.alert(
                'Account Created!',
                'Welcome to PingCode! Please complete your profile to get started.',
                [{ text: 'OK' }]
            );
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.form}>
                <Text className="mb-8 text-3xl font-bold text-white">Sign Up</Text>

                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                    secureTextEntry
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSignUp}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
}



export default SignUp;
