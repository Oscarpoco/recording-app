import React from 'react';
import {
    SafeAreaView,
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { Feather } from '@expo/vector-icons';

export default function SignUp({
    changeView,
    showPassword,
    setShowPassword,
    password,
    setPassword,
    email,
    setEmail,
    register,
    confirmPassword,
    setConfirmPassword,
    loading
}) {
    const handleRegister = () => {
        if (!email || !password || !confirmPassword) {
            return Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'All fields are required',
                position: 'bottom',
                duration: 3000,
            });
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            return Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Please enter a valid email address',
                position: 'bottom',
                duration: 3000,
            });
        }
        if (password !== confirmPassword) {
            return Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Passwords do not match',
                position: 'bottom',
                duration: 3000,
            });
        }

        register();

    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >

                <View style={styles.form}>
                <View style={styles.header}>
                    <Text style={styles.title}>Get Started</Text>
                </View>
                    {/* Email Input */}
                    <View style={styles.fieldContainer}>
                        <Feather name="mail" size={20} color="#7B8794" />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="#7B8794"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Password Input */}
                    <View style={styles.fieldContainer}>
                        <Feather name="lock" size={20} color="#7B8794" />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#7B8794"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Feather
                                name={showPassword ? 'eye' : 'eye-off'}
                                size={20}
                                color="#7B8794"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Confirm Password Input */}
                    <View style={styles.fieldContainer}>
                        <Feather name="lock" size={20} color="#7B8794" />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            placeholderTextColor="#7B8794"
                            secureTextEntry={!showPassword}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Feather
                                name={showPassword ? 'eye' : 'eye-off'}
                                size={20}
                                color="#7B8794"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Register Button */}
                    <TouchableOpacity style={styles.button} onPress={handleRegister}>
                        <Text style={styles.buttonText}>
                            {loading ? <ActivityIndicator color={'#fff'}/> : 'Register'}
                        </Text>
                    </TouchableOpacity>

                    {/* Sign In Option */}
                    <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => changeView('sign')}>
                            <Text style={styles.signupLink}>
                                Sign In
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    form: {
        paddingHorizontal: 20, 
        width: '100%', 
    },
    header: {
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#7B8794',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#7B8794',
        textAlign: 'center',
    },
    fieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E4E7EB',
        paddingVertical: 12,
        marginBottom: 16,
        width: '100%', 
    },
    input: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: '#7B8794',
    },
    forgotPasswordContainer: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        color: '#4A5568',
        fontSize: 14,
    },
    button: {
        backgroundColor: '#2B6CB0',
        borderRadius: 12,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#2B6CB0',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signupText: {
        color: '#4A5568',
        fontSize: 14,
    },
    signupLink: {
        color: '#2B6CB0',
        fontSize: 14,
        fontWeight: '600',
    },
});
